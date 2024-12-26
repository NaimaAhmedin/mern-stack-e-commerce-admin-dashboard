import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from 'antd';
import { getCategory, updateCategory } from "../../services/categoryService";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState({ name: "", image: "" });
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getCategory(id);
        console.log('Category response:', response); // Debug log
        
        if (response.success && response.data) {
          const categoryData = response.data;
          setCategory({
            name: categoryData.name,
            image: categoryData.image // This will now be an object with url and public_id
          });
          // Use the Cloudinary URL for image preview
          setImagePreview(categoryData.image?.url || '');
        } else {
          message.error(response.message || 'Failed to fetch category details');
        }
      } catch (err) {
        console.error('Error details:', err); // Debug log
        message.error(err.message || 'Failed to fetch category details');
      }
    };
    fetchCategory();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        message.error('Image size should be less than 5MB');
        return;
      }
      setCategory((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", category.name);
      
      // Only append image if it's a new file
      if (category.image instanceof File) {
        formData.append("image", category.image);
      }

      console.log('Submitting category update:', {
        id,
        name: category.name,
        hasNewImage: category.image instanceof File
      }); // Debug log

      const response = await updateCategory(id, formData);
      console.log('Update response:', response); // Debug log
      
      if (response.success) {
        message.success('Category updated successfully');
        navigate("/Content-Admin/category");
      } else {
        throw new Error(response.message || 'Failed to update category');
      }
    } catch (err) {
      console.error('Update error details:', err); // Debug log
      message.error(err.message || 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Category</h1>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              value={category.name}
              onChange={handleInputChange}
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
            />
            {imagePreview && (
              <div className="mt-4">
                <img 
                  src={imagePreview} 
                  alt="Category Preview" 
                  className="w-32 h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = '/default-category.png'; // Fallback image
                    console.warn(`Failed to load image for category`);
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/Content-Admin/category")}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Updating..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
