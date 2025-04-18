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

    static async get(req, res) {
        const portfolioID = req.params.id;
        const accountID = req.params.accountID;

        res.send(req.params);
    }

    static async create(req, res) {
        const {name, accountID} = req.body;

        // Validering af input
        // Sikre at den authentificerede bruger ejer kontoen
        const result = await Account.findByID(accountID, req.user.id);
        if (!result) {
            return res.status(404).json({ message: 'Account not found' });
        }

        const portfolio = new Portfolio({name, accountID});

        try {
            const result = await portfolio.create();
            console.log(result);
            res.status(201).json(result);

        } catch (error) {
            console.error('Error creating portfolio:', error);
            res.status(500).json({ message: 'Error creating portfolio', error });

        }

    }

}
export default PortfolioController;