import { generateTokenAndSetCookie } from '~/utils/generate-token'
import { User } from '../models/user.model'
import bcryptjs from 'bcryptjs'
import { Request, Response } from 'express'
import BadRequest from '../errors/bad-request'
import NotFoundError from '../errors/not-found'
import UnauthorizedError from '../errors/unauthorized-error'
import ApplicationError from '~/errors/application-error'
import InternalServerError from '../errors/internal-server-error'

export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, username } = req.body

    if (!email || !password || !username) {
      throw new BadRequest('All fields are required')
    }

    // Format type:
    // Regular expression to validate email format
    // ^[^\s@]+: Ensures the email starts with one or more characters that are not whitespace or '@'
    // @[^\s@]+: Ensures there is an '@' followed by one or more characters that are not whitespace or '@'
    // \.[^\s@]+$: Ensures there is a '.' followed by one or more characters that are not whitespace or '@' at the end
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      throw new BadRequest('Invalid email')
    }

    if (password.length < 6) {
      throw new BadRequest('Password must be at least 6 characters')
    }

    const existingUserByEmail = await User.findOne({ email })

    if (existingUserByEmail) {
      throw new BadRequest('Email already exists')
    }

    const existingUserByUsername = await User.findOne({ username })

    if (existingUserByUsername) {
      throw new BadRequest('Username already exists')
    }

    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    const PROFILE_PICS = ['/avatar1.png', '/avatar2.png', '/avatar3.png']

    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)]

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      image
    })

    const token = generateTokenAndSetCookie(`${newUser._id}`, res)
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
    if (error instanceof ApplicationError) {
      res.status(error.status).json({ success: false, message: error.message })
    } else {
      console.log('Error in signup controller', (error as Error).message)
      const internalError = new InternalServerError()
      res.status(internalError.status).json({ success: false, message: internalError.message })
    }
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new BadRequest('All fields are required')
    }

    const user = await User.findOne({ email })
    if (!user) {
      throw new NotFoundError('Invalid credentials')
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password)

    if (!isPasswordCorrect) {
      throw new UnauthorizedError('Invalid credentials')
    }

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
    if (error instanceof ApplicationError) {
      res.status(error.status).json({ success: false, message: error.message })
    } else {
      console.log('Error in login controller', (error as Error).message)
      const internalError = new InternalServerError()
      res.status(internalError.status).json({ success: false, message: internalError.message })
    }
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  try {
    res.clearCookie('jwt-netflix')
    res.status(200).json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    console.log('Error in logout controller', (error as Error).message)
    const internalError = new InternalServerError()
    res.status(internalError.status).json({ success: false, message: internalError.message })
  }
}

export async function authCheck(req: Request, res: Response): Promise<void> {
  try {
    console.log('req.user:', req.user)
    res.status(200).json({ success: true, user: req.user })
  } catch (error) {
    console.log('Error in authCheck controller', (error as Error).message)
    const internalError = new InternalServerError()
    res.status(internalError.status).json({ success: false, message: internalError.message })
  }
}
