const express = require("express");

const {
  getAllUsers,
  updateUserRole,
  getDashboardStats
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

// Admin dashboard statistics
router.get(
  "/dashboard",
  protect,
  adminOnly,
  getDashboardStats
);

// Get all users
router.get(
  "/users",
  protect,
  adminOnly,
  getAllUsers
);

// Update user role
router.put(
  "/users/:id/role",
  protect,
  adminOnly,
  updateUserRole
);

module.exports = router;