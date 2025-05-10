import db from '../database/db.js';
export default class DashboardController {

    //returnerer totalValue, totalUnrealisedPnL og totalRealisedPnL til dashboard
    static async getDashboard(req, res) {
        const userID = req.user.id;

        const query = db.request()
        console.log('Fetching dashboard for user:', userID);

        try {
            let totalValue = 0;
            let totalUnrealisedPnL = 0;
            let totalRealisedPnL = 0;
            // Hent alle de nyeste porteføljehistorik for hver portefølje
            const result = await query.input('userID', userID)
                .query(`
                    SELECT p.id AS portfolioID, p.name AS portfolioName, pv.totalPortfolioValue, pv.totalUnrealisedPnL, pv.totalRealisedPnL
                    FROM Portfolio p
                    JOIN PortfolioValueHistory pv ON p.id = pv.portfolioID
                    WHERE p.userID = @userID
                    AND pv.created_at = (SELECT MAX(created_at) FROM PortfolioValueHistory WHERE portfolioID = p.id)
                `)

            //beregn summen af alle porteføljer ved at loope gennem dem alle og lægge deres værdier til totalen
            const portfolios = result.recordset;
            portfolios.forEach(portfolio => {
                totalValue += portfolio.totalPortfolioValue;
                totalUnrealisedPnL += portfolio.totalUnrealisedPnL;
                totalRealisedPnL += portfolio.totalRealisedPnL;
            })

            console.log('result:', result);
            return res.status(200).json({
                totalValue,
                totalUnrealisedPnL,
                totalRealisedPnL,
            });

        } catch (error) {
            console.log('Error fetching dashboard:', error);
            return res.status(500).json({ message: 'Error fetching dashboard', error });


        }
    }
}