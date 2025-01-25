import express from 'express'
import authRouter from './auth.route'
import movieRouter from './movie.route'
import tvRouter from './tv.route'
import searchRouter from './search.route'
import { protectRoute } from '~/middleware/protect-route'

const router = express.Router()

router.use('/api/v1/auth', authRouter)
router.use('/api/v1/movie', protectRoute, movieRouter)
router.use('/api/v1/tv', protectRoute, tvRouter)
router.use('/api/v1/search', protectRoute, searchRouter)

export default router
