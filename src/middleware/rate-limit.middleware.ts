import rateLimit from 'express-rate-limit'

const rateLimitMiddleware = rateLimit({
  windowMs: 100, // 100ms time window
  max: 100, // Limit each client to 1 request per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
})

export default rateLimitMiddleware
