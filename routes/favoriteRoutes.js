const express = require("express");

const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {addFavorite, getFavorite, removeFavorite} = require('../controllers/favoriteController');

router.post('/',authMiddleware,addFavorite);

router.get('/',authMiddleware, getFavorite);

router.delete('/:schemeId',authMiddleware,removeFavorite);


module.exports = router;