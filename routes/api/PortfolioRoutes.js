// REF: https://expressjs.com/en/guide/routing.html#express-router
import express from 'express'
import checkAuth from '../../middleware/auth.js'
import PortfolioController from '../../controllers/PortfolioController.js'

const router = express.Router({mergeParams: true}) // mergeParams gør så vi kan tilgå alle parametre fra parent routeren


// Henter alle porteføljer for brugeren
router.get('/',checkAuth, PortfolioController.getAll)

// Opretter en portefølje
router.post('/', checkAuth, PortfolioController.create)

// Henter top 5 positioner for brugeren
router.get('/top5/value', checkAuth, PortfolioController.getTop5Value)

router.get('/top5/upnl', checkAuth, PortfolioController.getTop5UPNL)

// Henter en portefølje
router.get('/:id',checkAuth, PortfolioController.getPortfolio)

// Henter historisk værdi for en portefølje
router.get('/:id/historical',checkAuth, PortfolioController.getPortfolioHistoricalValue)

// Henter positioner for en portefølje
router.get('/:id/positions',checkAuth, PortfolioController.getPositions)

// Hent en position baseret på portfolioID og assetID
router.get('/:id/positions/:positionID',checkAuth, PortfolioController.getPosition)

// Håndter portefølje trades
router.get('/:id/trades',checkAuth, PortfolioController.getTrades)

router.post('/:id/trades',checkAuth, PortfolioController.createTrade)




export default router