import { NextFunction, Request, Response } from 'express'
import {
  authenticateUser,
  checkIfUserExists,
  getRandomProfilePic,
  hashPassword,
  validateLoginInput,
  validateSignupInput
} from '~/utils/auth-utils'
import { generateTokenAndSetCookie } from '~/utils/generate-token'
import { User } from '../models/user.model'

export async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, username } = req.body

    // Validate input fields
    validateSignupInput(email, password, username)

    // Check if email or username already exists
    await checkIfUserExists(email, username)

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Generate a random profile picture
    const image = getRandomProfilePic()

    // Create new user
    const newUser = new User({ email, password: hashedPassword, username, image })

    // Generate token
    const token = generateTokenAndSetCookie(`${newUser._id}`, res)

    // Save user to database
    await newUser.save()

    res.status(201).json({
      success: true,
      token,
      user: {
        ...newUser.toObject(),
        password: ''
      }
    })
  } catch (error) {
    next(error)
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body

    // Validate input fields
    validateLoginInput(email, password)

    // Authenticate user
    const user = await authenticateUser(email, password)

    // Generate token
    const token = generateTokenAndSetCookie(`${user._id}`, res)

    res.status(200).json({
      success: true,
      token,
      user: {
        ...user.toObject(),
        password: ''
      }
    })
  } catch (error) {
    next(error)
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.clearCookie('jwt-netflix')
    res.status(200).json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    next(error)
  }
}

export async function authCheck(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json({ success: true, user: req.user })
  } catch (error) {
    next(error)
  }
}
