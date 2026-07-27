const express = require("express");
const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")
const router = express.Router();


router.post("/create-admin", authMiddleware, adminMiddleware, createAdminUser);


module.exports = router