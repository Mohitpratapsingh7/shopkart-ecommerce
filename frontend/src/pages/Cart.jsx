import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, {
  updateCartItem,
  removeFromCart
} from "../services/api";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingProduct, setUpdatingProduct] =
    useState("");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token =
          localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          setLoading(false);
          return;
        }

        const response = await api.get("/cart", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setCart(response.data.cart);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Cart load nahi ho pa raha."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleQuantityChange = async (
    productId,
    newQuantity
  ) => {
    if (newQuantity < 1) return;

    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      setUpdatingProduct(productId);
      setError("");

      const response =
        await updateCartItem(
          productId,
          newQuantity,
          token
        );

      setCart(response.cart);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Quantity update nahi ho payi."
      );
    } finally {
      setUpdatingProduct("");
    }
  };

  const handleRemove = async (
    productId
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      setUpdatingProduct(productId);
      setError("");

      const response =
        await removeFromCart(
          productId,
          token
        );

      setCart(response.cart);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Product remove nahi ho paya."
      );
    } finally {
      setUpdatingProduct("");
    }
  };

  const calculateSubtotal = () => {
    if (!cart?.items) return 0;

    return cart.items.reduce(
      (total, item) => {
        const product = item.product;

        if (!product) return total;

        return (
          total +
          product.price * item.quantity
        );
      },
      0
    );
  };

  const calculateDiscount = () => {
    if (!cart?.items) return 0;

    return cart.items.reduce(
      (total, item) => {
        const product = item.product;

        if (!product) return total;

        const discountAmount =
          (product.price *
            product.discount) /
          100;

        return (
          total +
          discountAmount *
            item.quantity
        );
      },
      0
    );
  };

  const subtotal =
    calculateSubtotal();

  const discount =
    calculateDiscount();

  const totalAmount =
    subtotal - discount;

  const totalItems =
    cart?.items?.reduce(
      (total, item) =>
        total + item.quantity,
      0
    ) || 0;

  const handleCheckout = () => {
    if (
      !cart ||
      cart.items.length === 0
    ) {
      return;
    }

    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-loading">
          <div className="cart-loading-icon">
            🛒
          </div>

          <h2>Loading Your Cart...</h2>

          <p>
            Please wait while we fetch
            your cart.
          </p>
        </div>
      </div>
    );
  }

  if (error && !cart) {
    return (
      <div className="cart-page">
        <div className="cart-login-card">
          <div className="cart-empty-icon">
            🛒
          </div>

          <h1>Your Cart</h1>

          <p>{error}</p>

          <button
            onClick={() =>
              navigate("/login")
            }
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">

      <div className="cart-container">

        {/* HEADER */}

        <div className="cart-header">

          <div>
            <span>
              SHOPKART STORE
            </span>

            <h1>
              My Shopping Cart
            </h1>

            <p>
              Review your products and
              complete your order.
            </p>
          </div>

          <div className="cart-header-icon">
            🛒
          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="cart-error">
            ⚠️ {error}
          </div>
        )}

        {/* EMPTY CART */}

        {!cart ||
        cart.items.length === 0 ? (
          <div className="empty-cart-card">

            <div className="empty-cart-large-icon">
              🛒
            </div>

            <h2>
              Your Cart is Empty
            </h2>

            <p>
              Looks like you haven't
              added anything to your
              cart yet.
            </p>

            <button
              onClick={() =>
                navigate("/products")
              }
            >
              Start Shopping →
            </button>

          </div>
        ) : (
          <>
            {/* FREE DELIVERY BAR */}

            <div className="cart-benefits">

              <div>
                <span>🚚</span>
                <div>
                  <strong>
                    Fast Delivery
                  </strong>
                  <small>
                    Get your products
                    delivered quickly
                  </small>
                </div>
              </div>

              <div>
                <span>🔒</span>
                <div>
                  <strong>
                    Secure Shopping
                  </strong>
                  <small>
                    Your order is safe
                    with us
                  </small>
                </div>
              </div>

              <div>
                <span>↩️</span>
                <div>
                  <strong>
                    Easy Returns
                  </strong>
                  <small>
                    Hassle-free returns
                  </small>
                </div>
              </div>

            </div>

            {/* MAIN CART */}

            <div className="cart-layout">

              {/* LEFT */}

              <div className="cart-items-section">

                <div className="cart-section-header">
                  <h2>
                    Cart Items
                  </h2>

                  <span>
                    {totalItems} item
                    {totalItems !== 1
                      ? "s"
                      : ""}
                  </span>
                </div>

                {cart.items.map(
                  (item) => {
                    const product =
                      item.product;

                    if (!product) {
                      return null;
                    }

                    const discountedPrice =
                      Math.round(
                        product.price -
                          (product.price *
                            product.discount) /
                            100
                      );

                    const itemTotal =
                      discountedPrice *
                      item.quantity;

                    const isUpdating =
                      updatingProduct ===
                      product._id;

                    return (
                      <div
                        className="cart-item-card"
                        key={product._id}
                      >

                        {/* IMAGE */}

                        <div
                          className="cart-product-image"
                          onClick={() =>
                            navigate(
                              `/product/${product._id}`
                            )
                          }
                        >
                          {product.discount >
                            0 && (
                            <span>
                              {
                                product.discount
                              }
                              % OFF
                            </span>
                          )}

                          <img
                            src={
                              product
                                .images?.[0] ||
                              "https://placehold.co/300x300?text=Product"
                            }
                            alt={
                              product.name
                            }
                            onError={(
                              event
                            ) => {
                              event.currentTarget.src =
                                "https://placehold.co/300x300?text=Product";
                            }}
                          />
                        </div>

                        {/* INFORMATION */}

                        <div className="cart-product-info">

                          <small>
                            {
                              product.brand
                            }
                          </small>

                          <h3
                            onClick={() =>
                              navigate(
                                `/product/${product._id}`
                              )
                            }
                          >
                            {
                              product.name
                            }
                          </h3>

                          <p className="cart-category">
                            {product.category}
                          </p>

                          <div className="cart-price-row">

                            <strong>
                              ₹
                              {
                                discountedPrice
                              }
                            </strong>

                            {product.discount >
                              0 && (
                              <>
                                <del>
                                  ₹
                                  {
                                    product.price
                                  }
                                </del>

                                <span>
                                  {
                                    product.discount
                                  }
                                  % off
                                </span>
                              </>
                            )}

                          </div>

                          <div className="cart-stock">
                            {product.stock >
                            0
                              ? "✓ In stock"
                              : "Out of stock"}
                          </div>

                          {/* QUANTITY */}

                          <div className="cart-item-bottom">

                            <div className="cart-quantity">

                              <button
                                type="button"
                                disabled={
                                  isUpdating ||
                                  item.quantity <=
                                    1
                                }
                                onClick={() =>
                                  handleQuantityChange(
                                    product._id,
                                    item.quantity -
                                      1
                                  )
                                }
                              >
                                −
                              </button>

                              <span>
                                {
                                  item.quantity
                                }
                              </span>

                              <button
                                type="button"
                                disabled={
                                  isUpdating ||
                                  item.quantity >=
                                    product.stock
                                }
                                onClick={() =>
                                  handleQuantityChange(
                                    product._id,
                                    item.quantity +
                                      1
                                  )
                                }
                              >
                                +
                              </button>

                            </div>

                            <button
                              className="remove-button"
                              disabled={
                                isUpdating
                              }
                              onClick={() =>
                                handleRemove(
                                  product._id
                                )
                              }
                            >
                              🗑 Remove
                            </button>

                          </div>

                        </div>

                        {/* ITEM TOTAL */}

                        <div className="cart-item-total">

                          <span>
                            Item Total
                          </span>

                          <strong>
                            ₹
                            {Math.round(
                              itemTotal
                            )}
                          </strong>

                        </div>

                      </div>
                    );
                  }
                )}

                {/* CONTINUE SHOPPING */}

                <button
                  className="continue-shopping"
                  onClick={() =>
                    navigate(
                      "/products"
                    )
                  }
                >
                  ← Continue Shopping
                </button>

              </div>

              {/* RIGHT SUMMARY */}

              <div className="cart-summary">

                <div className="summary-title">
                  <h2>
                    Price Details
                  </h2>

                  <span>
                    {totalItems} Items
                  </span>
                </div>

                <div className="summary-line">
                  <span>
                    Price ({totalItems}{" "}
                    items)
                  </span>

                  <span>
                    ₹
                    {Math.round(
                      subtotal
                    )}
                  </span>
                </div>

                <div className="summary-line discount">
                  <span>
                    Discount
                  </span>

                  <span>
                    − ₹
                    {Math.round(
                      discount
                    )}
                  </span>
                </div>

                <div className="summary-line">
                  <span>
                    Delivery Charges
                  </span>

                  <span className="free">
                    FREE
                  </span>
                </div>

                <hr />

                <div className="summary-total">
                  <span>
                    Total Amount
                  </span>

                  <strong>
                    ₹
                    {Math.round(
                      totalAmount
                    )}
                  </strong>
                </div>

                <div className="savings-box">
                  💚 You will save ₹
                  {Math.round(
                    discount
                  )}{" "}
                  on this order
                </div>

                <button
                  className="checkout-button"
                  onClick={
                    handleCheckout
                  }
                >
                  Proceed to Checkout →
                </button>

                <div className="secure-payment">
                  🔒 Safe and Secure Payments
                </div>

              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Cart;