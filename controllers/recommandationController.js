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

            // Age check
            if (profile.age < scheme.minAge || profile.age > scheme.maxAge)
                eligible = false;

            // Income check — incomeLimit of 0 (or falsy) means "no cap"
            if (scheme.incomeLimit > 0 && profile.familyIncome > scheme.incomeLimit)
                eligible = false;

            // State check — accept "All" / "All India" as universal, case-insensitive
            const stateIsUniversal =
                !scheme.state ||
                scheme.state.toLowerCase() === "all" ||
                scheme.state.toLowerCase() === "all india";

            if (
                !stateIsUniversal &&
                scheme.state.toLowerCase() !== (profile.state || "").toLowerCase()
            )
                eligible = false;

            // Occupation check — case-insensitive match
            if (
                scheme.eligibleOccupations.length &&
                !scheme.eligibleOccupations.some(
                    (o) => o.toLowerCase() === (profile.occupation || "").toLowerCase()
                )
            )
                eligible = false;

            // Category check — case-insensitive match
            if (
                scheme.eligibleCategories.length &&
                !scheme.eligibleCategories.some(
                    (c) => c.toLowerCase() === (profile.category || "").toLowerCase()
                )
            )
                eligible = false;

            // Disability check
            if (scheme.disabilityRequired && !profile.disability)
                eligible = false;

            if (eligible) recommendations.push(scheme);
        }

        // Search
        if (search) {
            const searchLower = search.toLowerCase();
            recommendations = recommendations.filter(
                (scheme) =>
                    scheme.title.toLowerCase().includes(searchLower) ||
                    scheme.description.toLowerCase().includes(searchLower)
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

        const start = (page - 1) * Number(limit);
        const end = start + Number(limit);

        recommendations = recommendations.slice(start, end);

        res.status(200).json({
            success: true,
            recommendation: recommendations,
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
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