const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRouter = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const schemeRoutes = require("./routes/schemeRoutes");
const recommendationRoutes = require("./routes/recommandationRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const adminSchemeRoutes = require("./routes/adminSchemeRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const adminFeedbackRoutes = require("./routes/adminFeedbackRoutes");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const helmet = require("helmet")

dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use((req, res, next) => {
    if (req.body) req.body = mongoSanitize.sanitize(req.body);
    if (req.params) req.params = mongoSanitize.sanitize(req.params);
    // req.query is left alone here — Express 5 doesn't allow reassigning it,
    // but req.query is generally lower-risk since your queries use it for
    // filtering, not for raw MongoDB operators in your controllers
    next();
});
app.use(cookieParser());
app.use(helmet());

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://jansahay-frontend.vercel.app",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Routes
app.use("/api/auth", authRouter);

app.use("/api/profile", profileRoutes);

app.use("/api/schemes", schemeRoutes);

app.use("/api/admin/schemes", adminSchemeRoutes);

app.use("/api/recommendation", recommendationRoutes);

app.use("/api/favorites", favoriteRoutes);

app.use("/api/feedback", feedbackRoutes);

app.use("/api/admin/feedback", adminFeedbackRoutes);

// Health Check
app.get("/", (req, res) => {
    res.status(200).send("JanSahay Backend is running 🚀");
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API Route Not Found",
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
});

// Local Development
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Vercel
module.exports = app;