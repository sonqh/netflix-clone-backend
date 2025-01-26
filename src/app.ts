import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import express, { NextFunction, Request, Response } from 'express'
import logger from './logger'
import { errorHandler } from './middleware/error-handler'
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
app.use(cookieParser())
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(router)

// Error-handling middleware
app.use(errorHandler)

export default app
