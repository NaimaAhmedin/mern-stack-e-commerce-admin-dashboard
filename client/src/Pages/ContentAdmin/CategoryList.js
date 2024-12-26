import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdModeEditOutline,
  MdSearch,
  MdExpandMore,
  MdExpandLess,
  MdAdd,
  MdDelete,
} from "react-icons/md";
import { message } from "antd";
import { getCategories, deleteCategory } from "../../services/categoryService";
import {
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "../../services/subcategoryService";

const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    type: "",
    categoryId: null,
    subcategoryId: null,
  });
  const [subcategoryName, setSubcategoryName] = useState("");

  // Fetch categories from  backend
  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (response.success && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        message.error(response.message || "Failed to load categories");
        setCategories([]); // Set empty array as fallback
      }
    } catch (err) {
      console.error("Error loading categories:", err);
      message.error(err.message || "Failed to load categories");
      setCategories([]); // Set empty array on error
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Toggle category expansion
  const toggleExpand = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Filtered categories based on search input
  const filteredCategories = Array.isArray(categories)
    ? categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Handle select/deselect for individual categories
  const toggleSelectCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  // Check if all categories are selected
  const allSelected =
    filteredCategories.length > 0 &&
    selectedCategories.length === filteredCategories.length;

  // Handle select/deselect all
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(filteredCategories.map((category) => category._id));
    }
  };

  // Navigate to the edit category page
  const handleEdit = (id) => {
    navigate(`/Content-Admin/category/edit/${id}`);
  };

  // Delete selected categories
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedCategories.length} ${
        selectedCategories.length === 1 ? "category" : "categories"
      }?`
    );

    if (!confirmDelete) return;

    try {
      await Promise.all(selectedCategories.map((id) => deleteCategory(id)));
      await fetchCategories(); // Refresh the list after deletion
      setSelectedCategories([]);
      message.success("Categories deleted successfully");
    } catch (err) {
      console.error("Error deleting categories:", err);
      message.error(err.message || "Failed to delete categories");
    }
  };

  // Handle subcategory operations
  const openModal = (
    type,
    categoryId,
    subcategoryId = null,
    initialName = ""
  ) => {
    setModalData({ type, categoryId, subcategoryId });
    setSubcategoryName(initialName);
    setIsModalOpen(true);
  };

  // Handle create/update subcategory
  const handleSubcategorySubmit = async (e) => {
    e.preventDefault();

    const subcategoryData = {
      name: subcategoryName,
      categoryId: modalData.categoryId,
    };

    try {
      let response;
      if (modalData.type === "create") {
        response = await createSubcategory(subcategoryData);
      } else if (modalData.type === "edit") {
        response = await updateSubcategory(
          modalData.subcategoryId,
          subcategoryData
        );
      }

      if (response.success) {
        message.success(
          `Subcategory ${
            modalData.type === "create" ? "created" : "updated"
          } successfully`
        );
        await fetchCategories(); // Refresh the categories list
        setIsModalOpen(false);
        setSubcategoryName("");
        setModalData({ type: "", categoryId: null, subcategoryId: null });
      } else {
        throw new Error(
          response.message || `Failed to ${modalData.type} subcategory`
        );
      }
    } catch (err) {
      console.error(`Error ${modalData.type}ing subcategory:`, err);
      message.error(err.message || `Failed to ${modalData.type} subcategory`);
    }
  };

  const handleDeleteSubcategory = async (categoryId, subcategoryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this subcategory?"
    );
    if (!confirmDelete) return;

    try {
      const response = await deleteSubcategory(subcategoryId);
      if (response.success) {
        message.success("Subcategory deleted successfully");
        await fetchCategories(); // Refresh the categories list
      } else {
        throw new Error(response.message || "Failed to delete subcategory");
      }
    } catch (err) {
      console.error("Error deleting subcategory:", err);
      message.error(err.message || "Failed to delete subcategory");
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories</h1>

        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-3xl pl-10"
            />
            <MdSearch
              className="absolute right-2 top-2 text-gray-500"
              size={20}
            />
          </div>

          <button
            onClick={() => navigate("/Content-Admin/category/create")}
            className="bg-orange-600 text-white px-4 py-2 rounded-3xl"
          >
            + Create Category
          </button>
          {selectedCategories.length > 0 && (
            <button
              onClick={handleDelete}
              className="bg-orange-600 text-white px-4 py-2 rounded-3xl"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 bg-white shadow-md rounded-lg">
        {error && <p className="text-red-500 text-center">{error}</p>}
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <React.Fragment key={category._id}>
                <tr className="border-b">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category._id)}
                      onChange={() => toggleSelectCategory(category._id)}
                    />
                  </td>
                  <td className="p-4">
                    <img 
                      src={category.image?.url || '/default-category.png'} 
                      alt={category.name} 
                      className="w-10 h-10 object-cover rounded-full"
                      onError={(e) => {
                        e.target.src = '/default-category.png'; // Fallback image
                        console.warn(`Failed to load image for category: ${category.name}`);
                      }}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      {category.name}
                      <button
                        onClick={() => toggleExpand(category._id)}
                        className="ml-2 text-gray-500"
                      >
                        {expandedCategories[category._id] ? (
                          <MdExpandLess size={20} />
                        ) : (
                          <MdExpandMore size={20} />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category._id)}
                        className="text-orange-500 hover:text-orange-600"
                      >
                        <MdModeEditOutline size={20} />
                      </button>
                      <button
                        onClick={() => openModal("create", category._id)}
                        className="text-green-500 hover:text-green-600"
                      >
                        <MdAdd size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedCategories[category._id] && category.subcategories && (
                  <tr>
                    <td colSpan="4" className="p-0">
                      <div className="pl-12 pr-4 py-2 bg-gray-50">
                        <div className="font-medium mb-2">Subcategories:</div>
                        {category.subcategories.length === 0 ? (
                          <div className="text-gray-500">No subcategories</div>
                        ) : (
                          <div className="space-y-2">
                            {category.subcategories.map((sub) => (
                              <div
                                key={sub._id}
                                className="flex items-center justify-between py-1"
                              >
                                <span>{sub.name}</span>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      openModal(
                                        "edit",
                                        category._id,
                                        sub._id,
                                        sub.name
                                      )
                                    }
                                    className="text-orange-500 hover:text-orange-600"
                                  >
                                    <MdModeEditOutline size={18} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteSubcategory(
                                        category._id,
                                        sub._id
                                      )
                                    }
                                    className="text-red-500 hover:text-red-600"
                                  >
                                    <MdDelete size={18} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Subcategory Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {modalData.type === "create"
                ? "Create Subcategory"
                : "Edit Subcategory"}
            </h2>
            <form onSubmit={handleSubcategorySubmit}>
              <input
                type="text"
                value={subcategoryName}
                onChange={(e) => setSubcategoryName(e.target.value)}
                placeholder="Subcategory name"
                className="w-full px-4 py-2 border rounded mb-4"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
