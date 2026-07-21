const crypto = require("crypto");

// Generates a random 6 digit numeric OTP, e.g. "482913"
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Hashes the OTP before storing it in the database.
// We never store the raw OTP — only its SHA-256 hash — the same
// way a password would never be stored in plain text.
const hashOTP = (otp) => {
    return crypto.createHash("sha256").update(otp).digest("hex");
}; 

module.exports = { generateOTP, hashOTP };
