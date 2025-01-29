import express from 'express'
import cors from 'cors'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import dotenvConfig from './dotenv.config'

dotenvConfig.config()

export const configureExpress = (app: express.Application) => {
  console.log('process.env.FRONTEND_ORIGIN', process.env.FRONTEND_ORIGIN)
  app.use(
    cors({
      origin: process.env.FRONTEND_ORIGIN,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    })
  )

  app.use(compression())
  app.use(cookieParser())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
}
