const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        age: {
            type: Number,
            required: [true, 'Age is required'],
            min: 1,
            max: 130
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: [true, "Gender is required"],
        },
        state: {
            type: String,
            required: [true, 'State is required'],
            trim: true,
        },
        district: {
            type: String,
            required: [true, 'District is required'],
            trim: true,
        },
        occupation: {
            type: String,
            enum: [
                "Student",
                "Farmer",
                "Employee",
                "Business",
                "Unemployed",
                "Other",
            ],
            required: [true, 'Occupation is required'],
        },
        education: {
            type: String,
            default: ''
        },
        familyIncome: {
            type: Number,
            min: 0,
            required: [true, 'FamilyIncom is required'],
        },
        category: {
            type: String,
            enum: ["General", "OBC", "SC", "ST", "EWS"],
            required: [true, "Category is required"],
        },
        disability: {
            type: Boolean,
            default: false,
        },

        farmer: {
            type: Boolean,
            default: false,
        },

        landOwnership: {
            type: Boolean,
            default: false,
        },

        businessOwner: {
            type: Boolean,
            default: false,
        },
        maritalStatus: {
            type: String,
            enum: ["Single", "Married", "Widowed", "Divored"],
            default: 'Single',

        }
    },
    {
        timestapms: true,
    }
);

module.exports = mongoose.model('UserProfile', userProfileSchema);