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

router.get('/dashboard', async (req, res) => {
  res.render('dashboard', { title: 'Home' })
});

router.get('/accounts', async (req, res) => {
  res.render('accounts/accounts', { title: 'Accounts' })
})

router.get('/accounts/:id', async (req, res) => {
  res.render('accounts/account', { title: 'Account', accountID: req.params.id })
})




export default router