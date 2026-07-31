const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateToken = require('../utils/generateToken');
const { generateResetToken } = require('../utils/generateToken');
const { generateOTP, hashOTP } = require('../utils/generateOTP');
const { sendOTPEmail } = require('../utils/sendEmail');

//Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Valid all fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All Fields are required",
            });
        }
        //Check existe user
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        //Password hash
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Add user in Database
        await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user",
        });

        res.status(201).json({
            success: true,
            message: "User Register Successfully",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

//Login User 
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials",
            });
        }

        const token = generateToken(user._id);
        const isProd = process.env.NODE_ENV === "production";
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProd,                 
            sameSite: isProd ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            success: true,
            message: "Login Successful.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


// Step 1: Request OTP for password reset
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email",
            });
        }

        // Generate a 6 digit OTP, store only its hash + expiry
        const otp = generateOTP();

        user.resetPasswordOTP = hashOTP(otp);
        user.resetPasswordOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        user.resetPasswordVerified = false;

        await user.save();

        try {
            await sendOTPEmail(user.email, otp, user.name);
        } catch (emailError) {
            // Roll back the OTP if the email couldn't be sent
            user.resetPasswordOTP = undefined;
            user.resetPasswordOTPExpiry = undefined;
            await user.save();

            console.error("Email Error:", emailError);

            return res.status(500).json({
                success: false,
                message: "Unable to send OTP email. Please try again.",
            });
        }

        res.status(200).json({
            success: true,
            message: "OTP sent to your email address",
        });
    } catch (error) {
        console.error("Forgot Password Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// Step 2: Verify the OTP the user received by email
const verifyResetOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            });
        }

        const user = await User.findOne({ email }).select(
            "+resetPasswordOTP +resetPasswordOTPExpiry"
        );

        if (!user || !user.resetPasswordOTP) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
            });
        }

        if (user.resetPasswordOTPExpiry < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one.",
            });
        }

        if (user.resetPasswordOTP !== hashOTP(otp)) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // OTP is correct — consume it immediately so it can't be reused,
        // and mark the account as verified for the reset step.
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpiry = undefined;
        user.resetPasswordVerified = true;

        await user.save();

        // Short-lived token that authorizes the final reset-password call
        const resetToken = generateResetToken(user._id);

        res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            resetToken,
        });
    } catch (error) {
        console.error("Verify OTP Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// Step 3: Set the new password using the resetToken from step 2
const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        if (!resetToken || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Reset token and new password are required",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long",
            });
        }

        let decoded;

        try {
            decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "Reset link has expired. Please request a new OTP.",
            });
        }

        if (decoded.purpose !== "reset-password") {
            return res.status(400).json({
                success: false,
                message: "Invalid reset token",
            });
        }

        const user = await User.findById(decoded.id).select(
            "+resetPasswordVerified"
        );

        if (!user || !user.resetPasswordVerified) {
            return res.status(400).json({
                success: false,
                message: "OTP verification required before resetting password",
            });
        }

        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordVerified = false;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully. Please login with your new password.",
        });
    } catch (error) {
        console.error("Reset Password Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    verifyResetOTP,
    resetPassword,
}