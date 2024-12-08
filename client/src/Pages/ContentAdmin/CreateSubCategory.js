import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../../services/categoryService';
import { createSubcategory } from '../../services/subcategoryService';

const CreateSubCategory = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [parentCategoryId, setParentCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories');
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const subcategoryData = {
        name,
        categoryId: parentCategoryId,
      };

      await createSubcategory(subcategoryData);
      navigate('/Content-Admin/subcategory');
    } catch (err) {
      setError(err.message || 'Failed to create subcategory');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Subcategory</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Subcategory Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Parent Category
            </label>
            <select
              value={parentCategoryId}
              onChange={(e) => setParentCategoryId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
              required
            >
              <option value="">Select a Parent Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/Content-Admin/subcategory')}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:bg-orange-300"
            >
              {loading ? 'Creating...' : 'Create Subcategory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubCategory;
