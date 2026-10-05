import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        name,
        email,
        password
      });

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-layout">

        {/* Left promotional section */}
        <div className="register-promo">

          <div className="register-promo-content">

            <div className="register-logo">
              🛍️
            </div>

            <span className="register-eyebrow">
              JOIN SHOPKART
            </span>

            <h1>
              Start Your
              <br />
              Shopping Journey
            </h1>

            <p>
              Create your ShopKart account and
              enjoy a simple, secure and
              personalized shopping experience.
            </p>

            <div className="register-benefits">

              <div>
                <span>✓</span>
                <strong>
                  Thousands of products
                </strong>
              </div>

              <div>
                <span>✓</span>
                <strong>
                  Easy order tracking
                </strong>
              </div>

              <div>
                <span>✓</span>
                <strong>
                  Secure account
                </strong>
              </div>

            </div>

          </div>

          <div className="register-shopping-icon">
            🛒
          </div>

        </div>

        {/* Register card */}
        <div className="register-card">

          <div className="register-header">

            <div className="register-icon">
              👤
            </div>

            <div>
              <span className="register-kicker">
                CREATE ACCOUNT
              </span>

              <h2>
                Create Account
              </h2>

              <p>
                Join ShopKart and start shopping.
              </p>
            </div>

          </div>

          {error && (
            <div className="register-alert error">
              <span>!</span>

              <div>
                <strong>
                  Registration unsuccessful
                </strong>

                <p>{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="register-alert success">
              <span>✓</span>

              <div>
                <strong>
                  Account created
                </strong>

                <p>{success}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleRegister}>

            <div className="register-field">

              <label>Full Name</label>

              <div className="register-input-wrapper">
                <span>👤</span>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  required
                  autoComplete="name"
                />
              </div>

            </div>

            <div className="register-field">

              <label>Email Address</label>

              <div className="register-input-wrapper">
                <span>✉️</span>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                  autoComplete="email"
                />
              </div>

            </div>

            <div className="register-fields-row">

              <div className="register-field">

                <label>Password</label>

                <div className="register-input-wrapper">
                  <span>🔒</span>

                  <input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>

              </div>

              <div className="register-field">

                <label>Confirm Password</label>

                <div className="register-input-wrapper">
                  <span>🔐</span>

                  <input
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    required
                    autoComplete="new-password"
                  />
                </div>

              </div>

            </div>

            <div className="password-note">
              <span>🛡️</span>
              Password must contain at least
              6 characters.
            </div>

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="register-spinner"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  Create My Account →
                </>
              )}
            </button>

          </form>

          <div className="register-divider">
            <span>ALREADY A MEMBER?</span>
          </div>

          <div className="register-login-box">

            <div>
              <strong>
                Already have an account?
              </strong>

              <span>
                Login and continue shopping.
              </span>
            </div>

            <Link to="/login">
              Login
            </Link>

          </div>

          <div className="register-security">
            🔐 Your information is protected
            and secure.
          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;