import Account from "../models/Account.js";
import Portfolio from "../models/Portfolio.js";
import Trade from "../models/Trade.js";
import Asset from "../models/Asset.js";
import { findStocksBySymbol } from "../services/finnhubAPI/index.js";

class TradeController {

    //hent handler tilknyttet en specifik portefølje
    static async getTrades(req, res) {
        const portfolioID = req.params.portfolioID;
        const userID = req.user.id;

        try {
            const trades = await Trade.allByPortfolioID(userID, portfolioID);
            if (!trades) {
                return res.status(404).json({ message: 'Trades not found' });
            }
            return res.status(200).json(trades);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching trades', error });
        }
    }

    //håndtering af trade, sikrer at der er styr på det asset der handles og kalder create metoden i trade
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

            //Finnhub API returnerer ikke nødvendigvis det resultat med matchende symbol først.
            //Derfor bruger vi map og indexOf til at finde resultatet med det rigtige symbol.
            let resultIndex = assetDetails.map((stock) => stock.symbol == symbol.toUpperCase()).indexOf(true);
            if(assetDetails.length === 0 || resultIndex === -1) {
                return res.status(404).json({ message: 'Asset not found' });
            }
            const asset = new Asset({ symbol: assetDetails[resultIndex].symbol, name: assetDetails[resultIndex].description });

            try {
                // Opretter asset i databasen
                const newAsset = await asset.create(tradeRate);
                assetID = newAsset.id;
            } catch (error) {
                return res.status(500).json({ message: 'Error creating asset', error });
            }
        } else {
            assetID = assetExists.id;
            //hvis asset allerede eksisterer, opdateres kursen i databasen
            await assetExists.updateAssetPrice(tradeRate);
        }

        //opret trade objekt
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
            //kald create til at lave handlen
            const createdTrade = await trade.create(req.user.id, exchangeRate);
            if(createdTrade && createdTrade.error) {
                console.log('Error creating trade:', createdTrade.error);

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