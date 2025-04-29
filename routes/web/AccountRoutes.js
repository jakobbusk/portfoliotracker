import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
    res.render('accounts/list', { title: 'Accounts' })
})

router.get('/create', (req, res) => {
    res.render('accounts/create', { title: 'Create Account' })
});
  
router.get('/:id', (req, res) => {
    res.render('accounts/show', { title: 'Account', accountID: req.params.id })
})
  
export default router