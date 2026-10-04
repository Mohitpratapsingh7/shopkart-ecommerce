import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart, getProducts } from "../services/api";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    {
      name: "Mobiles",
      icon: "📱",
      color: "blue",
      subtitle: "Latest smartphones"
    },
    {
      name: "Fashion",
      icon: "👕",
      color: "pink",
      subtitle: "Style for everyone"
    },
    {
      name: "Electronics",
      icon: "🎧",
      color: "purple",
      subtitle: "Smart gadgets"
    },
    {
      name: "Home",
      icon: "🏠",
      color: "orange",
      subtitle: "Make it beautiful"
    },
    {
      name: "Appliances",
      icon: "🖥️",
      color: "green",
      subtitle: "Upgrade your home"
    },
    {
      name: "Beauty",
      icon: "💄",
      color: "red",
      subtitle: "Beauty essentials"
    },
    {
      name: "Grocery",
      icon: "🛒",
      color: "yellow",
      subtitle: "Daily essentials"
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts();

        setProducts(response.products || []);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Products load nahi ho pa rahe."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    try {
      await addToCart(productId, 1, token);

      alert("Product added to cart successfully.");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Product cart mein add nahi ho paya."
      );
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(
      `/products?category=${encodeURIComponent(
        categoryName
      )}`
    );
  };

  const getDiscountedPrice = (product) => {
    return Math.round(
      product.price -
        (product.price * product.discount) / 100
    );
  };

  const topDeals = useMemo(() => {
    return [...products]
      .sort(
        (a, b) =>
          Number(b.discount || 0) -
          Number(a.discount || 0)
      )
      .slice(0, 4);
  }, [products]);

  const trendingProducts = useMemo(() => {
    return [...products]
      .sort(
        (a, b) =>
          Number(b.rating || 0) -
          Number(a.rating || 0)
      )
      .slice(0, 4);
  }, [products]);

  const featuredProducts = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  const getCategoryProducts = (categoryName) => {
    return products
      .filter(
        (product) =>
          product.category === categoryName
      )
      .slice(0, 4);
  };

  const ProductCard = ({ product }) => {
    const discountedPrice =
      getDiscountedPrice(product);

    return (
      <div className="home-product-card">
        <div
          className="home-product-image"
          onClick={() =>
            navigate(`/product/${product._id}`)
          }
        >
          {product.discount > 0 && (
            <span className="home-discount-badge">
              {product.discount}% OFF
            </span>
          )}

          <img
            src={
              product.images &&
              product.images.length > 0
                ? product.images[0]
                : "https://placehold.co/500x500?text=Product"
            }
            alt={product.name}
            onError={(event) => {
              event.currentTarget.src =
                "https://placehold.co/500x500?text=Product";
            }}
          />
        </div>

        <div className="home-product-info">
          <p className="home-product-brand">
            {product.brand}
          </p>

          <h3
            onClick={() =>
              navigate(`/product/${product._id}`)
            }
            title={product.name}
          >
            {product.name}
          </h3>

          <div className="home-rating-row">
            <span className="home-rating">
              ⭐ {product.rating || 0}
            </span>

            <span className="home-stock">
              {product.stock > 0
                ? "In Stock"
                : "Out of Stock"}
            </span>
          </div>

          <div className="home-price-row">
            <span className="home-product-price">
              ₹{discountedPrice}
            </span>

            {product.discount > 0 && (
              <span className="home-original-price">
                ₹{product.price}
              </span>
            )}
          </div>

          {product.discount > 0 && (
            <p className="home-save-text">
              Save ₹
              {Math.round(
                product.price -
                  discountedPrice
              )}
            </p>
          )}

          <button
            className="home-add-cart-button"
            disabled={product.stock <= 0}
            onClick={(event) => {
              event.stopPropagation();

              if (product.stock > 0) {
                handleAddToCart(product._id);
              }
            }}
          >
            {product.stock > 0
              ? "Add to Cart"
              : "Out of Stock"}
          </button>
        </div>
      </div>
    );
  };

  const ProductSection = ({
    title,
    subtitle,
    productsToShow,
    sectionClass = ""
  }) => {
    return (
      <section
        className={`home-product-section ${sectionClass}`}
      >
        <div className="home-section-heading">
          <div>
            <span className="home-section-label">
              SHOPKART
            </span>

            <h2>{title}</h2>

            <p>{subtitle}</p>
          </div>

          <button
            className="home-view-all"
            onClick={() =>
              navigate("/products")
            }
          >
            View All →
          </button>
        </div>

        {productsToShow.length > 0 ? (
          <div className="home-products-grid">
            {productsToShow.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="home-empty-section">
            <p>
              Products coming soon in this
              section.
            </p>

            <button
              onClick={() =>
                navigate("/products")
              }
            >
              Browse Products
            </button>
          </div>
        )}
      </section>
    );
  };

  if (loading) {
    return (
      <div className="home-loading">
        <div className="home-loader">🛍️</div>

        <h2>Loading ShopKart...</h2>

        <p>
          Getting the best products for you.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-error-page">
        <div className="home-error-box">
          <div className="home-error-icon">
            ⚠️
          </div>

          <h2>Unable to Load Products</h2>

          <p>{error}</p>

          <button
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const heroProduct = products[0];
  const heroProductTwo = products[1];

  return (
    <div className="home-page">

      {/* =========================
          CATEGORY NAVIGATION
      ========================== */}

      <section className="home-category-strip">
        <div className="home-category-container">
          {categories.map((category) => {
            const count = products.filter(
              (product) =>
                product.category ===
                category.name
            ).length;

            return (
              <button
                key={category.name}
                className="home-category-item"
                onClick={() =>
                  handleCategoryClick(
                    category.name
                  )
                }
              >
                <div
                  className={`home-category-icon ${category.color}`}
                >
                  {category.icon}
                </div>

                <strong>{category.name}</strong>

                <span>
                  {count} products
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* =========================
          HERO
      ========================== */}

      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-hero-tag">
            🔥 BIG SHOPPING DAYS
          </span>

          <h1>
            Great Deals.
            <br />
            <span>Great Choices.</span>
          </h1>

          <p>
            Discover mobiles, electronics,
            fashion, home essentials and
            much more at amazing prices.
          </p>

          <div className="home-hero-buttons">
            <button
              className="home-primary-button"
              onClick={() =>
                navigate("/products")
              }
            >
              Shop Now →
            </button>

            <button
              className="home-secondary-button"
              onClick={() =>
                navigate(
                  "/products?category=Electronics"
                )
              }
            >
              Explore Electronics
            </button>
          </div>

          <div className="home-hero-features">
            <span>✓ Best Prices</span>
            <span>✓ Quality Products</span>
            <span>✓ Secure Shopping</span>
          </div>
        </div>

        <div className="home-hero-visual">
          <div className="home-hero-glow"></div>

          {heroProduct && (
            <div className="home-hero-product hero-product-one">
              <img
                src={
                  heroProduct.images?.[0] ||
                  "https://placehold.co/500x500?text=Product"
                }
                alt={heroProduct.name}
              />
            </div>
          )}

          {heroProductTwo && (
            <div className="home-hero-product hero-product-two">
              <img
                src={
                  heroProductTwo.images?.[0] ||
                  "https://placehold.co/500x500?text=Product"
                }
                alt={heroProductTwo.name}
              />
            </div>
          )}

          <div className="home-floating-offer">
            <strong>UP TO</strong>
            <span>70%</span>
            <small>OFF</small>
          </div>
        </div>
      </section>

      {/* =========================
          QUICK BENEFITS
      ========================== */}

      <section className="home-benefit-strip">
        <div className="home-benefit">
          <span>🚚</span>

          <div>
            <strong>Fast Delivery</strong>
            <p>Quick & safe delivery</p>
          </div>
        </div>

        <div className="home-benefit">
          <span>💳</span>

          <div>
            <strong>Secure Payments</strong>
            <p>Safe checkout experience</p>
          </div>
        </div>

        <div className="home-benefit">
          <span>💰</span>

          <div>
            <strong>Best Prices</strong>
            <p>Great deals every day</p>
          </div>
        </div>

        <div className="home-benefit">
          <span>⭐</span>

          <div>
            <strong>Quality Products</strong>
            <p>Carefully selected products</p>
          </div>
        </div>
      </section>

      {/* =========================
          CATEGORIES
      ========================== */}

      <section className="home-main-section">
        <div className="home-section-heading">
          <div>
            <span className="home-section-label">
              EXPLORE
            </span>

            <h2>Shop by Category</h2>

            <p>
              Everything you need, all in one
              place.
            </p>
          </div>

          <button
            className="home-view-all"
            onClick={() =>
              navigate("/products")
            }
          >
            View All →
          </button>
        </div>

        <div className="home-category-cards">
          {categories.map((category) => {
            const categoryProducts =
              getCategoryProducts(
                category.name
              );

            const categoryImage =
              categoryProducts[0]?.images?.[0];

            return (
              <div
                key={category.name}
                className={`home-large-category ${category.color}`}
                onClick={() =>
                  handleCategoryClick(
                    category.name
                  )
                }
              >
                <div className="home-large-category-text">
                  <span>
                    {category.icon}
                  </span>

                  <h3>{category.name}</h3>

                  <p>
                    {category.subtitle}
                  </p>

                  <strong>
                    Shop Now →
                  </strong>
                </div>

                <div className="home-large-category-image">
                  {categoryImage ? (
                    <img
                      src={categoryImage}
                      alt={category.name}
                    />
                  ) : (
                    <span>
                      {category.icon}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================
          TOP DEALS
      ========================== */}

      <ProductSection
        title="Top Deals of the Day"
        subtitle="Grab the biggest discounts before they are gone."
        productsToShow={topDeals}
        sectionClass="home-deals-section"
      />

      {/* =========================
          TRENDING
      ========================== */}

      <ProductSection
        title="Trending Products"
        subtitle="Popular picks customers are loving right now."
        productsToShow={trendingProducts}
        sectionClass="home-trending-section"
      />

      {/* =========================
          MOBILES
      ========================== */}

      <ProductSection
        title="Best of Mobiles"
        subtitle="Upgrade your smartphone experience."
        productsToShow={getCategoryProducts(
          "Mobiles"
        )}
        sectionClass="home-blue-section"
      />

      {/* =========================
          ELECTRONICS
      ========================== */}

      <ProductSection
        title="Electronics & Gadgets"
        subtitle="Smart technology for your everyday life."
        productsToShow={getCategoryProducts(
          "Electronics"
        )}
        sectionClass="home-purple-section"
      />

      {/* =========================
          FASHION
      ========================== */}

      <ProductSection
        title="Fashion for Everyone"
        subtitle="Refresh your wardrobe with stylish picks."
        productsToShow={getCategoryProducts(
          "Fashion"
        )}
        sectionClass="home-pink-section"
      />

      {/* =========================
          HOME + APPLIANCES
      ========================== */}

      <section className="home-combined-section">
        <div className="home-section-heading">
          <div>
            <span className="home-section-label">
              HOME ESSENTIALS
            </span>

            <h2>
              Upgrade Your Home
            </h2>

            <p>
              Useful products for a smarter
              and more comfortable home.
            </p>
          </div>

          <button
            className="home-view-all"
            onClick={() =>
              navigate(
                "/products?category=Home"
              )
            }
          >
            Explore Home →
          </button>
        </div>

        <div className="home-two-column">
          <div className="home-mini-section">
            <div className="home-mini-heading">
              <h3>🏠 Home Essentials</h3>

              <button
                onClick={() =>
                  handleCategoryClick(
                    "Home"
                  )
                }
              >
                View All →
              </button>
            </div>

            <div className="home-mini-products">
              {getCategoryProducts(
                "Home"
              ).slice(0, 4).map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          </div>

          <div className="home-mini-section">
            <div className="home-mini-heading">
              <h3>🖥️ Appliances</h3>

              <button
                onClick={() =>
                  handleCategoryClick(
                    "Appliances"
                  )
                }
              >
                View All →
              </button>
            </div>

            <div className="home-mini-products">
              {getCategoryProducts(
                "Appliances"
              ).slice(0, 4).map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          BEAUTY + GROCERY
      ========================== */}

      <section className="home-lifestyle-section">
        <div className="home-section-heading">
          <div>
            <span className="home-section-label">
              DAILY NEEDS
            </span>

            <h2>
              Beauty & Grocery
            </h2>

            <p>
              Everyday essentials at attractive
              prices.
            </p>
          </div>
        </div>

        <div className="home-two-column">
          <div className="home-lifestyle-card beauty-card">
            <div>
              <span className="lifestyle-icon">
                💄
              </span>

              <h3>Beauty Essentials</h3>

              <p>
                Skincare, haircare and
                fragrances.
              </p>

              <button
                onClick={() =>
                  handleCategoryClick(
                    "Beauty"
                  )
                }
              >
                Shop Beauty →
              </button>
            </div>

            <div className="lifestyle-products">
              {getCategoryProducts(
                "Beauty"
              )
                .slice(0, 2)
                .map((product) => (
                  <img
                    key={product._id}
                    src={
                      product.images?.[0]
                    }
                    alt={product.name}
                  />
                ))}
            </div>
          </div>

          <div className="home-lifestyle-card grocery-card">
            <div>
              <span className="lifestyle-icon">
                🛒
              </span>

              <h3>Grocery Essentials</h3>

              <p>
                Daily household essentials
                delivered easily.
              </p>

              <button
                onClick={() =>
                  handleCategoryClick(
                    "Grocery"
                  )
                }
              >
                Shop Grocery →
              </button>
            </div>

            <div className="lifestyle-products">
              {getCategoryProducts(
                "Grocery"
              )
                .slice(0, 2)
                .map((product) => (
                  <img
                    key={product._id}
                    src={
                      product.images?.[0]
                    }
                    alt={product.name}
                  />
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FINAL CTA
      ========================== */}

      <section className="home-final-banner">
        <div>
          <span>
            🛍️ SHOP SMART. SHOP EASY.
          </span>

          <h2>
            Your next favourite product
            is waiting.
          </h2>

          <p>
            Explore our growing collection
            and find something amazing today.
          </p>

          <button
            onClick={() =>
              navigate("/products")
            }
          >
            Start Shopping →
          </button>
        </div>

        <div className="home-final-icons">
          <span>📱</span>
          <span>👕</span>
          <span>🎧</span>
          <span>🏠</span>
          <span>💄</span>
          <span>🛒</span>
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================== */}

      <footer className="home-footer">
        <div className="home-footer-grid">
          <div>
            <h2>ShopKart</h2>

            <p>
              Your one-stop destination for
              everyday shopping.
            </p>
          </div>

          <div>
            <h4>Quick Links</h4>

            <button
              onClick={() => navigate("/")}
            >
              Home
            </button>

            <button
              onClick={() =>
                navigate("/products")
              }
            >
              Products
            </button>

            <button
              onClick={() =>
                navigate("/orders")
              }
            >
              Orders
            </button>
          </div>

          <div>
            <h4>Categories</h4>

            <button
              onClick={() =>
                handleCategoryClick(
                  "Mobiles"
                )
              }
            >
              Mobiles
            </button>

            <button
              onClick={() =>
                handleCategoryClick(
                  "Electronics"
                )
              }
            >
              Electronics
            </button>

            <button
              onClick={() =>
                handleCategoryClick(
                  "Fashion"
                )
              }
            >
              Fashion
            </button>
          </div>

          <div>
            <h4>Customer Care</h4>

            <span>Help Center</span>
            <span>Returns</span>
            <span>Privacy Policy</span>
          </div>
        </div>

        <div className="home-footer-bottom">
          <span>
            © 2026 ShopKart. All rights
            reserved.
          </span>

          <span>
            Made for a better shopping
            experience.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Home;