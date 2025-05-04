import db from '../database/db.js';
import Portfolio from '../models/Portfolio.js';
import { getStockPrice } from '../services/alphavantage.js';
export default class CronController {
    static async handleCronJob(req, res) {

        // Loop gennem alle assets i databasen
        // og opdater dem med nyeste data fra API
        // steps:
        // 1. Hent alle assets fra databasen
        // 2. Loop gennem dem og hent data fra API
        // 3. Opdater dem i databasen
        // 5. Opdater porteføljehistorik
        // Først henter vi alle assets fra databasen
        let assets

        try {
            const query = await db.query(`SELECT * FROM asset`);
            assets = query.recordset;
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error fetching assets' });
        }

        const newAssetPrices = [];

        // Loop gennem alle assets og hent data fra API
        try {
            for (let i = 0; i < assets.length; i++) {

                const assetID = assets[i].id
                const assetSymbol = assets[i].symbol

                // Hent data fra API
                const priceResponse = await getStockPrice(assetSymbol)

                if (priceResponse.error) {
                    console.log("ERROR",price.error);
                    return;
                }
                newAssetPrices.push({
                    assetID: assetID,
                    assetPrice: priceResponse.price
                })
            }

        } catch (error) {
            console.log('Error fetching data from API:', error);
            return res.status(500).json({ message: 'Error fetching data from API' });
        }

        console.log('New asset prices:', newAssetPrices);

        // Nu opdaterer vi databasen med de nye priser
        try {
            for (let i = 0; i < newAssetPrices.length; i++) {
                const assetID = newAssetPrices[i].assetID
                const assetPrice = newAssetPrices[i].assetPrice

                // Opdaterer den nuværende pris i HistoricalAssetPrice tabellen
                await db.request()
                    .input('assetID', assetID)
                    .input('currentAssetPrice', assetPrice)
                    .query(`INSERT INTO HistoricalAssetPrice (assetID, assetPrice) VALUES (@assetID, @currentAssetPrice)`)
            }
            console.log('Database updated with new prices');
        } catch (error) {
            console.log('Error updating database with new prices:', error);
            return res.status(500).json({ message: 'Error updating database with new prices' });
        }

        // Nu opdaterer vi alle porteføljer med de nye priser
        let portfolios;
        try {
            portfolios = await Portfolio.getAllPortfolios();

        } catch (error) {
            console.log('Error fetching portfolios:', error);
            return res.status(500).json({ message: 'Error fetching portfolios' });
        }

        console.log('Portfolios:', portfolios);

        // Loop gennem alle porteføljer og opdater dem med de nye priser
        for (let i = 0; i < portfolios.length; i++) {
            const portfolio = portfolios[i];

            // Opdaterer porteføljen med de nye priser
            try {
                await portfolio.updatePortfolioValueHistory();
            } catch (error) {
                console.log('Error updating portfolio value history:', error);
                return res.status(500).json({ message: 'Error updating portfolio value history' });
            }
        }
        console.log('Portfolios updated with new prices');
        res.status(200).json({ message: 'Cron job successful' })

    }

}