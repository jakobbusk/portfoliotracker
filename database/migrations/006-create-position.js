// asynkron funktion
export async function up(db){

    // opretter user tabellen
    await db.query(`
        Create TABLE Position(
            id INT IDENTITY PRIMARY KEY,
            portfolioID INT NOT NULL,
            assetID INT NOT NULL,
            quantity INT NOT NULL,
            unrealisedPnL DECIMAL(18, 2) NOT NULL,
            GAK DECIMAL(18, 2) NOT NULL,
            created_at DATETIME DEFAULT GETDATE() NOT NULL,
            updated_at DATETIME DEFAULT GETDATE() NOT NULL,

            CONSTRAINT FK_Position_portfolioID FOREIGN KEY (portfolioID) REFERENCES Portfolio(id),
            CONSTRAINT FK_Position_assetID FOREIGN KEY (assetID) REFERENCES Asset(id),
        );
        `);
}