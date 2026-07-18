const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getRecommendation } = require('../controllers/recommandationController');
const router = express.Router();

router.get('/', authMiddleware, getRecommendation);


module.exports = router;