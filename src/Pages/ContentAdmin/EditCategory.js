import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditCategory = ({ categories, setCategories }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [category, setCategory] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const categoryToEdit = categories.find(cat => cat.id === parseInt(id));
    if (categoryToEdit) {
      setCategory(categoryToEdit);
      setImagePreview(categoryToEdit.image); // Set initial preview to current image
    }
  }, [id, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedCategory = {
      ...category,
      name: e.target.name.value,
      image: newImage ? imagePreview : category.image, // Use new image if provided
    };

    setCategories(prevCategories => 
      prevCategories.map(cat => (cat.id === updatedCategory.id ? updatedCategory : cat))
    );
    navigate('/Content-Admin/category');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file); // Create a local URL for the image preview
      setNewImage(file); // Set the selected file to state
      setImagePreview(previewUrl); // Update the image preview
    }
  };

  if (!category) return null; // Render nothing until the category is loaded

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">Edit Category</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div>
          <label className="block mb-2">Category Name</label>
          <input
            type="text"
            name="name"
            defaultValue={category.name}
            className="border rounded-md px-4 py-2 w-full"
            required
          />
        </div>
        <div className="mt-4">
          <label className="block mb-2">Current Image</label>
          <img
            src={newImage ? imagePreview : category.image} // Display the new image if selected, else display the current image
            alt={category.name}
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
        <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded-3xl mt-4">
          Update Category
        </button>
      </form>
    </div>
  );
};

export default EditCategory;
