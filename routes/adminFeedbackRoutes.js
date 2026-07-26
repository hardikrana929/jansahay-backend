const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    getAllFeedback,
    getFeedbackStats,
    deleteFeedback,
} = require("../controllers/feedbackController");

router.get("/stats", authMiddleware, adminMiddleware, getFeedbackStats);

router.get("/", authMiddleware, adminMiddleware, getAllFeedback);

router.delete("/:id", authMiddleware, adminMiddleware, deleteFeedback);

module.exports = router;