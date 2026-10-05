import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminProducts.css";

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  discount: 0,
  category: "",
  brand: "",
  images: "",
  rating: 0,
  stock: ""
};

function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyProduct);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAdminAndLoadProducts = async () => {
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

        const response = await api.get("/products");

        setProducts(response.data.products || []);
      } catch (error) {
        console.error(error);

        if (error.response?.status === 401) {
          setError("Session expired. Please login again.");
        } else if (error.response?.status === 403) {
          setError("Admin access required.");
        } else {
          setError(
            error.response?.data?.message ||
              "Products load nahi ho paye."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndLoadProducts();
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    setMessage("");
    setError("");
  };

  const resetForm = () => {
    setFormData(emptyProduct);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      formData.price === "" ||
      !formData.category.trim() ||
      !formData.brand.trim() ||
      formData.stock === ""
    ) {
      setError("Please fill all required product fields.");
      return;
    }

    const price = Number(formData.price);
    const discount = Number(formData.discount);
    const rating = Number(formData.rating);
    const stock = Number(formData.stock);

    if (price < 0) {
      setError("Price cannot be negative.");
      return;
    }

    if (discount < 0 || discount > 100) {
      setError("Discount must be between 0 and 100.");
      return;
    }

    if (rating < 0 || rating > 5) {
      setError("Rating must be between 0 and 5.");
      return;
    }

    if (stock < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    try {
      setSaving(true);

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price,
        discount,
        category: formData.category.trim(),
        brand: formData.brand.trim(),
        images: formData.images
          .split(",")
          .map((image) => image.trim())
          .filter((image) => image !== ""),
        rating,
        stock
      };

      let response;

      if (editingId) {
        response = await api.put(
          `/products/${editingId}`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setProducts((previous) =>
          previous.map((product) =>
            product._id === editingId
              ? response.data.product
              : product
          )
        );

        setMessage("Product updated successfully.");
      } else {
        response = await api.post(
          "/products",
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setProducts((previous) => [
          response.data.product,
          ...previous
        ]);

        setMessage("Product added successfully.");
      }

      resetForm();
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (error.response?.status === 403) {
        setError("Admin access required.");
      } else {
        setError(
          error.response?.data?.message ||
            "Product save nahi ho paya."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      discount: product.discount ?? 0,
      category: product.category || "",
      brand: product.brand || "",
      images: product.images
        ? product.images.join(", ")
        : "",
      rating: product.rating ?? 0,
      stock: product.stock ?? ""
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = async (productId) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!shouldDelete) {
      return;
    }

    setMessage("");
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setDeletingId(productId);

      await api.delete(`/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setProducts((previous) =>
        previous.filter(
          (product) => product._id !== productId
        )
      );

      if (editingId === productId) {
        resetForm();
      }

      setMessage("Product deleted successfully.");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (error.response?.status === 403) {
        setError("Admin access required.");
      } else {
        setError(
          error.response?.data?.message ||
            "Product delete nahi ho paya."
        );
      }
    } finally {
      setDeletingId(null);
    }
  };

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) => total + Number(product.stock || 0),
    0
  );

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.stock || 0) > 0 &&
      Number(product.stock || 0) <= 10
  ).length;

  const outOfStockProducts = products.filter(
    (product) => Number(product.stock || 0) === 0
  ).length;

  if (loading) {
    return (
      <div className="admin-products-loading">
        <div className="admin-products-spinner"></div>

        <h2>Loading Products...</h2>

        <p>Please wait while we fetch your store inventory.</p>
      </div>
    );
  }

  return (
    <div className="admin-products-page">
      <div className="admin-products-container">

        {/* Header */}
        <section className="admin-products-header">
          <div>
            <div className="admin-products-title-row">
              <div className="admin-products-title-icon">
                📦
              </div>

              <div>
                <span className="admin-products-eyebrow">
                  STORE INVENTORY
                </span>

                <h1>Manage Products</h1>
              </div>
            </div>

            <p>
              Add, update and manage everything available in
              your ShopKart store.
            </p>
          </div>

          <button
            className="admin-products-dashboard-button"
            onClick={() => navigate("/admin")}
          >
            ← Dashboard
          </button>
        </section>

        {/* Alerts */}
        {message && (
          <div className="admin-products-alert success">
            <span>✓</span>
            {message}
          </div>
        )}

        {error && (
          <div className="admin-products-alert error">
            <span>!</span>
            {error}
          </div>
        )}

        {/* Inventory Stats */}
        <section className="inventory-stats">
          <div className="inventory-stat-card">
            <div className="inventory-stat-icon blue">
              📦
            </div>

            <div>
              <span>Total Products</span>
              <strong>{totalProducts}</strong>
            </div>
          </div>

          <div className="inventory-stat-card">
            <div className="inventory-stat-icon purple">
              🏷️
            </div>

            <div>
              <span>Total Stock</span>
              <strong>{totalStock}</strong>
            </div>
          </div>

          <div className="inventory-stat-card">
            <div className="inventory-stat-icon orange">
              ⚠️
            </div>

            <div>
              <span>Low Stock</span>
              <strong>{lowStockProducts}</strong>
            </div>
          </div>

          <div className="inventory-stat-card">
            <div className="inventory-stat-icon red">
              🚫
            </div>

            <div>
              <span>Out of Stock</span>
              <strong>{outOfStockProducts}</strong>
            </div>
          </div>
        </section>

        {/* Product Form */}
        <section className="product-form-section">

          <div className="form-section-header">
            <div>
              <span className="section-eyebrow">
                PRODUCT MANAGEMENT
              </span>

              <h2>
                {editingId
                  ? "Edit Product"
                  : "Add New Product"}
              </h2>

              <p>
                {editingId
                  ? "Update the selected product information."
                  : "Create a new product for your ShopKart catalog."}
              </p>
            </div>

            {editingId && (
              <span className="editing-badge">
                Editing Product
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit}>

            <div className="product-form-grid">

              <div className="form-field full">
                <label>Product Name *</label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Samsung Galaxy S25"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field full">
                <label>Description *</label>

                <textarea
                  name="description"
                  placeholder="Enter a detailed product description..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              <div className="form-field">
                <label>Price (₹) *</label>

                <input
                  type="number"
                  name="price"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-field">
                <label>Discount (%)</label>

                <input
                  type="number"
                  name="discount"
                  placeholder="0"
                  value={formData.discount}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="1"
                />
              </div>

              <div className="form-field">
                <label>Category *</label>

                <input
                  type="text"
                  name="category"
                  placeholder="e.g. Mobiles"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>Brand *</label>

                <input
                  type="text"
                  name="brand"
                  placeholder="e.g. Samsung"
                  value={formData.brand}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>Rating</label>

                <input
                  type="number"
                  name="rating"
                  placeholder="0 - 5"
                  value={formData.rating}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="0.1"
                />
              </div>

              <div className="form-field">
                <label>Stock *</label>

                <input
                  type="number"
                  name="stock"
                  placeholder="Available quantity"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  step="1"
                />
              </div>

              <div className="form-field full">
                <label>Product Images</label>

                <input
                  type="text"
                  name="images"
                  placeholder="Paste image URLs separated by commas"
                  value={formData.images}
                  onChange={handleChange}
                />

                <small>
                  Add multiple image URLs separated by commas.
                </small>
              </div>

            </div>

            <div className="product-form-actions">
              <button
                type="submit"
                className="save-product-button"
                disabled={saving}
              >
                {saving
                  ? "Saving Product..."
                  : editingId
                  ? "✓ Update Product"
                  : "+ Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="cancel-product-button"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              )}
            </div>

          </form>
        </section>

        {/* Product List */}
        <section className="products-list-section">

          <div className="products-list-header">
            <div>
              <span className="section-eyebrow">
                CATALOG
              </span>

              <h2>All Products</h2>

              <p>
                {products.length} products currently available
                in your store.
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="products-empty">
              <div>📦</div>

              <h3>No products found</h3>

              <p>
                Add your first product using the form above.
              </p>
            </div>
          ) : (
            <div className="admin-product-grid">

              {products.map((product) => {
                const stock = Number(product.stock || 0);

                const stockClass =
                  stock === 0
                    ? "out"
                    : stock <= 10
                    ? "low"
                    : "available";

                const finalPrice = Math.round(
                  Number(product.price || 0) -
                    (Number(product.price || 0) *
                      Number(product.discount || 0)) /
                      100
                );

                return (
                  <article
                    className="admin-product-card"
                    key={product._id}
                  >
                    <div className="admin-product-image">
                      <img
                        src={
                          product.images?.[0] ||
                          "https://placehold.co/300x300?text=No+Image"
                        }
                        alt={product.name}
                      />

                      {Number(product.discount || 0) > 0 && (
                        <span className="product-discount">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>

                    <div className="admin-product-content">

                      <div className="product-card-heading">
                        <span className="product-category">
                          {product.category}
                        </span>

                        <span className="product-rating">
                          ★ {product.rating}
                        </span>
                      </div>

                      <h3>{product.name}</h3>

                      <p className="product-brand">
                        {product.brand}
                      </p>

                      <div className="product-price-row">
                        <strong>
                          ₹{finalPrice.toLocaleString("en-IN")}
                        </strong>

                        {Number(product.discount || 0) > 0 && (
                          <del>
                            ₹
                            {Number(
                              product.price
                            ).toLocaleString("en-IN")}
                          </del>
                        )}
                      </div>

                      <div
                        className={`product-stock ${stockClass}`}
                      >
                        <span></span>

                        {stock === 0
                          ? "Out of Stock"
                          : stock <= 10
                          ? `Low Stock · ${stock} left`
                          : `${stock} units in stock`}
                      </div>

                      <div className="product-card-actions">

                        <button
                          type="button"
                          className="edit-product-button"
                          onClick={() =>
                            handleEdit(product)
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          type="button"
                          className="delete-product-button"
                          onClick={() =>
                            handleDelete(product._id)
                          }
                          disabled={
                            deletingId === product._id
                          }
                        >
                          {deletingId === product._id
                            ? "Deleting..."
                            : "🗑️ Delete"}
                        </button>

                      </div>
                    </div>
                  </article>
                );
              })}

            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default AdminProducts;