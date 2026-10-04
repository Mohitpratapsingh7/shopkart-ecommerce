import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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
      <div
        style={{
          padding: "40px",
          textAlign: "center"
        }}
      >
        <h1>Admin Dashboard</h1>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center"
        }}
      >
        <h1>Admin Dashboard</h1>

        <p
          style={{
            color: "red",
            fontWeight: "bold"
          }}
        >
          {error}
        </p>

        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "#2874f0",
            color: "white",
            cursor: "pointer"
          }}
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        backgroundColor: "#f1f3f6",
        padding: "30px 40px",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px"
          }}
        >
          <div>
            <h1
              style={{
                margin: "0 0 8px",
                fontSize: "30px"
              }}
            >
              Admin Dashboard
            </h1>

            <p
              style={{
                margin: 0,
                color: "#666"
              }}
            >
              ShopKart administration panel
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            style={{
              padding: "11px 20px",
              border: "none",
              borderRadius: "5px",
              backgroundColor: "#2874f0",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            View Store
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "30px"
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "8px",
              boxShadow:
                "0 2px 8px rgba(0, 0, 0, 0.08)"
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                color: "#666"
              }}
            >
              Total Users
            </p>

            <h2
              style={{
                margin: 0,
                fontSize: "32px"
              }}
            >
              {stats.totalUsers}
            </h2>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "8px",
              boxShadow:
                "0 2px 8px rgba(0, 0, 0, 0.08)"
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                color: "#666"
              }}
            >
              Total Products
            </p>

            <h2
              style={{
                margin: 0,
                fontSize: "32px"
              }}
            >
              {stats.totalProducts}
            </h2>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "8px",
              boxShadow:
                "0 2px 8px rgba(0, 0, 0, 0.08)"
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                color: "#666"
              }}
            >
              Total Orders
            </p>

            <h2
              style={{
                margin: 0,
                fontSize: "32px"
              }}
            >
              {stats.totalOrders}
            </h2>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "8px",
              boxShadow:
                "0 2px 8px rgba(0, 0, 0, 0.08)"
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                color: "#666"
              }}
            >
              Total Sales
            </p>

            <h2
              style={{
                margin: 0,
                fontSize: "32px"
              }}
            >
              ₹{stats.totalSales}
            </h2>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "8px",
            boxShadow:
              "0 2px 8px rgba(0, 0, 0, 0.08)"
          }}
        >
          <h2
            style={{
              marginTop: 0
            }}
          >
            Admin Management
          </h2>

          <div
            style={{
              display: "flex",
              gap: "15px",
              flexWrap: "wrap"
            }}
          >
            <button
              onClick={() => navigate("/admin/products")}
              style={{
                padding: "12px 20px",
                border: "none",
                borderRadius: "5px",
                backgroundColor: "#2874f0",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Manage Products
            </button>

            <button
              onClick={() => navigate("/admin/users")}
              style={{
                padding: "12px 20px",
                border: "none",
                borderRadius: "5px",
                backgroundColor: "#2874f0",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Manage Users
            </button>

            <button
              onClick={() => navigate("/admin/orders")}
              style={{
                padding: "12px 20px",
                border: "none",
                borderRadius: "5px",
                backgroundColor: "#2874f0",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Manage Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;