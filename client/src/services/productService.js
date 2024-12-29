const API_URL = '/api/products'; // Updated to match backend route

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

    if (!token) {
      throw new Error('No authentication token found');
    }
    
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

    // Ensure images are in the correct format
    if (data.data) {
      data.data = data.data.map(product => ({
        ...product,
        images: product.images && product.images.length > 0 
          ? product.images.map(img => ({
              url: typeof img === 'string' ? img : img.url,
              public_id: typeof img === 'string' ? null : img.public_id
            }))
          : []
      }));
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
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    // Ensure images are in the correct format
    if (data.images) {
      data.images = data.images.map(img => ({
        url: typeof img === 'string' ? img : img.url,
        public_id: typeof img === 'string' ? null : img.public_id
      }));
    }

    return data;
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

    // Log details about the request
    console.log('=== CREATE PRODUCT REQUEST ===');
    console.log('Token:', token ? 'Token present' : 'No token');
    
    // If productData is FormData, log its contents
    if (productData instanceof FormData) {
      console.log('FormData Contents:');
      for (let [key, value] of productData.entries()) {
        console.log(`${key}:`, value);
      }
    } else {
      console.log('Product Data:', productData);
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

    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      throw new Error('Unexpected server response format');
    }

    console.log('Server Response:', data);

    if (!response.ok) {
      throw new Error(data.message || `Error creating product: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (id, data, formData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error('No authentication token found');
    }

    // If formData is not provided, create a new one
    if (!formData) {
      formData = new FormData();
    }

    // Append text fields
    Object.keys(data).forEach(key => {
      if (key !== 'images' && key !== 'existingImages') {
        formData.append(key, data[key]);
      }
    });

    // Handle existing images
    if (data.existingImages && data.existingImages.length > 0) {
      formData.append('existingImages', JSON.stringify(data.existingImages));
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { 
        "Authorization": `Bearer ${token}`
      },
      credentials: 'include',
      body: formData
    });

    console.log('Update Response Status:', response.status);
    const responseData = await response.json();
    console.log('Update Response:', responseData);

    if (!response.ok) {
      throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
    }

    return responseData;
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
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`${API_URL}/seller`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      credentials: 'include'
    });

    const responseData = await response.json();
    console.log('Seller Products Response:', responseData);

    if (!response.ok) {
      throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
    }

    // Ensure data is always an array
    const productsData = responseData.data || responseData;
    
    // Process each product
    const processedProducts = (Array.isArray(productsData) ? productsData : []).map(product => ({
      ...product,
      images: product.images && Array.isArray(product.images) 
        ? product.images.map(img => 
            typeof img === 'string' 
              ? img 
              : (img.url || null)
          ).filter(Boolean)
        : [],
      image: product.images && product.images.length > 0 
        ? (typeof product.images[0] === 'string' 
            ? product.images[0] 
            : (product.images[0].url || null))
        : null
    }));

    return {
      success: true,
      data: processedProducts,
      message: responseData.message || 'Products fetched successfully'
    };
  } catch (error) {
    console.error('Error fetching seller products:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'An unexpected error occurred'
    };
  }
};
