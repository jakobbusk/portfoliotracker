import express from 'express'
import servicesController from '../../controllers/ServicesController.js'
import checkAuth from '../../middleware/auth.js'
const router = express.Router({mergeParams: true})

//søg efter symboler
router.get('/symbols',checkAuth, servicesController.symbolLookup)

//hent kurs på en aktie
router.get('/symbols/:symbol', checkAuth, servicesController.currentStockPrice)

//hent historisk data på en aktie
router.get('/symbols/:symbol/historical', checkAuth, servicesController.historicalData)

//hent kurs til valutaveksling
router.get('/exchangerate/:base/:target', checkAuth,servicesController.getConversionRate)


export default router