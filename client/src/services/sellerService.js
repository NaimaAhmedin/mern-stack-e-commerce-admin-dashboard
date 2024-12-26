const API_URL = '/api/users/sellers';

// Fetch sellers with filtering
export const getSellers = async (filters = {}) => {
  const token = localStorage.getItem('token');
  
  // Construct query parameters
  const queryParams = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== null) {
      queryParams.append(key, filters[key]);
    }
  });

  const response = await fetch(`${API_URL}?${queryParams}`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch sellers");
  }

  return await response.json();
};

// Update seller status
export const updateSellerStatus = async (sellerId, newStatus) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`/api/users/users/sellers/${sellerId}/status`, {
    method: "PATCH",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ status: newStatus })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to update seller status");
  }

  return await response.json();
};

// Update seller approval
export const updateSellerApproval = async (sellerId, newApproval) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`/api/users/users/sellers/${sellerId}/approval`, {
    method: "PATCH",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ approval: newApproval })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to update seller approval");
  }

  return await response.json();
};

// Fetch a single seller by ID
export const getSeller = async (id) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`/api/users/users/${id}`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch seller details");
  }

  return await response.json();
};

// Delete a seller
export const deleteSeller = async (id) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete seller");
  }

  return await response.json();
};
