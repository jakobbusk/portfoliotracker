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


const pool = new sql.ConnectionPool(config);

export default pool
export { sql }

