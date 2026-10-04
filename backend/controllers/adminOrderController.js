const mongoose = require("mongoose");
const Order = require("../models/Order");

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name brand")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch all orders",
      error: error.message
    });
  }
};

// Get single order
const getAdminOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid order ID"
      });
    }

    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("items.product", "name brand");

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.status(200).json({
      order
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order",
      error: error.message
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "Placed",
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled"
    ];

    if (!orderStatus) {
      return res.status(400).json({
        message: "Order status is required"
      });
    }

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        message: "Invalid order status"
      });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid order ID"
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    order.orderStatus = orderStatus;

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.product", "name brand");

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message
    });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const allowedStatuses = [
      "Pending",
      "Paid",
      "Failed"
    ];

    if (!paymentStatus) {
      return res.status(400).json({
        message: "Payment status is required"
      });
    }

    if (!allowedStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        message: "Invalid payment status"
      });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid order ID"
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    order.paymentStatus = paymentStatus;

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.product", "name brand");

    res.status(200).json({
      message: "Payment status updated successfully",
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update payment status",
      error: error.message
    });
  }
};

module.exports = {
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
  updatePaymentStatus
};