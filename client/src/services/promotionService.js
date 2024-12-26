const API_URL = '/api/promotions'; // Corrected API URL

// Fetch all promotions
export const getPromotions = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(API_URL, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch promotions");
  }
  
  return await response.json();
};

// Fetch a single promotion by ID
export const getPromotion = async (id) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch promotion details");
  }
  return await response.json();
};

// Add a new promotion
export const createPromotion = async (data) => {
  const token = localStorage.getItem("token");
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // Attach the token here for authentication
    },
    body: data, // This should be FormData includes image and other data
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create promotion");
  }
  return await response.json();
};

// Update an existing promotion
export const updatePromotion = async (id, data) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found.");
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`, // Attach the token here
    },
    body: data, // Send FormData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update promotion");
  }

  return await response.json();
};

// Delete a promotion
export const deletePromotion = async (id) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete promotion");
  }
  return await response.json();
};
