import db from '../database/db.js';
import Transaction from './Transaction.js';
class Account {
    static table = 'Account';
    static columns = ['id', 'userID', 'name', 'currency', 'balance', 'bankReference', 'closed', 'created_at', 'updated_at'];

    constructor(data = {}) {
        this.id = data.id;
        this.userID = data.userID;
        this.name = data.name;
        this.currency = data.currency;
        this.balance = data.balance;
        this.bankReference = data.bankReference;
        this.closed = data.closed;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;

    }
    // Her opdaterer vi updated_at kolonnen
    updated() {
        this.updated_at = new Date();
    }

    static async all(userID, columns = Account.columns) {
        const result = await db.request().input('userID', userID)
            .query(`SELECT ${columns.join(', ')} FROM ${Account.table} WHERE userID = @userID`);

        if (result.recordset.length === 0) return [];
        return result.recordset.map(row => new Account(row));
    }

    static async findByIDWithTransactions(id, userID, columns = Account.columns) {

        const query = db.request()

        try {
            const result = await query.input('id', id).input('userID', userID)
                .query(`SELECT
                    ${columns.map(col => 'a.' + col).join(', ')},
                    ${Transaction.columns.map(col => `t.${col} as transaction${col}`).join(`, `)}
                    FROM ${Account.table} a
                    LEFT JOIN [Transaction] t ON a.id = t.accountID
                    WHERE a.id = @id AND a.userID = @userID
                    `)
            if (result.recordset.length === 0) return null;
            const account = new Account(result.recordset[0]);
            account.transactions = []
            console.log(result.recordset);
            if(result.recordset[0].transactionid) {
                for (const row of result.recordset) {
                    const transaction = {
                        id: row.transactionid,
                        portfolioID: row.transactionportfolioID,
                        tradeID: row.transactiontradeID,
                        accountID: row.transactionaccountID,
                        amount: row.transactionamount,
                        currency: row.transactioncurrency,
                        exchangeRate: row.transactionexchangeRate,
                        transactionType: row.transactiontransactionType,
                        created_at: row.transactioncreated_at
                    }
                    account.transactions.push(transaction);
                }
            }
            return account;

        } catch (error) {
            console.error('Error fetching account:', error);
            throw error;
        }

    }

    async create() {
        const result = await db.request()
            .input('userID', this.userID)
            .input('name', this.name)
            .input('currency', this.currency)
            .input('bankReference', this.bankReference)
            .query(`INSERT INTO ${Account.table} (userID, name, currency, bankReference)
                VALUES (@userID, @name, @currency, @bankReference)`);

        return result;
    }

    async update() {
        this.updated();
        const result = await db.request()
            .input('id', this.id)
            .input('name', this.name)
            .input('currency', this.currency)
            .input('bankReference', this.bankReference)
            .input('balance', this.balance)
            .input('closed', this.closed)
            .input('updated_at', this.updated_at)
            .query(`UPDATE ${Account.table} SET
                name = @name,
                currency = @currency,
                bankReference = @bankReference,
                balance = @balance,
                closed = @closed,
                updated_at = @updated_at
                WHERE id = @id`);
        return result;
    }

    async makeTransaction(amount, type) {

    }

}

export default Account