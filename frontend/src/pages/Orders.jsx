import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Orders.css";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("/orders", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setOrders(response.data.orders || []);
      } catch (error) {
        console.error(error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          window.dispatchEvent(new Event("authChanged"));

          navigate("/login");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Failed to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "status-delivered";

      case "Shipped":
        return "status-shipped";

      case "Out for Delivery":
        return "status-out";

      case "Cancelled":
        return "status-cancelled";

      case "Processing":
        return "status-processing";

      default:
        return "status-placed";
    }
  };

  const getTotalItems = (items = []) => {
    return items.reduce(
      (total, item) => total + item.quantity,
      0
    );
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loading">
          <div className="orders-spinner"></div>

          <h2>Loading your orders...</h2>

          <p>
            Please wait while we fetch your order history.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="orders-error">
          <div className="orders-error-icon">!</div>

          <h2>Unable to load orders</h2>

          <p>{error}</p>

          <button
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <section className="orders-hero">
        <div>
          <span className="orders-eyebrow">
            SHOPKART ACCOUNT
          </span>

          <h1>My Orders</h1>

          <p>
            Track your purchases, view order details and
            manage your shopping history.
          </p>
        </div>

        <div className="orders-hero-icon">
          📦
        </div>
      </section>

      <section className="orders-summary">
        <div className="orders-summary-card">
          <div className="summary-icon">📦</div>

          <div>
            <span>Total Orders</span>
            <strong>{orders.length}</strong>
          </div>
        </div>

        <div className="orders-summary-card">
          <div className="summary-icon">🚚</div>

          <div>
            <span>Active Orders</span>

            <strong>
              {
                orders.filter(
                  (order) =>
                    order.orderStatus !== "Delivered" &&
                    order.orderStatus !== "Cancelled"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="orders-summary-card">
          <div className="summary-icon">✅</div>

          <div>
            <span>Delivered</span>

            <strong>
              {
                orders.filter(
                  (order) =>
                    order.orderStatus === "Delivered"
                ).length
              }
            </strong>
          </div>
        </div>
      </section>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <div className="empty-icon">🛍️</div>

          <h2>No orders yet</h2>

          <p>
            You haven't placed any orders yet.
            Start shopping and your orders will appear here.
          </p>

          <button
            onClick={() => navigate("/products")}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <section className="orders-list">
          <div className="orders-list-heading">
            <div>
              <h2>Your Order History</h2>

              <p>
                {orders.length}{" "}
                {orders.length === 1 ? "order" : "orders"} found
              </p>
            </div>
          </div>

          {orders.map((order) => {
            const firstItem = order.items?.[0];

            const extraItems =
              order.items?.length > 1
                ? order.items.length - 1
                : 0;

            return (
              <article
                className="order-card"
                key={order._id}
              >
                <div className="order-card-top">
                  <div className="order-info">
                    <span>ORDER PLACED</span>

                    <strong>
                      {formatDate(order.createdAt)}
                    </strong>
                  </div>

                  <div className="order-info">
                    <span>ORDER ID</span>

                    <strong className="order-id">
                      #{order._id.slice(-10).toUpperCase()}
                    </strong>
                  </div>

                  <div className="order-status-wrapper">
                    <span>STATUS</span>

                    <span
                      className={`order-status ${getStatusClass(
                        order.orderStatus
                      )}`}
                    >
                      <span className="status-dot"></span>

                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="order-product">
                  <div className="order-product-image">
                    {firstItem?.product?.images?.[0] ? (
                      <img
                        src={firstItem.product.images[0]}
                        alt={firstItem.name}
                      />
                    ) : (
                      <div className="no-product-image">
                        📦
                      </div>
                    )}
                  </div>

                  <div className="order-product-content">
                    <h3>
                      {firstItem?.name ||
                        "Product unavailable"}
                    </h3>

                    {firstItem?.product?.brand && (
                      <span className="product-brand">
                        {firstItem.product.brand}
                      </span>
                    )}

                    <div className="order-product-meta">
                      <span>
                        Qty:{" "}
                        <strong>
                          {firstItem?.quantity || 0}
                        </strong>
                      </span>

                      <span>
                        Price:{" "}
                        <strong>
                          ₹
                          {firstItem?.price?.toLocaleString(
                            "en-IN"
                          ) || "0"}
                        </strong>
                      </span>
                    </div>

                    {extraItems > 0 && (
                      <span className="more-items">
                        + {extraItems} more{" "}
                        {extraItems === 1
                          ? "item"
                          : "items"}
                      </span>
                    )}
                  </div>

                  <div className="order-total">
                    <span>ORDER TOTAL</span>

                    <strong>
                      ₹
                      {order.totalAmount?.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                    <small>
                      {getTotalItems(order.items)}{" "}
                      {getTotalItems(order.items) === 1
                        ? "item"
                        : "items"}
                    </small>
                  </div>
                </div>

                <div className="order-card-bottom">
                  <div className="delivery-message">
                    {order.orderStatus ===
                      "Delivered" && (
                      <>
                        <span>✓</span>
                        Order delivered successfully
                      </>
                    )}

                    {order.orderStatus ===
                      "Cancelled" && (
                      <>
                        <span>✕</span>
                        This order has been cancelled
                      </>
                    )}

                    {order.orderStatus !==
                      "Delivered" &&
                      order.orderStatus !==
                        "Cancelled" && (
                        <>
                          <span>🚚</span>
                          Your order is on its way
                        </>
                      )}
                  </div>

                  <button
                    className="view-order-button"
                    onClick={() =>
                      navigate(`/orders/${order._id}`)
                    }
                  >
                    View Details
                    <span>→</span>
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}

      <section className="orders-benefits">
        <div>
          <span>🔒</span>

          <div>
            <strong>Secure Shopping</strong>
            <p>Your data stays protected</p>
          </div>
        </div>

        <div>
          <span>🚚</span>

          <div>
            <strong>Fast Delivery</strong>
            <p>Track your orders easily</p>
          </div>
        </div>

        <div>
          <span>💬</span>

          <div>
            <strong>24/7 Support</strong>
            <p>We're here to help</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Orders;