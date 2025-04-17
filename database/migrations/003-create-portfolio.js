// asynkron funktion
export async function up(db){

    // opretter user tabellen
    await db.query(`
        CREATE TABLE Portfolio (
            id INT IDENTITY PRIMARY KEY,
            name NVARCHAR(255) NOT NULL,
            accountID INT NOT NULL,
            currency NVARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT GETDATE() NOT NULL,
            updated_at DATETIME DEFAULT GETDATE() NOT NULL,

            CONSTRAINT FK_accountID FOREIGN KEY (accountID) REFERENCES Account(id),
        );
        `);
}