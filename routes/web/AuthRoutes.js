import express from 'express'
const router = express.Router({mergeParams: true})

//loginside
router.get('/login', (req, res) => {
    res.render('auth/login', { title: 'Login' })
});

//register side
router.get('/register', (req, res) => {
res.render('auth/register', { title: 'Register' })
});

//changepassword side
router.get('/changepassword', (req, res) => {
res.render('auth/changepassword', { title: 'Change Password' })
});

export default router