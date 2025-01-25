import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import logger from './logger'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

// New route added for testing
app.get('/test', (req: Request, res: Response) => {
  res.send('This is a test route')
})

console.log('This is a test log message')

app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`)
})
