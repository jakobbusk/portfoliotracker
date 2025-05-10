import express from 'express'
const router = express.Router({mergeParams: true})
import accountRoutes from './AccountRoutes.js'
import portfolioRoutes from './PortfolioRoutes.js'
import AuthRoutes from './AuthRoutes.js'

//redirect til dashboard
router.get('/', (req, res) => {
  res.redirect('/dashboard')
});

//vis dashboard
router.get('/dashboard', (req, res) => {
  res.render('dashboard', { title: 'Hjem' })
});

//vis symboler søgeside
router.get('/symbols', (req, res) => {
  res.render('symbols/search', { title: 'Symboler' })
})

//side for specifikt symbol
router.get('/symbols/:symbol', (req, res) => {
  res.render('symbols/symbol', { title: `${req.params.symbol}`, symbol: req.params.symbol })
})

//køb specifikt symbol
router.get('/symbols/:symbol/trade', (req, res) => {
  res.render('symbols/trade', { title: 'Køb', symbol: req.params.symbol })
})

//sælg specifikt symbol
router.get('/symbols/:symbol/sell', (req, res) => {
  res.render('symbols/sell', { title: 'Sælg', symbol: req.params.symbol })
})

//brug de dedikerede routerfiler
router.use('/accounts', accountRoutes)
router.use('/portfolios', portfolioRoutes)
router.use(AuthRoutes)


export default router