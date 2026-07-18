const mongoose = require('mongoose')

const favoriteScheme = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    scheme: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Scheme",
        required: true,
    }
},
    {
        timestamps: true
    }
);

favoriteScheme.index(
    {
        user: 1,
        scheme: 1,
    },
    {
        unique: true,
    }
);

module.exports = mongoose.model("Favorite", favoriteScheme);