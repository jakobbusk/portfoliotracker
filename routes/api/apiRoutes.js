import express from 'express'
const router = express.Router({mergeParams: true})
import authRoutes from './AuthRoutes.js'
import accountRoutes from './AccountRoutes.js'
import portfolioRoutes from './PortfolioRoutes.js'
import serviceRoutes from './ServicesRoutes.js'

router.use('/auth', authRoutes)

router.use('/accounts', accountRoutes)

router.use('/portfolios', portfolioRoutes)

router.use('/services', serviceRoutes)
export default router