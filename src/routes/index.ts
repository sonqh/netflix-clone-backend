import express from 'express'
import authRouter from './auth.route'
import movieRouter from './movie.route'
import tvRouter from './tv.route'
import searchRouter from './search.route'
import { protectRoute } from '~/middleware/protect-route.middleware'
import docRouter from './dev/doc.route'
import cacheRouter from './cache.route'

const router = express.Router()
const API_VERSION = process.env.API_VERSION ?? 'v1'

router.use(`/api/${API_VERSION}/auth`, authRouter)
router.use(`/api/${API_VERSION}/dev`, docRouter)
router.use(`/api/${API_VERSION}/movie`, protectRoute, movieRouter)
router.use(`/api/${API_VERSION}/tv`, protectRoute, tvRouter)
router.use(`/api/${API_VERSION}/search`, protectRoute, searchRouter)

// This route is only for checking the cache
router.use(`/api/${API_VERSION}`, protectRoute, cacheRouter)

// This route is only for health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' })
})

export default router
