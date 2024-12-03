import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';


export const fetchProducts = async (type = '', search = '', sort = '', order = 'asc') => {
  const params = {};
  if (type) params.type = type;
  if (search) params.search = search;
  if (sort) params.sort = sort;
  if (order) params.order = order;

  const response = await axios.get(`${API_BASE_URL}/items`, { params });
  return response.data;
};

// Функція для отримання додаткової інформації про продукт
export const fetchMoreInfo = async (productId) => {
  const response = await axios.get(`${API_BASE_URL}/items/${productId}/more-info`);
  return response.data; 
};


export const fetchProductById = async (id) => {
  try {
      const response = await axios.get(`${API_BASE_URL}/items/${id}`);
      return response.data; 
  } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw error;
  }
};
