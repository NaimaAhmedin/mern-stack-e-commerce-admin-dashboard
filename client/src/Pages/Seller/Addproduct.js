import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { message } from 'antd';

const AddProduct = () => {
  const navigate = useNavigate();
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
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !images.length || !formData.price || !formData.category) {
      setError('Name, images, price, and category are required.');
      return;
    }

    // Validate price and stock are numbers
    if (isNaN(formData.price) || (formData.stock && isNaN(formData.stock))) {
      setError('Price and stock must be valid numbers.');
      return;
    }

    const productData = new FormData();
    // First append the images
    images.forEach((image, index) => {
      productData.append('images', image);
    });
    // Then append other form data
    Object.keys(formData).forEach(key => {
      if (formData[key]) { // Only append if value exists
        // Map some keys to match backend expectations
        const mappedKey = key === 'stock' ? 'amount' : 
                          key === 'category' ? 'categoryId' : 
                          key === 'subcategory' ? 'subcategoryId' : 
                          key;
        productData.append(mappedKey, formData[key]);
      }
    });

    try {
      setLoading(true);
      const response = await createProduct(productData);
      
      if (response.success) {
        message.success(response.message || 'Product created successfully!');
        navigate('/seller/productList');
      } else {
        // More detailed error handling
        const errorMessage = response.message || 'Failed to create product';
        message.error(errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Error creating product:', err);
      const errorMessage = err.message || 'An unexpected error occurred';
      message.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (response.success) {
        setCategories(response.data);
      } else {
        message.error('Failed to load categories');
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      message.error('Failed to load categories');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // When category changes, update subcategories
    if (name === 'category') {
      const selectedCategory = categories.find(cat => cat._id === value);
      if (selectedCategory && selectedCategory.subcategories) {
        setSubcategories(selectedCategory.subcategories);
        // Reset subcategory when category changes
        setFormData(prev => ({
          ...prev,
          [name]: value,
          subcategory: ''
        }));
      } else {
        setSubcategories([]);
      }
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    const newImages = Array.from(files);
    setImages(prev => [...prev, ...newImages]);
    const newImagePreviewUrls = newImages.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newImagePreviewUrls]);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

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
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
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
                value={formData.subcategory}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                disabled={!formData.category || subcategories.length === 0}
              >
                <option value="">Select Subcategory</option>
                {subcategories.map(subcat => (
                  <option key={subcat._id} value={subcat._id}>
                    {subcat.name}
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
                Stock*
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

            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Product Images*
              </label>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                accept="image/*"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                required
              />
              {imagePreviewUrls.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {imagePreviewUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  ))}
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
              onClick={() => navigate('/seller/products')}
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
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
