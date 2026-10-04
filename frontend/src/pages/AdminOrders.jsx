import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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

  // Update Order Status
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

  // Update Payment Status
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

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          backgroundColor: "#f1f3f6",
          minHeight: "calc(100vh - 70px)"
        }}
      >
        <h1>Admin Orders</h1>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "30px 40px",
        backgroundColor: "#f1f3f6",
        minHeight: "calc(100vh - 70px)"
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px"
          }}
        >
          <h1>Admin Orders</h1>

          <button
            type="button"
            onClick={() => navigate("/admin")}
            style={{
              padding: "10px 18px",
              cursor: "pointer"
            }}
          >
            Dashboard
          </button>
        </div>

        {/* Success Message */}
        {message && (
          <div
            style={{
              backgroundColor: "#e8f5e9",
              color: "#1b5e20",
              padding: "12px 15px",
              borderRadius: "5px",
              marginBottom: "15px",
              border: "1px solid #a5d6a7"
            }}
          >
            ✓ {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: "#ffebee",
              color: "#c62828",
              padding: "12px 15px",
              borderRadius: "5px",
              marginBottom: "15px",
              border: "1px solid #ef9a9a"
            }}
          >
            ✕ {error}
          </div>
        )}

        {/* Orders */}
        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "8px"
          }}
        >
          <h2>All Orders</h2>

          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px"
              }}
            >
              {orders.map((order) => (
                <div
                  key={order._id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "20px"
                  }}
                >
                  {/* Order Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "20px",
                      flexWrap: "wrap"
                    }}
                  >
                    {/* Order Information */}
                    <div>
                      <h3>
                        Order ID: {order._id}
                      </h3>

                      <p>
                        <strong>Customer:</strong>{" "}
                        {order.user?.name ||
                          "Unknown User"}
                      </p>

                      <p>
                        <strong>Email:</strong>{" "}
                        {order.user?.email || "N/A"}
                      </p>

                      <p>
                        <strong>Total:</strong>{" "}
                        ₹{order.totalAmount}
                      </p>

                      <p>
                        <strong>Payment Method:</strong>{" "}
                        {order.paymentMethod}
                      </p>
                    </div>

                    {/* Status Controls */}
                    <div
                      style={{
                        minWidth: "220px"
                      }}
                    >
                      {/* Order Status */}
                      <div style={{ marginBottom: "18px" }}>
                        <p
                          style={{
                            marginBottom: "7px"
                          }}
                        >
                          <strong>
                            Order Status
                          </strong>
                        </p>

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
                          style={{
                            padding: "10px",
                            width: "100%"
                          }}
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
                          <p
                            style={{
                              marginTop: "5px"
                            }}
                          >
                            Updating order status...
                          </p>
                        )}
                      </div>

                      {/* Payment Status */}
                      <div>
                        <p
                          style={{
                            marginBottom: "7px"
                          }}
                        >
                          <strong>
                            Payment Status
                          </strong>
                        </p>

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
                          style={{
                            padding: "10px",
                            width: "100%"
                          }}
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
                          <p
                            style={{
                              marginTop: "5px"
                            }}
                          >
                            Updating payment status...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <hr />

                  {/* Products */}
                  <h3>Products</h3>

                  {order.items?.map((item) => (
                    <div
                      key={item._id}
                      style={{
                        padding: "12px",
                        backgroundColor: "#f7f7f7",
                        marginBottom: "10px",
                        borderRadius: "5px"
                      }}
                    >
                      <p>
                        <strong>
                          {item.name}
                        </strong>
                      </p>

                      <p>
                        Quantity: {item.quantity}
                      </p>

                      <p>
                        Price: ₹{item.price}
                      </p>

                      <p>
                        Subtotal: ₹
                        {item.price *
                          item.quantity}
                      </p>
                    </div>
                  ))}

                  <hr />

                  {/* Shipping Address */}
                  <h3>Shipping Address</h3>

                  <p>
                    {order.shippingAddress?.street}
                  </p>

                  <p>
                    {order.shippingAddress?.city},{" "}
                    {order.shippingAddress?.state}
                  </p>

                  <p>
                    Pincode:{" "}
                    {order.shippingAddress?.pincode}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;