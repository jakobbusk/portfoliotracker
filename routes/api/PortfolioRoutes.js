// REF: https://expressjs.com/en/guide/routing.html#express-router
import express from 'express'
import checkAuth from '../../middleware/auth.js'
import PortfolioController from '../../controllers/PortfolioController.js'

const router = express.Router({mergeParams: true}) // mergeParams gør så vi kan tilgå alle parametre fra parent routeren


// Henter alle porteføljer for brugeren
router.get('/',checkAuth, PortfolioController.getAll)

// Opretter en portefølje
router.post('/', checkAuth, PortfolioController.create)

// Henter en portefølje
router.get('/:id',checkAuth, PortfolioController.get)





export default router