import Account from "../models/Account.js";
import Portfolio from "../models/Portfolio.js";
import Position from "../models/Position.js";

class PortfolioController {

    //henter alle porteføljer for en bruger
    static async getAll(req, res) {

        const userID = req.user.id;

        try {
            const portfolios = await Portfolio.all(userID);
            return res.status(200).json(portfolios);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching portfolios', error });
        }

    }

    //henter top 5 positioner efter værdi, på tværs af porteføljer
    static async getTop5Value(req, res) {
        const userID = req.user.id;

        try {
            const positions = await Position.top5Value(userID);
            return res.status(200).json(positions);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching top 5 positions', error });
        }
    }

    //henter top 5 positioner efter urealiseret gevinst, på tværs af porteføljer
    static async getTop5UPNL(req, res) {
        const userID = req.user.id;

        try {
            const positions = await Position.top5UPNL(userID);
            console.log('Top 5 UPNL:', positions);

            return res.status(200).json(positions);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching top 5 positions', error });
        }
    }

    //henter specifik portefølje med navn på tilknyttet konto og realiseret gevinst.
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

    //hent historiske værdier for en portefølje
    static async getPortfolioHistoricalValue(req, res) {
        const portfolioID = req.params.id;
        const userID = req.user.id;

        try {
            const historicalValue = await Portfolio.getHistoricalValue(portfolioID, userID);
            if (!historicalValue) {
                return res.status(404).json({ message: 'Portfolio not found' });
            }
            return res.status(200).json(historicalValue);
        } catch (error) {
            console.log('Error fetching portfolio historical value:', error);

            return res.status(500).json({ message: 'Error fetching portfolio historical value', error });
        }

    }

    //hent alle positioner tilhørende en specifik portefølje
    static async getPositions(req, res) {
        const portfolioID = req.params.id;
        const userID = req.user.id;

        try {
            const positions = await Position.allByPortfolioID(portfolioID, userID);
            if (!positions) {
                return res.status(404).json({ message: 'Positions not found' });
            }
            return res.status(200).json(positions);
        } catch (error) {
            console.error('Error fetching positions:', error);
            return res.status(500).json({ message: 'Error fetching positions', error });
        }
    }

    //hent en specifik position
    static async getPosition(req, res) {
        const portfolioID = req.params.id;
        const userID = req.user.id;
        const positionID = req.params.positionID;

        try {
            const position = await Position.findByID(positionID, portfolioID, userID);
            if (!position) {
                return res.status(404).json({ message: 'Position not found' });
            }
            return res.status(200).json(position);
        } catch (error) {
            console.error('Error fetching position:', error);
            return res.status(500).json({ message: 'Error fetching position', error });
        }
    }

    //opret en portefølje
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

    //hent handler tilknyttet en bestemt portefølje
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

    //opret handel
    static async createTrade(req,res){

        const portfolioID = req.params.id;
        const userID = req.user.id;

        //dekonstruer body til quantity og tradeRate
        const {quantity, tradeRate} = req.body;

        // Validering af input
        // Sikre at den authentificerede bruger ejer porteføljen
        const result = await Portfolio.findByID(portfolioID, userID);
        if (!result) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        const trade = new Portfolio({portfolioID, quantity, tradeRate});

        try {
            const result = await trade.createTrade();

            res.status(201).json({tradeID: result.recordset[0].Id});

        } catch (error) {
            console.error('Error creating trade:', error);
            res.status(500).json({ message: 'Error creating trade', error });

        }


    }

}
export default PortfolioController;