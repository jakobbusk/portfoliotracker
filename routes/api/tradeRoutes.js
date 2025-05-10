// REF: https://expressjs.com/en/guide/routing.html#express-router
import express from 'express'
import checkAuth from '../../middleware/auth.js'
import TradeController from '../../controllers/TradeController.js'
const router = express.Router()

//registrering af handel
router.post('/',checkAuth, TradeController.handleTrade)

//hent handler tilhørende en portefølje
router.get('/:portfolioID',checkAuth, TradeController.getTrades)


export default router