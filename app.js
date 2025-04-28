import express from 'express'
import db from './database/db.js'

import apiRoutes from './routes/api/apiRoutes.js'
import webRoutes from './routes/web/webRoutes.js'

// Initialiserer express app
const app = express()

app.set('view engine', 'ejs');
app.set('views', './views/pages');

// Middleware der håndterer json data
app.use(express.json())

app.use("/assets/",express.static('public'))

app.use('/api', apiRoutes)

// webRoutes
app.use('/', webRoutes)

// Starter serveren
// Henter port fra miljøvariabler eller bruger 8080 som standard
if(process.env.NODE_ENV !== 'production') {
const port = process.env.PORT || 8080;
app.listen(port, () => {

  try {
    db.connect();

    console.log('Connected to database');
    console.log('Server listening on port', port)
} catch (error) {
  console.error('Database connection failed:', error);
  console.error('Error starting server:', error)
  process.exit(1);

}
})
}

export default app;