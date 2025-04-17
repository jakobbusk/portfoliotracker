import express from 'express'
const router = express.Router({mergeParams: true})
import authRoutes from './AuthRoutes.js'
import accountRoutes from './AccountRoutes.js'
import portfolioRoutes from './PortfolioRoutes.js'

router.use('/auth', authRoutes)

router.use('/accounts/:userId/portfolios', portfolioRoutes)

router.use('/accounts', accountRoutes)
export default router