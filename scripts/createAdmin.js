// backend/scripts/createAdmin.js
// One-time script to create the first admin user directly in the database.
// Run locally with: node scripts/createAdmin.js
// Never expose this as an HTTP route.

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const ADMIN_NAME = "Yadav krishana";
const ADMIN_EMAIL = "krishana@gmail.com";
const ADMIN_PASSWORD = "krishana1234"; // change before running, then change again after first login

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const existing = await User.findOne({ email: ADMIN_EMAIL });
        if (existing) {
            console.log("A user with this email already exists:", existing.email, "| role:", existing.role);
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

        const admin = await User.create({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: "admin",
        });

        console.log("Admin created successfully:");
        console.log("  email:", admin.email);
        console.log("  role:", admin.role);
        console.log("\nLog in with this email/password, then IMMEDIATELY change the password from the app.");
    } catch (error) {
        console.error("Failed to create admin:", error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

run();