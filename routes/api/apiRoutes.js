import express from 'express'
//sørg for at parametre kan tilgås af subroutes
const router = express.Router({mergeParams: true})
import authRoutes from './AuthRoutes.js'
import accountRoutes from './AccountRoutes.js'
import portfolioRoutes from './PortfolioRoutes.js'
import serviceRoutes from './ServicesRoutes.js'
import tradeRoutes from './TradeRoutes.js'
import dashboardRoutes from './DashboardRoutes.js'
import cronController from '../../controllers/CronController.js'



//fordeler routes ud i de respektive routere
router.use('/auth', authRoutes)

router.use('/accounts', accountRoutes)

router.use('/portfolios', portfolioRoutes)

router.use('/services', serviceRoutes)

router.use('/trades', tradeRoutes)

router.use('/dashboard', dashboardRoutes)

router.get('/cron', cronController.handleCronJob)
export default router