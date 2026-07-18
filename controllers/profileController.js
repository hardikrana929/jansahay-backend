const UserProfile = require('../models/UserProfiles');

//Create Profile
const createProfile = async (req, res) => {
    try {
        //Get user 
        const userId = req.user._id;
        //Validate user
        const userExists = await UserProfile.findOne({ user: userId });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "Profile already exists.",
            })
        }
        //Get data from request body
        const {
            age,
            gender,
            state,
            district,
            occupation,
            education,
            familyIncome,
            category,
            disability,
            farmer,
            landOwnership,
            businessOwner,
            maritalStatus,
        } = req.body;
        //Validation check
        if (!age || !gender || !state || !district || !occupation || !familyIncome || !category) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }
        //Add collection
        const profile = await UserProfile.create({
            user: userId,
            age,
            gender,
            state,
            district,
            occupation,
            education,
            familyIncome,
            category,
            disability,
            farmer,
            landOwnership,
            businessOwner,
            maritalStatus,
        })
        res.status(201).json({
            success: true,
            message: "Profile created successfully.",
            profile
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
}

//Get Profile 
const getProfile = async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ user: req.user._id }).populate("user", "name email role");
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile is not Found;"
            })
        }
        return res.status(200).json({
            success: true,
            profile,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

//Update Profile
const updateProfile = async (req, res) => {
    try {
        const profile = await UserProfile.findOne({
            user: req.user._id
        })

        if (!profile) {

            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });

        }

        const updatedProfile = await UserProfile.findOneAndUpdate(
            { user: req.user._id },
            req.body,
            { new: true, runValidators: true });
        res.status(200).json({
            success: true,
            message: "Profile Updated Successful.",
            profile: updatedProfile,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
}

//Delete Profile
const deleteProfile = async (req, res) => {
    try {
        const profile = await UserProfile.findOneAndDelete({
            user: req.user._id
        });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile delete Successfully."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
}

module.exports = { createProfile, getProfile, updateProfile, deleteProfile }