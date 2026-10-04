import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h1>Admin Products</h1>
        <p>Loading products...</p>
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
          <h1>Admin Products</h1>

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
              marginBottom: "15px",
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
              border: "1px solid #ef9a9a"
            }}
          >
            ✕ {error}
          </div>
        )}

        {/* Product Form */}

        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "8px",
            marginBottom: "25px"
          }}
        >
          <h2>
            {editingId
              ? "Edit Product"
              : "Add New Product"}
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              style={inputStyle}
            />

            <textarea
              name="description"
              placeholder="Product Description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              style={inputStyle}
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              style={inputStyle}
            />

            <input
              type="number"
              name="discount"
              placeholder="Discount (%)"
              value={formData.discount}
              onChange={handleChange}
              min="0"
              max="100"
              step="1"
              style={inputStyle}
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={formData.brand}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="text"
              name="images"
              placeholder="Image URLs separated by commas"
              value={formData.images}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="number"
              name="rating"
              placeholder="Rating"
              value={formData.rating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              style={inputStyle}
            />

            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              step="1"
              style={inputStyle}
            />

            <div
              style={{
                display: "flex",
                gap: "10px"
              }}
            >
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: "12px 20px",
                  cursor: saving
                    ? "not-allowed"
                    : "pointer"
                }}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Product"
                  : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: "12px 20px",
                    cursor: "pointer"
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Product List */}

        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "8px"
          }}
        >
          <h2>All Products</h2>

          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px"
              }}
            >
              {products.map((product) => (
                <div
                  key={product._id}
                  style={{
                    display: "flex",
                    gap: "20px",
                    padding: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    alignItems: "center"
                  }}
                >
                  <div
                    style={{
                      width: "120px",
                      height: "120px",
                      flexShrink: 0,
                      backgroundColor: "#f7f7f7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      borderRadius: "5px"
                    }}
                  >
                    <img
                      src={
                        product.images?.[0] ||
                        "https://placehold.co/120x120?text=No+Image"
                      }
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain"
                      }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3>{product.name}</h3>

                    <p>
                      <strong>Brand:</strong>{" "}
                      {product.brand}
                    </p>

                    <p>
                      <strong>Category:</strong>{" "}
                      {product.category}
                    </p>

                    <p>
                      <strong>Price:</strong> ₹
                      {product.price}
                    </p>

                    <p>
                      <strong>Discount:</strong>{" "}
                      {product.discount}%
                    </p>

                    <p>
                      <strong>Stock:</strong>{" "}
                      {product.stock}
                    </p>

                    <p>
                      <strong>Rating:</strong>{" "}
                      {product.rating}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px"
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleEdit(product)}
                      style={{
                        padding: "10px 15px",
                        cursor: "pointer"
                      }}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(product._id)
                      }
                      disabled={
                        deletingId === product._id
                      }
                      style={{
                        padding: "10px 15px",
                        cursor:
                          deletingId === product._id
                            ? "not-allowed"
                            : "pointer"
                      }}
                    >
                      {deletingId === product._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
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

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  boxSizing: "border-box"
};

export default AdminProducts;