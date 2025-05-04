import db from '../database/db.js';
class Transaction {

    static table = '[Transaction]';
    static columns = ['id', 'portfolioID', 'tradeID', 'accountID', 'amount', 'currency', 'exchangeRate', 'transactionType',  'created_at'];


    constructor(data = {}) {
        this.id = data.id;
        this.accountID = data.accountID;
        this.portfolioID = data.portfolioID || null; // Valgfri hvis det bare er en overførsel
        this.tradeID = data.tradeID || null; // Valgfri hvis det bare er en overførsel
        this.amount = data.amount; // Beløbet i oprindelig valuta
        this.currency = data.currency; // Valutaen for transaktionen
        this.exchangeRate = data.exchangeRate; // Vekselkursen for transaktionen
        this.transactionType = data.transactionType; // deposit/withdraw
        this.created_at = data.created_at;
    }

    // Lav en transaktion
    async create() {

        try {
            // Her laver vi en transaktion
            const result = await db.request()
                .input('portfolioID', this.portfolioID)
                .input('tradeID', this.tradeID)
                .input('accountID', this.accountID)
                .input('amount', this.amount)
                .input('currency', this.currency)
                .input('exchangeRate', this.exchangeRate)
                .input('transactionType', this.transactionType)
                .query(`INSERT INTO ${Transaction.table} (portfolioID, tradeID, accountID, amount, currency, exchangeRate, transactionType) VALUES (@portfolioID, @tradeID, @accountID, @amount, @currency, @exchangeRate, @transactionType)`);

            return result;

        } catch (error) {
            console.error('Error fetching last transaction:', error);
            throw error;
        }

    }

}

export default Transaction;