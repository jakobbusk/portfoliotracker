// asynkron funktion
export async function up(db){

    // opretter user tabellen
    await db.query(`
        Create TABLE HistoricalAssetPrice(
            id INT IDENTITY PRIMARY KEY,
            assetID INT NOT NULL,
            date DATETIME NOT NULL,
            assetPrice DECIMAL(18, 2) NOT NULL,
            created_at DATETIME DEFAULT GETDATE() NOT NULL,

            CONSTRAINT FK_HistoricalAssetPrice_assetID FOREIGN KEY (assetID) REFERENCES Asset(id),
        );
        `);
}