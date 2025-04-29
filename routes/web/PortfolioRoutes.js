import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
    res.render('portfolios/list', { title: 'Portfolio' })
})

router.get('/create', (req, res) => {
    res.render('portfolios/create', { title: 'Create Portfolio' })
});

router.get('/:id', (req, res) => {
    res.render('portfolios/show', { title: 'Portfolio' })
});

export default router