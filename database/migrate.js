/**
 * Denne fil skal bruges til at migrere databasen, så den er klar til brug.
 * Dette gøres ved at køre denne fil - det kan gøres ved at køre "npm run migrate" i terminalen.
 */
import db from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// import.meta.url er en variabel som har stien for hvor filen ligger.
// Den starter med file:/// og det skal vi fjerne for at kunne bruge filen i fs modulet.
// Vi bruger fileURLToPath til at fjerne file:///
const filename = fileURLToPath(import.meta.url);
// path.dirname giver os mappen hvor filen ligger.
// Vi tilføjer /migrations til stien så vi kan finde migrations filerne.
const migrationsFolder = path.dirname(filename) + '/migrations';

async function migrate(){
    console.log('Migrerer databasen...');

    // Opretter migrations tabellen, hvis den ikke findes
    await migrateTable();

    // Hent alle migrations filer synkront
    // det betyder at koden venter på at filerne er hentet før vi fortsætter
    const migrations = fs.readdirSync(migrationsFolder)
        .filter(item => item.endsWith('.js')); // Her sikrer vi os at det kun er javascript filerne

    // Her henter vi alle migrations der er kørt
    // Vi bruger db.query til at hente alle migrations der er kørt
    const [ranMigrations] = await db.query('SELECT name FROM migrations');


    // Her kører vi alle migrationer der ikke er kørt endnu
    for(var i = 0; i < migrations.length; i++){
        if(ranMigrations.some(migration => migration.name === migrations[i])){

            console.log('Migration allerede kørt:', migrations[i]);

        } else {
            const migration = migrations[i];
            console.log('Kører migration:', migration);

            // Her importerer vi migrationen
            const migrationFile = await import(migrationsFolder + '/' + migration);
            // Her kører vi migrationen
            await migrationFile.up(db);

            // Her gemmer vi at migrationen er kørt
            await db.query('INSERT INTO migrations (name) VALUES (?)', [migration]);
        }
    }



}

async function migrateTable(){
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                ran_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `)

    } catch (error) {
        console.error('Fejl ved oprettelse af migrations tabel', error)
    }
}


try {
    await migrate();
    // Vi skal huske at lukke forbindelsen så terminalen ikke hænger
    db.end();
} catch (error) {
    console.error('Fejl ved migration', error);
    // VI SKAL huske at lukke processen hvis der er en fejl
    process.exit(1); // REF: https://www.geeksforgeeks.org/node-js-process-exit-method/
}