import db from '../database/db.js';
import Position from './Position.js';
import Trade from './Trade.js';

class Portfolio {

    static tableName = 'Portfolio';

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

    static async all(userID, columns = Portfolio.columns) {
        const result = await db.request().input('userID', userID)
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

        if (result.recordset.length === 0) return [];
        return result.recordset.map(row => new Portfolio(row));
    }

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
            return new Portfolio(result.recordset[0]);

        } catch (error) {
            console.error('Error fetching portfolio:', error);
            throw error;
        }
    }

    async create() {
        const result = await db.request()
            .input('name', this.name)
            .input('userID', this.userID)
            .input('accountID', this.accountID)
            .query(`INSERT INTO ${Portfolio.tableName} (name, accountID, userID)
                OUTPUT INSERTED.Id
                VALUES (@name, @accountID, @userID)`);

        return result;
    }

    static async getHistoricalValue(portfolioID, userID) {
        const query = db.request()
        try {
            const result = await query
            .input('portfolioID', portfolioID).input('userID', userID)
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

    static async getAllPortfolios(){
        const query = db.request()
        try {

            const result = await db.query(`
                SELECT * FROM Portfolio
                `)
            if (result.recordset.length === 0) return [];
            return result.recordset.map(row => new Portfolio(row));
        } catch (error) {
            console.error('Error fetching all portfolios:', error);
            throw error;
        }
    }

    async updatePortfolioValueHistory(){
        // Først henter vi alle positioner i porteføljen
        const [positions, trades] = await Promise.all([
            await Position.allByPortfolioID(this.id, this.userID),
            await Trade.allByPortfolioID(this.userID, this.id, ['realisedPnL'])
        ])

        let totalPortfolioValue = 0;
        let totalUnrealisedPnL = 0;
        let totalRealisedPnL = 0;

        positions.forEach(position => {
            totalPortfolioValue += position.totalValue;
            totalUnrealisedPnL += position.totalValue - (position.GAK * position.quantity);
        })

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
                .input('portfolioID', this.id)
                .input('totalPortfolioValue', totalPortfolioValue)
                .input('totalUnrealisedPnL', totalUnrealisedPnL)
                .input('totalRealisedPnL', totalRealisedPnL)
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