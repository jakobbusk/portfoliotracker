import express from 'express'
const router = express.Router()



router.get('/', (req, res) => {
  res.redirect('/dashboard')
});

router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Login' })
});

router.get('/register', (req, res) => {
  res.render('auth/register', { title: 'Register' })
});

router.get('/dashboard', (req, res) => {
  res.render('dashboard', { title: 'Home' })
});

router.get('/accounts', (req, res) => {
  res.render('accounts/list', { title: 'Accounts' })
})

router.get('/accounts/create', (req, res) => {
  res.render('accounts/create', { title: 'Create Account' })
});

router.get('/accounts/:id', (req, res) => {
  res.render('accounts/show', { title: 'Account', accountID: req.params.id })
})

router.get('/portfolios', (req, res) => {
  res.render('portfolios/list', { title: 'Portfolio' })
})

router.get('/portfolios/create', (req, res) => {
  res.render('portfolios/create', { title: 'Create Portfolio' })
});


router.get('/portfolios/:id', (req, res) => {
  res.render('portfolios/show', { title: 'Portfolio' })
});




export default router