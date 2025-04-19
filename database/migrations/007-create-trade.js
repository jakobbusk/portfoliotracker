// asynkron funktion
export async function up(db){

    // opretter user tabellen
    await db.query(`
        Create TABLE Trade(
            id INT IDENTITY PRIMARY KEY,
            portfolioID INT NOT NULL,
            assetID INT NOT NULL,
            quantity INT NOT NULL, -- number of units
            tradeRate DECIMAL(18, 2) NOT NULL, -- price per unit
            tradingFee DECIMAL(18, 2) NOT NULL, -- trading fee in money
            tradeType VARCHAR(4) NOT NULL, -- buy/sell

            created_at DATETIME DEFAULT GETDATE() NOT NULL,
            updated_at DATETIME DEFAULT GETDATE() NOT NULL,

            CONSTRAINT FK_Trade_portfolioID FOREIGN KEY (portfolioID) REFERENCES Portfolio(id),
            CONSTRAINT FK_Trade_assetID FOREIGN KEY (assetID) REFERENCES Asset(id),
        );
        `);
}