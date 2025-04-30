import express from 'express'
const router = express.Router({mergeParams: true})

router.get('/login', (req, res) => {
    res.render('auth/login', { title: 'Login' })
});

router.get('/register', (req, res) => {
res.render('auth/register', { title: 'Register' })
});

router.get('/changepassword', (req, res) => {
res.render('auth/changepassword', { title: 'Change Password' })
});

export default router