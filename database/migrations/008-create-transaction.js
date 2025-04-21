// asynkron funktion
export async function up(db){

    // opretter user tabellen
    await db.query(`
        Create TABLE [Transaction](
            id INT IDENTITY PRIMARY KEY,
            portfolioID INT NOT NULL,
            tradeID INT, -- valgfri hvis det bare er en overførsel
            accountID INT NOT NULL,
            amount DECIMAL(18, 2) NOT NULL, -- beløb hævet/indsat
            currency VARCHAR(3) NOT NULL, -- valuta på transaktionen i stedet for kontoen
            exchangeRate DECIMAL(18, 6) NOT NULL, -- vekselkurs
            transactionType VARCHAR(8) NOT NULL, -- deposit/withdraw
            balanceBefore DECIMAL(18, 2) NOT NULL, -- saldo før transaktionen
            balanceAfter DECIMAL(18, 2) NOT NULL, -- saldo efter transaktionen
            created_at DATETIME DEFAULT GETDATE() NOT NULL,

            CONSTRAINT FK_Transaction_portfolioID FOREIGN KEY (portfolioID) REFERENCES Portfolio(id),
            CONSTRAINT FK_Transaction_tradeID FOREIGN KEY (tradeID) REFERENCES Trade(id),
            CONSTRAINT FK_Transaction_accountID FOREIGN KEY (accountID) REFERENCES Account(id),
        );
        `);
}