// værdipapirer
// id

class Asset {
    static table = 'asset';
    static columns = ['id', 'name', 'symbol', 'currency', 'assetType', 'exchange', 'figi', 'created_at', 'updated_at'];

    constructor(data = {}) {
        this.id = data.id;
        this.name = data.name;
        this.symbol = data.symbol;
        this.currency = data.currency;
        this.assetType = data.assetType;
        this.exchange = data.exchange;
        this.figi = data.figi;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }


    async create() {
        // TODO
        const result = await db.request()
            .input('name', this.name)
            .input('symbol', this.symbol)
            .input('currency', this.currency)
            .input('assetType', this.assetType)
            .input('exchange', this.exchange)
            .input('figi', this.figi)
            .query(`INSERT INTO ${Asset.table} (name, symbol, currency, assetType, exchange, figi) VALUES (@name, @symbol, @currency, @assetType, @exchange, @figi)`);
        return result;
    }

}