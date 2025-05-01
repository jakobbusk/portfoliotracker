import db from '../database/db.js';
export default class Position {

    static tableName = 'Position';
    static columns = ['id', 'portfolioID', 'assetID', 'quantity', 'unrealisedPnL', 'GAK', 'created_at', 'updated_at'];

    constructor(data = {}) {
        this.id = data.id;
        this.portfolioID = data.portfolioID;
        this.assetID = data.assetID;
        this.quantity = data.quantity || 0;
        this.unrealisedPnL = data.unrealisedPnL || 0;
        this.GAK = data.GAK || 0;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;

        // Håndter ekstra data fra join
        if ('assetName' in data) this.assetName = data.assetName;
        if ('assetSymbol' in data) this.assetSymbol = data.assetSymbol;

    }


    static async all(userID, columns = Position.columns) {}


    static async allByPortfolioID(portfolioID,userID, columns = Position.columns) {
        const query = db.request()
        try {
            const result = await query.input('portfolioID', portfolioID)
                .input('userID', userID)
                .query(`SELECT
                    ${columns.map(col => 'p.' + col).join(', ')},
                    a.name AS assetName,
                    a.symbol AS assetSymbol
                    FROM ${Position.tableName} p
                    JOIN Portfolio port ON p.portfolioID = port.id
                    JOIN Asset a ON p.assetID = a.id
                    WHERE port.userID = @userID AND port.id = @portfolioID
                `)

            if (result.recordset.length === 0) return [];
            return result.recordset.map(row => new Position(row));
        } catch (error) {
            console.error('Error fetching positions:', error);
            throw error;
        }

    }

    static async top5(userID, columns = Position.columns) {
        // Hent de 5 største positioner på userID
        // Quantity * GAK
        const query = db.request()
        try {
            const result = await query.input('userID', userID)
                .query(`SELECT TOP 5
                    ${columns.map(col => 'p.' + col).join(', ')},
                    a.name AS assetName,
                    a.symbol AS assetSymbol
                    FROM ${Position.tableName} p
                    JOIN Portfolio port ON p.portfolioID = port.id
                    JOIN Asset a ON p.assetID = a.id
                    WHERE port.userID = @userID
                    ORDER BY p.quantity * p.GAK DESC
                `)

            if (result.recordset.length === 0) return [];
            return result.recordset.map(row => new Position(row));
        } catch (error) {
            console.error('Error fetching positions:', error);
            throw error;
        }
    }


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

    async create() {
        const query = db.request()
        try {
            const result = await query.input('portfolioID', this.portfolioID)
                .input('assetID', this.assetID)
                .input('quantity', this.quantity)
                .input('unrealisedPnL', this.unrealisedPnL)
                .input('GAK', this.GAK)
                .query(`INSERT INTO ${Position.tableName} (portfolioID, assetID, quantity, unrealisedPnL, GAK) OUTPUT INSERTED.* VALUES (@portfolioID, @assetID, @quantity, @unrealisedPnL, @GAK)`);

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
            // GAK = (GAK * quantity + tradeValue) / (quantity + tradeQuantity)
            this.GAK = (this.GAK * this.quantity + tradeValue) / (this.quantity + tradeQuantity);
            this.quantity = this.quantity + tradeQuantity;

        } else if(tradeType === 'sell') {
            this.quantity = this.quantity - tradeQuantity;
        }

        this.updated_at = new Date();
        const query = db.request()
        try {
            console.log('Updating position:', this);
            const result = await query.input('portfolioID', this.portfolioID)
                .input('assetID', this.assetID)
                .input('quantity', this.quantity)
                .input('unrealisedPnL', this.unrealisedPnL)
                .input('GAK', this.GAK)
                .input('updated_at', this.updated_at)
                .query(`UPDATE ${Position.tableName} SET quantity = @quantity, unrealisedPnL = @unrealisedPnL, GAK = @GAK, updated_at = @updated_at
                    WHERE portfolioID = @portfolioID AND assetID = @assetID`);

            return result.recordset;
        } catch (error) {
            console.error('Error updating position:', error);
            throw error;
        }
    }

    // Logik til at opdatere PnL
    async updatePnL(currentPrice) {
        // unrealisedPnL = (currentPrice - GAK) * quantity
        this.unrealisedPnL = (currentPrice - this.GAK) * this.quantity;
        this.updated_at = new Date();
        const query = db.request()
        try {
            const result = await query.input('portfolioID', this.portfolioID)
                .input('assetID', this.assetID)
                .input('unrealisedPnL', this.unrealisedPnL)
                .input('updated_at', this.updated_at)
                .query(`UPDATE ${Position.tableName} SET unrealisedPnL = @unrealisedPnL, updated_at = @updated_at
                    WHERE portfolioID = @portfolioID AND assetID = @assetID`);

            return result.recordset;
        } catch (error) {
            console.error('Error updating position PnL:', error);
            throw error;
        }
    }
}