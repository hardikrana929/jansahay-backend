const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: 1,
            max: 5,
        },

        category: {
            type: String,
            enum: ["suggestion", "bug", "compliment", "other"],
            default: "other",
        },

        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Feedback", feedbackSchema);