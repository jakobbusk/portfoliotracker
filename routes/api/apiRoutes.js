import express from 'express'
const router = express.Router({mergeParams: true})
import authRoutes from './AuthRoutes.js'
import accountRoutes from './AccountRoutes.js'
import portfolioRoutes from './PortfolioRoutes.js'
import serviceRoutes from './ServicesRoutes.js'
import tradeRoutes from './TradeRoutes.js'

router.use('/auth', authRoutes)

router.use('/accounts', accountRoutes)

router.use('/portfolios', portfolioRoutes)

router.use('/services', serviceRoutes)

router.use('/trades', tradeRoutes)

router.get('/cron', (req, res) => {
    // Loop gennem alle assets i databasen
    // og opdater dem med nyeste data fra API
    res.status(200).json({ message: 'Cron job endpoint' })
})
export default router