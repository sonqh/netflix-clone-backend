import { Request, Response, NextFunction } from 'express'
import logger from '~/logger'

/**
 * Middleware to log the response time of each request.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {void} - This middleware does not return a value.
 */
const logResponseTime = (req: Request, res: Response, next: NextFunction): void => {
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

export default logResponseTime
