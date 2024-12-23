import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct, updateProduct } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    subcategory: '',
    brand: '',
    color: '',
    warranty: ''
  });
  
  const [images, setImages] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // Fetch categories and product data concurrently with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const [categoriesResponse, productData] = await Promise.all([
          getCategories(),
          getProduct(id)
        ]);

        clearTimeout(timeoutId);

        if (!categoriesResponse.success) {
          message.error('Failed to load categories');
          return;
        }

        const allCategories = categoriesResponse.data;
        setCategories(allCategories);

        if (!productData) {
          message.error('Failed to load product');
          return;
        }

        // Set the form data with all product information
        setFormData({
          name: productData.name || '',
          description: productData.description || '',
          price: productData.price || '',
          stock: productData.quantity || productData.amount || '',
          category: productData.categoryId?._id || productData.category || '', 
          subcategory: productData.subcategoryId?._id || productData.subcategory || '', 
          brand: productData.brand || '',
          color: productData.color || '',
          warranty: productData.warranty || ''
        });

        // Handle images
        if (productData.images && Array.isArray(productData.images)) {
          console.log('Setting current images:', productData.images);
          // Handle both string URLs and object URLs
          const imageUrls = productData.images.map(img => 
            typeof img === 'string' ? img : img.url || img
          );
          setCurrentImages(imageUrls);
        } else if (productData.image) {
          console.log('Setting single image as array:', [productData.image]);
          setCurrentImages([productData.image]);
        } else {
          console.log('No images found in product data');
          setCurrentImages([]);
        }

        // If we have a category, load its subcategories
        if (productData.categoryId?._id || productData.category) {
          const categoryId = productData.categoryId?._id || productData.category;
          const selectedCategory = allCategories.find(cat => cat._id === categoryId);
          if (selectedCategory && selectedCategory.subcategories) {
            setSubcategories(selectedCategory.subcategories);
          }
        }

      } catch (err) {
        console.error('Error:', err);
        
        // More detailed error handling
        if (err.name === 'AbortError') {
          message.error('Request timed out. Please check your internet connection.');
        } else {
          message.error('Failed to load data');
        }
      }
    };

    fetchProductData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'category') {
      const selectedCategory = categories.find(cat => cat._id === value);
      if (selectedCategory) {
        // Update subcategories based on the selected category
        const newSubcategories = selectedCategory.subcategories || [];
        setSubcategories(newSubcategories);
        
        // Update form data and reset subcategory
        setFormData(prev => ({
          ...prev,
          category: value,
          subcategory: '' // Reset subcategory when category changes
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveCurrentImage = (index) => {
    setCurrentImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!formData.name || !formData.price || !formData.category) {
      message.error('Please fill in all required fields');
      return;
    }

    // Prepare product data for update
    const productUpdateData = {
      name: formData.name,
      price: Number(formData.price),
      quantity: Number(formData.stock || 0),
      category: formData.category,
      subcategory: formData.subcategory || undefined,
      brand: formData.brand || undefined,
      color: formData.color || undefined,
      warranty: formData.warranty ? Number(formData.warranty) : undefined,
      description: formData.description || undefined
    };

    // Validate price and quantity
    if (isNaN(productUpdateData.price) || productUpdateData.price < 0) {
      message.error('Price must be a valid positive number');
      return;
    }

    if (isNaN(productUpdateData.quantity) || productUpdateData.quantity < 0) {
      message.error('Quantity must be a valid positive number');
      return;
    }

    try {
      setLoading(true);
      
      // Upload new images to Cloudinary
      let cloudinaryUrls = [];
      if (images.length > 0) {
        try {
          const uploadPromises = images.map(async (image) => {
            // Use your Cloudinary cloud name
            const CLOUDINARY_CLOUD_NAME = 'dmauyxqhi';
            const CLOUDINARY_UPLOAD_PRESET = 'markato-E-Commerce';

            const formData = new FormData();
            formData.append('file', image.file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
            
            try {
              const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, 
                {
                  method: 'POST',
                  body: formData
                }
              );
              
              if (!response.ok) {
                const errorData = await response.json();
                console.error('Cloudinary upload error details:', errorData);
                throw new Error(`Image upload failed: ${JSON.stringify(errorData)}`);
              }
              
              const result = await response.json();
              console.log('Cloudinary upload success:', result);
              return result.secure_url;
            } catch (error) {
              console.error('Error uploading to Cloudinary:', error);
              throw error;
            }
          });
          
          cloudinaryUrls = await Promise.all(uploadPromises);
          console.log('All Cloudinary uploads successful:', cloudinaryUrls);
        } catch (error) {
          console.error('Error uploading images:', error);
          message.error('Failed to upload one or more images');
          throw error;
        }
      }

      // Combine current and new image URLs
      const allImageUrls = [
        ...(currentImages || []),
        ...cloudinaryUrls
      ];

      console.log('All image URLs:', allImageUrls);

      // Add images to product update data
      productUpdateData.images = allImageUrls;

      console.log('Product Update Data:', productUpdateData);

      // Call update product service
      const response = await updateProduct(id, productUpdateData);
      
      if (response.success) {
        message.success(response.message || 'Product updated successfully!');
        navigate('/seller/ProductList');
      } else {
        // More detailed error handling
        const errorMessage = response.message || 'Failed to update product';
        message.error(errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Error updating product:', err);
      const errorMessage = err.message || 'An unexpected error occurred';
      message.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Product Name*
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Category*
              </label>
              <select
                name="category"
                value={formData.category || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option 
                    key={category._id} 
                    value={category._id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Subcategory
              </label>
              <select
                name="subcategory"
                value={formData.subcategory || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                disabled={!formData.category || subcategories.length === 0}
              >
                <option value="">Select Subcategory</option>
                {subcategories.map(subcategory => (
                  <option 
                    key={subcategory._id} 
                    value={subcategory._id}
                  >
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Price*
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                required
                min="0"
                step="0.01"
              />
            </div>

            {/* Stock */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Quantity*
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                required
                min="0"
              />
            </div>

            {/* Brand */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Color */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Color
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Warranty */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Warranty (months)
              </label>
              <input
                type="number"
                name="warranty"
                value={formData.warranty}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                min="0"
              />
            </div>

            {/* Multiple Image Upload */}
            <div className="mb-4 col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Product Images
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                multiple
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
              />
              
              {/* Display current images */}
              {currentImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-bold mb-2">Current Images:</p>
                  <div className="grid grid-cols-3 gap-4">
                    {currentImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={typeof image === 'string' ? image : image.url || image}
                          alt={`Current ${index + 1}`}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCurrentImage(index)}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 hover:bg-gray-100"
                        >
                          <DeleteOutlined className="text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Display new images */}
              {images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-bold mb-2">New Images:</p>
                  <div className="grid grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.preview}
                          alt={`New ${index + 1}`}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(index)}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 hover:bg-gray-100"
                        >
                          <DeleteOutlined className="text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
              rows="4"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/seller/ProductList')}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;