import { generateTokenAndSetCookie } from '~/utils/generate-token'
import { User } from '../models/user.model'
import bcryptjs from 'bcryptjs'
import { Request, Response } from 'express'

export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, username } = req.body

    if (!email || !password || !username) {
      res.status(400).json({ success: false, message: 'All fields are required' })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, message: 'Invalid email' })
      return
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
      return
    }

    const existingUserByEmail = await User.findOne({ email })

    if (existingUserByEmail) {
      res.status(400).json({ success: false, message: 'Email already exists' })
      return
    }

    const existingUserByUsername = await User.findOne({ username })

    if (existingUserByUsername) {
      res.status(400).json({ success: false, message: 'Username already exists' })
      return
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
    console.log('Error in signup controller', (error as Error).message)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'All fields are required' })
      return
    }

    const user = await User.findOne({ email })
    if (!user) {
      res.status(404).json({ success: false, message: 'Invalid credentials' })
      return
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password)

    if (!isPasswordCorrect) {
      res.status(400).json({ success: false, message: 'Invalid credentials' })
      return
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
    console.log('Error in login controller', (error as Error).message)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  try {
    res.clearCookie('jwt-netflix')
    res.status(200).json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    console.log('Error in logout controller', (error as Error).message)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export async function authCheck(req: Request, res: Response): Promise<void> {
  try {
    console.log('req.user:', req.user)
    res.status(200).json({ success: true, user: req.user })
  } catch (error) {
    console.log('Error in authCheck controller', (error as Error).message)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}
