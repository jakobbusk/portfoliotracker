import db from '../database/db.js';
export default class Position {

    static tableName = 'Position';
    static columns = ['id', 'portfolioID', 'assetID', 'quantity', 'GAK', 'created_at'];

    constructor(data = {}) {
        this.id = data.id;
        this.portfolioID = data.portfolioID;
        this.assetID = data.assetID;
        this.quantity = data.quantity || 0;
        this.GAK = data.GAK || 0;
        this.created_at = data.created_at;

        // Håndter ekstra data fra join
        if('assetName' in data) this.assetName = data.assetName;
        if('assetSymbol' in data) this.assetSymbol = data.assetSymbol;
        if('totalValue' in data) this.totalValue = data.totalValue;
        if('portfolioName' in data) this.portfolioName = data.portfolioName;
        if('unrealisedPnL' in data) this.unrealisedPnL = data.unrealisedPnL;

    }

    //hent alle positioner ud fra portfolioID og userID
    static async allByPortfolioID(portfolioID,userID, columns = Position.columns) {
        const query = db.request()
        try {
            const result = await query.input('portfolioID', portfolioID)
                .input('userID', userID)
                //bemærk vi finder nyeste pris ved at sætte hap dato lig SELECT TOP 1 dato
                .query(`SELECT
                    ${columns.map(col => 'p.' + col).join(', ')},
                    a.name AS assetName,
                    a.symbol AS assetSymbol,
                    hap.assetPrice as currentPrice,
                    (p.quantity * hap.assetPrice) AS totalValue
                    FROM ${Position.tableName} p
                    JOIN Portfolio port ON p.portfolioID = port.id
                    JOIN Asset a ON p.assetID = a.id
                    JOIN HistoricalAssetPrice hap ON p.assetID = hap.assetID
                    WHERE port.userID = @userID AND port.id = @portfolioID AND p.quantity > 0
                    AND hap.created_at = (
                        SELECT TOP 1 created_at
                        FROM HistoricalAssetPrice
                        WHERE assetID = p.assetID
                        ORDER BY created_at DESC)
                    ORDER BY totalValue DESC

                `)

            if (result.recordset.length === 0) return [];
            return result.recordset.map(row => new Position(row));
        } catch (error) {
            console.error('Error fetching positions:', error);
            throw error;
        }

    }

    //finder en position ud fra id og brugerID, indsætter symbol og assetName sammen med
    static async findByID(id, userID, columns = Position.columns) {
        const query = db.request()
        try {
            const result = await query.input('id', id)
                .input('userID', userID)
                .query(`
                    SELECT TOP 1
                    ${columns.map(col => 'p.' + col).join(', ')},
                    a.name AS assetName,
                    a.symbol AS assetSymbol
                    FROM ${Position.tableName} p
                    JOIN Portfolio port ON p.portfolioID = port.id
                    JOIN Asset a ON p.assetID = a.id
                    WHERE p.id = @id AND port.userID = @userID`)

            if (result.recordset.length === 0) return null;
            return new Position(result.recordset[0]);
        } catch (error) {
            console.error('Error fetching position:', error);
            throw error;
        }
    }

    //hent top 5 positioner målt på værdi
    static async top5Value(userID, columns = Position.columns) {
        // Hent de 5 største værdier på positioner med userID
        // Alle porteføljer
        // Quantity * AssetPrice
        // Udregnes i SQL
        // Vi får quantity fra Position tabellen
        // Vi får assetPrice fra HistoricalAssetPrice tabellen
        // Vi ønsker også at få marketValue med
        const query = db.request()
        try {
            const result = await query.input('userID', userID)
                .query(`SELECT TOP 5
                    ${columns.map(col => 'p.' + col).join(', ')},
                    a.name AS assetName,
                    a.symbol AS assetSymbol,
                    a.currency AS assetCurrency,
                    port.name AS portfolioName,
                    (p.quantity * hap.assetPrice) AS totalValue
                    FROM ${Position.tableName} p
                    JOIN Portfolio port ON p.portfolioID = port.id
                    JOIN Asset a ON p.assetID = a.id
                    JOIN HistoricalAssetPrice hap ON p.assetID = hap.assetID
                    WHERE port.userID = @userID
                    AND hap.created_at = (
                        SELECT TOP 1 created_at
                        FROM HistoricalAssetPrice
                        WHERE assetID = p.assetID
                        ORDER BY created_at DESC)
                    ORDER BY totalValue DESC


                `)

                console.log('result:', result);
            if (result.recordset.length === 0) return [];
            return result.recordset.map(row => new Position(row));
        } catch (error) {
            console.error('Error fetching positions:', error);
            throw error;
        }
    }

