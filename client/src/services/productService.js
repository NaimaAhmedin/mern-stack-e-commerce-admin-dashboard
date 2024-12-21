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
export const createProduct = async (productData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Convert FormData to object for logging and potential modification
    const productObject = {};
    for (let [key, value] of productData.entries()) {
      productObject[key] = value;
    }

    console.log('Sending Product Data:', productObject);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productObject)
    });

    const data = await response.json();

    // Log full response for debugging
    console.log('Product Creation Response:', {
      status: response.status,
      ok: response.ok,
      data: data
    });

    if (!response.ok) {
      console.error('Server error details:', data);
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      data: data.data,
      message: data.message || 'Product created successfully'
    };
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (productId, productData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Convert FormData to object for logging and potential modification
    const productObject = {};
    for (let [key, value] of productData.entries()) {
      productObject[key] = value;
    }

    console.log('Sending Product Update Data:', {
      productId,
      productData: productObject
    });

    const response = await fetch(`${API_URL}/${productId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productObject)
    });

    const data = await response.json();

    // Log full response for debugging
    console.log('Product Update Response:', {
      status: response.status,
      ok: response.ok,
      data: data
    });

    if (!response.ok) {
      console.error('Server error details:', data);
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      data: data.data,
      message: data.message || 'Product updated successfully'
    };
  } catch (error) {
    console.error("Error updating product:", error);
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

// Fetch products for a seller
export const getSellerProducts = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('/api/routes/products', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const responseData = await response.json();
    console.log('Seller Products Response Status:', response.status);
    console.log('Seller Products Response:', responseData);

    if (!response.ok) {
      throw new Error(responseData.message || 'Error fetching seller products');
    }

    return {
      success: true,
      data: responseData.data,
      message: responseData.message || 'Seller products fetched successfully'
    };
  } catch (error) {
    console.error('Error fetching seller products:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred'
    };
  }
};
