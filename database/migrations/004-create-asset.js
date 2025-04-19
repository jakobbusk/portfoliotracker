// asynkron funktion
export async function up(db){

    // opretter user tabellen
    await db.query(`
        Create TABLE Asset(
            id INT IDENTITY PRIMARY KEY,
            name NVARCHAR(255) NOT NULL,
            symbol NVARCHAR(255) NOT NULL,
            assetType NVARCHAR(255) NOT NULL,
            currency NVARCHAR(255) NOT NULL,
            exchange NVARCHAR(255) NOT NULL,
            figi NVARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT GETDATE() NOT NULL,
            updated_at DATETIME DEFAULT GETDATE() NOT NULL,
        );
        `);
}