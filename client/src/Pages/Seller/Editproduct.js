import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct, updateProduct } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
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
  width: '100%',
  height: '500px',
  marginBottom: '2rem',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
};

const defaultCenter = {
  lat: 9.0222,  // Default center at Addis Ababa
  lng: 38.7468
};

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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
      coordinates: [38.7468, 9.0222] // Default to Addis Ababa
    }
  });

  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [locationName, setLocationName] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [images, setImages] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to get location name from coordinates
  const getLocationName = async (lat, lng) => {
    try {
      setIsLoadingLocation(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      return data.display_name || 'Location name not found';
    } catch (error) {
      console.error('Error getting location name:', error);
      return 'Error getting location name';
    } finally {
      setIsLoadingLocation(false);
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        console.log('Fetching product data for id:', id);
        const [categoriesResponse, productData] = await Promise.all([
          getCategories(),
          getProduct(id)
        ]);

        console.log('Product data:', productData);

        if (!categoriesResponse.success) {
          message.error('Failed to load categories');
          return;
        }

        const allCategories = categoriesResponse.data;
        setCategories(allCategories);

        // Set location and marker position from product data
        if (productData.location && productData.location.coordinates) {
          const [lng, lat] = productData.location.coordinates;
          setMarkerPosition({ lat, lng });
          // Get location name for the initial coordinates
          const name = await getLocationName(lat, lng);
          setLocationName(name);
        }

        // Set form data
        setFormData({
          name: productData.name || '',
          description: productData.description || '',
          price: productData.price || '',
          quantity: productData.quantity || '',
          category: productData.categoryId || '',
          subcategory: productData.subcategoryId || '',
          brand: productData.brand || '',
          color: productData.color || '',
          warranty: productData.warranty || '',
          location: productData.location || {
            type: 'Point',
            coordinates: [38.7468, 9.0222]
          }
        });

        // Set current images
        console.log('Setting current images:', productData.images);
        if (productData.images && Array.isArray(productData.images)) {
          setCurrentImages(productData.images);
        }

      } catch (err) {
        console.error('Error fetching product data:', err);
        message.error('Failed to load product data');
      }
    };

    fetchProductData();
  }, [id]);

  const MapEvents = () => {
    const map = useMap();
    
    useEffect(() => {
      map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        setMarkerPosition({ lat, lng });
        setFormData(prev => ({
          ...prev,
          location: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        }));

        // Get and set location name for the new coordinates
        const name = await getLocationName(lat, lng);
        setLocationName(name);
      });
    }, [map]);

    return null;
  };

  const renderMap = () => (
    <MapContainer
      center={[markerPosition.lat, markerPosition.lng]}
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
    
    // Validate total number of images
    if (files.length + currentImages.length > 5) {
      message.error('Maximum 5 images allowed');
      return;
    }

    // Create preview URLs for new images
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveNewImage = (index) => {
    setImages(prev => {
      const newImages = [...prev];
      // Clean up the preview URL
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleRemoveCurrentImage = (index) => {
    setCurrentImages(prev => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create FormData object
      const productData = new FormData();
      
      // Validate and convert numeric fields
      const price = parseFloat(formData.price);
      const quantity = parseInt(formData.quantity);
      const warranty = parseInt(formData.warranty);

      // Validate price
      if (isNaN(price) || price <= 0) {
        message.error('Please enter a valid price greater than 0');
        setLoading(false);
        return;
      }

      // Validate quantity
      if (isNaN(quantity) || quantity < 0) {
        message.error('Please enter a valid quantity (0 or greater)');
        setLoading(false);
        return;
      }

      // Append basic fields
      productData.append('name', formData.name);
      productData.append('description', formData.description);
      productData.append('price', price);
      productData.append('quantity', quantity);
      productData.append('categoryId', formData.category);
      productData.append('subcategoryId', formData.subcategory);
      productData.append('brand', formData.brand);
      productData.append('color', formData.color);
      productData.append('warranty', warranty || 0);
      
      // Append location if exists
      if (formData.location) {
        productData.append('location', JSON.stringify(formData.location));
      }

      // Append new images
      images.forEach(image => {
        productData.append('images', image.file);
      });

      // Append current images
      productData.append('currentImages', JSON.stringify(currentImages));

      // Log form data for debugging
      console.log('Form data being sent:');
      for (let [key, value] of productData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await updateProduct(id, productData);

      if (response.success) {
        message.success('Product updated successfully');
        navigate('/seller/productList');
      } else {
        setError(response.message || 'Failed to update product');
        message.error(response.message || 'Failed to update product');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.message || 'Failed to update product');
      message.error(err.message || 'Failed to update product');
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
                Product Images (Max 5)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full p-2 border rounded"
                disabled={currentImages.length + images.length >= 5}
              />
              <div className="mt-4">
                {/* Current Images */}
                {currentImages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-2">Current Images:</p>
                    <div className="flex flex-wrap gap-4">
                      {currentImages.map((url, index) => (
                        <div key={`current-${index}`} className="relative w-24 h-24">
                          <img
                            src={url}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover rounded"
                            onError={(e) => {
                              console.error('Image failed to load:', url);
                              e.target.src = '/placeholder-image.jpg'; // Add a placeholder image
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveCurrentImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images */}
                {images.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2">New Images:</p>
                    <div className="flex flex-wrap gap-4">
                      {images.map((image, index) => (
                        <div key={`new-${index}`} className="relative w-24 h-24">
                          <img
                            src={image.preview}
                            alt={`New ${index + 1}`}
                            className="w-full h-full object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {5 - (currentImages.length + images.length)} image slots remaining
              </p>
            </div>

            {/* Product Location */}
            <div className="col-span-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Product Location
              </label>
              <div className="relative">
                {renderMap()}
                <div className="mt-2 p-3 bg-gray-50 rounded-md shadow-sm">
                  {isLoadingLocation ? (
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Loading location details...
                    </div>
                  ) : locationName && (
                    <div>
                      <p className="font-semibold text-gray-700">Selected Location:</p>
                      <p className="text-gray-600 text-sm break-words">{locationName}</p>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Click anywhere on the map to update the product location
              </p>
            </div>

            {/* Product Description */}
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

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
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