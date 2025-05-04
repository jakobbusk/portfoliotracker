import express from 'express'
const router = express.Router({mergeParams: true})
import authRoutes from './AuthRoutes.js'
import accountRoutes from './AccountRoutes.js'
import portfolioRoutes from './PortfolioRoutes.js'
import serviceRoutes from './ServicesRoutes.js'
import tradeRoutes from './TradeRoutes.js'
import dashboardRoutes from './DashboardRoutes.js'
import cronController from '../../controllers/CronController.js'




router.use('/auth', authRoutes)

router.use('/accounts', accountRoutes)

router.use('/portfolios', portfolioRoutes)

router.use('/services', serviceRoutes)

router.use('/trades', tradeRoutes)

router.use('/dashboard', dashboardRoutes)

router.get('/cron', cronController.handleCronJob)
export default router