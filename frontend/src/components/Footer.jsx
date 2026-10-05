import { useNavigate } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="site-footer">

      <div className="footer-main">

        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            🛍️ ShopKart
          </div>

          <p>
            Your trusted destination for great
            products, amazing deals and a simple
            shopping experience.
          </p>

          <div className="footer-trust">
            <span>✓ Secure Shopping</span>
            <span>✓ Fast Delivery</span>
            <span>✓ Easy Returns</span>
          </div>
        </div>

        {/* Shop */}
        <div className="footer-column">
          <h3>Shop</h3>

          <button onClick={() => navigate("/products")}>
            All Products
          </button>

          <button
            onClick={() =>
              navigate("/products?category=Mobiles")
            }
          >
            Mobiles
          </button>

          <button
            onClick={() =>
              navigate("/products?category=Fashion")
            }
          >
            Fashion
          </button>

          <button
            onClick={() =>
              navigate("/products?category=Electronics")
            }
          >
            Electronics
          </button>
        </div>

        {/* Account */}
        <div className="footer-column">
          <h3>Account</h3>

          <button onClick={() => navigate("/profile")}>
            My Profile
          </button>

          <button onClick={() => navigate("/orders")}>
            My Orders
          </button>

          <button onClick={() => navigate("/cart")}>
            Shopping Cart
          </button>

          <button onClick={() => navigate("/login")}>
            Login
          </button>
        </div>

        {/* Help */}
        <div className="footer-column">
          <h3>Support</h3>

          <button onClick={() => navigate("/products")}>
            Help Center
          </button>

          <button onClick={() => navigate("/products")}>
            Shipping
          </button>

          <button onClick={() => navigate("/products")}>
            Returns
          </button>

          <button onClick={() => navigate("/products")}>
            Contact Us
          </button>
        </div>

      </div>

      <div className="footer-bottom">

        <div>
          © {new Date().getFullYear()} ShopKart.
          All rights reserved.
        </div>

        <div className="footer-bottom-links">
          <span>Privacy Policy</span>
          <span>Terms & Conditions</span>
          <span>Secure Payments</span>
        </div>

      </div>

    </footer>
  );
}

export default Footer;