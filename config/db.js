const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing");
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = connectDB;