import { Request, Response, NextFunction } from 'express'
import { redisClient } from '../config/redis.config'

/**
 * Middleware to check for cached data in Redis.
 *
 * @param {string} key - The key to check in the Redis cache.
 * @returns {Function} - The middleware function to check the cache.
 */
export const checkCache = (key: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cachedData = await redisClient.get(key)
      if (cachedData) {
        res.status(200).json(JSON.parse(cachedData))
        return
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}
