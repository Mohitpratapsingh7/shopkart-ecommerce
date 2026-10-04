import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const getProducts = async () => {
  const response = await api.get("/products");

  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);

  return response.data;
};

export const addToCart = async (productId, quantity, token) => {
  const response = await api.post(
    "/cart/add",
    {
      productId,
      quantity
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

export const updateCartItem = async (
  productId,
  quantity,
  token
) => {
  const response = await api.put(
    "/cart/update",
    {
      productId,
      quantity
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

export const removeFromCart = async (productId, token) => {
  const response = await api.delete(
    "/cart/remove",
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        productId
      }
    }
  );

  return response.data;
};

export default api;