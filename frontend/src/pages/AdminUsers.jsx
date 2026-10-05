import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminUsers.css";

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");

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

  const filteredUsers = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    if (!search) {
      return users;
    }

    return users.filter((user) =>
      [
        user.name,
        user.email,
        user.role,
        user._id
      ]
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [users, searchText]);

  const adminCount = users.filter(
    (user) => user.role === "admin"
  ).length;

  const customerCount = users.filter(
    (user) => user.role === "user"
  ).length;

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="admin-users-loading">
        <div className="admin-users-spinner"></div>

        <h2>Loading Customers...</h2>

        <p>
          Fetching your ShopKart user database.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-users-page">
      <div className="admin-users-container">

        {/* Header */}
        <section className="admin-users-header">

          <div className="admin-users-heading">
            <div className="admin-users-icon">
              👥
            </div>

            <div>
              <span className="admin-users-eyebrow">
                SHOPKART ADMINISTRATION
              </span>

              <h1>User Management</h1>

              <p>
                View customers and manage account roles
                from one secure dashboard.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="admin-users-dashboard-btn"
            onClick={() => navigate("/admin")}
          >
            ← Dashboard
          </button>

        </section>

        {/* Alerts */}
        {message && (
          <div className="admin-users-alert success">
            <span>✓</span>
            {message}
          </div>
        )}

        {error && (
          <div className="admin-users-alert error">
            <span>!</span>
            {error}
          </div>
        )}

        {/* Statistics */}
        <section className="admin-users-stats">

          <div className="admin-user-stat-card">
            <div className="admin-user-stat-icon blue">
              👥
            </div>

            <div>
              <span>Total Users</span>

              <strong>
                {users.length}
              </strong>

              <small>
                Registered accounts
              </small>
            </div>
          </div>

          <div className="admin-user-stat-card">
            <div className="admin-user-stat-icon green">
              👤
            </div>

            <div>
              <span>Customers</span>

              <strong>
                {customerCount}
              </strong>

              <small>
                Standard user accounts
              </small>
            </div>
          </div>

          <div className="admin-user-stat-card">
            <div className="admin-user-stat-icon purple">
              🛡️
            </div>

            <div>
              <span>Administrators</span>

              <strong>
                {adminCount}
              </strong>

              <small>
                Admin accounts
              </small>
            </div>
          </div>

        </section>

        {/* Main panel */}
        <section className="admin-users-panel">

          <div className="admin-users-panel-header">

            <div>
              <span className="section-eyebrow">
                CUSTOMER DATABASE
              </span>

              <h2>All Users</h2>

              <p>
                Manage registered ShopKart accounts
                and their access levels.
              </p>
            </div>

            <div className="user-count-badge">
              {filteredUsers.length} Users
            </div>

          </div>

          {/* Search */}
          <div className="admin-users-search">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search by name, email, role or user ID..."
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
            />

            {searchText && (
              <button
                type="button"
                onClick={() => setSearchText("")}
              >
                ×
              </button>
            )}

          </div>

          {users.length === 0 ? (
            <div className="admin-users-empty">

              <div className="empty-users-icon">
                👥
              </div>

              <h3>No Users Found</h3>

              <p>
                Registered customers will appear here.
              </p>

            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="admin-users-empty">

              <div className="empty-users-icon">
                🔎
              </div>

              <h3>No Matching Users</h3>

              <p>
                Try searching with another name or
                email address.
              </p>

            </div>
          ) : (
            <div className="admin-users-list">

              {filteredUsers.map((user) => (
                <article
                  className="admin-user-card"
                  key={user._id}
                >

                  {/* User identity */}
                  <div className="admin-user-identity">

                    <div
                      className={`admin-user-avatar ${
                        user.role === "admin"
                          ? "admin-avatar"
                          : ""
                      }`}
                    >
                      {getInitials(user.name)}
                    </div>

                    <div className="admin-user-main">

                      <div className="admin-user-name-row">
                        <h3>
                          {user.name}
                        </h3>

                        <span
                          className={`role-badge ${
                            user.role === "admin"
                              ? "admin-role"
                              : "user-role"
                          }`}
                        >
                          {user.role === "admin"
                            ? "🛡️ Admin"
                            : "👤 Customer"}
                        </span>
                      </div>

                      <p className="admin-user-email">
                        {user.email}
                      </p>

                      <p className="admin-user-id">
                        ID: {user._id}
                      </p>

                    </div>

                  </div>

                  {/* Role management */}
                  <div className="admin-user-actions">

                    <label>
                      ACCOUNT ROLE
                    </label>

                    <div className="role-select-wrapper">

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
                      >
                        <option value="user">
                          Customer
                        </option>

                        <option value="admin">
                          Administrator
                        </option>
                      </select>

                      <span>
                        ▾
                      </span>

                    </div>

                    {updatingId === user._id && (
                      <small className="role-updating">
                        Updating role...
                      </small>
                    )}

                  </div>

                </article>
              ))}

            </div>
          )}

        </section>

        {/* Security note */}
        <div className="admin-users-security">

          <div className="security-icon">
            🔐
          </div>

          <div>
            <strong>
              Role-based access control
            </strong>

            <p>
              Only administrators can change account
              roles. Customer accounts cannot access
              the administration panel.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminUsers;