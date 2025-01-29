import rateLimit from 'express-rate-limit'

/**
 * Middleware to limit repeated requests to public APIs and/or endpoints.
 *
 * @param {Object} options - The options for rate limiting.
 * @param {number} options.windowMs - The time window in milliseconds for which requests are counted.
 * @param {number} options.max - The maximum number of requests allowed per windowMs.
 * @param {boolean} options.standardHeaders - Whether to include standard rate limit headers in the response.
 * @param {boolean} options.legacyHeaders - Whether to include legacy rate limit headers in the response.
 * @returns {Function} - The rate limiting middleware function.
 */
const rateLimitMiddleware = rateLimit({
  windowMs: 100, // 100ms time window
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
})

export default rateLimitMiddleware
