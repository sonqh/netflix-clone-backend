import { Router } from 'express'
import { redisClient } from '../config/redis.config'
import { checkCache } from '../middleware/cache.middleware'

const cacheRouter = Router()

cacheRouter.get('/cache', checkCache('cachedData'), async (req, res, next) => {
  try {
    const dataToCache = { message: 'Data to be cached' }
    await redisClient.set('cachedData', JSON.stringify(dataToCache), 'EX', 3600)
    res.json(dataToCache)
  } catch (error) {
    next(error)
  }
})

export default cacheRouter
