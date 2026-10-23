import rateLimit from 'express-rate-limit';

/**
 * Standard API rate limiter
 * Allows 60 requests per 15-minute window per IP
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please wait a few minutes before trying again.',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

/**
 * Chat/symptom submission rate limiter
 * Allows 25 submissions per 5-minute window to avoid spam while keeping demo friendly
 */
export const submissionLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Submission rate limit reached. Please wait a moment before sending another message.',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

export default {
  apiRateLimiter,
  submissionLimiter
};
