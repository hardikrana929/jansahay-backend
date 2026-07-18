const express = require('express');
const { createScheme, getAllSchemes, getSchemeById, updateScheme, deactivateScheme } = require('../controllers/schemeController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();


router.post('/', authMiddleware, adminMiddleware, createScheme);

router.get('/', authMiddleware, adminMiddleware, getAllSchemes);

router.get('/:id', authMiddleware, adminMiddleware, getSchemeById);

router.put('/:id', authMiddleware, adminMiddleware, updateScheme);

router.patch('/:id/deactivate', authMiddleware, adminMiddleware, deactivateScheme);


module.exports = router;

