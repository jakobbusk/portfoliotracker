import db from '../database/db.js';
import { convertToTargetCurrency } from '../helpers/currencies.js';
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

    //hent alle accounts tilhørende en bruger
    static async all(userID, columns = Account.columns) {
        const result = await db.request().input('userID', userID)
            .query(`SELECT ${columns.join(', ')} FROM ${Account.table} WHERE userID = @userID`);

        if (result.recordset.length === 0) return [];
        return result.recordset.map(row => new Account(row));
    }

    //hent en konto ud fra id
    static async findByID(id, userID, columns = Account.columns) {
        const query = db.request()
        try {
            const result = await query.input('id', id).input('userID', userID)
                .query(`SELECT TOP 1 ${columns.join(', ')} FROM ${Account.table} WHERE id = @id AND userID = @userID`)
            if (result.recordset.length === 0) return null;
            return new Account(result.recordset[0]);
        } catch (error) {
            console.error('Error fetching account:', error);
            throw error;
        }
    }

    //hent en konto med transaktioner og portefølje tilknyttet transaktionerne
    static async findByIDWithTransactions(id, userID, columns = Account.columns) {

        const query = db.request()

        try {
            const result = await query.input('id', id).input('userID', userID)
                .query(`SELECT
                    ${columns.map(col => 'a.' + col).join(', ')},
                    ${Transaction.columns.map(col => `t.${col} as transaction${col}`).join(`, `)},
                    p.name AS portfolioName
                    FROM ${Account.table} a
                    LEFT JOIN [Transaction] t ON a.id = t.accountID
                    LEFT JOIN Portfolio p ON t.portfolioID = p.id
                    WHERE a.id = @id AND a.userID = @userID
                    `)
            if (result.recordset.length === 0) return null;

            const account = new Account(result.recordset[0]);
            account.transactions = []
            console.log(result.recordset);
            let balanceAfter = 0;
            if(result.recordset[0].transactionid) { //hvis der er et transaction id på første record (tester om transaction eksisterer)
                for (const row of result.recordset) { //for alle records
                    if (row.transactiontransactionType === 'deposit') { //hvis deposit læg til balanceAfter
                        balanceAfter += convertToTargetCurrency(row.transactionamount, row.transactioncurrency, account.currency, row.transactionexchangeRate);
                    } else if (row.transactiontransactionType === 'withdraw') { //hvis withdraw træk fra balanceAfter
                        balanceAfter -= convertToTargetCurrency(row.transactionamount, row.transactioncurrency, account.currency, row.transactionexchangeRate);
                    } else {
                        balanceAfter = 0;
                    }

                    const transaction = { //opret objekt for hver transaction/record
                        id: row.transactionid,
                        portfolioID: row.transactionportfolioID,
                        portfolioName: row.portfolioName,
                        tradeID: row.transactiontradeID,
                        accountID: row.transactionaccountID,
                        amount: row.transactionamount,
                        currency: row.transactioncurrency,
                        exchangeRate: row.transactionexchangeRate,
                        balanceAfter: balanceAfter,
                        transactionType: row.transactiontransactionType,
                        created_at: row.transactioncreated_at
                    }

                    account.transactions.push(transaction); //tilføj objekt til transactions array
                }
            }

            return account;

        } catch (error) {
            console.error('Error fetching account:', error);
            throw error;
        }

    }

    //opretter en account
    async create() {
        const result = await db.request()
            .input('userID', this.userID)
            .input('name', this.name)
            .input('currency', this.currency)
            .input('bankReference', this.bankReference)
            .query(`INSERT INTO ${Account.table} (userID, name, currency, bankReference)
                OUTPUT INSERTED.Id
                VALUES (@userID, @name, @currency, @bankReference)`);

        return result;
    }

    //opdaterer et objekt i databasen
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

    //opret en transaktion
    async makeTransaction(amount,exchangeRate,currency,transactionType,portfolioID,tradeID) {
        if(this.closed) {
            return { error: 'Konto er lukket' };
        }

        //omregn til kontoens valuta
        const amountInTargetCurrency = convertToTargetCurrency(amount, currency, this.currency, exchangeRate);
        // Her tjekker vi om der er penge nok på kontoen
        if (transactionType === 'withdraw' && this.balance - amountInTargetCurrency < 0) {
            return { error: 'Utilstrækkelig dækning' };
        }

        // Her laver vi en ny klasse af Transaction
        const transaction = new Transaction({
            accountID: this.id,
            amount: amount,
            exchangeRate: exchangeRate,
            currency: currency,
            transactionType: transactionType,
            portfolioID: portfolioID,
            tradeID: tradeID
        })

        // Nu sender vi de nødvendige data til Transaction klassen
        try {
            const result = await transaction.create();
            // Her opdaterer vi kontoen med den nye balance
            if (transactionType === 'deposit') {
                this.balance += amountInTargetCurrency;
            } else if (transactionType === 'withdraw') {
                this.balance -= amountInTargetCurrency;
            }
            await this.update();
            return result;
        } catch (error) {
            throw error;

        }


    }

}

export default Account
