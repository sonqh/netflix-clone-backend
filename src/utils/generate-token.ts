import jwt from 'jsonwebtoken'
import { Response } from 'express'

export const generateTokenAndSetCookie = (userId: string, res: Response): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15d' })

  res.cookie('jwt-netflix', token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks, make it not be accessed by JS
    sameSite: 'strict', // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== 'development'
  })

  return token
}
