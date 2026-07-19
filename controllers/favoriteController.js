const Favorite = require('../models/Favorite');
const Scheme = require('../models/Scheme');


//Add Favorite 
const addFavorite = async (req, res) => {
    try {
        const { schemeId } = req.body;
        const scheme = await Scheme.findById(schemeId);
        if (!scheme || !scheme.isActive) {

            return res.status(404).json({
                success: false,
                message: "Scheme not found."
            });
        }
        const favoriteExists = await Favorite.findOne({
            user: req.user._id,
            scheme: schemeId
        })
        if (favoriteExists) {
            return res.status(400).json({
                success: false,
                message: "Already saved."
            })
        }
        const favorite = await Favorite.create({
            user: req.user._id,
            scheme: schemeId,
        });
        res.status(200).json({
            success: true,
            message: "Scheme saved.",
            favorite
        });

    } catch (error) {
        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });
    }

}

// Get Favorite
const getFavorite = async (req, res) => {
    try {

        const favorites = await Favorite.find({
            user: req.user._id
        }).populate("scheme");

        // Remove invalid favorite records
        const validFavorites = favorites.filter(
            (item) => item.scheme !== null
        );

        res.status(200).json({
            success: true,
            total: validFavorites.length,
            favorite: validFavorites
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

//Delete Favorite
const removeFavorite = async (req, res) => {
    try {
        const { schemeId } = req.params;
        const favorite = await Favorite.findOneAndDelete({
            user: req.user._id,
            scheme: schemeId
        });

        if (!favorite) {
            return res.status(404).json({
                success: false,
                message: "Favorite not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Favorite removed."
        });
        if (!result.deletedCount) {
            return res.status(404).json({ success: false, message: "Favorite not Found." });
        }
        res.status(200).json({ success: true, message: "Favorite removed." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

module.exports = { addFavorite, getFavorite, removeFavorite };