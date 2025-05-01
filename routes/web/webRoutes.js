import express from 'express'
const router = express.Router({mergeParams: true})
import accountRoutes from './AccountRoutes.js'
import portfolioRoutes from './PortfolioRoutes.js'
import AuthRoutes from './AuthRoutes.js'

router.get('/', (req, res) => {
  res.redirect('/dashboard')
});

router.get('/dashboard', (req, res) => {
  res.render('dashboard', { title: 'Home' })
});

router.get('/symbols', (req, res) => {
  res.render('symbols/search', { title: 'Symbols' })
})

router.get('/symbols/:symbol', (req, res) => {
  res.render('symbols/symbol', { title: 'Stock', symbol: req.params.symbol })
})

router.use('/accounts', accountRoutes)
router.use('/portfolios', portfolioRoutes)
router.use(AuthRoutes)


export default router