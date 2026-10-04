import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const productResponse =
          await api.get(`/products/${id}`);

        const fetchedProduct =
          productResponse.data.product;

        setProduct(fetchedProduct);

        setSelectedImage(
          fetchedProduct.images?.[0] ||
            "https://placehold.co/700x700?text=Product"
        );

        setQuantity(1);

        // Load related products
        try {
          const productsResponse =
            await api.get("/products");

          const allProducts =
            productsResponse.data.products || [];

          const related = allProducts
            .filter(
              (item) =>
                item._id !== fetchedProduct._id &&
                item.category ===
                  fetchedProduct.category
            )
            .slice(0, 4);

          setRelatedProducts(related);
        } catch (relatedError) {
          console.error(
            "Related products error:",
            relatedError
          );

          setRelatedProducts([]);
        }
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Product load nahi ho paya."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getFinalPrice = () => {
    if (!product) {
      return 0;
    }

    return Math.round(
      product.price -
        (product.price * product.discount) / 100
    );
  };

  const handleAddToCart = async () => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setCartLoading(true);
      setMessage("");
      setError("");

      await api.post(
        "/cart/add",
        {
          productId: product._id,
          quantity
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(
        `${product.name} added to cart successfully.`
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Product cart mein add nahi ho paya."
      );
    } finally {
      setCartLoading(false);
    }
  };

  const handleBuyNow = async () => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setCartLoading(true);
      setMessage("");
      setError("");

      await api.post(
        "/cart/add",
        {
          productId: product._id,
          quantity
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      navigate("/checkout");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Product checkout ke liye add nahi ho paya."
      );
    } finally {
      setCartLoading(false);
    }
  };

  const handleQuantityDecrease = () => {
    setQuantity((previous) =>
      Math.max(1, previous - 1)
    );
  };

  const handleQuantityIncrease = () => {
    setQuantity((previous) =>
      Math.min(
        product.stock,
        previous + 1
      )
    );
  };

  if (loading) {
    return (
      <div className="product-details-loading">
        <div className="details-loading-icon">
          🛍️
        </div>

        <h2>Loading Product...</h2>

        <p>
          Please wait while we fetch the
          product details.
        </p>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="product-details-error">
        <div className="details-error-card">
          <div className="details-error-icon">
            ⚠️
          </div>

          <h2>Product Not Found</h2>

          <p>{error}</p>

          <button
            onClick={() =>
              navigate("/products")
            }
          >
            ← Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const finalPrice = getFinalPrice();

  const savings =
    product.price - finalPrice;

  const productImages =
    product.images &&
    product.images.length > 0
      ? product.images
      : [
          "https://placehold.co/700x700?text=Product"
        ];

  return (
    <div className="product-details-page">

      {/* TOP BACK NAVIGATION */}

      <div className="product-details-container">

        <button
          className="details-back-button"
          onClick={() =>
            navigate("/products")
          }
        >
          ← Back to Products
        </button>

        {/* MAIN PRODUCT CARD */}

        <div className="product-main-card">

          {/* SUCCESS / ERROR */}

          {message && (
            <div className="details-success">
              <span>✓</span>
              {message}
            </div>
          )}

          {error && product && (
            <div className="details-error">
              <span>!</span>
              {error}
            </div>
          )}

          <div className="product-main-grid">

            {/* ======================
                LEFT IMAGE SECTION
            ====================== */}

            <div className="product-gallery">

              <div className="product-main-image">

                {product.discount > 0 && (
                  <span className="details-discount-badge">
                    {product.discount}% OFF
                  </span>
                )}

                <img
                  src={selectedImage}
                  alt={product.name}
                  onError={(event) => {
                    event.currentTarget.src =
                      "https://placehold.co/700x700?text=Product";
                  }}
                />

              </div>

              {/* THUMBNAILS */}

              {productImages.length > 1 && (
                <div className="product-thumbnails">
                  {productImages.map(
                    (image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        className={
                          selectedImage === image
                            ? "product-thumbnail active"
                            : "product-thumbnail"
                        }
                        onClick={() =>
                          setSelectedImage(
                            image
                          )
                        }
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          onError={(event) => {
                            event.currentTarget.src =
                              "https://placehold.co/100x100?text=Image";
                          }}
                        />
                      </button>
                    )
                  )}
                </div>
              )}

              {/* TRUST FEATURES */}

              <div className="product-trust-row">

                <div>
                  <span>🚚</span>
                  <strong>
                    Fast Delivery
                  </strong>
                </div>

                <div>
                  <span>↩️</span>
                  <strong>
                    Easy Returns
                  </strong>
                </div>

                <div>
                  <span>🔒</span>
                  <strong>
                    Secure Shopping
                  </strong>
                </div>

              </div>

            </div>

            {/* ======================
                RIGHT INFORMATION
            ====================== */}

            <div className="product-information">

              <div className="details-brand">
                {product.brand}
              </div>

              <h1>
                {product.name}
              </h1>

              <div className="details-category">
                Category:
                <strong>
                  {product.category}
                </strong>
              </div>

              {/* RATING */}

              <div className="details-rating-row">

                <span className="details-rating">
                  ⭐ {product.rating || 0}
                </span>

                <span className="details-rating-text">
                  Rated product
                </span>

              </div>

              <div className="details-divider" />

              {/* PRICE */}

              <div className="details-price-section">

                <div className="details-price">
                  ₹{finalPrice}
                </div>

                {product.discount > 0 && (
                  <>
                    <div className="details-original-price">
                      ₹{product.price}
                    </div>

                    <div className="details-discount-text">
                      {product.discount}% off
                    </div>
                  </>
                )}

              </div>

              {product.discount > 0 && (
                <div className="details-saving">
                  💚 You save ₹{savings} on
                  this product
                </div>
              )}

              {/* STOCK */}

              <div
                className={
                  product.stock > 0
                    ? "details-stock available"
                    : "details-stock unavailable"
                }
              >
                {product.stock > 0
                  ? `✓ In Stock — ${product.stock} available`
                  : "✕ Currently Out of Stock"}
              </div>

              {/* QUANTITY */}

              {product.stock > 0 && (
                <div className="details-quantity-section">

                  <strong>
                    Quantity
                  </strong>

                  <div className="quantity-control">

                    <button
                      type="button"
                      onClick={
                        handleQuantityDecrease
                      }
                      disabled={
                        quantity <= 1
                      }
                    >
                      −
                    </button>

                    <span>
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={
                        handleQuantityIncrease
                      }
                      disabled={
                        quantity >=
                        product.stock
                      }
                    >
                      +
                    </button>

                  </div>

                </div>
              )}

              {/* ACTION BUTTONS */}

              {product.stock > 0 ? (
                <div className="details-action-buttons">

                  <button
                    type="button"
                    className="details-add-cart"
                    onClick={
                      handleAddToCart
                    }
                    disabled={
                      cartLoading
                    }
                  >
                    🛒{" "}
                    {cartLoading
                      ? "Please wait..."
                      : "Add to Cart"}
                  </button>

                  <button
                    type="button"
                    className="details-buy-now"
                    onClick={
                      handleBuyNow
                    }
                    disabled={
                      cartLoading
                    }
                  >
                    ⚡ Buy Now
                  </button>

                </div>
              ) : (
                <button
                  className="details-out-stock-button"
                  disabled
                >
                  Out of Stock
                </button>
              )}

              {/* DELIVERY BOX */}

              <div className="delivery-box">

                <div className="delivery-box-title">
                  🚚 Delivery & Services
                </div>

                <div className="delivery-row">
                  <span>📦</span>
                  <div>
                    <strong>
                      Free delivery
                    </strong>
                    <p>
                      Available on eligible
                      orders
                    </p>
                  </div>
                </div>

                <div className="delivery-row">
                  <span>🔄</span>
                  <div>
                    <strong>
                      Easy returns
                    </strong>
                    <p>
                      Return policy available
                      on eligible products
                    </p>
                  </div>
                </div>

                <div className="delivery-row">
                  <span>🛡️</span>
                  <div>
                    <strong>
                      Secure shopping
                    </strong>
                    <p>
                      Your account and order
                      information is protected
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* TOTAL BAR */}

          {product.stock > 0 && (
            <div className="details-total-bar">

              <div>
                <span>
                  {quantity} item
                  {quantity !== 1
                    ? "s"
                    : ""} selected
                </span>

                <strong>
                  ₹{finalPrice * quantity}
                </strong>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={cartLoading}
              >
                ⚡ Buy Now
              </button>

            </div>
          )}

        </div>

        {/* ======================
            DESCRIPTION
        ====================== */}

        <div className="details-content-card">

          <div className="details-section-title">
            <span>📋</span>
            <h2>
              Product Description
            </h2>
          </div>

          <p className="details-description">
            {product.description}
          </p>

        </div>

        {/* ======================
            PRODUCT INFORMATION
        ====================== */}

        <div className="details-content-card">

          <div className="details-section-title">
            <span>ℹ️</span>
            <h2>
              Product Information
            </h2>
          </div>

          <div className="details-info-grid">

            <div>
              <span>Brand</span>
              <strong>
                {product.brand}
              </strong>
            </div>

            <div>
              <span>Category</span>
              <strong>
                {product.category}
              </strong>
            </div>

            <div>
              <span>Rating</span>
              <strong>
                ⭐ {product.rating || 0}/5
              </strong>
            </div>

            <div>
              <span>Discount</span>
              <strong>
                {product.discount || 0}%
              </strong>
            </div>

            <div>
              <span>Available Stock</span>
              <strong>
                {product.stock}
              </strong>
            </div>

            <div>
              <span>Product Status</span>
              <strong
                className={
                  product.stock > 0
                    ? "status-green"
                    : "status-red"
                }
              >
                {product.stock > 0
                  ? "Available"
                  : "Out of Stock"}
              </strong>
            </div>

          </div>

        </div>

        {/* ======================
            RELATED PRODUCTS
        ====================== */}

        {relatedProducts.length > 0 && (
          <div className="related-products-section">

            <div className="related-heading">

              <div>
                <span>
                  MORE FROM THIS CATEGORY
                </span>

                <h2>
                  You May Also Like
                </h2>
              </div>

              <button
                onClick={() =>
                  navigate(
                    `/products?category=${encodeURIComponent(
                      product.category
                    )}`
                  )
                }
              >
                View All →
              </button>

            </div>

            <div className="related-products-grid">

              {relatedProducts.map(
                (item) => {
                  const itemPrice =
                    Math.round(
                      item.price -
                        (item.price *
                          item.discount) /
                          100
                    );

                  return (
                    <div
                      className="related-product-card"
                      key={item._id}
                      onClick={() =>
                        navigate(
                          `/product/${item._id}`
                        )
                      }
                    >

                      <div className="related-image">

                        {item.discount >
                          0 && (
                          <span>
                            {item.discount}%
                            OFF
                          </span>
                        )}

                        <img
                          src={
                            item.images?.[0] ||
                            "https://placehold.co/400x400?text=Product"
                          }
                          alt={item.name}
                          onError={(event) => {
                            event.currentTarget.src =
                              "https://placehold.co/400x400?text=Product";
                          }}
                        />

                      </div>

                      <div className="related-info">

                        <small>
                          {item.brand}
                        </small>

                        <h3>
                          {item.name}
                        </h3>

                        <div className="related-rating">
                          ⭐{" "}
                          {item.rating || 0}
                        </div>

                        <div className="related-price">
                          ₹{itemPrice}

                          {item.discount >
                            0 && (
                            <del>
                              ₹{item.price}
                            </del>
                          )}
                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default ProductDetails;