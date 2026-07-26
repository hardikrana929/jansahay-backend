const Feedback = require("../models/Feedback");

// Submit Feedback (User)
const submitFeedback = async (req, res) => {
    try {
        const { rating, category, message } = req.body;

        if (!rating || !message) {
            return res.status(400).json({
                success: false,
                message: "Rating and message are required.",
            });
        }

        const feedback = await Feedback.create({
            user: req.user._id,
            rating,
            category,
            message,
        });

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully.",
            feedback,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// Get All Feedback (Admin) — optional ?rating=1-5 filter
const getAllFeedback = async (req, res) => {
    try {
        const { rating } = req.query;

        const filter = {};

        if (rating) {
            filter.rating = Number(rating);
        }

        const feedbacks = await Feedback.find(filter)
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: feedbacks.length,
            feedbacks,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// Get Feedback Stats (Admin)
const getFeedbackStats = async (req, res) => {
    try {
        const totalFeedback = await Feedback.countDocuments({});

        const avgResult = await Feedback.aggregate([
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                },
            },
        ]);

        const averageRating = avgResult[0]
            ? Number(avgResult[0].averageRating.toFixed(1))
            : 0;

        res.status(200).json({
            success: true,
            stats: {
                totalFeedback,
                averageRating,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// Delete Feedback (Admin)
const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;

        const feedback = await Feedback.findByIdAndDelete(id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Feedback deleted.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    submitFeedback,
    getAllFeedback,
    getFeedbackStats,
    deleteFeedback,
};