import express from 'express'
const router = express.Router({mergeParams: true})
import accountRoutes from './AccountRoutes.js'
import portfolioRoutes from './PortfolioRoutes.js'
import AuthRoutes from './AuthRoutes.js'

router.get('/', (req, res) => {
  res.redirect('/dashboard')
});

router.get('/dashboard', (req, res) => {
  res.render('dashboard', { title: 'Hjem' })
});

router.get('/symbols', (req, res) => {
  res.render('symbols/search', { title: 'Symboler' })
})

router.get('/symbols/:symbol', (req, res) => {
  res.render('symbols/symbol', { title: `${req.params.symbol}`, symbol: req.params.symbol })
})

router.get('/symbols/:symbol/trade', (req, res) => {
  res.render('symbols/trade', { title: 'Køb', symbol: req.params.symbol })
})

router.get('/symbols/:symbol/sell', (req, res) => {
  res.render('symbols/sell', { title: 'Sælg', symbol: req.params.symbol })
})

router.use('/accounts', accountRoutes)
router.use('/portfolios', portfolioRoutes)
router.use(AuthRoutes)


export default router