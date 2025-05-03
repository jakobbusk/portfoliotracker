// REF: https://expressjs.com/en/guide/routing.html#express-router
import express from 'express'
import checkAuth from '../../middleware/auth.js'
import DashboardController from '../../controllers/DashboardController.js'
const router = express.Router()


router.get('/', checkAuth, DashboardController.getDashboard)


export default router