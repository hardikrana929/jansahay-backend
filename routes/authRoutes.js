const express = require('express');
const {
    registerUser,
    loginUser,
    forgotPassword,
    verifyResetOTP,
    resetPassword,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

// Password reset (OTP based)
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);

router.get('/me', authMiddleware, (req, res) => {
    res.json({
        success: true,
        user: req.user
    })
})

module.exports = router;