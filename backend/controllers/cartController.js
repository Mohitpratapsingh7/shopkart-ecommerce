const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: []
      });
    }

    res.status(200).json({
      cart
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get cart",
      error: error.message
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required"
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1"
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: "Not enough stock available"
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [
          {
            product: productId,
            quantity
          }
        ]
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        if (newQuantity > product.stock) {
          return res.status(400).json({
            message: "Requested quantity exceeds available stock"
          });
        }

        existingItem.quantity = newQuantity;
      } else {
        cart.items.push({
          product: productId,
          quantity
        });
      }

      await cart.save();
    }

    await cart.populate("items.product");

    res.status(200).json({
      message: "Product added to cart",
      cart
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add product to cart",
      error: error.message
    });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        message: "Product ID and quantity are required"
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1"
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        message: "Requested quantity exceeds available stock"
      });
    }

    const cart = await Cart.findOne({
      user: req.user.id
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      });
    }

    const cartItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        message: "Product not found in cart"
      });
    }

    cartItem.quantity = quantity;

    await cart.save();
    await cart.populate("items.product");

    res.status(200).json({
      message: "Cart quantity updated",
      cart
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update cart quantity",
      error: error.message
    });
  }
};

// Remove product from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required"
      });
    }

    const cart = await Cart.findOne({
      user: req.user.id
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      });
    }

    const itemExists = cart.items.some(
      (item) => item.product.toString() === productId
    );

    if (!itemExists) {
      return res.status(404).json({
        message: "Product not found in cart"
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.product");

    res.status(200).json({
      message: "Product removed from cart",
      cart
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove product from cart",
      error: error.message
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
};