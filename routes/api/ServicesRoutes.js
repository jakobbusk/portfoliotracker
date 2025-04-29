import express from 'express'
import servicesController from '../../controllers/ServicesController.js'
import checkAuth from '../../middleware/auth.js'
const router = express.Router({mergeParams: true})

router.get('/symbols',checkAuth, servicesController.symbolLookup)

router.get('/symbols/:symbol', checkAuth, servicesController.currentStockPrice)

router.get('/symbols/:symbol/historical', checkAuth, servicesController.historicalData)


router.get('/exchangerate/:base/:target', checkAuth,servicesController.getConversionRate)


export default router