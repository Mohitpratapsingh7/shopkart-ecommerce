import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password
      });

      const { token, user } = response.data;

      // Save login information
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Tell Navbar that login state changed
      window.dispatchEvent(new Event("authChanged"));

      // Admin goes to Admin Dashboard
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        backgroundColor: "#f1f3f6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
          boxSizing: "border-box"
        }}
      >
        <h1
          style={{
            marginTop: 0,
            marginBottom: "25px",
            textAlign: "center"
          }}
        >
          Login
        </h1>

        {error && (
          <div
            style={{
              backgroundColor: "#ffebee",
              color: "#c62828",
              padding: "12px",
              borderRadius: "5px",
              marginBottom: "15px"
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label>
            <strong>Email</strong>
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
            style={inputStyle}
          />

          <label>
            <strong>Password</strong>
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "5px",
              backgroundColor: loading
                ? "#999"
                : "#2874f0",
              color: "white",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              fontWeight: "bold",
              fontSize: "16px",
              marginTop: "10px"
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  marginTop: "7px",
  marginBottom: "18px",
  boxSizing: "border-box",
  border: "1px solid #ccc",
  borderRadius: "5px",
  fontSize: "15px"
};

export default Login;