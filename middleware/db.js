import db from '../database/db.js';

// REF: https://expressjs.com/en/guide/using-middleware.html
// Application level middleware
// https://expressjs.com/en/guide/using-middleware.html#middleware.application

const dbConnectionMiddleware = async (req, res, next) => {
    try {
        req.db = db // Connect til databasen

        console.log('DB connection established');

        res.on('finish', () => {
            console.log('DB connection closed');
        });

        next();
    } catch (error) {
        console.error('Error establishing database connection', error);
        res.status(500).json({ message: "Internal server error"  });
    }
}

export default dbConnectionMiddleware;