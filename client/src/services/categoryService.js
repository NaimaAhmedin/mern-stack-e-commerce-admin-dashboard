const API_URL = '/api/routes/categories'; // Uses proxy to direct requests to the backend

// Fetch all categories
export const getCategories = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return await response.json();
};

// Fetch a single category by ID
export const getCategory = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch category details");
  }
  return await response.json();
};

// Add a new category
export const createCategory = async (data) => {
  const token = localStorage.getItem("token"); // Get the token from localStorage
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // Attach the token here for authentication
    },
    body: data, // This should be FormData includes image and other data
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create category");
  }
  return await response.json();
};

// Update an existing category
export const updateCategory = async (id, data) => {
  const token = localStorage.getItem("token");
  console.log("Token:", token);
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
    throw new Error(error.message || "Failed to update category");
  }

  return await response.json();
};

// Delete a category
export const deleteCategory = async (id) => {
  const token = localStorage.getItem("token"); // Get the token from localStorage
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete category");
  }
  return await response.json();
};
