import express from 'express'

// Henter vores db connecti⁄on middleware
import dbConnectionMiddleware from './middleware/db.js'

import apiRoutes from './routes/api/apiRoutes.js'
import webRoutes from './routes/web/webRoutes.js'

// Initialiserer express app
const app = express()

// Middleware der logger tidspunktet for hver anmodning
app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})

app.set('view engine', 'ejs');
app.set('views', 'views/pages');

// Middleware der håndterer json data
app.use(express.json())

app.use(express.static('public'))

app.use('/api', dbConnectionMiddleware, apiRoutes)

// webRoutes
app.use('/', webRoutes)

// Starter serveren
// Henter port fra miljøvariabler eller bruger 8080 som standard
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Server listening on port', port)
})

export default app;