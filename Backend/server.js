const app = require('./app')
const http = require('http')
const logger = require('./logging/logger')

const PORT = process.env.PORT || 3000

const server = http.createServer(app)

server.listen(PORT, () => {
    logger.info(`started server on port ${PORT}`)
})