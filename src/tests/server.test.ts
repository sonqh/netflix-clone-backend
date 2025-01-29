import dotenv from 'dotenv'
import request from 'supertest'
import http from 'http'
import app from '~/app'
import SafeMongooseConnection from '~/lib/safe-mongoose-connection'
import logger from '~/logger'
import { redisClient } from '~/config/redis.config'

dotenv.config()

jest.mock('~/lib/safe-mongoose-connection', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    close: jest.fn()
  }))
}))

jest.mock('~/config/redis.config', () => ({
  __esModule: true,
  redisClient: {
    on: jest.fn(),
    quit: jest.fn().mockResolvedValue(undefined)
  }
}))

jest.mock('~/logger')

const port = process.env.PORT || 3000
let server: http.Server

const MockSafeMongooseConnection = SafeMongooseConnection as jest.MockedClass<typeof SafeMongooseConnection>

beforeEach(() => {
  MockSafeMongooseConnection.mockClear()
})

afterAll(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve))
  }

  if (redisClient) {
    await redisClient.quit()
  }

  jest.clearAllMocks()
})

describe('GET /', () => {
  it('should return 200 OK', async () => {
    const response = await request(app).get('/health')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ status: 'UP' })
  })
})

describe('Server', () => {
  it('should be running', (done) => {
    server = app.listen(port, () => {
      expect(server.listening).toBe(true)
      done()
    })
  })

  it('should connect to MongoDB', () => {
    const mongoUrl = process.env.MONGO_URL ?? ''
    const mockConnect = jest.fn((callback: (url: string) => void) => callback(mongoUrl))

    ;(SafeMongooseConnection as jest.Mock).mockImplementation(() => ({
      connect: mockConnect,
      close: jest.fn()
    }))

    const safeMongooseConnection = new SafeMongooseConnection({
      mongoUrl,
      onStartConnection: (url) => logger.info(`Connecting to MongoDB at ${url}`),
      onConnectionError: (error, url) =>
        logger.log({
          level: 'error',
          message: `Could not connect to MongoDB at ${url}`,
          error
        }),
      onConnectionRetry: (url) => logger.info(`Retrying to MongoDB at ${url}`)
    })

    safeMongooseConnection.connect((url) => {
      expect(url).toBe(mongoUrl)
      expect(mockConnect).toHaveBeenCalledTimes(1)
    })
  })

  it('should handle MongoDB connection error', () => {
    const invalidMongoUrl = 'mongodb://invalid-url'
    const mockConnect = jest.fn().mockImplementation(() => {
      throw new Error('Connection error')
    })

    ;(SafeMongooseConnection as jest.Mock).mockImplementation(() => ({
      connect: mockConnect,
      close: jest.fn()
    }))

    const safeMongooseConnection = new SafeMongooseConnection({
      mongoUrl: invalidMongoUrl,
      onStartConnection: (url) => logger.info(`Connecting to MongoDB at ${url}`),
      onConnectionError: (error, url) => {
        expect(url).toBe(invalidMongoUrl)
        expect(error).toBeInstanceOf(Error)
      },
      onConnectionRetry: (url) => logger.info(`Retrying to MongoDB at ${url}`)
    })

    expect(() => safeMongooseConnection.connect(jest.fn())).toThrow('Connection error')
  })
})
