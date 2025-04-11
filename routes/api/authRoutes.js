// REF: https://expressjs.com/en/guide/routing.html#express-router
import express from 'express'
import AuthController from '../../controllers/AuthController.js'
import checkAuth from '../../middleware/auth.js'
const router = express.Router()


// Login route
router.post('/login', AuthController.login)

// Check login route
router.get('/check', AuthController.checkAuth)

// Logout route
router.post('/logout', AuthController.logout)

// Register route
router.post('/register', AuthController.register)

// Change password route
router.put('/change-password',checkAuth, AuthController.changePassword)


export default router