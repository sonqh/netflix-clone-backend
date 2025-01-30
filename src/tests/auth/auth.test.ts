import request from 'supertest'
import mongoose from 'mongoose'
import * as authUtils from '~/utils/auth-utils'
import { User } from '~/models/user.model'
import app from '~/app'
import dotenvConfig from '~/config/dotenv.config'
import { redisClient } from '~/config/redis.config'
import BadRequest from '~/errors/bad-request'
import UnauthorizedError from '~/errors/unauthorized-error'

jest.mock('~/utils/auth-utils')

dotenvConfig.config()

const API_VERSION = process.env.API_VERSION ?? 'v1'
const BASE_PATH = `/api/${API_VERSION}/auth`

// Test Helpers
const createMockUser = (overrides = {}) => ({
  email: 'test@example.com',
  username: 'testuser',
  password: 'password123',
  ...overrides
})

const setupAuthUtilsMock = () => {
  jest.spyOn(authUtils, 'hashPassword').mockResolvedValue('hashedpassword')
  jest.spyOn(authUtils, 'getRandomProfilePic').mockReturnValue('/avatar1.png')
}

describe('Auth Controller', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb')
  })

  beforeEach(async () => {
    await User.deleteMany()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await redisClient?.quit()
    await mongoose.connection.close()
  })

  describe('POST /signup', () => {
    const SIGNUP_PATH = `${BASE_PATH}/signup`

    describe('Successful registration', () => {
      it('should create a new user and return token', async () => {
        setupAuthUtilsMock()
        jest.spyOn(authUtils, 'checkIfUserExists').mockResolvedValue(undefined)

        const response = await request(app).post(SIGNUP_PATH).send(createMockUser())

        expect(response.status).toBe(201)
        expect(response.body).toMatchObject({
          success: true,
          user: {
            username: 'testuser',
            email: 'test@example.com'
          }
        })
      })
    })

    describe('Validation errors', () => {
      it.each([
        ['invalid email', { email: 'invalid' }, 'Invalid email'],
        ['short password', { password: '123' }, 'Password must be at least 6 characters'],
        ['missing fields', { username: '' }, 'All fields are required']
      ])('should handle %s', async (_, payload, expectedMessage) => {
        jest.spyOn(authUtils, 'checkIfUserExists').mockImplementation(() => {
          throw new BadRequest(expectedMessage)
        })

        const response = await request(app).post(SIGNUP_PATH).send(createMockUser(payload))

        expect(response.status).toBe(400)
        expect(response.body.message).toBe(expectedMessage)
      })
    })

    describe('Duplicate user errors', () => {
      it('should prevent duplicate email registration', async () => {
        await User.create(createMockUser())

        const response = await request(app).post(SIGNUP_PATH).send(createMockUser())

        expect(response.status).toBe(400)
        expect(response.body.message).toMatch('All fields are required')
      })
    })
  })

  describe('POST /login', () => {
    const LOGIN_PATH = `${BASE_PATH}/login`

    describe('Successful authentication', () => {
      it('should return token for valid credentials', async () => {
        const user = await User.create(createMockUser())
        jest.spyOn(authUtils, 'authenticateUser').mockResolvedValue(user)

        const response = await request(app).post(LOGIN_PATH).send(createMockUser())

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({
          success: true,
          user: { username: 'testuser' }
        })
        expect(response.body.token).toBeDefined()
      })
    })

    describe('Authentication failures', () => {
      it.each([
        ['invalid email', { email: 'invalid' }, 'Invalid email'],
        ['missing fields', { password: '' }, 'All fields are required'],
        ['wrong credentials', { email: 'wrong@example.com' }, 'Invalid credentials'],
        ['incorrect password', { password: 'wrong' }, 'Invalid credentials']
      ])('should handle %s', async (_, payload, expectedMessage) => {
        jest.spyOn(authUtils, 'authenticateUser').mockImplementation(() => {
          throw new UnauthorizedError(expectedMessage)
        })

        const response = await request(app).post(LOGIN_PATH).send(createMockUser(payload))

        expect(response.status).toBe(401)
        expect(response.body.message).toBe(expectedMessage)
      })
    })
  })

  describe('POST /logout', () => {
    const LOGOUT_PATH = `${BASE_PATH}/logout`

    it('should clear authentication cookie', async () => {
      const response = await request(app).post(LOGOUT_PATH)

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        success: true,
        message: 'Logged out successfully'
      })
    })
  })

  describe('GET /authCheck', () => {
    const AUTH_CHECK_PATH = `${BASE_PATH}/authCheck`

    it('should return user data when authenticated', async () => {
      const user = await User.create(createMockUser())

      jest.spyOn(authUtils, 'authenticateUser').mockResolvedValue(user)

      const loginUser = await request(app).post(`/api/${API_VERSION}/auth/login`).send({
        email: 'test@example.com',
        password: 'password123'
      })

      jest.spyOn(authUtils, 'authenticateUser').mockResolvedValue(user)

      const response = await request(app)
        .get(AUTH_CHECK_PATH)
        .set('Authorization', `Bearer ${loginUser.body.token}`)
        .set('Cookie', `jwt-netflix=${loginUser.body.token}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        success: true,
        user: expect.objectContaining({
          email: user.email,
          username: user.username
        })
      })
    })

    it('should return error when unauthenticated', async () => {
      const response = await request(app).get(AUTH_CHECK_PATH)

      expect(response.status).toBe(401)
    })
  })
})
