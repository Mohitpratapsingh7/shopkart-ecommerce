const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message
    });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Role must be user or admin"
      });
    }

    // Prevent admin from changing their own role
    if (req.user.id.toString() === id.toString()) {
      return res.status(400).json({
        message: "You cannot change your own role"
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.role = role;

    await user.save();

    res.status(200).json({
      message: "User role updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user role",
      error: error.message
    });
  }
};

// Admin dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const salesResult = await Order.aggregate([
      {
        $match: {
          orderStatus: {
            $ne: "Cancelled"
          }
        }
      },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: "$totalAmount"
          }
        }
      }
    ]);

    const totalSales =
      salesResult.length > 0
        ? salesResult[0].totalSales
        : 0;

    res.status(200).json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalSales
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  getDashboardStats
};