import db from '../database/db.js';
import Position from './Position.js';
import Trade from './Trade.js';

class Portfolio {
    
    //static betyder den tilhører constructoren. Altså kan vi tilgå den fra klassen uden et objekt.
    static tableName = 'Portfolio';

    //array over kolonner i databasens tilsvarende tabel
    static columns = ['id', 'name', 'accountID','userID', 'created_at'];

    constructor(data = {}){
        this.id = data.id;
        this.name = data.name;
        this.accountID = data.accountID;
        this.userID = data.userID;
        this.created_at = data.created_at;

        // Værdier tilføjet fra join
        if('accountName' in data) this.accountName = data.accountName;
        if('accountCurrency' in data) this.accountCurrency = data.accountCurrency;
        if('accountBalance' in data) this.accountBalance = data.accountBalance;
        if('realisedPnL' in data) this.realisedPnL = data.realisedPnL;
        if('totalAcquisitionValue' in data) this.totalAcquisitionValue = data.totalAcquisitionValue;

    }

    //static så den kan kaldes på klassen
    //finder alle en brugers porteføljer
    static async all(userID, columns = Portfolio.columns) {
        const result = await db.request().input('userID', userID)
            //columns.map bruges til at indsætte alle kolonnerne fra tabellen med p. som præfiks.
            //.join() omdanner arrayet til en string, her med et komma og et mellemrum imellem hvert element
            //select SUM i parentes: her vælger vi summen af anskaffelsesværdien for alle positioner i porteføljen
            .query(`
                SELECT
                ${columns.map(col => 'p.' + col).join(', ')},
                a.name AS accountName,
                a.currency AS accountCurrency,
                a.balance AS accountBalance,
                (SELECT SUM(pos.GAK * pos.quantity)
                    FROM Position pos
                    WHERE pos.portfolioID = p.id
                ) AS totalAcquisitionValue
                FROM ${this.tableName} p
                JOIN Account a ON p.accountID = a.id
                WHERE a.userID = @userID
                `)

        if (result.recordset.length === 0) return []; //hvis ingen resultater returner tom array
        return result.recordset.map(row => new Portfolio(row)); //returner resultatet som en array af Portfolio objekter
    }

    //henter specifik portefølje med navn på tilknyttet konto og realiseret gevinst.
    static async findByID(id, userID, columns = Portfolio.columns) {
        const query = db.request()
        try {
            const result = await query.input('id', id).input('userID', userID)
            // I denne skal vi joine alle trades på porteføljen
            // hvor de er lig med sell og summe realisedPnL
                .query(`
                    SELECT TOP 1
                    ${columns.map(col => 'p.' + col).join(', ')},
                    a.name AS accountName,
                    (   SELECT SUM(t.realisedPnL)
                        FROM Trade t
                        WHERE t.portfolioID = p.id AND t.tradeType = 'sell'
                    ) AS realisedPnL
                    FROM ${this.tableName} p
                    JOIN Account a ON p.accountID = a.id
                    WHERE p.id = @id AND a.userID = @userID`)

            if (result.recordset.length === 0) return null;
            return new Portfolio(result.recordset[0]); //returnerer porteføljeobjekt, med realisedPnL-key.

        } catch (error) {
            console.error('Error fetching portfolio:', error);
            throw error;
        }
    }

    //opret portefølje
    async create() {
        const result = await db.request()
            //først sættes input parametre
            .input('name', this.name)
            .input('userID', this.userID)
            .input('accountID', this.accountID)
            //herefter INTERT INTO query for at oprette en ny række
            .query(`INSERT INTO ${Portfolio.tableName} (name, accountID, userID)
                OUTPUT INSERTED.Id
                VALUES (@name, @accountID, @userID)`);

        return result;
    }

    //henter historiske værdier for en portefølje
    static async getHistoricalValue(portfolioID, userID) {
        const query = db.request()
        try {
            const result = await query
            .input('portfolioID', portfolioID).input('userID', userID)
                //vi vælger alle kolonner i PortfolioValueHistory. 
                //vi joiner med portfolio og sætter også userID som betingelse
                //til sidst sorteres efter største dato (nyeste) først
                .query(`
                    SELECT
                    pv.*
                    FROM PortfolioValueHistory pv
                    JOIN Portfolio p ON pv.portfolioID = p.id
                    WHERE p.id = @portfolioID AND p.userID = @userID
                    ORDER BY pv.created_at DESC
                    `)

            if (result.recordset.length === 0) return [];
            return result.recordset

        } catch (error) {
            console.error('Error fetching portfolio value history:', error);
            throw error;
        }
    }

    //henter alle porteføljer i hele databasen
    static async getAllPortfolios(){
        const query = db.request()
        try {

            const result = await db.query(`
                SELECT * FROM Portfolio
                `)
            if (result.recordset.length === 0) return [];
            return result.recordset.map(row => new Portfolio(row)); //returnerer resultaterne som Portfolio objekter
        } catch (error) {
            console.error('Error fetching all portfolios:', error);
            throw error;
        }
    }

    //opdaterer PortfolioValueHistory tabellen
    async updatePortfolioValueHistory(){
        // Først henter vi alle positioner og trades i porteføljen
        const [positions, trades] = await Promise.all([
            await Position.allByPortfolioID(this.id, this.userID),
            await Trade.allByPortfolioID(this.userID, this.id, ['realisedPnL'])
        ])

        //erklær variable for de tre nøgletal
        let totalPortfolioValue = 0;
        let totalUnrealisedPnL = 0;
        let totalRealisedPnL = 0;

        //for hver position lægges værdien og den urealiserede værdi til totalerne
        positions.forEach(position => {
            totalPortfolioValue += position.totalValue;
            //urealiseret gevinst regnes som værdi minus erhvervelsesværdi
            totalUnrealisedPnL += position.totalValue - (position.GAK * position.quantity);
        })

        //urealiseret værdi regnes ved at tage summen af den realiserede værdi ved hver handel
        trades.forEach(trade => {
            if(trade.realisedPnL == null) return;
            totalRealisedPnL += trade.realisedPnL;
        })

        console.log('Positions:', positions);
        console.log('Trades:', trades);
        console.log('Total portfolio value:', totalPortfolioValue);
        console.log('Total unrealised PnL:', totalUnrealisedPnL);
        console.log('Total realised PnL:', totalRealisedPnL);




        // Opdater historisk værdi for porteføljen
        const query = db.request()
        try {
            const result = await query
                //sætter inputparametre
                .input('portfolioID', this.id)
                .input('totalPortfolioValue', totalPortfolioValue)
                .input('totalUnrealisedPnL', totalUnrealisedPnL)
                .input('totalRealisedPnL', totalRealisedPnL)
                //opretter ny række i tabellen med INSERT INTO
                .query(`INSERT INTO PortfolioValueHistory (portfolioID, totalPortfolioValue, totalUnrealisedPnL, totalRealisedPnL)
                    VALUES (@portfolioID, @totalPortfolioValue, @totalUnrealisedPnL, @totalRealisedPnL)`);
            return result;

        } catch (error) {
            console.error('Error updating portfolio value history:', error);
            throw error;
        }
    }

}

export default Portfolio;