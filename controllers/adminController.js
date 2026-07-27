const User = require("../models/User");
const Scheme = require("../models/Scheme");
const UserProfile = require("../models/UserProfiles");

// Get Admin Dashboard Stats
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: "user" });
        const totalSchemes = await Scheme.countDocuments({});
        const activeSchemes = await Scheme.countDocuments({ isActive: true });
        const totalProfilesCompleted = await UserProfile.countDocuments({});

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalSchemes,
                activeSchemes,
                inactiveSchemes: totalSchemes - activeSchemes,
                totalProfilesCompleted,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
// create admin
const createAdminUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(12));
        const admin = await User.create({ name, email, password: hashedPassword, role: "admin" });
        res.status(201).json({ success: true, message: "Admin created", admin: { id: admin._id, email } });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = { getDashboardStats, createAdminUser };