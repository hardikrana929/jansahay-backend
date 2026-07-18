const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is requied"],
            trim: true,
        },

        description: {
            type: String,
            required: [true, "Description is requied"],
        },

        schemeType: {
            type: String,
            enum: [
                "Education",
                "Agriculture",
                "Employment",
                "Women",
                "Health",
                "Business",
                "Housing",
                "Pension",
                "Other",
            ],
            required: [true, "schemeType is requied"],
        },

        government: {
            type: String,
            enum: ["Central", "State"],
            required: [true, "Government is requied"],
        },

        state: {
            type: String,
            default: "All",
        },

        eligibleOccupations: [
            {
                type: String,
            },
        ],

        eligibleCategories: [
            {
                type: String,
            },
        ],

        incomeLimit: {
            type: Number,
            default: 0,
        },

        minAge: {
            type: Number,
            default: 0,
        },

        maxAge: {
            type: Number,
            default: 130,
        },

        disabilityRequired: {
            type: Boolean,
            default: false,
        },

        documentsRequired: [
            {
                type: String,
            },
        ],

        benefits: {
            type: String,
            required: [true, "Benefits is requied"],
        },

        officialLink: {
            type: String,
            required: [true, "OfficialLink is requied"],
        },

        applicationDeadline: {
            type: Date,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }

)

module.exports = mongoose.model("Scheme", schemeSchema);