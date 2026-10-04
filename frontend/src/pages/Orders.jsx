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
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          return;
        }

        const response = await api.get("/orders", {
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

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="orders-page">
        <h1>My Orders</h1>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <h1>My Orders</h1>
        <p className="order-error">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <h1>My Orders</h1>

        <div className="empty-orders">
          <h2>No orders found</h2>
          <p>You have not placed any orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-header">
              <div>
                <p className="order-label">Order ID</p>

                <p className="order-id">
                  {order._id}
                </p>
              </div>

              <div>
                <p className="order-label">Status</p>

                <p className="order-status">
                  {order.orderStatus}
                </p>
              </div>
            </div>

            <hr />

            <div className="order-items">
              {order.items.map((item) => (
                <div
                  className="order-item"
                  key={item._id}
                >
                  <div>
                    <h2>{item.name}</h2>

                    <p>
                      Quantity: {item.quantity}
                    </p>

                    <p>
                      Price: ₹{item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <hr />

            <div className="order-footer">
              <div>
                <strong>
                  Total: ₹{order.totalAmount}
                </strong>
              </div>

              <button
                className="view-order-button"
                onClick={() =>
                  navigate(`/orders/${order._id}`)
                }
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;