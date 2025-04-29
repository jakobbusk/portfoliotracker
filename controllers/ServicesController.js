import { findStocksBySymbol } from '../services/finnhubAPI/index.js'
import { getConversionRate } from '../services/exchangerateAPI/index.js';
import { historicalStockData } from '../services/alphavantage.js';
class ServicesController {

    // Søg efter aktie
    static async symbolLookup(req,res){

        const symbol = req.query.q;
        let result
        try {
            result = await findStocksBySymbol(symbol)
            return res.status(200).json(result)
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching symbols', error });
        }
    }

    // Hent sidste års aktiekurser for given symbol
    static async historicalData(req,res){
        const symbol = req.params.symbol

        try {
            const result = await historicalStockData(symbol)
            return res.status(200).json(result)
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching historical data', error });
        }
    }

    // Lav getConversionRate
    static async getConversionRate(req,res){
        const base = req.params.base
        const target = req.params.target

        try {
            const {base_code, target_code, conversion_rate} = await getConversionRate(base, target)

            return res.status(200).json({base_code, target_code, conversion_rate})
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching conversion rate', error });
        }
    }

}

export default ServicesController