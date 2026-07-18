const Scheme = require('../models/Scheme');
const UserProfile = require('../models/UserProfiles');

//Get Recommendation
const getRecommendation = async (req, res) => {
    try {
        //Find user profile 
        const profile = await UserProfile.findOne({ user: req.user._id });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Please Complete your Profile first."
            });
        }

        //Get Active Scheme
        const schemes = await Scheme.find({ isActive: true });

        const recommendation = [];

        for (const scheme of schemes) {
            let eligible = true;
            //Check Age 
            if (profile.age < scheme.minAge || profile.age > scheme.maxAge) {
                eligible = false;
            }

            //Check Income
            if (profile.familyIncome > scheme.incomeLimit) {
                eligible = false;
            }

            //Check State 
            if (scheme.state !== "All" && scheme.state !== profile.state) {
                eligible = false;
            }

            //Check Occupation 
            if (scheme.eligibleOccupations.length && !scheme.eligibleOccupations.includes(profile.occupation)) {
                eligible = false;
            }

            //Check Category
            if (scheme.eligibleCategories.length && !scheme.eligibleCategories.includes(profile.category)) {
                eligible = false;
            }

            //Check disability
            if (scheme.disabilityRequired && !profile.disability) {
                eligible = false;
            }

            if (eligible) {
                recommendation.push(scheme);
            }
        }
        res.status(200).json({
            success: true,
            total: recommendation.length,
            recommendation
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

module.exports = { getRecommendation };