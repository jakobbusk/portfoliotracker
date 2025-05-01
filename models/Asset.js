import db from '../database/db.js';
export default class Asset {
    static table = 'asset';
    static columns = ['id', 'name', 'symbol', 'currency', 'assetType', 'created_at', 'updated_at'];

    constructor(data = {}) {
        this.id = data.id;
        this.name = data.name;
        this.symbol = data.symbol;
        this.currency = data.currency || 'USD';
        this.assetType = data.assetType || 'stock';
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
    updated() {
        this.updated_at = new Date();
    }

    static async findBySymbol(symbol) {
        const query = db.request()
        try {
            const result = await query.input('symbol', symbol)
                .query(`SELECT * FROM ${Asset.table} WHERE symbol = @symbol`)

            if (result.recordset.length === 0) return null;
            return new Asset(result.recordset[0]);

        } catch (error) {
            console.error('Error finding asset by symbol:', error);
            throw error;
        }
    }

    async create() {
        let result;
        try {

            result = await db.request()
                .input('name', this.name)
                .input('symbol', this.symbol)
                .input('currency', this.currency)
                .input('assetType', this.assetType)
                // Insert i databasen og returnere den nye asset OUTPUT
                .query(`INSERT INTO ${Asset.table} (name, symbol, currency, assetType) OUTPUT INSERTED.id, INSERTED.name, INSERTED.symbol VALUES (@name, @symbol, @currency, @assetType)`);

                return result.recordset[0];

        } catch (error) {
            console.error('Error creating asset:', error);
            throw error;
        }
    }

}