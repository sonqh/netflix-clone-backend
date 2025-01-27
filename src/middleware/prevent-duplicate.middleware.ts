import { Request, Response, NextFunction } from 'express'

const pendingRequests = new Set<string>()

const preventDuplicateMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const key = `${req.method}-${req.originalUrl}-${JSON.stringify(req.body)}`

  if (pendingRequests.has(key)) {
    return
  }

  pendingRequests.add(key)

  res.on('finish', () => {
    pendingRequests.delete(key)
  })

  next()
}

export default preventDuplicateMiddleware
