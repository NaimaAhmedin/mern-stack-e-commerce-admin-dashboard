import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditSubCategory = ({ subCategories = [], categories = [], setSubCategories = () => {} }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subCategory, setSubCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  useEffect(() => {
    const foundSubCategory = subCategories.find(sub => sub.id === parseInt(id, 10));
    if (foundSubCategory) {
      setSubCategory(foundSubCategory);
      setImagePreview(foundSubCategory.imageUrl || foundSubCategory.image); // Handle both imageUrl and image
      setSelectedCategoryId(foundSubCategory.parentCategoryId);
    }
    setLoading(false); // Stop loading once data is processed
  }, [id, subCategories]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedSubCategory = {
      ...subCategory,
      name: e.target.name.value,
      imageUrl: newImage ? imagePreview : subCategory.imageUrl || subCategory.image,
      parentCategoryId: selectedCategoryId,
    };

    setSubCategories(prevSubCategories =>
      prevSubCategories.map(sub => (sub.id === updatedSubCategory.id ? updatedSubCategory : sub))
    );

    navigate('/Content-Admin/subcategory');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setNewImage(file);
      setImagePreview(previewUrl);
    }
  };

  if (loading) return <p>Loading...</p>; // Show loading until data is loaded
  if (!subCategory) return <p>Subcategory not found</p>; // If no subCategory found

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">Edit Subcategory</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div>
          <label className="block mb-2">Subcategory Name</label>
          <input
            type="text"
            name="name"
            defaultValue={subCategory.name}
            className="border rounded-md px-4 py-2 w-full"
            required
          />
        </div>
        <div className="mt-4">
          <label className="block mb-2">Current Image</label>
          <img
            src={newImage ? imagePreview : subCategory.imageUrl || subCategory.image}
            alt={subCategory.name}
            className="w-32 h-32 object-cover mb-2"
          />
        </div>
        <div className="mt-4">
          <label className="block mb-2">Upload New Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border rounded-md px-4 py-2 w-full"
          />
        </div>
        <div className="mt-4">
          <label className="block mb-2">Parent Category</label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="border rounded-md px-4 py-2 w-full"
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded-3xl mt-4">
          Update Subcategory
        </button>
      </form>
    </div>
  );
};

export default EditSubCategory;
