const express = require('express');
const {
    registerUser,
    loginUser,
    forgotPassword,
    verifyResetOTP,
    resetPassword,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware')
const { loginLimiter, otpLimiter } = require('../middleware/rateLimiter')

const router = express.Router();

router.post('/register', otpLimiter, registerUser);

router.post('/login', loginLimiter, loginUser);

// Password reset (OTP based)
router.post('/forgot-password', otpLimiter, forgotPassword);
router.post('/verify-reset-otp', otpLimiter, verifyResetOTP);
router.post('/reset-password', otpLimiter, resetPassword);

router.get('/me', authMiddleware, (req, res) => {
    res.json({ success: true, user: req.user })   
})

module.exports = router;