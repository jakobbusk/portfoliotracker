class Transaction {

    static table = 'Transactions';
    static columns = ['id', 'portfolioID', 'tradeID', 'accountID', 'amount', 'currency', 'exchangeRate', 'transactionType',  'created_at'];


    constructor(data = {}) {
        this.id = data.id;
        this.portfolioID = data.portfolioID;
        this.tradeID = data.tradeID;
        this.accountID = data.accountID;
        this.amount = data.amount;
        this.currency = data.currency;
        this.exchangeRate = data.exchangeRate;
        this.transactionType = data.transactionType;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    static async all(accountID, columns = Transaction.columns) {
        const result = await db.request().input('accountID', accountID)
            .query(`SELECT ${columns.join(', ')} FROM ${Transaction.table} WHERE accountID = @accountID`);

        if (result.recordset.length === 0) return [];
        return result.recordset.map(row => new Transaction(row));
    }

}

export default Transaction;