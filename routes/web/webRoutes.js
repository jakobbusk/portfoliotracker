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

router.get('/portfolio', async (req, res) => {
  res.send("All portfolios")
})

router.get('/portfolio/:portfolioID', async (req, res) => {
  const portfolioID = req.params.portfolioID
  res.send(portfolioID)
})


export default router