import { useEffect, useMemo, useState } from "react";
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

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("0");
  const [sort, setSort] = useState("default");

  const urlSearch =
    searchParams.get("search") || "";

  const urlCategory =
    searchParams.get("category") || "";

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/products"
        );

        setProducts(
          response.data.products || []
        );
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
    setSearch(urlSearch);

    setCategory(
      urlCategory || "All"
    );
  }, [urlSearch, urlCategory]);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map(
            (product) =>
              product.category
          )
          .filter(Boolean)
      )
    ];

    return [
      "All",
      ...uniqueCategories
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    const searchText =
      search.trim().toLowerCase();

    if (searchText) {
      result = result.filter(
        (product) => {
          const name =
            product.name?.toLowerCase() ||
            "";

          const brand =
            product.brand?.toLowerCase() ||
            "";

          const description =
            product.description?.toLowerCase() ||
            "";

          return (
            name.includes(searchText) ||
            brand.includes(searchText) ||
            description.includes(searchText)
          );
        }
      );
    }

    if (category !== "All") {
      result = result.filter(
        (product) =>
          product.category ===
          category
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
          Number(
            product.rating || 0
          ) >= Number(rating)
      );
    }

    if (sort === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.price) -
          Number(b.price)
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.price) -
          Number(a.price)
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

  const handleCategoryChange = (
    newCategory
  ) => {
    setCategory(newCategory);

    const params = new URLSearchParams();

    if (search.trim()) {
      params.set(
        "search",
        search.trim()
      );
    }

    if (newCategory !== "All") {
      params.set(
        "category",
        newCategory
      );
    }

    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setRating("0");
    setSort("default");

    setSearchParams({});
  };

  const handleAddToCart = async (
    productId
  ) => {
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

  const getDiscountedPrice = (
    product
  ) => {
    return Math.round(
      product.price -
        (product.price *
          product.discount) /
          100
    );
  };

  if (loading) {
    return (
      <div className="products-loading">
        <div className="products-loading-icon">
          🛍️
        </div>

        <h2>
          Loading Products...
        </h2>

        <p>
          Finding the best products
          for you.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-error-page">
        <div className="products-error-box">
          <div>⚠️</div>

          <h2>
            Something went wrong
          </h2>

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

  return (
    <div className="products-page">

      {/* PAGE HEADER */}

      <div className="products-page-header">

        <div>
          <span className="products-eyebrow">
            SHOPKART STORE
          </span>

          <h1>
            {category === "All"
              ? "All Products"
              : `${category} Products`}
          </h1>

          <p>
            Discover great products at
            amazing prices.
          </p>
        </div>

        <div className="products-header-icon">
          🛍️
        </div>
      </div>

      {/* FILTER PANEL */}

      <div className="products-filter-card">

        <div className="products-filter-title">
          <div>
            <h2>
              🔎 Search & Filters
            </h2>

            <p>
              Find exactly what you're
              looking for.
            </p>
          </div>

          <button
            className="products-clear-top"
            onClick={clearFilters}
          >
            Reset Filters
          </button>
        </div>

        {/* SEARCH */}

        <div className="products-search-box">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search products, brands and more..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />
        </div>

        {/* FILTERS */}

        <div className="products-filter-grid">

          <div className="products-filter-field">
            <label>
              Category
            </label>

            <select
              value={category}
              onChange={(event) =>
                handleCategoryChange(
                  event.target.value
                )
              }
            >
              {categories.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="products-filter-field">
            <label>
              Minimum Price
            </label>

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

          <div className="products-filter-field">
            <label>
              Maximum Price
            </label>

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

          <div className="products-filter-field">
            <label>
              Rating
            </label>

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
                ⭐ 4★ & above
              </option>

              <option value="3">
                ⭐ 3★ & above
              </option>

              <option value="2">
                ⭐ 2★ & above
              </option>
            </select>
          </div>

          <div className="products-filter-field">
            <label>
              Sort By
            </label>

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

        {/* RESULT BAR */}

        <div className="products-result-bar">

          <strong>
            {filteredProducts.length}{" "}
            product
            {filteredProducts.length !== 1
              ? "s"
              : ""}{" "}
            found
          </strong>

          <span>
            Showing the best matches
            for you
          </span>

        </div>

      </div>

      {/* PRODUCTS */}

      {filteredProducts.length === 0 ? (
        <div className="products-empty">

          <div className="products-empty-icon">
            🔍
          </div>

          <h2>
            No Products Found
          </h2>

          <p>
            Try changing your search
            or filters.
          </p>

          <button
            onClick={clearFilters}
          >
            Clear All Filters
          </button>

        </div>
      ) : (
        <div className="products-grid">

          {filteredProducts.map(
            (product) => {
              const discountedPrice =
                getDiscountedPrice(
                  product
                );

              return (
                <div
                  className="premium-product-card"
                  key={product._id}
                >

                  {/* IMAGE */}

                  <div
                    className="premium-product-image"
                    onClick={() =>
                      navigate(
                        `/product/${product._id}`
                      )
                    }
                  >

                    {product.discount >
                      0 && (
                      <span className="premium-discount-badge">
                        {product.discount}%
                        OFF
                      </span>
                    )}

                    <img
                      src={
                        product.images?.[0] ||
                        "https://placehold.co/500x500?text=Product"
                      }
                      alt={
                        product.name
                      }
                      onError={(
                        event
                      ) => {
                        event.currentTarget.src =
                          "https://placehold.co/500x500?text=Product";
                      }}
                    />

                    <div className="premium-view-product">
                      View Product →
                    </div>

                  </div>

                  {/* INFO */}

                  <div className="premium-product-info">

                    <span className="premium-brand">
                      {product.brand}
                    </span>

                    <h2
                      onClick={() =>
                        navigate(
                          `/product/${product._id}`
                        )
                      }
                      title={
                        product.name
                      }
                    >
                      {product.name}
                    </h2>

                    <div className="premium-rating-row">

                      <span className="premium-rating">
                        ⭐{" "}
                        {product.rating ||
                          0}
                      </span>

                      <span
                        className={
                          product.stock >
                          0
                            ? "premium-stock"
                            : "premium-out"
                        }
                      >
                        {product.stock >
                        0
                          ? `${product.stock} left`
                          : "Out of Stock"}
                      </span>

                    </div>

                    <div className="premium-price-row">

                      <strong>
                        ₹
                        {
                          discountedPrice
                        }
                      </strong>

                      {product.discount >
                        0 && (
                        <span>
                          ₹
                          {
                            product.price
                          }
                        </span>
                      )}

                    </div>

                    {product.discount >
                      0 && (
                      <div className="premium-saving">
                        💚 Save ₹
                        {Math.round(
                          product.price -
                            discountedPrice
                        )}
                      </div>
                    )}

                    <button
                      className="premium-cart-button"
                      disabled={
                        product.stock <=
                        0
                      }
                      onClick={() =>
                        handleAddToCart(
                          product._id
                        )
                      }
                    >
                      {product.stock >
                      0
                        ? "🛒 Add to Cart"
                        : "Out of Stock"}
                    </button>

                  </div>
                </div>
              );
            }
          )}

        </div>
      )}

    </div>
  );
}

export default Products;