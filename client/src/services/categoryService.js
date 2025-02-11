import axios from 'axios';

const API_URL = '/api/categories'; // Uses proxy to direct requests to the backend

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    }
  };
};

// Fetch all categories
export const getCategories = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Fetch a single category by ID
export const getCategory = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

// Add a new category
export const createCategory = async (data) => {
  try {
    const response = await axios.post(API_URL, data, {
      ...getAuthHeader(),
      headers: {
        ...getAuthHeader().headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Update an existing category
export const updateCategory = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      ...getAuthHeader(),
      headers: {
        ...getAuthHeader().headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Delete a category
export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};
