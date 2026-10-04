import { useNavigate } from "react-router-dom";

function AdminLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChanged"));

    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "calc(100vh - 70px)",
        backgroundColor: "#f1f3f6"
      }}
    >
      {/* Admin Sidebar */}
      <aside
        style={{
          width: "245px",
          backgroundColor: "#ffffff",
          borderRight: "1px solid #ddd",
          padding: "25px 16px",
          boxSizing: "border-box",
          flexShrink: 0
        }}
      >
        <h2
          style={{
            margin: "0 0 25px",
            textAlign: "center"
          }}
        >
          Admin Panel
        </h2>

        <button
          type="button"
          onClick={() => navigate("/admin")}
          style={sidebarButtonStyle}
        >
          Dashboard
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          style={sidebarButtonStyle}
        >
          Products
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/users")}
          style={sidebarButtonStyle}
        >
          Users
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/orders")}
          style={sidebarButtonStyle}
        >
          Orders
        </button>

        <hr
          style={{
            margin: "25px 0",
            border: "none",
            borderTop: "1px solid #ddd"
          }}
        />

        <button
          type="button"
          onClick={() => navigate("/")}
          style={{
            ...sidebarButtonStyle,
            backgroundColor: "white",
            color: "#2874f0",
            border: "1px solid #2874f0"
          }}
        >
          View Store
        </button>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            ...sidebarButtonStyle,
            backgroundColor: "#e53935",
            color: "white"
          }}
        >
          Logout
        </button>
      </aside>

      {/* Admin Page Content */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding: "30px",
          boxSizing: "border-box"
        }}
      >
        {children}
      </main>
    </div>
  );
}

const sidebarButtonStyle = {
  display: "block",
  width: "100%",
  padding: "13px 15px",
  marginBottom: "8px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "white",
  color: "#222",
  textAlign: "left",
  fontSize: "16px",
  cursor: "pointer"
};

export default AdminLayout;