const API_URL = '/api/routes/products'; // Uses proxy to direct requests to the backend

// Fetch all products
// export const getProducts = async () => {
//   try {
//     const response = await fetch(API_URL, {
//       method: "GET",
//       headers: { 
//         "Content-Type": "application/json",
//       },
//       credentials: 'include'
//     });
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     throw error;
//   }
// };

export const getProducts = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log('Token:', token); // Debug token

    const response = await fetch(API_URL, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      credentials: 'include'
    });
    
    console.log('Response status:', response.status); // Debug response status
    const data = await response.json();
    console.log('Response data:', data); // Debug response data

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data; // Return the entire response
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Fetch a single product by ID
export const getProduct = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const productData = await response.json();
    
    // Add additional logging for debugging
    console.log('Fetched Product Data:', productData);
    
    return productData;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Add a new product
export const createProduct = async (data) => {
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

// Update an existing product
export const updateProduct = async (id, data) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: data
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || 'Failed to update product');
      } catch (e) {
        throw new Error(errorText || 'Failed to update product');
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error in updateProduct:", error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        // 'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || 'Failed to delete product');
      } catch (e) {
        throw new Error(errorText || 'Failed to delete product');
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    throw error;
  }
};
