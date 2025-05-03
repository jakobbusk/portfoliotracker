import Account from "../models/Account.js";
import Portfolio from "../models/Portfolio.js";
import Trade from "../models/Trade.js";
import Asset from "../models/Asset.js";
import { findStocksBySymbol } from "../services/finnhubAPI/index.js";

class TradeController {

    static async getTrades(req, res) {
        const portfolioID = req.params.portfolioID;
        const userID = req.user.id;

        try {
            const trades = await Trade.all(userID, portfolioID);
            if (!trades) {
                return res.status(404).json({ message: 'Trades not found' });
            }
            return res.status(200).json(trades);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching trades', error });
        }
    }

    static async handleTrade(req, res) {
        const { portfolioID, symbol, quantity, tradeRate, tradingFee, tradeType, exchangeRate } = req.body;
        const userID = req.user.id;
        let assetID;

        // Validering af input
        // Sikre at den authentificerede bruger ejer porteføljen
        // og at symbol er gyldigt
        const assetExists = await Asset.findBySymbol(symbol)


        // Hvis asset ikke findes så opretter vi den.
        if(!assetExists) {
            const assetDetails = await findStocksBySymbol(symbol);
            if(assetDetails.length === 0) {
                return res.status(404).json({ message: 'Asset not found' });
            }
            const asset = new Asset({ symbol: assetDetails[0].symbol, name: assetDetails[0].description });
            try {
                // Opretter asset i databasen
                const newAsset = await asset.create(tradeRate);
                assetID = newAsset.id;
            } catch (error) {
                return res.status(500).json({ message: 'Error creating asset', error });
            }
        } else {
            assetID = assetExists.id;
            await assetExists.updateAssetPrice(tradeRate);
        }

        const trade = new Trade({
            portfolioID,
            assetID,
            symbol,
            quantity,
            tradeRate,
            tradingFee,
            tradeType
        });

        try {
            const createdTrade = await trade.create(req.user.id, exchangeRate);
            if(createdTrade && createdTrade.error) {
                return res.status(400).json({ error: createdTrade.error });
            } else {
                return res.status(201).json({ tradeID: createdTrade.id });
            }
        } catch (error) {
            console.log('Error creating trade:', error);
            return res.status(500).json({ message: 'Error creating trade', error });
        }
    }

}
export default TradeController;