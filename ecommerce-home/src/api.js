import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Функція для отримання продуктів
export const fetchProducts = async (type = '', search = '', sort = '', order = 'asc') => {
  const params = {};
  if (type) params.type = type;
  if (search) params.search = search;
  if (sort) params.sort = sort;
  if (order) params.order = order;

  try {
    const response = await axios.get(`${API_BASE_URL}/items`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Функція для отримання додаткової інформації про продукт
export const fetchMoreInfo = async (productId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/items/${productId}/more-info`);
    return response.data;
  } catch (error) {
    console.error("Error fetching more product info:", error);
    throw error;
  }
};

// Функція для отримання продукту за ID
export const fetchProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/items/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};

// Функція для отримання кошика
export const fetchCart = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`, // Додаємо токен до заголовків
      },
    });
    console.log("Fetched cart data:", response.data); // Логування для перевірки
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

export const addItemToCart = async (item, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/carts`,
      item, // Передаємо об'єкт товару
      {
        headers: {
          Authorization: `Bearer ${token}`, // Додаємо токен до заголовків
        },
      }
    );
    console.log("Item added to cart:", response.data); // Логування для перевірки
    return response.data;
  } catch (error) {
    console.error("Error adding item to cart:", error);
    throw error;
  }
};

// Функція для оновлення кошика
export const updateCart = async (cartData, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/cart`,
      { cart_data: cartData },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Додаємо токен до заголовків
        },
      }
    );
    console.log("Cart successfully updated:", response.data); // Логування для перевірки
    return response.data;
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};

// Функція для очищення кошика
export const clearCart = async (token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`, // Додаємо токен до заголовків
      },
    });
    console.log("Cart cleared:", response.data); // Логування для перевірки
    return response.data;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};

// Функція для реєстрації нового користувача
export const registerUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, { email, password });
    console.log("User registered:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Функція для логіну
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    console.log("User logged in, token:", response.data.token);
    return response.data.token; // Повертаємо токен
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};
