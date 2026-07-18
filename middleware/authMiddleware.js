const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded:", decoded);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error(error);

        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = authMiddleware;