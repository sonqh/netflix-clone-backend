import { Request, Response, NextFunction } from 'express'
import ApplicationError from '../errors/application-error'
import InternalServerError from '../errors/internal-server-error'
import logger from '../logger'

/**
 * Middleware to handle errors in the application.
 *
 * @param {ApplicationError | Error} err - The error object.
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {void} - This middleware does not return a value.
 */
export const errorHandler = (err: ApplicationError | Error, req: Request, res: Response, next: NextFunction): void => {
  if (res.headersSent) {
    return next(err)
  }

  if (err instanceof ApplicationError) {
    res.status(err.status).json({ success: false, message: err.message })
  } else {
    logger.error('Unexpected error:', { message: err.message, stack: err.stack })
    const internalError = new InternalServerError()
    res.status(internalError.status).json({ success: false, message: internalError.message })
  }
}
