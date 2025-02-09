import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { message } from 'antd';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const containerStyle = {
  width: '100%',  // Full viewport width
  height: '500px', // Increased height
  marginBottom: '2rem',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
};

const center = {
  lat: 9.0222,  // Default center at Addis Ababa
  lng: 38.7468
};

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '', 
    category: '',
    subcategory: '',
    brand: '',
    color: '',
    warranty: '',
    location: {
      type: 'Point',
      coordinates: [38.7468, 9.0222] // [longitude, latitude]
    }
  });
  const [images, setImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(center);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name || !formData.category || !formData.price) {
        setError('Please fill in all required fields: Name, Category, and Price');
        setLoading(false);
        return;
      }

      // Create FormData
      const productData = new FormData();
      productData.append('name', formData.name);
      productData.append('description', formData.description);
      productData.append('price', formData.price);
      productData.append('quantity', formData.quantity);
      productData.append('categoryId', formData.category);
      productData.append('subcategoryId', formData.subcategory);
      productData.append('brand', formData.brand);
      productData.append('color', formData.color);
      productData.append('warranty', formData.warranty);
      productData.append('location', JSON.stringify(formData.location));

      // Append images
      if (images && images.length > 0) {
        images.forEach((image, index) => {
          productData.append('images', image);
        });
      }

      console.log('Submitting Product Data:');
      for (let [key, value] of productData.entries()) {
        console.log(`${key}:`, value);
      }

      // Call create product service
      const response = await createProduct(productData);

      // Handle successful product creation
      console.log('Product Created Successfully:', response);
      setLoading(false);
      
      // Optional: Reset form or navigate to product list
      setFormData({
        name: '',
        description: '',
        price: '',
        quantity: '', 
        category: '',
        subcategory: '',
        brand: '',
        color: '',
        warranty: '',
        location: {
          type: 'Point',
          coordinates: [38.7468, 9.0222] // [longitude, latitude]
        }
      });
      navigate('/seller/productList');
    } catch (err) {
      console.error('Product Creation Error:', err);
      setError(err.message || 'Failed to create product. Please try again.');
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
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      message.error('You can only upload up to 5 images');
      return;
    }
    
    // Update the images state with the actual files
    setImages(prevImages => {
      const newImages = [...prevImages, ...files];
      if (newImages.length > 5) {
        message.warning('Only the first 5 images will be used');
        return newImages.slice(0, 5);
      }
      return newImages;
    });
    
    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prevUrls => {
      const combinedUrls = [...prevUrls, ...newPreviewUrls];
      if (combinedUrls.length > 5) {
        // Clean up unused URLs
        newPreviewUrls.slice(5).forEach(url => URL.revokeObjectURL(url));
        return combinedUrls.slice(0, 5);
      }
      return combinedUrls;
    });
  };

  const handleRemoveImage = (index) => {
    setImages(prevImages => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });

    setImagePreviewUrls(prevUrls => {
      const newUrls = [...prevUrls];
      URL.revokeObjectURL(newUrls[index]); // Clean up the URL
      newUrls.splice(index, 1);
      return newUrls;
    });
  };

  const MapEvents = () => {
    const map = useMap();
    
    useEffect(() => {
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setMarkerPosition({ lat, lng });
        setFormData(prev => ({
          ...prev,
          location: {
            type: 'Point',
            coordinates: [lng, lat] // MongoDB expects [longitude, latitude]
          }
        }));
      });
    }, [map]);

    return null;
  };

  const renderMap = () => (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      style={containerStyle}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker 
        position={[markerPosition.lat, markerPosition.lng]}
      />
      <MapEvents />
    </MapContainer>
  );

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

            {/* Quantity */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Quantity*
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
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
            <div className="col-span-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Product Images (Up to 5)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full p-2 border rounded"
              />
              {imagePreviewUrls.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Location */}
            <div className="col-span-2 mb-6 -mx-6 px-6">
              <label className="block text-gray-700 text-sm font-bold mb-3">
                Product Location* (Click on the map to set location)
              </label>
              <div className="relative">
                {renderMap()}
              </div>
            </div>

            {/* Description */}
            <div className="col-span-2 mb-4">
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
