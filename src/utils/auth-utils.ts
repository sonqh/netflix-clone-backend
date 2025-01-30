import { User } from '~/models/user.model'
import BadRequest from '../errors/bad-request'
import UnauthorizedError from '../errors/unauthorized-error'
import NotFoundError from '../errors/not-found'
import bcryptjs from 'bcryptjs'

// Validate email format
export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new BadRequest('Invalid email')
  }
}

// Validate signup input fields
export function validateSignupInput(email: string, password: string, username: string): void {
  if (!email || !password || !username) {
    throw new BadRequest('All fields are required')
  }

  validateEmail(email)

  if (password.length < 6) {
    throw new BadRequest('Password must be at least 6 characters')
  }
}

// Validate login input fields
export function validateLoginInput(email: string, password: string): void {
  if (!email || !password) {
    throw new BadRequest('All fields are required')
  }

  validateEmail(email)
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10)
  return bcryptjs.hash(password, salt)
}

// Get random profile picture
export function getRandomProfilePic(): string {
  const PROFILE_PICS = ['/avatar1.png', '/avatar2.png', '/avatar3.png']
  return PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)]
}

// Function to check if the email and username already exist
export async function checkIfUserExists(email: string, username: string): Promise<void> {
  const existingUserByEmail = await User.findOne({ email })
  if (existingUserByEmail) {
    throw new BadRequest('Email already exists')
  }

  const existingUserByUsername = await User.findOne({ username })
  if (existingUserByUsername) {
    throw new BadRequest('Username already exists')
  }
}

// Authenticate user
export async function authenticateUser(email: string, password: string) {
  const user = await User.findOne({ email })
  if (!user) {
    throw new NotFoundError('Invalid credentials')
  }

  const isPasswordCorrect = await bcryptjs.compare(password, user.password)
  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Invalid credentials')
  }

  return user
}
