const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Create Order
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = "COD" } = req.body;

    if (
      !shippingAddress ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        message: "Complete shipping address is required"
      });
    }

    const cart = await Cart.findOne({
      user: req.user.id
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty"
      });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        return res.status(400).json({
          message: "Product not found"
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`
        });
      }

      const discountedPrice =
        product.price -
        (product.price * product.discount) / 100;

      const finalPrice = Math.round(discountedPrice);

      orderItems.push({
        product: product._id,
        name: product.name,
        price: finalPrice,
        quantity: item.quantity
      });

      totalAmount += finalPrice * item.quantity;

      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      totalAmount,
      paymentMethod
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to place order",
      error: error.message
    });
  }
};

// Get My Orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};

// Get Single Order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate("items.product");

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

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById
};