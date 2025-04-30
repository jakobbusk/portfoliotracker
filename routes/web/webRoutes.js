import express from 'express'
const router = express.Router({mergeParams: true})
import accountRoutes from './AccountRoutes.js'
import portfolioRoutes from './PortfolioRoutes.js'

router.use('/accounts', accountRoutes)
router.use('/portfolios', portfolioRoutes)

router.get('/', (req, res) => {
  res.redirect('/dashboard')
});

router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Login' })
});

router.get('/register', (req, res) => {
  res.render('auth/register', { title: 'Register' })
});

router.get('/changepassword', (req, res) => {
  res.render('auth/changepassword', { title: 'Change Password' })
});

router.get('/dashboard', (req, res) => {
  res.render('dashboard', { title: 'Home' })
});

router.get('/symbols', (req, res) => {
  res.render('symbols/search', { title: 'Symbols' })
})

router.get('/symbols/:symbol/historical', (req, res) => {
  res.render('symbols/historical', { title: 'Stock', symbol: req.params.symbol })
})

export default router