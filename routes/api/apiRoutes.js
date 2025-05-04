import express from 'express'
const router = express.Router({mergeParams: true})
import authRoutes from './AuthRoutes.js'
import accountRoutes from './AccountRoutes.js'
import portfolioRoutes from './PortfolioRoutes.js'
import serviceRoutes from './ServicesRoutes.js'
import tradeRoutes from './TradeRoutes.js'
import dashboardRoutes from './DashboardRoutes.js'
import Portfolio from '../../models/Portfolio.js'




router.use('/auth', authRoutes)

router.use('/accounts', accountRoutes)

router.use('/portfolios', portfolioRoutes)

router.use('/services', serviceRoutes)

router.use('/trades', tradeRoutes)

router.use('/dashboard', dashboardRoutes)

router.get('/cron', async (req, res) => {
    // Loop gennem alle assets i databasen
    // og opdater dem med nyeste data fra API
    // steps:
    // 1. Hent alle assets fra databasen
    // 2. Loop gennem dem og hent data fra API
    // 3. Opdater dem i databasen
    // 5. Opdater porteføljehistorik

    const portfolio = await Portfolio.findByID(24, 2)

    await portfolio.updatePortfolioValueHistory()

    res.status(200).json({ message: 'Cron job endpoint' })
})
export default router