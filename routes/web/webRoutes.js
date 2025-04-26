import express from 'express'
const router = express.Router()



router.get('/', (req, res) => {
  res.redirect('/dashboard')
});

router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Login' })
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' })
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

router.get('/accounts/:id/deposit', (req, res) => {
  res.render('accounts/deposit', { title: 'Transaction', accountID: req.params.id })}
);

router.get('/accounts/:id/withdraw', (req, res) => {
  res.render('accounts/withdraw', { title: 'Transaction', accountID: req.params.id })
});




export default router