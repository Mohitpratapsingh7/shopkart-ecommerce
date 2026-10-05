import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useNavigate,
  useSearchParams
} from "react-router-dom";

import api from "../services/api";
import "./Products.css";

function Products() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [category, setCategory] = useState(
    searchParams.get("category") || "All"
  );

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("0");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products");

        setProducts(response.data.products || []);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Products load nahi ho paye."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const urlCategory =
      searchParams.get("category") || "All";

    const urlSearch =
      searchParams.get("search") || "";

    setCategory(urlCategory);
    setSearch(urlSearch);
  }, [searchParams]);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      )
    ];

    return ["All", ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    const searchText =
      search.trim().toLowerCase();

    if (searchText) {
      result = result.filter((product) => {
        const productName =
          product.name?.toLowerCase() || "";

        const brand =
          product.brand?.toLowerCase() || "";

        const description =
          product.description?.toLowerCase() || "";

        return (
          productName.includes(searchText) ||
          brand.includes(searchText) ||
          description.includes(searchText)
        );
      });
    }

    if (category !== "All") {
      result = result.filter(
        (product) =>
          product.category === category
      );
    }

    if (minPrice !== "") {
      result = result.filter(
        (product) =>
          Number(product.price) >=
          Number(minPrice)
      );
    }

    if (maxPrice !== "") {
      result = result.filter(
        (product) =>
          Number(product.price) <=
          Number(maxPrice)
      );
    }

    if (Number(rating) > 0) {
      result = result.filter(
        (product) =>
          Number(product.rating || 0) >=
          Number(rating)
      );
    }

    if (sort === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.price) - Number(b.price)
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.price) - Number(a.price)
      );
    }

    if (sort === "rating-high") {
      result.sort(
        (a, b) =>
          Number(b.rating || 0) -
          Number(a.rating || 0)
      );
    }

    if (sort === "discount-high") {
      result.sort(
        (a, b) =>
          Number(b.discount || 0) -
          Number(a.discount || 0)
      );
    }

    return result;
  }, [
    products,
    search,
    category,
    minPrice,
    maxPrice,
    rating,
    sort
  ]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setRating("0");
    setSort("default");

    setSearchParams({});
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);

    const params = {};

    if (newCategory !== "All") {
      params.category = newCategory;
    }

    if (search.trim()) {
      params.search = search.trim();
    }

    setSearchParams(params);
  };

  const handleSearchChange = (value) => {
    setSearch(value);

    const params = {};

    if (value.trim()) {
      params.search = value.trim();
    }

    if (category !== "All") {
      params.category = category;
    }

    setSearchParams(params);
  };

  const handleAddToCart = async (productId) => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await api.post(
        "/cart/add",
        {
          productId,
          quantity: 1
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(
        "Product added to cart successfully."
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Product cart mein add nahi ho paya."
      );
    }
  };

  if (loading) {
    return (
      <div className="products-loading-page">
        <div className="products-loader"></div>
        <h2>Loading Products</h2>
        <p>Finding the best products for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-error-page">
        <div className="error-icon">⚠️</div>

        <h2>Something went wrong</h2>

        <p>{error}</p>

        <button
          onClick={() =>
            window.location.reload()
          }
          className="primary-button"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="products-page">

      {/* Hero */}
      <section className="products-hero">
        <div className="hero-content-products">
          <div className="hero-eyebrow">
            SHOPKART STORE
          </div>

          <h1>
            {category === "All"
              ? "All Products"
              : `${category} Products`}
          </h1>

          <p>
            Discover great products, amazing
            deals and trusted brands.
          </p>

          <div className="hero-mini-stats">
            <div>
              <strong>
                {products.length}+
              </strong>
              <span>Products</span>
            </div>

            <div>
              <strong>
                {categories.length - 1}
              </strong>
              <span>Categories</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Shopping</span>
            </div>
          </div>
        </div>

        <div className="hero-shopping-icon">
          🛍️
        </div>
      </section>

      {/* Filters */}
      <section className="filters-card">

        <div className="filters-heading">
          <div>
            <span className="section-kicker">
              DISCOVER
            </span>

            <h2>Search & Filters</h2>

            <p>
              Find exactly what you're looking
              for.
            </p>
          </div>

          <button
            className="reset-button"
            onClick={clearFilters}
          >
            ↻ Reset Filters
          </button>
        </div>

        {/* Search */}
        <div className="products-search-box">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search products, brands and more..."
            value={search}
            onChange={(event) =>
              handleSearchChange(
                event.target.value
              )
            }
          />
        </div>

        <div className="filters-grid">

          <div className="filter-field">
            <label>Category</label>

            <select
              value={category}
              onChange={(event) =>
                handleCategoryChange(
                  event.target.value
                )
              }
            >
              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-field">
            <label>Minimum Price</label>

            <input
              type="number"
              min="0"
              placeholder="₹ Minimum"
              value={minPrice}
              onChange={(event) =>
                setMinPrice(
                  event.target.value
                )
              }
            />
          </div>

          <div className="filter-field">
            <label>Maximum Price</label>

            <input
              type="number"
              min="0"
              placeholder="₹ Maximum"
              value={maxPrice}
              onChange={(event) =>
                setMaxPrice(
                  event.target.value
                )
              }
            />
          </div>

          <div className="filter-field">
            <label>Rating</label>

            <select
              value={rating}
              onChange={(event) =>
                setRating(
                  event.target.value
                )
              }
            >
              <option value="0">
                All Ratings
              </option>

              <option value="4">
                4★ & above
              </option>

              <option value="3">
                3★ & above
              </option>

              <option value="2">
                2★ & above
              </option>

              <option value="1">
                1★ & above
              </option>
            </select>
          </div>

          <div className="filter-field">
            <label>Sort By</label>

            <select
              value={sort}
              onChange={(event) =>
                setSort(
                  event.target.value
                )
              }
            >
              <option value="default">
                Recommended
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="rating-high">
                Rating: High to Low
              </option>

              <option value="discount-high">
                Discount: High to Low
              </option>
            </select>
          </div>

        </div>

        <div className="results-bar">
          <div>
            <strong>
              {filteredProducts.length}
            </strong>

            <span>
              {" "}
              product
              {filteredProducts.length !== 1
                ? "s"
                : ""}{" "}
              found
            </span>
          </div>

          <span className="results-message">
            Showing the best matches for you
          </span>
        </div>
      </section>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="empty-products">
          <div className="empty-icon">
            🔎
          </div>

          <h2>No products found</h2>

          <p>
            Try changing your search or
            filters.
          </p>

          <button
            onClick={clearFilters}
            className="primary-button"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <section className="product-section">

          <div className="product-section-heading">
            <div>
              <span className="section-kicker">
                SHOP NOW
              </span>

              <h2>
                {category === "All"
                  ? "Featured Products"
                  : `Best ${category} Picks`}
              </h2>
            </div>

            <span className="product-count">
              {filteredProducts.length} items
            </span>
          </div>

          <div className="products-grid">

            {filteredProducts.map(
              (product) => {

                const discountedPrice =
                  Math.round(
                    product.price -
                      (product.price *
                        product.discount) /
                        100
                  );

                const isInStock =
                  product.stock > 0;

                return (
                  <article
                    key={product._id}
                    className="product-card"
                  >

                    {/* Discount */}
                    {product.discount > 0 && (
                      <div className="discount-badge">
                        {product.discount}% OFF
                      </div>
                    )}

                    {/* Wishlist visual */}
                    <button
                      className="wishlist-button"
                      type="button"
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                    >
                      ♡
                    </button>

                    {/* Image */}
                    <div
                      className="product-image-box"
                      onClick={() =>
                        navigate(
                          `/product/${product._id}`
                        )
                      }
                    >
                      <img
                        src={
                          product.images?.[0] ||
                          "https://placehold.co/500x500?text=Product+Image"
                        }
                        alt={product.name}
                      />

                      <div className="quick-view">
                        View Details →
                      </div>
                    </div>

                    {/* Details */}
                    <div className="product-card-content">

                      <div className="product-meta">
                        <span>
                          {product.category}
                        </span>

                        <span>
                          {product.brand}
                        </span>
                      </div>

                      <h3
                        onClick={() =>
                          navigate(
                            `/product/${product._id}`
                          )
                        }
                        title={product.name}
                      >
                        {product.name}
                      </h3>

                      <div className="rating-row">
                        <span className="rating-badge">
                          ⭐{" "}
                          {product.rating || 0}
                        </span>

                        <span className="rating-text">
                          Customer Rating
                        </span>
                      </div>

                      <div className="price-row">
                        <strong>
                          ₹{discountedPrice}
                        </strong>

                        {product.discount > 0 && (
                          <span className="old-price">
                            ₹{product.price}
                          </span>
                        )}
                      </div>

                      {product.discount > 0 && (
                        <div className="saving-text">
                          You save ₹
                          {Number(product.price) -
                            discountedPrice}
                        </div>
                      )}

                      <div className="stock-row">
                        <span
                          className={
                            isInStock
                              ? "stock-dot available"
                              : "stock-dot unavailable"
                          }
                        ></span>

                        <span>
                          {isInStock
                            ? `${product.stock} in stock`
                            : "Out of stock"}
                        </span>
                      </div>

                      <button
                        className={
                          isInStock
                            ? "cart-button"
                            : "cart-button disabled"
                        }
                        disabled={!isInStock}
                        onClick={(event) => {
                          event.stopPropagation();

                          if (isInStock) {
                            handleAddToCart(
                              product._id
                            );
                          }
                        }}
                      >
                        {isInStock
                          ? "🛒 Add to Cart"
                          : "Out of Stock"}
                      </button>

                    </div>
                  </article>
                );
              }
            )}

          </div>
        </section>
      )}

    </div>
  );
}

export default Products;