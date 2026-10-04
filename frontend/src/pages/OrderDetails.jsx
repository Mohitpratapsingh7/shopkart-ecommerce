import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./OrderDetails.css";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          return;
        }

        const response = await api.get(`/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setOrder(response.data.order);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to fetch order"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const getStatusStep = () => {
    const statuses = [
      "Placed",
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered"
    ];

    if (order?.orderStatus === "Cancelled") {
      return -1;
    }

    return statuses.indexOf(order?.orderStatus);
  };

  if (loading) {
    return (
      <div className="order-details-page">
        <div className="order-details-loading">
          <div className="loading-cart">📦</div>

          <h2>Loading your order...</h2>

          <p>Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-details-page">
        <div className="order-details-error">
          <div className="error-icon">⚠️</div>

          <h1>Order Details</h1>

          <p>{error}</p>

          <button
            type="button"
            onClick={() => navigate("/orders")}
          >
            ← Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-page">
        <div className="order-details-error">
          <div className="error-icon">📦</div>

          <h1>Order Not Found</h1>

          <p>
            We couldn't find the order you're looking for.
          </p>

          <button
            type="button"
            onClick={() => navigate("/orders")}
          >
            ← Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  const currentStep = getStatusStep();

  return (
    <div className="order-details-page">
      <div className="order-details-container">

        {/* HEADER */}

        <div className="order-details-header">
          <div>
            <span className="order-store-label">
              SHOPKART STORE
            </span>

            <h1>Order Details</h1>

            <p>
              Track your order and view complete order
              information.
            </p>
          </div>

          <div className="order-header-icon">
            📦
          </div>
        </div>

        {/* ORDER TOP BAR */}

        <div className="order-top-card">
          <div>
            <span className="small-label">
              ORDER ID
            </span>

            <strong className="order-id">
              #{order._id}
            </strong>
          </div>

          <div className="order-date">
            <span className="small-label">
              ORDER DATE
            </span>

            <strong>
              {new Date(
                order.createdAt
              ).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
              })}
            </strong>
          </div>

          <div
            className={`order-status-badge ${
              order.orderStatus === "Cancelled"
                ? "cancelled"
                : "active-status"
            }`}
          >
            {order.orderStatus === "Cancelled"
              ? "✕ Cancelled"
              : `✓ ${order.orderStatus}`}
          </div>
        </div>

        {/* TRACKING */}

        <div className="tracking-card">
          <div className="section-title">
            <div className="section-icon">
              🚚
            </div>

            <div>
              <h2>Order Tracking</h2>

              <p>
                Your order status
              </p>
            </div>
          </div>

          {order.orderStatus === "Cancelled" ? (
            <div className="cancelled-box">
              <span>✕</span>

              <div>
                <strong>
                  This order has been cancelled
                </strong>

                <p>
                  Please contact support if you need
                  assistance.
                </p>
              </div>
            </div>
          ) : (
            <div className="tracking-timeline">
              {[
                {
                  title: "Order Placed",
                  subtitle: "Your order has been placed",
                  icon: "✓"
                },
                {
                  title: "Processing",
                  subtitle: "Seller is preparing your order",
                  icon: "📦"
                },
                {
                  title: "Shipped",
                  subtitle: "Your order is on the way",
                  icon: "🚚"
                },
                {
                  title: "Out for Delivery",
                  subtitle: "Delivery partner is nearby",
                  icon: "🏠"
                },
                {
                  title: "Delivered",
                  subtitle: "Order delivered successfully",
                  icon: "✓"
                }
              ].map((step, index) => (
                <div
                  className={`tracking-step ${
                    index <= currentStep
                      ? "completed"
                      : ""
                  } ${
                    index === currentStep
                      ? "current"
                      : ""
                  }`}
                  key={step.title}
                >
                  <div className="timeline-marker">
                    {index <= currentStep
                      ? step.icon
                      : index + 1}
                  </div>

                  <div className="timeline-content">
                    <strong>
                      {step.title}
                    </strong>

                    <span>
                      {step.subtitle}
                    </span>
                  </div>

                  {index < 4 && (
                    <div
                      className={`timeline-line ${
                        index < currentStep
                          ? "completed-line"
                          : ""
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="order-details-grid">

          {/* LEFT */}

          <div className="order-details-main">

            {/* PRODUCTS */}

            <div className="details-card">
              <div className="section-title">
                <div className="section-icon">
                  🛍️
                </div>

                <div>
                  <h2>Products</h2>

                  <p>
                    {order.items.length} product
                    {order.items.length !== 1
                      ? "s"
                      : ""}{" "}
                    in this order
                  </p>
                </div>
              </div>

              <div className="ordered-products">
                {order.items.map((item) => {
                  const productImage =
                    item.product?.images?.[0] ||
                    "https://placehold.co/180x180?text=Product";

                  return (
                    <div
                      className="ordered-product"
                      key={item._id}
                    >
                      <div className="ordered-product-image">
                        <img
                          src={productImage}
                          alt={item.name}
                        />
                      </div>

                      <div className="ordered-product-info">
                        <span>
                          {item.product?.brand ||
                            "ShopKart"}
                        </span>

                        <h3>{item.name}</h3>

                        <p>
                          Quantity:{" "}
                          <strong>
                            {item.quantity}
                          </strong>
                        </p>

                        <p className="product-unit-price">
                          ₹{item.price} per item
                        </p>
                      </div>

                      <div className="ordered-product-total">
                        <span>Subtotal</span>

                        <strong>
                          ₹
                          {(
                            item.price *
                            item.quantity
                          ).toLocaleString("en-IN")}
                        </strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SHIPPING ADDRESS */}

            <div className="details-card">
              <div className="section-title">
                <div className="section-icon">
                  📍
                </div>

                <div>
                  <h2>Shipping Address</h2>

                  <p>
                    Delivery location
                  </p>
                </div>
              </div>

              <div className="address-box">
                <div className="address-person">
                  🏠
                </div>

                <div>
                  <strong>
                    Delivery Address
                  </strong>

                  <p>
                    {order.shippingAddress.street}
                  </p>

                  <p>
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state}
                  </p>

                  <p>
                    Pincode:{" "}
                    {order.shippingAddress.pincode}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <aside className="order-details-sidebar">

            {/* PRICE */}

            <div className="details-card price-details-card">
              <div className="section-title">
                <div className="section-icon">
                  💰
                </div>

                <div>
                  <h2>Price Details</h2>

                  <p>
                    Order summary
                  </p>
                </div>
              </div>

              <div className="summary-row">
                <span>
                  Product Total
                </span>

                <span>
                  ₹
                  {order.items
                    .reduce(
                      (total, item) =>
                        total +
                        item.price *
                          item.quantity,
                      0
                    )
                    .toLocaleString("en-IN")}
                </span>
              </div>

              <div className="summary-row">
                <span>
                  Delivery
                </span>

                <strong className="free">
                  FREE
                </strong>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <strong>
                  Total Amount
                </strong>

                <strong>
                  ₹
                  {order.totalAmount.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              <div className="saved-message">
                ✓ Order amount confirmed
              </div>
            </div>

            {/* PAYMENT */}

            <div className="details-card payment-details-card">
              <div className="section-title">
                <div className="section-icon">
                  💳
                </div>

                <div>
                  <h2>Payment</h2>

                  <p>
                    Payment information
                  </p>
                </div>
              </div>

              <div className="payment-detail">
                <span>
                  Payment Method
                </span>

                <strong>
                  {order.paymentMethod === "COD"
                    ? "Cash on Delivery"
                    : order.paymentMethod}
                </strong>
              </div>

              <div className="payment-detail">
                <span>
                  Payment Status
                </span>

                <strong
                  className={`payment-status ${
                    order.paymentStatus
                      .toLowerCase()
                  }`}
                >
                  {order.paymentStatus}
                </strong>
              </div>
            </div>

            {/* HELP */}

            <div className="help-card">
              <div className="help-icon">
                🎧
              </div>

              <div>
                <strong>
                  Need Help?
                </strong>

                <p>
                  We're here to help with your
                  order.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="continue-shopping"
              onClick={() =>
                navigate("/products")
              }
            >
              🛍️ Continue Shopping
            </button>

            <button
              type="button"
              className="back-orders"
              onClick={() =>
                navigate("/orders")
              }
            >
              ← View My Orders
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;