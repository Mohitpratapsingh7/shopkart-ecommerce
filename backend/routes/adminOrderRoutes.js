const express = require("express");

const {
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
  updatePaymentStatus
} = require("../controllers/adminOrderController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

// Get all orders
router.get(
  "/",
  protect,
  adminOnly,
  getAllOrders
);

// Get single order
router.get(
  "/:id",
  protect,
  adminOnly,
  getAdminOrderById
);

// Update order status
router.put(
  "/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);

// Update payment status
router.put(
  "/:id/payment-status",
  protect,
  adminOnly,
  updatePaymentStatus
);

module.exports = router;