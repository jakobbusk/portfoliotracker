import Account from "../models/Account.js";
import Portfolio from "../models/Portfolio.js";

class PortfolioController {

    static async getAll(req, res) {

        const userID = req.user.id;

        try {
            const portfolios = await Portfolio.all(userID);
            return res.status(200).json(portfolios);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching portfolios', error });
        }

    }

    static async getPortfolio(req, res) {
        const portfolioID = req.params.id;
        const userID = req.user.id;

        try {
            const portfolio = await Portfolio.findByID(portfolioID, userID);
            if (!portfolio) {
                return res.status(404).json({ message: 'Portfolio not found' });
            }
            return res.status(200).json(portfolio);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching portfolio', error });
        }


    }

    static async getPositions(req, res) {
        const portfolioID = req.params.id;
        const userID = req.user.id;

        try {
            const positions = await Portfolio.getPositions(portfolioID, userID);
            if (!positions) {
                return res.status(404).json({ message: 'Positions not found' });
            }
            return res.status(200).json(positions);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching positions', error });
        }
    }

    static async create(req, res) {
        const {name, accountID} = req.body;
        const userID = req.user.id;

        // Validering af input
        // Sikre at den authentificerede bruger ejer kontoen
        const result = await Account.findByID(accountID, req.user.id);
        if (!result) {
            return res.status(404).json({ message: 'Account not found' });
        }

        const portfolio = new Portfolio({name, accountID, userID});

        try {
            const result = await portfolio.create();

            res.status(201).json({portfolioID: result.recordset[0].Id});

        } catch (error) {
            console.error('Error creating portfolio:', error);
            res.status(500).json({ message: 'Error creating portfolio', error });

        }

    }

    static async getTrades(req,res){
        const portfolioID = req.params.id;
        const userID = req.user.id;

        try {
            const trades = await Portfolio.getTrades(portfolioID, userID);
            if (!trades) {
                return res.status(404).json({ message: 'Trades not found' });
            }
            return res.status(200).json(trades);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching trades', error });
        }

    }

    static async createTrade(req,res){


    }

}
export default PortfolioController;