import request from 'supertest'
import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

describe('GET /', () => {
  it('should return 200 OK', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(200)
    expect(response.text).toBe('Express + TypeScript Server')
  })
})

describe('Server', () => {
  it('should be running', async () => {
    const server = app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`)
    })
    server.close()
  })
})
