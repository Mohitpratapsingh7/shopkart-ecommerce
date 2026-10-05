import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

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

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      window.dispatchEvent(
        new Event("authChanged")
      );

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
    <div className="login-page">

      <div className="login-layout">

        {/* Left Promotional Panel */}
        <div className="login-promo">

          <div className="promo-content">

            <div className="promo-logo">
              🛍️
            </div>

            <span className="promo-eyebrow">
              WELCOME TO SHOPKART
            </span>

            <h1>
              Your Shopping
              <br />
              Journey Starts Here
            </h1>

            <p>
              Sign in to access your orders,
              saved address, cart and personalized
              shopping experience.
            </p>

            <div className="promo-benefits">

              <div>
                <span>✓</span>
                <strong>
                  Easy & Secure Shopping
                </strong>
              </div>

              <div>
                <span>✓</span>
                <strong>
                  Track Your Orders
                </strong>
              </div>

              <div>
                <span>✓</span>
                <strong>
                  Exclusive Deals
                </strong>
              </div>

            </div>

          </div>

          <div className="promo-shopping-icon">
            🛒
          </div>

        </div>

        {/* Login Card */}
        <div className="login-card">

          <div className="login-header">

            <div className="login-icon">
              👤
            </div>

            <div>
              <span className="login-kicker">
                ACCOUNT ACCESS
              </span>

              <h2>Welcome Back!</h2>

              <p>
                Login to continue shopping.
              </p>
            </div>

          </div>

          {error && (
            <div className="login-error">
              <span>!</span>

              <div>
                <strong>
                  Login unsuccessful
                </strong>

                <p>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin}>

            <div className="login-field">

              <label>Email Address</label>

              <div className="login-input-wrapper">
                <span>✉️</span>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  required
                  autoComplete="email"
                />
              </div>

            </div>

            <div className="login-field">

              <label>Password</label>

              <div className="login-input-wrapper">
                <span>🔒</span>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  required
                  autoComplete="current-password"
                />
              </div>

            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  Logging in...
                </>
              ) : (
                <>
                  Login to ShopKart →
                </>
              )}
            </button>

          </form>

          <div className="login-divider">
            <span>OR</span>
          </div>

          <div className="create-account-box">

            <div>
              <strong>
                New to ShopKart?
              </strong>

              <span>
                Create your account in seconds.
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/register")
              }
            >
              Create Account
            </button>

          </div>

          <div className="login-security">
            🔐 Your account information is
            protected and secure.
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;