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

    static async all(accountID, columns = Transaction.columns) {
        const result = await db.request().input('accountID', accountID)
            .query(`SELECT ${columns.join(', ')} FROM ${Transaction.table} WHERE accountID = @accountID`);

        if (result.recordset.length === 0) return [];
        return result.recordset.map(row => new Transaction(row));
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

    static convertToAccountCurrency(amount, transactionCurrency, accountCurrency, exchangeRate) {
        // Hvus valutaerne er de samme så returner beløbet
        if (transactionCurrency === accountCurrency) {
            return amount;
        }

        // Tjek om kursen er ugyldig
        if (exchangeRate == undefined ||exchangeRate <= 0) {
            throw new Error('Invalid exchange rate');
        }

        // Omregn beløbet til kontovalutaen
        // beløb / (vekselkurs/100) - 1000dk / 0.1526 = 152,6
        var convertedAmount = amount / exchangeRate

        // Her bruger vi toFixed til at sikre at vi kun har to decimaler
        // Vigtgit at vi bruger Number() til at konvertere det til et tal igen
        return Number(convertedAmount.toFixed(2));
        // For at få den korrekte exchange rate, så skal vi tage transaktionens valuta som base og kontoen som valuta mål
        // https://v6.exchangerate-api.com/v6/:YOUR-API-KEY/pair/:transactionCurrency/:accountCurrency
    }


}

export default Transaction;