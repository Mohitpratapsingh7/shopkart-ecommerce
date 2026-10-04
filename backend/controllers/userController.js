const User = require("../models/User");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      user
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get profile",
      error: error.message
    });
  }
};

// Update user address
const updateAddress = async (req, res) => {
  try {
    const {
      street,
      city,
      state,
      pincode
    } = req.body;

    if (!street || !city || !state || !pincode) {
      return res.status(400).json({
        message: "All address fields are required"
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.address = {
      street,
      city,
      state,
      pincode
    };

    await user.save();

    res.status(200).json({
      message: "Address updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update address",
      error: error.message
    });
  }
};

module.exports = {
  getProfile,
  updateAddress
};