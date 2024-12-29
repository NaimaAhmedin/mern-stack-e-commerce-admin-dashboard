import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCategory } from '../../services/categoryService';

const CreateCategory = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !image) {
      setError('Category name and image are required.');
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);

    try {
      setLoading(true);
      const response = await createCategory(formData);
      if (response.success) {
        navigate('/Content-Admin/category'); // Redirect to category list
      } else {
        setError(response.message || 'Failed to create category. Try again.');
      }
    } catch (err) {
      console.error('Error creating category:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Category</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Image
            </label>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
              required
            />
            {imagePreview && (
              <div className="mt-4">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = '/default-image.png'; // Fallback image
                    console.warn('Failed to load category image preview');
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/Content-Admin/category')}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:bg-orange-300"
            >
              {loading ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategory;
