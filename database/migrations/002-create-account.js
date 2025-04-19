// asynkron funktion
export async function up(db){

    // opretter account tabellen
    await db.query(`
        CREATE TABLE Account (
            id INT IDENTITY PRIMARY KEY,
            userID INT NOT NULL,
            name NVARCHAR(255) NOT NULL,
            currency NVARCHAR(255) NOT NULL,
            balance DECIMAL(18, 2) DEFAULT 0,
            bankReference NVARCHAR(255) DEFAULT NULL,
            closed BIT DEFAULT 0 NOT NULL,
            created_at DATETIME DEFAULT GETDATE() NOT NULL,
            updated_at DATETIME DEFAULT GETDATE() NOT NULL,

            CONSTRAINT FK_Account_userID FOREIGN KEY (userID) REFERENCES [User](id),
        );
        `);
}