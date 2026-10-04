import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
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

        const response = await api.get("/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUsers(response.data.users || []);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Users load nahi ho paye."
        );
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [navigate]);

  const handleRoleChange = async (userId, newRole) => {
    setMessage("");
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setUpdatingId(userId);

      const response = await api.put(
        `/admin/users/${userId}/role`,
        {
          role: newRole
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                role: response.data.user.role
              }
            : user
        )
      );

      setMessage(
        response.data.message ||
          "User role updated successfully."
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "User role update nahi ho paya."
      );
    } finally {
      setUpdatingId(null);
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
        <h1>Admin Users</h1>
        <p>Loading users...</p>
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px"
          }}
        >
          <h1>Admin Users</h1>

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

        {message && (
          <div
            style={{
              backgroundColor: "#e8f5e9",
              color: "#1b5e20",
              padding: "12px 15px",
              borderRadius: "5px",
              marginBottom: "15px"
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              backgroundColor: "#ffebee",
              color: "#c62828",
              padding: "12px 15px",
              borderRadius: "5px",
              marginBottom: "15px"
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "8px"
          }}
        >
          <h2>All Users</h2>

          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px"
              }}
            >
              {users.map((user) => (
                <div
                  key={user._id}
                  style={{
                    padding: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "20px"
                  }}
                >
                  <div>
                    <h3 style={{ marginTop: 0 }}>
                      {user.name}
                    </h3>

                    <p>
                      <strong>Email:</strong>{" "}
                      {user.email}
                    </p>

                    <p>
                      <strong>User ID:</strong>{" "}
                      {user._id}
                    </p>

                    <p>
                      <strong>Role:</strong>{" "}
                      {user.role}
                    </p>
                  </div>

                  <div>
                    <label>
                      <strong>Change Role:</strong>
                    </label>

                    <br />

                    <select
                      value={user.role}
                      disabled={
                        updatingId === user._id
                      }
                      onChange={(event) =>
                        handleRoleChange(
                          user._id,
                          event.target.value
                        )
                      }
                      style={{
                        marginTop: "8px",
                        padding: "10px",
                        minWidth: "130px"
                      }}
                    >
                      <option value="user">
                        User
                      </option>

                      <option value="admin">
                        Admin
                      </option>
                    </select>

                    {updatingId === user._id && (
                      <p>Updating...</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;