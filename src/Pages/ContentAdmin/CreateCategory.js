import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const CreateCategory = ({ addCategory }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(''); // State for image preview

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!image) return; // Ensure an image is selected

    const newCategory = {
      id: Date.now(), // Generate a unique ID based on the current time
      name,
      image: URL.createObjectURL(image), // Create a local URL for the image
    };

    addCategory(newCategory); // Call the function passed as a prop
    navigate('/Content-Admin/category'); // Redirect back to the category list
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Set the selected file to state
      setImagePreview(URL.createObjectURL(file)); // Create a local URL for preview
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">Create New Category</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div>
          <label className="block mb-2">Category Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-md px-4 py-2 w-full"
            required
          />
        </div>
        <div className="mt-4">
          <label className="block mb-2">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border rounded-md px-4 py-2 w-full"
            required
          />
        </div>
        {imagePreview && ( // Conditionally render the image preview if available
          <div className="mt-4">
            <label className="block mb-2">Image Preview</label>
            <img
              src={imagePreview}
              alt="Selected"
              className="w-32 h-32 object-cover mb-2"
            />
          </div>
        )}
        <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded-3xl mt-4">
          Create Category
        </button>
      </form>
    </div>
  );
};

export default CreateCategory;
