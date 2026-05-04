import rateLimit from "express-rate-limit";


export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.API_LIMITER_WINDOW_TIME), // 10 minutes
  max: parseInt(process.env.API_LIMITER_MSG), // Limit each IP to 150 requests per window
  message: { msg: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const strictLimiter = rateLimit({
  windowMs: parseInt(process.env.STRICT_LIMITER_WINDOW_TIME), // 30 min
  max: parseInt(process.env.STRICT_LIMITER_MSG), // Only 15 attempts per 30 min
  message: { msg: "Security limit reached. Please try again in an hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const testLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 3, // Only 3 requests allowed every 10 seconds
  message: { msg: "Test limit reached! Wait 10 seconds." },
});