const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { submitFeedback } = require("../controllers/feedbackController");

router.post("/", authMiddleware, submitFeedback);

module.exports = router;