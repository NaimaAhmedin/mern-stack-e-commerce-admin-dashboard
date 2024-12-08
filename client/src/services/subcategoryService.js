const API_URL = '/api/routes/subcategories'; // Uses proxy to direct requests to the backend

// Fetch all subcategories
export const getSubcategories = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json"
    },
  });
  return await response.json();
};

// Fetch a single subcategory by ID
export const getSubcategory = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json"
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch subcategory details");
  }
  return await response.json();
};

// Add a new subcategory
export const createSubcategory = async (data) => {
  const token = localStorage.getItem("token");
  
  // Prepare data as JSON (no image, only name and categoryId)
  const requestData = JSON.stringify({
    name: data.name,
    categoryId: data.categoryId,
  });

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Make sure the header indicates JSON
      Authorization: `Bearer ${token}`,
    },
    body: requestData, // Send the data as JSON
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create subcategory");
  }
  return await response.json();
};

// Update an existing subcategory
export const updateSubcategory = async (id, data) => {
  const token = localStorage.getItem("token");

  // Prepare data as JSON (no image, only name and categoryId)
  const requestData = JSON.stringify({
    name: data.name,
    categoryId: data.categoryId,
  });

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json", // Make sure the header indicates JSON
      Authorization: `Bearer ${token}`,
    },
    body: requestData, // Send the data as JSON
  });

  if (!response.ok) {
    throw new Error("Failed to update subcategory");
  }
  return await response.json();
};

// Delete a subcategory
export const deleteSubcategory = async (id) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete subcategory");
  }
  return await response.json();
};
