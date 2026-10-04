import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: ""
  });

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const [cartResponse, profileResponse] =
          await Promise.all([
            api.get("/cart", {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }),

            api.get("/users/profile", {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
          ]);

        setCart(cartResponse.data.cart);

        const user = profileResponse.data.user;

        if (user?.address) {
          setAddress({
            street: user.address.street || "",
            city: user.address.city || "",
            state: user.address.state || "",
            pincode: user.address.pincode || ""
          });
        }
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Checkout load nahi ho paya."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, [navigate]);

  const handleChange = (event) => {
    setAddress({
      ...address,
      [event.target.name]: event.target.value
    });

    setError("");
  };

  const calculateSubtotal = () => {
    if (!cart?.items) {
      return 0;
    }

    return cart.items.reduce((total, item) => {
      const product = item.product;

      if (!product) {
        return total;
      }

      return total + product.price * item.quantity;
    }, 0);
  };

  const calculateDiscount = () => {
    if (!cart?.items) {
      return 0;
    }

    return cart.items.reduce((total, item) => {
      const product = item.product;

      if (!product) {
        return total;
      }

      const discount =
        (product.price * product.discount) / 100;

      return total + discount * item.quantity;
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const calculateTotalItems = () => {
    if (!cart?.items) {
      return 0;
    }

    return cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
  };

  const handlePlaceOrder = async () => {
    setError("");
    setSuccess("");

    const street = address.street.trim();
    const city = address.city.trim();
    const state = address.state.trim();
    const pincode = address.pincode.trim();

    if (!street || !city || !state || !pincode) {
      setError("Please fill all delivery address fields.");
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setPlacingOrder(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.post(
        "/orders",
        {
          shippingAddress: {
            street,
            city,
            state,
            pincode
          },
          paymentMethod: "COD"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const orderId = response.data.order._id;

      setSuccess("Order placed successfully!");

      setTimeout(() => {
        navigate(`/orders/${orderId}`);
      }, 700);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Order place nahi ho paya. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="checkout-loading">
          <div className="loading-icon">🛒</div>

          <h2>Preparing your checkout...</h2>

          <p>Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (error && !cart) {
    return (
      <div className="checkout-page">
        <div className="checkout-error-page">
          <div className="error-icon">⚠️</div>

          <h2>Checkout unavailable</h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="secondary-button"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <div className="empty-icon">🛒</div>

          <h1>Your Cart is Empty</h1>

          <p>
            Add some products to your cart before
            proceeding to checkout.
          </p>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="primary-button"
          >
            Continue Shopping →
          </button>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const discount = calculateDiscount();
  const totalAmount = calculateTotal();
  const totalItems = calculateTotalItems();

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Page Header */}

        <div className="checkout-header">
          <div>
            <span className="checkout-label">
              SHOPKART STORE
            </span>

            <h1>Secure Checkout</h1>

            <p>
              Complete your order and get it delivered
              to your doorstep.
            </p>
          </div>

          <div className="checkout-header-icon">
            🔒
          </div>
        </div>

        {/* Checkout Steps */}

        <div className="checkout-steps">
          <div className="checkout-step active">
            <div className="step-number">1</div>

            <div>
              <strong>Delivery</strong>
              <span>Address</span>
            </div>
          </div>

          <div className="step-line"></div>

          <div className="checkout-step active">
            <div className="step-number">2</div>

            <div>
              <strong>Payment</strong>
              <span>Cash on Delivery</span>
            </div>
          </div>

          <div className="step-line"></div>

          <div className="checkout-step">
            <div className="step-number">3</div>

            <div>
              <strong>Confirmation</strong>
              <span>Place Order</span>
            </div>
          </div>
        </div>

        {/* Error */}

        {error && (
          <div className="checkout-alert error-alert">
            <span>⚠️</span>

            <div>
              <strong>Something went wrong</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Success */}

        {success && (
          <div className="checkout-alert success-alert">
            <span>✓</span>

            <div>
              <strong>{success}</strong>

              <p>
                Redirecting you to your order...
              </p>
            </div>
          </div>
        )}

        <div className="checkout-layout">
          {/* LEFT SIDE */}

          <div className="checkout-main">
            {/* Delivery Address */}

            <section className="checkout-card">
              <div className="card-heading">
                <div className="heading-icon">
                  📍
                </div>

                <div>
                  <h2>Delivery Address</h2>

                  <p>
                    Where should we deliver your
                    order?
                  </p>
                </div>
              </div>

              <div className="address-form">
                <div className="form-group full-width">
                  <label htmlFor="street">
                    Street / House Address
                  </label>

                  <input
                    id="street"
                    type="text"
                    name="street"
                    placeholder="House no., street, locality"
                    value={address.street}
                    onChange={handleChange}
                    disabled={placingOrder}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">
                    City
                  </label>

                  <input
                    id="city"
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    value={address.city}
                    onChange={handleChange}
                    disabled={placingOrder}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state">
                    State
                  </label>

                  <input
                    id="state"
                    type="text"
                    name="state"
                    placeholder="Enter state"
                    value={address.state}
                    onChange={handleChange}
                    disabled={placingOrder}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pincode">
                    Pincode
                  </label>

                  <input
                    id="pincode"
                    type="text"
                    name="pincode"
                    placeholder="6-digit pincode"
                    maxLength="6"
                    value={address.pincode}
                    onChange={handleChange}
                    disabled={placingOrder}
                  />
                </div>
              </div>
            </section>

            {/* Products */}

            <section className="checkout-card">
              <div className="card-heading">
                <div className="heading-icon">
                  📦
                </div>

                <div>
                  <h2>Your Products</h2>

                  <p>
                    {totalItems} item
                    {totalItems !== 1
                      ? "s"
                      : ""}{" "}
                    in your order
                  </p>
                </div>
              </div>

              <div className="checkout-products">
                {cart.items.map((item) => {
                  const product = item.product;

                  if (!product) {
                    return null;
                  }

                  const discountedPrice =
                    product.price -
                    (product.price *
                      product.discount) /
                      100;

                  const itemTotal =
                    discountedPrice *
                    item.quantity;

                  return (
                    <div
                      className="checkout-product"
                      key={product._id}
                    >
                      <div className="checkout-product-image">
                        <img
                          src={
                            product.images?.[0] ||
                            "https://placehold.co/150x150?text=Product"
                          }
                          alt={product.name}
                        />
                      </div>

                      <div className="checkout-product-info">
                        <span className="product-brand">
                          {product.brand}
                        </span>

                        <h3>{product.name}</h3>

                        <p>
                          Quantity:{" "}
                          <strong>
                            {item.quantity}
                          </strong>
                        </p>

                        <div className="product-price-row">
                          <strong>
                            ₹
                            {Math.round(
                              discountedPrice
                            )}
                          </strong>

                          {product.discount > 0 && (
                            <>
                              <span className="old-price">
                                ₹{product.price}
                              </span>

                              <span className="discount-text">
                                {product.discount}% OFF
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="checkout-item-total">
                        <span>Total</span>

                        <strong>
                          ₹
                          {Math.round(
                            itemTotal
                          )}
                        </strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Payment */}

            <section className="checkout-card">
              <div className="card-heading">
                <div className="heading-icon">
                  💵
                </div>

                <div>
                  <h2>Payment Method</h2>

                  <p>
                    Select your preferred payment
                    option.
                  </p>
                </div>
              </div>

              <div className="payment-option selected">
                <div className="payment-radio">
                  ✓
                </div>

                <div className="payment-icon">
                  💵
                </div>

                <div className="payment-info">
                  <strong>
                    Cash on Delivery
                  </strong>

                  <span>
                    Pay when your order arrives at
                    your doorstep.
                  </span>
                </div>

                <div className="payment-badge">
                  Available
                </div>
              </div>

              <div className="secure-note">
                🔒 Your order information is
                protected and securely processed.
              </div>
            </section>
          </div>

          {/* RIGHT SIDE */}

          <aside className="checkout-sidebar">
            <div className="price-card">
              <h2>Price Details</h2>

              <div className="price-row">
                <span>
                  Price ({totalItems} items)
                </span>

                <span>
                  ₹{Math.round(subtotal)}
                </span>
              </div>

              <div className="price-row discount-row">
                <span>Discount</span>

                <span>
                  − ₹{Math.round(discount)}
                </span>
              </div>

              <div className="price-row">
                <span>Delivery</span>

                <span className="free-text">
                  FREE
                </span>
              </div>

              <div className="price-divider"></div>

              <div className="total-row">
                <strong>Total Amount</strong>

                <strong>
                  ₹{Math.round(totalAmount)}
                </strong>
              </div>

              {discount > 0 && (
                <div className="savings-box">
                  🎉 You are saving ₹
                  {Math.round(discount)} on this
                  order!
                </div>
              )}

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="place-order-button"
              >
                {placingOrder ? (
                  <>
                    <span className="button-spinner"></span>
                    Placing Order...
                  </>
                ) : (
                  <>
                    🔒 Place Order
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/cart")}
                disabled={placingOrder}
                className="back-cart-button"
              >
                ← Back to Cart
              </button>
            </div>

            <div className="checkout-benefits">
              <div className="benefit">
                <span>🚚</span>

                <div>
                  <strong>Free Delivery</strong>

                  <p>
                    Delivered to your doorstep
                  </p>
                </div>
              </div>

              <div className="benefit">
                <span>🔄</span>

                <div>
                  <strong>Easy Returns</strong>

                  <p>
                    Hassle-free return support
                  </p>
                </div>
              </div>

              <div className="benefit">
                <span>🔒</span>

                <div>
                  <strong>Secure Shopping</strong>

                  <p>
                    Your data is protected
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Checkout;