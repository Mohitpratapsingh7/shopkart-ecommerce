import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useSearchParams
} from "react-router-dom";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [isAdmin, setIsAdmin] =
    useState(false);

  const [searchText, setSearchText] =
    useState("");

  const checkLoginStatus = () => {
    const token =
      localStorage.getItem("token");

    const storedUser =
      localStorage.getItem("user");

    setIsLoggedIn(!!token);

    if (!storedUser) {
      setIsAdmin(false);
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      setIsAdmin(user.role === "admin");
    } catch (error) {
      console.error(
        "Invalid user data:",
        error
      );

      setIsAdmin(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();

    const handleAuthChanged = () => {
      checkLoginStatus();
    };

    window.addEventListener(
      "authChanged",
      handleAuthChanged
    );

    return () => {
      window.removeEventListener(
        "authChanged",
        handleAuthChanged
      );
    };
  }, [location.pathname]);

  useEffect(() => {
    const urlSearch =
      searchParams.get("search") || "";

    setSearchText(urlSearch);
  }, [searchParams]);

  const handleSearch = (event) => {
    event.preventDefault();

    const trimmedSearch =
      searchText.trim();

    if (!trimmedSearch) {
      navigate("/products");
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(
        trimmedSearch
      )}`
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setIsAdmin(false);
    setSearchText("");

    window.dispatchEvent(
      new Event("authChanged")
    );

    navigate("/login");
  };

  return (
    <>
      <nav className="shop-navbar">

        {/* TOP NAVBAR */}

        <div className="shop-navbar-main">

          {/* LOGO */}

          <button
            className="shop-logo"
            onClick={() =>
              navigate("/")
            }
          >
            <span className="shop-logo-icon">
              🛍️
            </span>

            <span>
              ShopKart
            </span>
          </button>

          {/* SEARCH */}

          <form
            className="shop-search"
            onSubmit={handleSearch}
          >
            <span className="shop-search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search for products, brands and more"
              value={searchText}
              onChange={(event) =>
                setSearchText(
                  event.target.value
                )
              }
            />

            <button type="submit">
              Search
            </button>
          </form>

          {/* DESKTOP ACTIONS */}

          <div className="shop-navbar-actions">

            {isLoggedIn ? (
              <>
                <button
                  className="shop-nav-button"
                  onClick={() =>
                    navigate("/profile")
                  }
                >
                  <span>👤</span>
                  Profile
                </button>

                <button
                  className="shop-nav-button"
                  onClick={() =>
                    navigate("/orders")
                  }
                >
                  <span>📦</span>
                  Orders
                </button>

                <button
                  className="shop-nav-button cart-nav-button"
                  onClick={() =>
                    navigate("/cart")
                  }
                >
                  <span>🛒</span>
                  Cart
                </button>

                {isAdmin && (
                  <button
                    className="shop-nav-button admin-nav-button"
                    onClick={() =>
                      navigate("/admin")
                    }
                  >
                    <span>⚙️</span>
                    Admin
                  </button>
                )}

                <button
                  className="shop-logout-button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="shop-login-button"
                  onClick={() =>
                    navigate("/login")
                  }
                >
                  <span>👤</span>
                  Login
                </button>

                <button
                  className="shop-nav-button cart-nav-button"
                  onClick={() =>
                    navigate("/cart")
                  }
                >
                  <span>🛒</span>
                  Cart
                </button>
              </>
            )}

          </div>
        </div>

        {/* CATEGORY QUICK LINKS */}

        <div className="shop-navbar-category-bar">

          <button
            onClick={() =>
              navigate("/products")
            }
          >
            All Products
          </button>

          <button
            onClick={() =>
              navigate(
                "/products?category=Mobiles"
              )
            }
          >
            Mobiles
          </button>

          <button
            onClick={() =>
              navigate(
                "/products?category=Fashion"
              )
            }
          >
            Fashion
          </button>

          <button
            onClick={() =>
              navigate(
                "/products?category=Electronics"
              )
            }
          >
            Electronics
          </button>

          <button
            onClick={() =>
              navigate(
                "/products?category=Home"
              )
            }
          >
            Home
          </button>

          <button
            onClick={() =>
              navigate(
                "/products?category=Appliances"
              )
            }
          >
            Appliances
          </button>

          <button
            onClick={() =>
              navigate(
                "/products?category=Beauty"
              )
            }
          >
            Beauty
          </button>

          <button
            onClick={() =>
              navigate(
                "/products?category=Grocery"
              )
            }
          >
            Grocery
          </button>

          <span className="navbar-offer">
            🔥 Best Deals
          </span>

        </div>
      </nav>
    </>
  );
}

export default Navbar;