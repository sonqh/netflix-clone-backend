import express from 'express'
import authRouter from './auth.route'
import movieRouter from './movie.route'
import tvRouter from './tv.route'
import searchRouter from './search.route'
import { protectRoute } from '~/middleware/protect-route'
import docRouter from './dev/doc.route'

const router = express.Router()
const API_VERSION = process.env.API_VERSION ?? 'v1'

router.use(`/api/${API_VERSION}/auth`, authRouter)
router.use(`/api/${API_VERSION}/dev`, docRouter)
router.use(`/api/${API_VERSION}/movie`, protectRoute, movieRouter)
router.use(`/api/${API_VERSION}/tv`, protectRoute, tvRouter)
router.use(`/api/${API_VERSION}/search`, protectRoute, searchRouter)

export default router
