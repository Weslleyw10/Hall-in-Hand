const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const busboy = require('connect-busboy')
const busboyBodyParser = require('busboy-body-parser')

const app = express()

// DATABASE
require('./database')

// MIDDLEWARES
app.use(morgan('dev'))
app.use(express.json())
app.use(busboy())
app.use(busboyBodyParser())
app.use(cors())

// VARIABLES
app.set('port', 8000)

// ROUTES
app.use('/hall', require('./src/routes/hall.routes'))
app.use('/service', require('./src/routes/services.routes'))


app.listen(app.get('port'), () => {
    console.log('Server is up.')
})