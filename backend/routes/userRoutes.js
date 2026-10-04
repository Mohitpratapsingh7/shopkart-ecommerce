const express = require("express");

const {
  getProfile,
  updateAddress
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", protect, getProfile);

router.put("/address", protect, updateAddress);

module.exports = router;