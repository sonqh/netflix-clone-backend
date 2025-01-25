import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { User } from '~/models/user.model'

interface DecodedToken extends JwtPayload {
  userId: string
}

export const protectRoute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies['jwt-netflix']

    if (!token) {
      res.status(401).json({ success: false, message: 'Unauthorized - No Token Provided' })
      return
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken

    if (!decoded || !decoded.userId) {
      res.status(401).json({ success: false, message: 'Unauthorized - Invalid Token' })
      return
    }

    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' })
      return
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Error in protectRoute middleware:', (error as Error).message)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}
