import Portfolio from './Portfolio.js';
import Asset from './Asset.js';
import db from '../database/db.js';
import Account from './Account.js';
import Position from './Position.js';

export default class Trade {
    static table = 'trade';
    static columns = ['id', 'portfolioID', 'assetID', 'quantity', 'tradeRate', 'tradingFee', 'tradeType', 'created_at',];

    constructor(data = {}) {
        this.id = data.id;
        this.portfolioID = data.portfolioID;
        this.assetID = data.assetID;
        this.quantity = data.quantity;
        this.tradeRate = data.tradeRate;
        this.tradingFee = data.tradingFee;
        this.tradeType = data.tradeType;
        this.created_at = data.created_at;

        // Håndter hvis symbol er givet
        // og assetID ikke er givet
        if(data.symbol) {
            this.symbol = data.symbol;
        }
    }

    static async all(userID, portfolioID, columns = Trade.columns) {
        console.log('Fetching all trades for user:', userID, 'and portfolio:', portfolioID);

        const query = db.request()
        try {
            const result = await query.input('userID', userID)
                .input('portfolioID', portfolioID)
                .query(`SELECT
                    ${columns.map(col => 't.' + col).join(', ')},
                    a.name AS assetName,
                    a.symbol AS assetSymbol,
                    a.currency AS assetCurrency
                    FROM Trade t
                    JOIN Portfolio p ON p.id = t.portfolioID
                    JOIN Asset a ON a.id = t.assetID
                    WHERE p.userID = @userID AND p.id = @portfolioID
                `)

            console.log('result:', result);

            return result.recordset
        } catch (error) {
            console.error('Error fetching portfolio trades:', error);
            throw error;
        }
    }

    async create(userID, exchangeRate) {
        // Først validerer vi at porteføljen eksisterer
        // Og at assetID eksisterer
        // Og at der er nok penge i porteføljen
        const portfolio = await Portfolio.findByID(this.portfolioID, userID)

        if (!portfolio) {
            return {
                error: 'Portfolio not found',
            }
        }

        // Her finder vi den konto som porteføljen tilhører
        const account = await Account.findByID(portfolio.accountID, userID);
        if (!account) {
            return {
                error: 'Account not found',
            }
        } else if(account.closed) {
            return {
                error: 'Account is closed',
            }
        } else if(account.balance < (this.quantity * this.tradeRate + this.tradingFee) * exchangeRate) {
            return {
                error: 'Not enough money in account',
            }
        }
        // Find positionen forbundet med porteføljen
        let position = await Position.findByPortfolioIDAndAssetID(this.portfolioID, this.assetID);
        if (!position) {
            // Hvis positionen ikke findes, så opretter vi en ny
            const newPosition = new Position({
                portfolioID: this.portfolioID,
                assetID: this.assetID,
            });
            await newPosition.create();
            position = newPosition;
        }

        // Nu tjekker vi om vi kan sælge aktien
        if (this.tradeType == 'sell'  && position.quantity < this.quantity) {
            return {
                error: 'Not enough shares to sell',
            }
        }

        try {
            // Her opretter vi en ny trade og transaktion
            const tradeQuery = await db.request()
            .input('portfolioID', this.portfolioID)
            .input('assetID', this.assetID)
            .input('quantity', this.quantity)
            .input('tradeRate', this.tradeRate)
            .input('tradingFee', this.tradingFee)
            .input('tradeType', this.tradeType)
            .query(`INSERT INTO
                ${Trade.table}
                (portfolioID, assetID, quantity, tradeRate, tradingFee, tradeType)
                OUTPUT INSERTED.id, INSERTED.portfolioID, INSERTED.assetID, INSERTED.quantity, INSERTED.tradeRate, INSERTED.tradingFee, INSERTED.tradeType
                VALUES (@portfolioID, @assetID, @quantity, @tradeRate, @tradingFee, @tradeType)`);

            const newTrade = new Trade(tradeQuery.recordset[0]);
            const tradeValue = this.quantity * this.tradeRate + this.tradingFee;
            const transactionType = this.tradeType === 'buy' ? 'withdraw' : 'deposit';
            const transactionQuery = await account.makeTransaction(tradeValue, exchangeRate, 'USD', transactionType, this.portfolioID, newTrade.id);
            console.log('Transaction query:', transactionQuery);

            if(transactionQuery.rowsAffected[0] === 0) {
                throw new Error('Transaction failed');
            }

            if(this.tradeType === 'sell') {
                // Hvis vi sælger en aktie - så skal vi regne realiseret PnL ud
                const realisedPnL = (this.tradeRate - position.GAK) * this.quantity;
                portfolio.realisedPnL += realisedPnL;
            }


            // Opdater positionen
            await position.update(this.tradeType, this.quantity, tradeValue);
            // await portfolio.update();

            return true;
        } catch (error) {
            console.error('Error creating trade:', error);
            throw error;
        }
    }

}