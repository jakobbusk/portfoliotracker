// REF: https://expressjs.com/en/guide/routing.html#express-router
import express from 'express'
import checkAuth from '../../middleware/auth.js'
import AccountController from '../../controllers/AccountController.js'
const router = express.Router()


// Henter all konti for brugeren
router.get('/',checkAuth, AccountController.getAllAccounts)

// Henter en konto og porteføljerne for kontoen
router.get('/:id',checkAuth, AccountController.getAccount)

// Opretter en konto
router.post('/',checkAuth, AccountController.createAccount)

// Lukker en konto
router.put('/:id/close',checkAuth, AccountController.closeAccount)

// Åbner en lukket konto
router.put('/:id/open',checkAuth, AccountController.openAccount)



export default router