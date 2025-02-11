// Get auth header with token for API requests
export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
        }
    };
};

// Get token from localStorage
export const getToken = () => {
    return localStorage.getItem('token');
};

// Set token in localStorage
export const setToken = (token) => {
    localStorage.setItem('token', token);
};

// Remove token from localStorage
export const removeToken = () => {
    localStorage.removeItem('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
    const token = getToken();
    return !!token;
};
