const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" });
}

// Short-lived token issued only after OTP verification.
// It proves the user owns the email and is allowed to set a new
// password — separate from the normal login token.
const generateResetToken = (id) => {
    return jwt.sign(
        { id, purpose: "reset-password" },
        process.env.JWT_SECRET,
        { expiresIn: "10m" });
}

module.exports = generateToken;
module.exports.generateResetToken = generateResetToken;