import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get("/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const profileUser = response.data.user;

        setUser(profileUser);

        setAddress({
          street: profileUser.address?.street || "",
          city: profileUser.address?.city || "",
          state: profileUser.address?.state || "",
          pincode: profileUser.address?.pincode || ""
        });
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Profile load nahi ho paya."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (event) => {
    setAddress({
      ...address,
      [event.target.name]: event.target.value
    });

    setMessage("");
    setError("");
  };

  const handleUpdateAddress = async () => {
    setMessage("");
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (
      !address.street.trim() ||
      !address.city.trim() ||
      !address.state.trim() ||
      !address.pincode.trim()
    ) {
      setError("Please fill all address fields.");
      return;
    }

    if (!/^\d{6}$/.test(address.pincode.trim())) {
      setError("Pincode must be exactly 6 digits.");
      return;
    }

    try {
      setUpdating(true);

      const response = await api.put(
        "/users/address",
        address,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(
        response.data.message ||
          "Address updated successfully."
      );

      setUser((previousUser) => ({
        ...previousUser,
        address: { ...address }
      }));
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Address update nahi ho paya."
      );
    } finally {
      setUpdating(false);
    }
  };

  const getInitials = () => {
    if (!user?.name) {
      return "U";
    }

    return user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loader"></div>

        <h2>Loading Profile</h2>

        <p>Please wait...</p>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="profile-error-page">
        <div className="profile-error-icon">
          ⚠️
        </div>

        <h2>Unable to load profile</h2>

        <p>{error}</p>

        <button
          type="button"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="profile-page">

      {/* Profile Hero */}
      <section className="profile-hero">

        <div className="profile-hero-content">

          <div className="profile-avatar-large">
            {getInitials()}
          </div>

          <div>
            <span className="profile-eyebrow">
              SHOPKART ACCOUNT
            </span>

            <h1>
              Welcome, {user?.name}
            </h1>

            <p>
              Manage your account information and
              delivery address.
            </p>
          </div>

        </div>

        <div className="profile-hero-icon">
          👤
        </div>

      </section>

      {/* Messages */}
      {message && (
        <div className="profile-alert success">
          <span>✓</span>
          <div>
            <strong>Success</strong>
            <p>{message}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="profile-alert error">
          <span>!</span>
          <div>
            <strong>Something went wrong</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="profile-layout">

        {/* Left Column */}
        <div className="profile-main-column">

          {/* Personal Information */}
          <section className="profile-card">

            <div className="card-header">

              <div className="card-icon blue">
                👤
              </div>

              <div>
                <h2>Personal Information</h2>

                <p>
                  Your registered account details
                </p>
              </div>

            </div>

            <div className="personal-profile">

              <div className="profile-mini-avatar">
                {getInitials()}
              </div>

              <div className="personal-details">

                <div className="detail-item">
                  <span className="detail-label">
                    Full Name
                  </span>

                  <strong>
                    {user?.name}
                  </strong>
                </div>

                <div className="detail-item">
                  <span className="detail-label">
                    Email Address
                  </span>

                  <strong>
                    {user?.email}
                  </strong>
                </div>

                <div className="detail-item">
                  <span className="detail-label">
                    Account Type
                  </span>

                  <span
                    className={
                      user?.role === "admin"
                        ? "role-badge admin"
                        : "role-badge user"
                    }
                  >
                    {user?.role === "admin"
                      ? "★ Administrator"
                      : "● Customer"}
                  </span>
                </div>

              </div>

            </div>

          </section>

          {/* Address */}
          <section className="profile-card">

            <div className="card-header">

              <div className="card-icon orange">
                📍
              </div>

              <div>
                <h2>Delivery Address</h2>

                <p>
                  This address will be used during
                  checkout.
                </p>
              </div>

            </div>

            <div className="address-form">

              <div className="form-field full">
                <label>
                  Street / House Address
                </label>

                <div className="input-wrapper">
                  <span>🏠</span>

                  <input
                    type="text"
                    name="street"
                    placeholder="Enter your street or house address"
                    value={address.street}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="address-fields-row">

                <div className="form-field">
                  <label>City</label>

                  <div className="input-wrapper">
                    <span>🏙️</span>

                    <input
                      type="text"
                      name="city"
                      placeholder="Enter city"
                      value={address.city}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>State</label>

                  <div className="input-wrapper">
                    <span>📌</span>

                    <input
                      type="text"
                      name="state"
                      placeholder="Enter state"
                      value={address.state}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Pincode</label>

                  <div className="input-wrapper">
                    <span>🔢</span>

                    <input
                      type="text"
                      name="pincode"
                      placeholder="6-digit pincode"
                      value={address.pincode}
                      onChange={handleChange}
                      maxLength="6"
                      inputMode="numeric"
                    />
                  </div>
                </div>

              </div>

              <div className="address-save-row">

                <div className="address-security">
                  <span>🔒</span>

                  <div>
                    <strong>
                      Your information is secure
                    </strong>

                    <small>
                      Your address is only used for
                      order delivery.
                    </small>
                  </div>
                </div>

                <button
                  type="button"
                  className="save-address-button"
                  onClick={handleUpdateAddress}
                  disabled={updating}
                >
                  {updating
                    ? "Saving..."
                    : "✓ Save Address"}
                </button>

              </div>

            </div>

          </section>

        </div>

        {/* Right Column */}
        <aside className="profile-sidebar">

          {/* Quick Actions */}
          <section className="profile-card quick-actions-card">

            <div className="sidebar-title">
              <span>⚡</span>
              <h2>Quick Actions</h2>
            </div>

            <button
              type="button"
              onClick={() => navigate("/orders")}
            >
              <span className="quick-icon blue-bg">
                📦
              </span>

              <span className="quick-text">
                <strong>My Orders</strong>
                <small>
                  Track your purchases
                </small>
              </span>

              <span className="arrow">
                →
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/cart")}
            >
              <span className="quick-icon green-bg">
                🛒
              </span>

              <span className="quick-text">
                <strong>My Cart</strong>
                <small>
                  View your shopping cart
                </small>
              </span>

              <span className="arrow">
                →
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/products")}
            >
              <span className="quick-icon orange-bg">
                🛍️
              </span>

              <span className="quick-text">
                <strong>Continue Shopping</strong>
                <small>
                  Explore more products
                </small>
              </span>

              <span className="arrow">
                →
              </span>
            </button>

          </section>

          {/* Security */}
          <section className="security-card">

            <div className="security-icon">
              🛡️
            </div>

            <h3>
              Safe & Secure Shopping
            </h3>

            <p>
              Your account information and
              shopping data are protected.
            </p>

            <div className="security-points">

              <span>
                ✓ Secure account
              </span>

              <span>
                ✓ Protected information
              </span>

              <span>
                ✓ Trusted shopping
              </span>

            </div>

          </section>

        </aside>

      </div>

    </div>
  );
}

export default Profile;