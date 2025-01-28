import rateLimit from 'express-rate-limit'

const rateLimitMiddleware = rateLimit({
  windowMs: 100, // 100ms time window
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
})

export default rateLimitMiddleware
