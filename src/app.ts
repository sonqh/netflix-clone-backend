import express from 'express'
import { configureExpress } from './config/express.config'
import { redisClient } from './config/redis.config'
import router from './routes'
import logResponseTime from './middleware/log-response-time.middleware'
import rateLimitMiddleware from './middleware/rate-limit.middleware'
import { errorHandler } from './middleware/error-handler.middleware'
const app = express()

// Configure Express middleware
configureExpress(app)

// Custom middlewares
app.use(logResponseTime)
app.use(rateLimitMiddleware)

// Routes
app.use(router)

// Error handling
app.use(errorHandler)

// Redis connection handling
redisClient.on('connect', () => console.log('Connected to Redis'))
redisClient.on('error', (err) => console.error('Redis Client Error', err))

export default app
