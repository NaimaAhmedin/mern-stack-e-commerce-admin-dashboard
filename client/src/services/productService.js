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

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
        // Note: Don't set Content-Type when sending FormData
      },
      credentials: 'include',
      body: productData
    });

    const data = await response.json();
    console.log('Server Response:', data);

    if (!response.ok) {
      throw new Error(data.message || `Error creating product`);
    }

    return data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (id, data) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // If data is a FormData, convert it to a plain object
    const productData = data instanceof FormData 
      ? Object.fromEntries(data.entries()) 
      : data;

    console.log('Updating product with ID:', id);
    console.log('Product Data:', productData);

    // Validate required fields
    const requiredFields = ['name', 'price', 'category'];
    const missingFields = requiredFields.filter(field => 
      !productData[field] || productData[field] === ''
    );

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Prepare data for backend
    const requestData = {
      name: productData.name,
      price: Number(productData.price),
      quantity: Number(productData.stock || productData.quantity || 0),
      categoryId: productData.category,
      subcategoryId: productData.subcategory || undefined,
      brand: productData.brand || undefined,
      color: productData.color || undefined,
      warranty: productData.warranty ? Number(productData.warranty) : undefined,
      description: productData.description || undefined,
      images: productData.images || undefined
    };

    // Validate price and quantity
    if (isNaN(requestData.price) || requestData.price < 0) {
      throw new Error('Price must be a valid positive number');
    }

    if (isNaN(requestData.quantity) || requestData.quantity < 0) {
      throw new Error('Quantity must be a valid positive number');
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify(requestData)
    });

    console.log('Update Response Status:', response.status);

    const result = await response.json();
    console.log('Update Response:', result);

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update product');
    }

    return { 
      success: true, 
      data: result.data, 
      message: result.message || 'Product updated successfully' 
    };
  } catch (error) {
    console.error("Error in updateProduct:", error);
    return { 
      success: false, 
      message: error.message || 'An unexpected error occurred'
    };
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
