const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require("../middleware/adminMiddleware");
const { createProfile, getProfile, updateProfile, deleteProfile } = require('../controllers/profileController')
const router = express.Router();

router.post('/', authMiddleware, createProfile);

router.get('/', authMiddleware, getProfile);

router.put('/', authMiddleware, updateProfile)

router.delete('/', authMiddleware, adminMiddleware, deleteProfile);

module.exports = router;