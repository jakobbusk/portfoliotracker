import db from '../database/db.js';

class Portfolio {

    static tableName = 'Portfolio';

    static columns = ['id', 'name', 'accountID', 'totalAcquisitionValue', 'totalMarketValue', 'totalUnrealisedPnL', 'created_at', 'updated_at'];

    constructor(data = {}){
        this.id = data.id;
        this.name = data.name;
        this.accountID = data.accountID;
        this.totalAcquisitionValue = data.totalAcquisitionValue || 0;
        this.totalMarketValue = data.totalMarketValue || 0;
        this.totalUnrealisedPnL = data.totalUnrealisedPnL || 0;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;

        // Værdier tilføjet fra join
        if('accountName' in data) this.accountName = data.accountName;
        if('accountCurrency' in data) this.accountCurrency = data.accountCurrency;

    }

    updated(){
        this.updated_at = new Date();
    }

    static async all(userID, columns = Portfolio.columns) {
        const result = await db.request().input('userID', userID)
            .query(`
                SELECT ${columns.map(col => 'p.' + col).join(', ')}, a.name AS accountName
                FROM ${this.tableName} p
                JOIN Account a ON p.accountID = a.id
                WHERE a.userID = @userID
                `)

        if (result.recordset.length === 0) return [];
        return result.recordset.map(row => new Portfolio(row));
    }

    static async findByID(id, accountID, userID, columns = Portfolio.columns) {

    }

    async create() {
        const result = await db.request()
            .input('name', this.name)
            .input('accountID', this.accountID)
            .query(`INSERT INTO ${Portfolio.tableName} (name, accountID)
                VALUES (@name, @accountID)`);
        console.log(result);
        return result;
    }



}

export default Portfolio;