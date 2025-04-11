// asynkron funktion
export async function up(db){

    // opretter user tabellen
    await db.query(`
        CREATE TABLE users (
            id INT IDENTITY(1,1) PRIMARY KEY,
            username NVARCHAR(255) UNIQUE NOT NULL,
            name NVARCHAR(255),
            email NVARCHAR(255) UNIQUE NOT NULL,
            password NVARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT GETDATE(),
            updated_at DATETIME DEFAULT GETDATE()
        );
        `);
}