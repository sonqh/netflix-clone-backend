import { Request, Response, NextFunction } from 'express'
import ApplicationError from '../errors/application-error'
import InternalServerError from '../errors/internal-server-error'
import logger from '../logger'

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
