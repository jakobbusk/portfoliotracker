import express from 'express'

const router = express.Router()

//liste over accounts
router.get('/', (req, res) => {
    res.render('accounts/list', { title: 'Accounts' })
})

//opret account
router.get('/create', (req, res) => {
    res.render('accounts/create', { title: 'Create Account' })
});
  
//specifik account side
router.get('/:id', (req, res) => {
    res.render('accounts/show', { title: 'Account', accountID: req.params.id })
})
  
export default router