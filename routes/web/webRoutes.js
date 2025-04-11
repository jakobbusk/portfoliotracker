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


export default router