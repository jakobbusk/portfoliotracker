// Make a model for the account
/**
 *     id INT IDENTITY PRIMARY KEY,
    userID INT,
    name NVARCHAR(255),
    currency NVARCHAR(255),
    balance DECIMAL(18, 2),
    bankReference NVARCHAR(255),
    closed BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_userID FOREIGN KEY (userID) REFERENCES users(id),
 */

import db from '../database/db.js';
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

    static async findByID(id, userID, columns = Account.columns) {

        const result = await db.request().input('id', id).input('userID', userID)
            .query(`SELECT TOP 1 ${columns.join(', ')}
                        FROM ${Account.table}
                        WHERE id = @id AND userID = @userID`);

            if (result.recordset.length === 0) return null;
            return new Account(result.recordset[0]);

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

}

export default Account