const express = require('express')
const compression = require('compression')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const db = require('./db/db').default
const morgan = require('./logging/morgan')

require('./models/relations')

const routes = require('./routes')

const app = express()

// Connection
app.locals.db = db

// Middlewares
app.use(express.json())
app.use(compression())
app.use(cors())

// Logging
app.use(morgan)

// Mount routes
app.use('/', routes)

module.exports = app