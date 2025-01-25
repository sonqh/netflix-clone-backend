import bodyParser from 'body-parser'
import compression from 'compression'
import express, { NextFunction, Request, Response } from 'express'
import ApplicationError from './errors/application-error'

import logger from './logger'
import router from './routes'

const app = express()

function logResponseTime(req: Request, res: Response, next: NextFunction) {
  const startHrTime = process.hrtime()

  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime)
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6
    const message = `${req.method} ${res.statusCode} ${elapsedTimeInMs}ms\t${req.path}`
    logger.log({
      level: 'debug',
      message,
      consoleLoggerOptions: { label: 'API' }
    })
  })

  next()
}

app.use(logResponseTime)

app.use(compression())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(router)

// Error-handling middleware
app.use((err: ApplicationError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    next(err)
  }

  res.status(err.status || 500).json({
    error: err.message
  })
})

export default app
