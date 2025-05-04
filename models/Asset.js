import db from '../database/db.js';
export default class Asset {
    static table = 'asset';
    static columns = ['id', 'name', 'symbol', 'currency', 'assetType', 'created_at'];

    constructor(data = {}) {
        this.id = data.id;
        this.name = data.name;
        this.symbol = data.symbol;
        this.currency = data.currency || 'USD';
        this.assetType = data.assetType || 'stock';
        this.created_at = data.created_at;
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

    async create(currentAssetPrice) {
        let result;
        try {

            result = await db.request()
                .input('name', this.name)
                .input('symbol', this.symbol)
                .input('currency', this.currency)
                .input('assetType', this.assetType)
                // Insert i databasen og returnere den nye asset OUTPUT
                .query(`INSERT INTO ${Asset.table} (name, symbol, currency, assetType) OUTPUT INSERTED.id, INSERTED.name, INSERTED.symbol VALUES (@name, @symbol, @currency, @assetType)`);

            const asset = new Asset(result.recordset[0]);
                // Når vi oprettet en ny asset - så ønsker vi også
                // at oprette nuværende pris i HistoricalAssetPrice tabellen
            await asset.updateAssetPrice(currentAssetPrice);

            return asset;

        } catch (error) {
            console.error('Error creating asset:', error);
            throw error;
        }
    }

    async updateAssetPrice(currentAssetPrice, assetID = this.id) {
        // Opdaterer den nuværende pris i HistoricalAssetPrice tabellen
        const query = db.request()
        try {
            await query.input('assetID', this.id)
                .input('currentAssetPrice', currentAssetPrice)
                .query(`INSERT INTO HistoricalAssetPrice (assetID, assetPrice) VALUES (@assetID, @currentAssetPrice)`)


            return;
        } catch (error) {
            console.error('Error updating asset price:', error);
            throw error;
        }
    }

}