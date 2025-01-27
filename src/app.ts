import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import express from 'express'
import dotenvConfig from './config/dotenv.config'
import { errorHandler } from './middleware/error-handler'
import logResponseTime from './middleware/log-response-time'
import router from './routes'
import rateLimitMiddleware from './middleware/rate-limit.middleware'

const app = express()

dotenvConfig.config()

// Enable CORS
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
)

app.use(logResponseTime)
app.use(cookieParser())
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(rateLimitMiddleware)
app.use(router)

// Error-handling middleware
app.use(errorHandler)

export default app
