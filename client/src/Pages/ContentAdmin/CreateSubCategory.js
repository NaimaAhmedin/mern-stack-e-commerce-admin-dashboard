import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateSubCategory = ({ addSubCategory, categories }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [parentCategoryId, setParentCategoryId] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newSubCategory = {
      id: Date.now(),
      name,
      imageUrl: selectedImage,
      parentCategoryId,  // Store the parent category ID
    };

    addSubCategory(newSubCategory);
    navigate('/Content-Admin/subcategory');
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">Create New SubCategory</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div>
          <label className="block mb-2">SubCategory Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-md px-4 py-2 w-full"
            required
          />
        </div>
        <div className="mt-4">
          <label className="block mb-2">Image Upload</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="border rounded-md px-4 py-2 w-full"
            required
          />
        </div>
        {selectedImage && (
          <div className="mt-4">
            <h2 className="text-lg">Selected Image:</h2>
            <img src={selectedImage} alt="Selected Preview" className="mt-2 w-48 h-48 object-cover" />
          </div>
        )}
        <div className="mt-4">
          <label className="block mb-2">Parent Category</label>
          <select
            value={parentCategoryId}
            onChange={(e) => setParentCategoryId(e.target.value)}
            className="border rounded-md px-4 py-2 w-full"
            required
          >
            <option value="">Select a Parent Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded-3xl mt-4">
          Create SubCategory
        </button>
      </form>
    </div>
  );
};

export default CreateSubCategory;
