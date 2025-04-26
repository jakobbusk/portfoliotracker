import express from 'express'
import servicesController from '../../controllers/ServicesController.js'
import checkAuth from '../../middleware/auth.js'
const router = express.Router({mergeParams: true})

router.get('/symbols',checkAuth, servicesController.symbolLookup)

router.get('/exchangerate/:base/:target', checkAuth,servicesController.getConversionRate)


export default router