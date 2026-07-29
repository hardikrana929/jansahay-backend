const rateLimit = require("express-rate-limit");

// Strict limiter for login: 5 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many login attempts. Please try again in 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Slightly looser limiter for OTP request/verify endpoints
const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Too many attempts. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { loginLimiter, otpLimiter };