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
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
};

const defaultCenter = {
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
      coordinates: [defaultCenter.lng, defaultCenter.lat]
    }
  });
  const [images, setImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [locationName, setLocationName] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(true);
  const [locationError, setLocationError] = useState('');

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
          coordinates: [defaultCenter.lng, defaultCenter.lat]
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

  // Function to get user's current location
  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setIsGettingCurrentLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Update marker position and form data
          setMarkerPosition({ lat: latitude, lng: longitude });
          setFormData(prev => ({
            ...prev,
            location: {
              type: 'Point',
              coordinates: [longitude, latitude]
            }
          }));

          // Get location name for the current position
          try {
            const name = await getLocationName(latitude, longitude);
            setLocationName(name);
          } catch (error) {
            console.error('Error getting location name:', error);
          }
          setIsGettingCurrentLocation(false);
        },
        (error) => {
          console.error('Error getting current location:', error);
          setLocationError('Could not get your current location. Using default location.');
          setIsGettingCurrentLocation(false);
          // Get location name for default position
          getLocationName(defaultCenter.lat, defaultCenter.lng).then(name => {
            setLocationName(name);
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser. Using default location.');
      setIsGettingCurrentLocation(false);
      // Get location name for default position
      getLocationName(defaultCenter.lat, defaultCenter.lng).then(name => {
        setLocationName(name);
      });
    }
  };

  // Get current location when component mounts
  useEffect(() => {
    getCurrentLocation();
  }, []);

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
            <div className="col-span-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Product Location
              </label>
              <div className="relative">
                {isGettingCurrentLocation ? (
                  <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <svg className="animate-spin h-8 w-8 mx-auto mb-2 text-blue-500" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <p className="text-gray-600">Getting your current location...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {renderMap()}
                    {locationError && (
                      <div className="mt-2 text-yellow-600 text-sm">
                        <p>{locationError}</p>
                      </div>
                    )}
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
                  </>
                )}
              </div>
              <div className="mt-1 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Click anywhere on the map to set the product location
                </p>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none"
                >
                  Use My Location
                </button>
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
