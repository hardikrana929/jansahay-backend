const Scheme = require("../models/Scheme");
const UserProfile = require("../models/UserProfiles");

const getRecommendation = async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ user: req.user._id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Please complete your profile first.",
            });
        }

        const {
            page = 1,
            limit = 9,
            search = "",
            schemeType,
            government,
            sort = "latest",
        } = req.query;

        const schemes = await Scheme.find({ isActive: true });

        let recommendations = [];

        for (const scheme of schemes) {
            let eligible = true;

            if (profile.age < scheme.minAge || profile.age > scheme.maxAge)
                eligible = false;

            if (profile.familyIncome > scheme.incomeLimit)
                eligible = false;

            if (scheme.state !== "All" && scheme.state !== profile.state)
                eligible = false;

            if (
                scheme.eligibleOccupations.length &&
                !scheme.eligibleOccupations.includes(profile.occupation)
            )
                eligible = false;

            if (
                scheme.eligibleCategories.length &&
                !scheme.eligibleCategories.includes(profile.category)
            )
                eligible = false;

            if (scheme.disabilityRequired && !profile.disability)
                eligible = false;

            if (eligible) recommendations.push(scheme);
        }

        // Search
        if (search) {
            recommendations = recommendations.filter(
                (scheme) =>
                    scheme.title.toLowerCase().includes(search.toLowerCase()) ||
                    scheme.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Scheme Type
        if (schemeType) {
            recommendations = recommendations.filter(
                (scheme) => scheme.schemeType === schemeType
            );
        }

        // Government
        if (government) {
            recommendations = recommendations.filter(
                (scheme) => scheme.government === government
            );
        }

        // Sort
        recommendations.sort((a, b) => {
            return sort === "oldest"
                ? new Date(a.createdAt) - new Date(b.createdAt)
                : new Date(b.createdAt) - new Date(a.createdAt);
        });

        const total = recommendations.length;

        const start = (page - 1) * limit;
        const end = start + Number(limit);

        recommendations = recommendations.slice(start, end);

        res.status(200).json({
            success: true,
            recommendation: recommendations,
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = { getRecommendation };