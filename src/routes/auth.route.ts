import { Router } from 'express'
import { authCheck, login, logout, signup } from '~/controller/auth.controller'
import { protectRoute } from '~/middleware/protect-route'

const authRrouter = Router()

authRrouter.post('/signup', signup)
authRrouter.post('/login', login)
authRrouter.post('/logout', logout)

authRrouter.get('/authCheck', protectRoute, authCheck)

export default authRrouter
