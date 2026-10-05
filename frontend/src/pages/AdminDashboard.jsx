import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get("/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setStats(response.data);
      } catch (error) {
        console.error(error);

        if (error.response?.status === 401) {
          setError("Session expired. Please login again.");
        } else if (error.response?.status === 403) {
          setError("You do not have admin access.");
        } else {
          setError(
            error.response?.data?.message ||
              "Dashboard load nahi ho paya."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [navigate]);

  if (loading) {
    return (
      <div className="admin-loading-page">
        <div className="admin-loader"></div>
        <h2>Loading Admin Dashboard...</h2>
        <p>Please wait while we fetch your store data.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error-page">
        <div className="admin-error-card">
          <div className="error-icon">⚠️</div>

          <h1>Something went wrong</h1>

          <p>{error}</p>

          <button
            className="admin-primary-button"
            onClick={() => navigate("/")}
          >
            Go to Store
          </button>
        </div>
      </div>
    );
  }

  const dashboardCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: "👥",
      description: "Registered customers",
      className: "users-card",
      path: "/admin/users"
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: "📦",
      description: "Products in store",
      className: "products-card",
      path: "/admin/products"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: "🛒",
      description: "Orders received",
      className: "orders-card",
      path: "/admin/orders"
    },
    {
      title: "Total Sales",
      value: `₹${Number(stats.totalSales || 0).toLocaleString("en-IN")}`,
      icon: "💰",
      description: "Revenue from orders",
      className: "sales-card",
      path: "/admin/orders"
    }
  ];

  return (
    <div className="admin-page">
      <div className="admin-container">

        {/* Header */}
        <section className="admin-header">
          <div>
            <div className="admin-title-row">
              <div className="admin-title-icon">⚡</div>

              <div>
                <p className="admin-eyebrow">
                  SHOPKART ADMINISTRATION
                </p>

                <h1>Admin Dashboard</h1>
              </div>
            </div>

            <p className="admin-subtitle">
              Manage your store, products, customers and orders
              from one powerful dashboard.
            </p>
          </div>

          <button
            className="store-button"
            onClick={() => navigate("/")}
          >
            <span>🏪</span>
            View Store
            <span>→</span>
          </button>
        </section>

        {/* Stats */}
        <section className="admin-stats-grid">
          {dashboardCards.map((card) => (
            <div
              className={`admin-stat-card ${card.className}`}
              key={card.title}
              onClick={() => navigate(card.path)}
            >
              <div className="stat-card-top">
                <div className="stat-icon">
                  {card.icon}
                </div>

                <span className="stat-arrow">↗</span>
              </div>

              <div className="stat-content">
                <p>{card.title}</p>

                <h2>{card.value}</h2>

                <span>{card.description}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Main Admin Section */}
        <section className="management-section">

          <div className="section-top">
            <div>
              <p className="section-label">
                STORE CONTROL
              </p>

              <h2>Admin Management</h2>

              <p>
                Quickly access the most important areas of
                your ShopKart store.
              </p>
            </div>

            <div className="management-badge">
              <span className="status-dot"></span>
              Admin Access
            </div>
          </div>

          <div className="management-grid">

            {/* Products */}
            <button
              className="management-card"
              onClick={() => navigate("/admin/products")}
            >
              <div className="management-icon products-icon">
                📦
              </div>

              <div className="management-content">
                <h3>Manage Products</h3>

                <p>
                  Add, edit, update stock and remove products
                  from your store.
                </p>

                <span className="management-link">
                  Open Products →
                </span>
              </div>
            </button>

            {/* Users */}
            <button
              className="management-card"
              onClick={() => navigate("/admin/users")}
            >
              <div className="management-icon users-icon">
                👥
              </div>

              <div className="management-content">
                <h3>Manage Users</h3>

                <p>
                  View customers and manage user roles and
                  account access.
                </p>

                <span className="management-link">
                  Open Users →
                </span>
              </div>
            </button>

            {/* Orders */}
            <button
              className="management-card"
              onClick={() => navigate("/admin/orders")}
            >
              <div className="management-icon orders-icon">
                🛍️
              </div>

              <div className="management-content">
                <h3>Manage Orders</h3>

                <p>
                  View orders and update delivery and payment
                  statuses.
                </p>

                <span className="management-link">
                  Open Orders →
                </span>
              </div>
            </button>

          </div>
        </section>

        {/* Store Overview */}
        <section className="overview-section">

          <div className="overview-heading">
            <div>
              <p className="section-label">
                QUICK OVERVIEW
              </p>

              <h2>Your Store at a Glance</h2>
            </div>
          </div>

          <div className="overview-grid">

            <div className="overview-item">
              <div className="overview-item-icon">
                👥
              </div>

              <div>
                <strong>{stats.totalUsers}</strong>
                <span>Customers</span>
              </div>
            </div>

            <div className="overview-item">
              <div className="overview-item-icon">
                📦
              </div>

              <div>
                <strong>{stats.totalProducts}</strong>
                <span>Products</span>
              </div>
            </div>

            <div className="overview-item">
              <div className="overview-item-icon">
                🛒
              </div>

              <div>
                <strong>{stats.totalOrders}</strong>
                <span>Orders</span>
              </div>
            </div>

            <div className="overview-item">
              <div className="overview-item-icon">
                💵
              </div>

              <div>
                <strong>
                  ₹{Number(stats.totalSales || 0).toLocaleString("en-IN")}
                </strong>

                <span>Total Sales</span>
              </div>
            </div>

          </div>
        </section>

        {/* Bottom CTA */}
        <section className="admin-bottom-banner">
          <div>
            <span className="banner-small">
              SHOPKART STORE
            </span>

            <h2>
              Keep your store running smoothly.
            </h2>

            <p>
              Manage products, customers and orders from
              your admin panel.
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="banner-button"
          >
            Visit Store →
          </button>
        </section>

      </div>
    </div>
  );
}

export default AdminDashboard;