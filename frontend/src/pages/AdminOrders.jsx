import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminOrders.css";

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [updatingPaymentId, setUpdatingPaymentId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const statusOptions = [
    "Placed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled"
  ];

  const paymentStatusOptions = [
    "Pending",
    "Paid",
    "Failed"
  ];

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
          navigate("/login");
          return;
        }

        const user = JSON.parse(storedUser);

        if (user.role !== "admin") {
          navigate("/");
          return;
        }

        const response = await api.get("/admin/orders", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setOrders(response.data.orders || []);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Orders load nahi ho paye."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [navigate]);

  const handleStatusChange = async (orderId, newStatus) => {
    setMessage("");
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setUpdatingId(orderId);

      const response = await api.put(
        `/admin/orders/${orderId}/status`,
        {
          orderStatus: newStatus
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus:
                  response.data.order.orderStatus
              }
            : order
        )
      );

      setMessage(
        response.data.message ||
          "Order status updated successfully."
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Order status update nahi ho paya."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePaymentStatusChange = async (
    orderId,
    newPaymentStatus
  ) => {
    setMessage("");
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setUpdatingPaymentId(orderId);

      const response = await api.put(
        `/admin/orders/${orderId}/payment-status`,
        {
          paymentStatus: newPaymentStatus
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                paymentStatus:
                  response.data.order.paymentStatus
              }
            : order
        )
      );

      setMessage(
        response.data.message ||
          "Payment status updated successfully."
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Payment status update nahi ho paya."
      );
    } finally {
      setUpdatingPaymentId(null);
    }
  };

  const statistics = useMemo(() => {
    const totalValue = orders.reduce(
      (sum, order) =>
        sum + Number(order.totalAmount || 0),
      0
    );

    const delivered = orders.filter(
      (order) => order.orderStatus === "Delivered"
    ).length;

    const pending = orders.filter(
      (order) =>
        order.orderStatus !== "Delivered" &&
        order.orderStatus !== "Cancelled"
    ).length;

    const cancelled = orders.filter(
      (order) => order.orderStatus === "Cancelled"
    ).length;

    return {
      total: orders.length,
      totalValue,
      delivered,
      pending,
      cancelled
    };
  }, [orders]);

  const getStatusClass = (status) => {
    if (status === "Delivered") return "delivered";
    if (status === "Cancelled") return "cancelled";
    if (status === "Shipped") return "shipped";
    if (status === "Out for Delivery") return "out-delivery";
    if (status === "Processing") return "processing";

    return "placed";
  };

  const getPaymentClass = (status) => {
    if (status === "Paid") return "paid";
    if (status === "Failed") return "failed";

    return "pending";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  if (loading) {
    return (
      <div className="admin-orders-loading">
        <div className="admin-orders-spinner"></div>

        <h2>Loading Orders...</h2>

        <p>
          Fetching your latest customer orders.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">
      <div className="admin-orders-container">

        {/* Header */}
        <section className="admin-orders-header">
          <div className="admin-orders-heading">
            <div className="admin-orders-icon">
              🛍️
            </div>

            <div>
              <span className="admin-orders-eyebrow">
                SHOPKART ADMINISTRATION
              </span>

              <h1>Order Management</h1>

              <p>
                Track customer orders, payments and
                delivery status from one place.
              </p>
            </div>
          </div>

          <button
            className="admin-orders-dashboard-btn"
            onClick={() => navigate("/admin")}
          >
            ← Dashboard
          </button>
        </section>

        {/* Alerts */}
        {message && (
          <div className="admin-orders-alert success">
            <span>✓</span>
            {message}
          </div>
        )}

        {error && (
          <div className="admin-orders-alert error">
            <span>!</span>
            {error}
          </div>
        )}

        {/* Statistics */}
        <section className="admin-order-stats">

          <div className="admin-order-stat">
            <div className="order-stat-icon blue">
              🛒
            </div>

            <div>
              <span>Total Orders</span>
              <strong>
                {statistics.total}
              </strong>
              <small>All received orders</small>
            </div>
          </div>

          <div className="admin-order-stat">
            <div className="order-stat-icon green">
              ✓
            </div>

            <div>
              <span>Delivered</span>
              <strong>
                {statistics.delivered}
              </strong>
              <small>Successfully completed</small>
            </div>
          </div>

          <div className="admin-order-stat">
            <div className="order-stat-icon orange">
              ⏳
            </div>

            <div>
              <span>In Progress</span>
              <strong>
                {statistics.pending}
              </strong>
              <small>Active orders</small>
            </div>
          </div>

          <div className="admin-order-stat">
            <div className="order-stat-icon purple">
              ₹
            </div>

            <div>
              <span>Order Value</span>
              <strong>
                ₹
                {statistics.totalValue.toLocaleString(
                  "en-IN"
                )}
              </strong>
              <small>Total order value</small>
            </div>
          </div>

        </section>

        {/* Orders */}
        <section className="orders-panel">

          <div className="orders-panel-header">
            <div>
              <span className="section-eyebrow">
                CUSTOMER ORDERS
              </span>

              <h2>All Orders</h2>

              <p>
                Manage order delivery and payment
                information.
              </p>
            </div>

            <div className="orders-count">
              {orders.length} Orders
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="admin-orders-empty">
              <div className="empty-order-icon">
                📦
              </div>

              <h3>No Orders Yet</h3>

              <p>
                Customer orders will appear here once
                they are placed.
              </p>
            </div>
          ) : (
            <div className="admin-order-list">

              {orders.map((order) => (
                <article
                  className="admin-order-card"
                  key={order._id}
                >

                  {/* Order top */}
                  <div className="admin-order-top">

                    <div className="order-main-info">
                      <div className="order-number-row">
                        <span className="order-label">
                          ORDER ID
                        </span>

                        <strong>
                          #{order._id.slice(-10).toUpperCase()}
                        </strong>
                      </div>

                      <div className="order-date">
                        Placed on{" "}
                        {formatDate(order.createdAt)}
                      </div>
                    </div>

                    <div className="order-badges">
                      <span
                        className={`order-status-badge ${getStatusClass(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>

                      <span
                        className={`payment-badge ${getPaymentClass(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>

                  </div>

                  {/* Customer + Controls */}
                  <div className="order-info-grid">

                    <div className="customer-box">
                      <div className="info-box-title">
                        👤 CUSTOMER
                      </div>

                      <h3>
                        {order.user?.name ||
                          "Unknown User"}
                      </h3>

                      <p>
                        {order.user?.email ||
                          "No email available"}
                      </p>
                    </div>

                    <div className="payment-box">
                      <div className="info-box-title">
                        💳 PAYMENT
                      </div>

                      <h3>
                        ₹
                        {Number(
                          order.totalAmount || 0
                        ).toLocaleString("en-IN")}
                      </h3>

                      <p>
                        Method:{" "}
                        {order.paymentMethod || "COD"}
                      </p>
                    </div>

                    <div className="status-controls">

                      <label>
                        Order Status
                      </label>

                      <select
                        value={order.orderStatus}
                        disabled={
                          updatingId === order._id
                        }
                        onChange={(event) =>
                          handleStatusChange(
                            order._id,
                            event.target.value
                          )
                        }
                      >
                        {statusOptions.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          )
                        )}
                      </select>

                      {updatingId === order._id && (
                        <small>
                          Updating...
                        </small>
                      )}

                    </div>

                    <div className="status-controls">

                      <label>
                        Payment Status
                      </label>

                      <select
                        value={
                          order.paymentStatus
                        }
                        disabled={
                          updatingPaymentId ===
                          order._id
                        }
                        onChange={(event) =>
                          handlePaymentStatusChange(
                            order._id,
                            event.target.value
                          )
                        }
                      >
                        {paymentStatusOptions.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          )
                        )}
                      </select>

                      {updatingPaymentId ===
                        order._id && (
                        <small>
                          Updating...
                        </small>
                      )}

                    </div>

                  </div>

                  {/* Products */}
                  <div className="order-products-section">

                    <div className="order-section-title">
                      <span>📦</span>
                      Products
                    </div>

                    <div className="order-products-list">

                      {order.items?.map((item) => (
                        <div
                          className="admin-order-product"
                          key={item._id}
                        >

                          <div className="order-product-image">
                            {item.product?.images?.[0] ? (
                              <img
                                src={
                                  item.product.images[0]
                                }
                                alt={item.name}
                              />
                            ) : (
                              <span>📦</span>
                            )}
                          </div>

                          <div className="order-product-details">
                            <h4>{item.name}</h4>

                            <p>
                              Quantity:{" "}
                              {item.quantity}
                            </p>
                          </div>

                          <div className="order-product-price">
                            <span>
                              ₹
                              {Number(
                                item.price || 0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </span>

                            <small>
                              Subtotal ₹
                              {(
                                Number(
                                  item.price || 0
                                ) *
                                Number(
                                  item.quantity || 0
                                )
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </small>
                          </div>

                        </div>
                      ))}

                    </div>

                  </div>

                  {/* Shipping */}
                  <div className="shipping-section">

                    <div className="shipping-title">
                      <span>📍</span>
                      Shipping Address
                    </div>

                    <div className="shipping-address">
                      <strong>
                        {order.shippingAddress?.street ||
                          "Address unavailable"}
                      </strong>

                      <span>
                        {order.shippingAddress?.city ||
                          ""},{" "}
                        {order.shippingAddress?.state ||
                          ""}
                      </span>

                      <span>
                        PIN:{" "}
                        {order.shippingAddress?.pincode ||
                          "N/A"}
                      </span>
                    </div>

                  </div>

                  {/* Footer */}
                  <div className="admin-order-footer">

                    <span>
                      Order Total
                    </span>

                    <strong>
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toLocaleString("en-IN")}
                    </strong>

                  </div>

                </article>
              ))}

            </div>
          )}

        </section>

      </div>
    </div>
  );
}

export default AdminOrders;