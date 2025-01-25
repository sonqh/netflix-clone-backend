import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { User } from '~/models/user.model'
import InternalServerError from '~/errors/internal-server-error'
import NotFoundError from '~/errors/not-found'
import UnauthorizedError from '~/errors/unauthorized-error'
import ApplicationError from '~/errors/application-error'

interface DecodedToken extends JwtPayload {
  userId: string
}

export const protectRoute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies['jwt-netflix']

    if (!token) {
      throw new UnauthorizedError('Unauthorized - No Token Provided')
    }

    if (!process.env.JWT_SECRET) {
      throw new InternalServerError('JWT_SECRET is not defined')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken

    if (!decoded || !decoded.userId) {
      throw new UnauthorizedError('Unauthorized - Invalid Token')
    }

    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      throw new NotFoundError('User not found')
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Error in protectRoute middleware:', (error as Error).message)
    if (error instanceof ApplicationError) {
      res.status(error.status).json({ success: false, message: error.message })
    } else {
      const internalError = new InternalServerError()
      res.status(internalError.status).json({ success: false, message: internalError.message })
    }
  }
}
