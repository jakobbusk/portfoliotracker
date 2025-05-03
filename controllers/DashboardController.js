import db from '../database/db.js';
export default class DashboardController {

    static async getDashboard(req, res) {
        const userID = req.user.id;

        const query = db.request()
        console.log('Fetching dashboard for user:', userID);

        try {

            // Først henter vi
            // total værdi
            // total realiseret gevinst
            // total urealiseret gevinst
            // Værdierne udregnes i SQL


            // Query til at hente total værdi
            const result = await query.input('userID', userID)
                .query(`
                    SELECT
                        SUM(p.quantity * hap.assetPrice) AS totalValue,
                        SUM(CASE WHEN t.tradeType = 'buy' THEN (p.quantity * hap.assetPrice) - ELSE 0 END) AS realisedPnL,
                        SUM(CASE WHEN t.tradeType = 'sell' THEN (p.quantity * hap.assetPrice) ELSE 0 END) AS unrealisedPnL
                    FROM Position p
                    JOIN Portfolio port ON p.portfolioID = port.id
                    JOIN Asset a ON p.assetID = a.id
                    JOIN HistoricalAssetPrice hap ON a.id = hap.assetID
                    JOIN Trade t ON p.portfolioID = t.portfolioID AND p.assetID = t.assetID
                    WHERE port.userID = @userID
                    AND hap.created_at = (
                        SELECT TOP 1 created_at
                        FROM HistoricalAssetPrice
                        WHERE assetID = p.assetID
                        ORDER BY created_at DESC)
                    GROUP BY p.portfolioID
                    ORDER BY totalValue DESC
                `)
            console.log('result:', result);
            return res.status(200).json({
                totalValue: result.recordset[0].totalValue,
                realisedPnL: result.recordset[0].realisedPnL,
                unrealisedPnL: result.recordset[0].unrealisedPnL
            });

        } catch (error) {
            console.log('Error fetching dashboard:', error);
            return res.status(500).json({ message: 'Error fetching dashboard', error });


        }
    }
}