    //hent top 5 positioner målt på urealiseret gevinst
    //fungerer på samme måde som ovenstående metode
    static async top5UPNL(userID, columns = Position.columns) {
        const query = db.request()
        try {
            const result = await query
                .input('userID', userID)
                .query(`SELECT TOP 5
                    ${columns.map(col => 'p.' + col).join(', ')},
                    a.name AS assetName,
                    a.symbol AS assetSymbol,
                    port.name AS portfolioName,
                    hap.assetPrice as currentPrice,
                    (p.quantity * (hap.assetPrice - p.GAK)) AS unrealisedPnL,
                    (p.quantity * hap.assetPrice) as totalValue
                    FROM ${Position.tableName} p
                    JOIN Portfolio port ON p.portfolioID = port.id
                    JOIN Asset a ON p.assetID = a.id
                    JOIN HistoricalAssetPrice hap ON p.assetID = hap.assetID
                    WHERE port.userID = @userID
                    AND hap.created_at = (
                        SELECT TOP 1 created_at
                        FROM HistoricalAssetPrice
                        WHERE assetID = p.assetID
                        ORDER BY created_at DESC)
                    ORDER BY unrealisedPnL DESC

                `)

            if (result.recordset.length === 0) return [];
            return result.recordset.map(row => new Position(row));
        } catch (error) {
            console.error('Error fetching positions:', error);
            throw error;
        }

    }

    //find position efter portføljeID og assetID
    static async findByPortfolioIDAndAssetID(portfolioID, assetID, columns = Position.columns) {
        const query = db.request()
        try {
            const result = await query.input('portfolioID', portfolioID)
                .input('assetID', assetID)
                .query(`SELECT TOP 1 ${columns.join(', ')} FROM ${Position.tableName} WHERE portfolioID = @portfolioID AND assetID = @assetID`)

            if (result.recordset.length === 0) return null;
            return new Position(result.recordset[0]);
        } catch (error) {
            console.error('Error fetching position:', error);
            throw error;
        }
    }

    //opret ny position i databasen
    async create() {
        const query = db.request()
        try {
            const result = await query.input('portfolioID', this.portfolioID)
                .input('assetID', this.assetID)
                .input('quantity', this.quantity)
                .input('GAK', this.GAK)
                //INSERT INTO bruges til at oprette en ny række i position tabellen.
                .query(`INSERT INTO ${Position.tableName} (portfolioID, assetID, quantity, GAK) OUTPUT INSERTED.* VALUES (@portfolioID, @assetID, @quantity, @GAK)`);

            return result.recordset[0];
        } catch (error) {
            console.error('Error creating position:', error);
            throw error;
        }

    }

    // Logik til at opdatere en positionens GAK og quantity
    async update(tradeType, tradeQuantity, tradeValue) {

        if(tradeType === 'buy') {
            // Hvis det er en buy trade så skal vi opdatere GAK
            // GAK = (nuværende erhvervelsesværdi + handelssum) / (nuværende antal stk + nye antal stk anskaffet)
            // GAK = (GAK * quantity + tradeValue) / (quantity + tradeQuantity)
            this.GAK = (this.GAK * this.quantity + tradeValue) / (this.quantity + tradeQuantity);
            this.quantity = this.quantity + tradeQuantity;

        //opdater quantity ved et salg
        } else if(tradeType === 'sell') {
            this.quantity = this.quantity - tradeQuantity;

            // Vi sletter positionen hvis quantity er 0
            if(this.quantity <= 0) {
                this.delete();
                return;
            }

        }

        this.updated_at = new Date();
        const query = db.request()
        try {
            console.log('Updating position:', this);
            const result = await query.input('portfolioID', this.portfolioID)
                .input('assetID', this.assetID)
                .input('quantity', this.quantity)
                .input('GAK', this.GAK)
                //her bruger vi UPDATE til at ændre data i eksisterende række
                .query(`UPDATE ${Position.tableName} SET quantity = @quantity, GAK = @GAK
                    WHERE portfolioID = @portfolioID AND assetID = @assetID`);

            return result.recordset;
        } catch (error) {
            console.error('Error updating position:', error);
            throw error;
        }
    }


        // Logik til at slette en position når den er 0, dvs. lukket
        async delete() {
            const query = db.request()
            try {
                const result = await query.input('portfolioID', this.portfolioID)
                    .input('assetID', this.assetID)
                    //Vi bruger DELETE til at slette rækken
                    .query(`DELETE FROM ${Position.tableName} WHERE portfolioID = @portfolioID AND assetID = @assetID`);
                return result.recordset;
            } catch (error) {
                console.error('Error deleting position:', error);
                throw error;
            }
        }
}