import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h1>My Profile</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div style={{ padding: "40px" }}>
        <h1>My Profile</h1>
        <p style={{ color: "red" }}>{error}</p>
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
          maxWidth: "900px",
          margin: "0 auto"
        }}
      >
        <h1>My Profile</h1>

        {message && (
          <div
            style={{
              backgroundColor: "#e8f5e9",
              color: "#1b5e20",
              padding: "12px 15px",
              borderRadius: "5px",
              marginBottom: "15px",
              fontWeight: "bold",
              border: "1px solid #a5d6a7"
            }}
          >
            ✓ {message}
          </div>
        )}

        {error && (
          <div
            style={{
              backgroundColor: "#ffebee",
              color: "#c62828",
              padding: "12px 15px",
              borderRadius: "5px",
              marginBottom: "15px",
              fontWeight: "bold",
              border: "1px solid #ef9a9a"
            }}
          >
            ✕ {error}
          </div>
        )}

        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "8px",
            marginBottom: "20px"
          }}
        >
          <h2>Personal Information</h2>

          <p>
            <strong>Name:</strong> {user?.name}
          </p>

          <p>
            <strong>Email:</strong> {user?.email}
          </p>

          <p>
            <strong>Role:</strong> {user?.role}
          </p>
        </div>

        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "8px"
          }}
        >
          <h2>My Address</h2>

          <input
            type="text"
            name="street"
            placeholder="Street / House Address"
            value={address.street}
            onChange={handleChange}
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginBottom: "12px",
              boxSizing: "border-box"
            }}
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={address.city}
            onChange={handleChange}
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginBottom: "12px",
              boxSizing: "border-box"
            }}
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            value={address.state}
            onChange={handleChange}
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginBottom: "12px",
              boxSizing: "border-box"
            }}
          />

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={address.pincode}
            onChange={handleChange}
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              boxSizing: "border-box"
            }}
          />

          <button
            type="button"
            onClick={handleUpdateAddress}
            disabled={updating}
            style={{
              padding: "12px 25px",
              backgroundColor: updating
                ? "#999"
                : "#2874f0",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: updating
                ? "not-allowed"
                : "pointer",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            {updating
              ? "Updating..."
              : "Update Address"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;