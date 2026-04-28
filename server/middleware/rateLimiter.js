import rateLimit from "express-rate-limit";

// General limit for all API requests
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { msg: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limit for sensitive actions (Login, Emails)
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15, // Only 15 attempts per hour
  message: { msg: "Security limit reached. Please try again in an hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const testLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 3, // Only 3 requests allowed every 10 seconds
  message: { msg: "Test limit reached! Wait 10 seconds." },
});