const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createScheme,
  getAllSchemesAdmin,
  getSchemeByIdAdmin,
  updateScheme,
  deactivateScheme,
} = require("../controllers/schemeController");

const { getDashboardStats } = require("../controllers/adminController");

router.get("/stats", authMiddleware, adminMiddleware, getDashboardStats);

router.get("/", authMiddleware, adminMiddleware, getAllSchemesAdmin);

router.get("/:id", authMiddleware, adminMiddleware, getSchemeByIdAdmin);

router.post("/", authMiddleware, adminMiddleware, createScheme);

router.put("/:id", authMiddleware, adminMiddleware, updateScheme);

router.patch("/:id/deactivate", authMiddleware, adminMiddleware, deactivateScheme);

module.exports = router;