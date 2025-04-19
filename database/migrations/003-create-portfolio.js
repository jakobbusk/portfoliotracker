// asynkron funktion
export async function up(db){

    // opretter user tabellen
    await db.query(`
        CREATE TABLE Portfolio (
            id INT IDENTITY PRIMARY KEY,
            name NVARCHAR(255) NOT NULL,
            accountID INT NOT NULL,
            totalAcquisitionValue DECIMAL(18, 2) NOT NULL,
            totalMarketValue DECIMAL(18, 2) NOT NULL,
            totalUnrealisedPnL DECIMAL(18, 2) NOT NULL,
            created_at DATETIME DEFAULT GETDATE() NOT NULL,
            updated_at DATETIME DEFAULT GETDATE() NOT NULL,

            CONSTRAINT FK_Portfolio_accountID FOREIGN KEY (accountID) REFERENCES Account(id),
        );
        `);
}