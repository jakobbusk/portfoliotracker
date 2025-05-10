import express from 'express'

const router = express.Router()

//liste over porteføljer
router.get('/', (req, res) => {
    res.render('portfolios/list', { title: 'Portfolio' })
})

//opret portefølje
router.get('/create', (req, res) => {
    res.render('portfolios/create', { title: 'Create Portfolio' })
});

//vis specifik portefølje
router.get('/:id', (req, res) => {
    res.render('portfolios/show', { title: 'Portfolio' })
});

export default router