import dotenv from 'dotenv'

const result = dotenv.config()

if (result.error) {
  dotenv.config({ path: '.env.default' })
}

import util from 'util'

import SafeMongooseConnection from './lib/safe-mongoose-connection'
import logger from './logger'
import app from './app'

const PORT = process.env.PORT || 3000

type DebugCallback = (collectionName: string, method: string, query: Record<string, unknown>, doc: string) => void

let debugCallback: DebugCallback | undefined
if (process.env.NODE_ENV === 'development') {
  debugCallback = (collectionName: string, method: string, query: Record<string, unknown>, doc: string): void => {
    const message = `${collectionName}.${method}(${util.inspect(query, { colors: true, depth: null })}) - doc: ${doc}`
    logger.log({
      level: 'verbose',
      message,
      consoleLoggerOptions: { label: 'MONGO' }
    })
  }
}

const safeMongooseConnection = new SafeMongooseConnection({
  mongoUrl: process.env.MONGO_URL ?? '',
  debugCallback,
  onStartConnection: (mongoUrl) => logger.info(`Connecting to MongoDB at ${mongoUrl}`),
  onConnectionError: (error, mongoUrl) =>
    logger.log({
      level: 'error',
      message: `Could not connect to MongoDB at ${mongoUrl}`,
      error
    }),
  onConnectionRetry: (mongoUrl) => logger.info(`Retrying to MongoDB at ${mongoUrl}`)
})

const serve = () =>
  app.listen(PORT, () => {
    logger.info(`🌏 Express server started at http://localhost:${PORT}`)

    if (process.env.NODE_ENV === 'development') {
      // This route is only present in development mode
      logger.info(`⚙️  Swagger UI hosted at http://localhost:${PORT}/dev/api-docs`)
    }
  })

if (process.env.MONGO_URL == null) {
  logger.error('MONGO_URL not specified in environment', new Error('MONGO_URL not specified in environment'))
  process.exit(1)
} else {
  safeMongooseConnection.connect((mongoUrl) => {
    logger.info(`Connected to MongoDB at ${mongoUrl}`)
    serve()
  })
}

// Close the Mongoose connection, when receiving SIGINT
process.on('SIGINT', async () => {
  console.log('\n')
  logger.info('Gracefully shutting down')
  logger.info('Closing the MongoDB connection')
  try {
    await safeMongooseConnection.close(true)
    logger.info('Mongo connection closed successfully')
  } catch (err) {
    logger.log({
      level: 'error',
      message: 'Error shutting closing mongo connection',
      error: err
    })
  }
  process.exit(0)
})
