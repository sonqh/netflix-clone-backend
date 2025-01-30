import { Router } from 'express'
import { authCheck, login, logout, signup } from '~/controllers/auth.controller'
import { protectRoute } from '~/middleware/protect-route.middleware'

const authRouter = Router()

authRouter.post('/signup', signup)
authRouter.post('/login', login)
authRouter.post('/logout', logout)

authRouter.get('/authCheck', protectRoute, authCheck)

export default authRouter
