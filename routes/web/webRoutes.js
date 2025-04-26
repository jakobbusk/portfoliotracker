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




export default router