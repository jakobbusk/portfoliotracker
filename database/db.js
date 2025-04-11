import dotenv from 'dotenv';
dotenv.config();

import sql from 'mssql';

const config = {
    server: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER  || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'portfoliotracker',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    }
};


// REF: https://sidorares.github.io/node-mysql2/docs
// Vi bruger createPool i stedet for createConnection. Det er mere effektivt
// i forhold til mange requests.
const pool = new sql.ConnectionPool(config);

try {
    await pool.connect();
    console.log('Connected to database');
} catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
}

export default pool
export { sql }

