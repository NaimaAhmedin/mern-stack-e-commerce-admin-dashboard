import axios from 'axios';

const API_URL = 'http://localhost:1337/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

// Dashboard Statistics
export const getDashboardStats = async () => {
    try {
        console.log('Making API call to:', '/api/content/dashboard-stats');
        console.log('With headers:', getAuthHeader());
        const response = await axios.get('/api/content/dashboard-stats', getAuthHeader());
        console.log('API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Recent Products
export const getRecentProducts = async () => {
    try {
        console.log('Making API call to:', '/api/content/dashboard/recent-products');
        console.log('With headers:', getAuthHeader());
        const response = await axios.get('/api/content/dashboard/recent-products', getAuthHeader());
        console.log('API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Active Promotions
export const getActivePromotions = async () => {
    try {
        console.log('Making API call to:', `${API_URL}/content/active-promotions`);
        console.log('With headers:', getAuthHeader());
        const response = await axios.get(`${API_URL}/content/active-promotions`, getAuthHeader());
        console.log('API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('API Error:', error.response || error);
        throw error.response?.data || error.message;
    }
};

// Category Statistics
export const getCategoryStats = async () => {
    try {
        console.log('Making API call to:', `${API_URL}/content/category-stats`);
        console.log('With headers:', getAuthHeader());
        const response = await axios.get(`${API_URL}/content/category-stats`, getAuthHeader());
        console.log('API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('API Error:', error.response || error);
        throw error.response?.data || error.message;
    }
};

// Recent Orders
export const getRecentOrders = async () => {
    try {
        console.log('Making API call to:', `${API_URL}/content/recent-orders`);
        console.log('With headers:', getAuthHeader());
        const response = await axios.get(`${API_URL}/content/recent-orders`, getAuthHeader());
        console.log('API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('API Error:', error.response || error);
        throw error.response?.data || error.message;
    }
};

// User Statistics
export const getUserStats = async () => {
    try {
        console.log('Making API call to:', `${API_URL}/content/user-stats`);
        console.log('With headers:', getAuthHeader());
        const response = await axios.get(`${API_URL}/content/user-stats`, getAuthHeader());
        console.log('API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('API Error:', error.response || error);
        throw error.response?.data || error.message;
    }
};

// Monthly Product Statistics
export const getMonthlyProductStats = async () => {
    try {
        const response = await axios.get('/api/content/dashboard/monthly-stats', getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error fetching monthly stats:', error);
        throw error;
    }
};

// Recent Products
export const getRecentProductsFromDashboard = async () => {
    try {
        const response = await axios.get('/api/content/dashboard/recent-products', getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error fetching recent products:', error);
        throw error;
    }
};
