const express = require('express');
const { createScheme, getAllSchemes, getSchemeById, updateScheme, deactivateScheme } = require('../controllers/schemeController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();

router.get('/', authMiddleware, getAllSchemes);

router.get('/:id', authMiddleware, getSchemeById);


module.exports = router;

