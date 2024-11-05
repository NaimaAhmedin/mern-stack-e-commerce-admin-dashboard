// src/Pages/ContentAdmin/CategoryList.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdModeEditOutline, MdSearch } from "react-icons/md";

const CategoryList = ({ categories, setCategories }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectCategory = (id) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]
    );
  };

  const allSelected = filteredCategories.length > 0 && selectedCategories.length === filteredCategories.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(filteredCategories.map(category => category.id));
    }
  };

  const handleEdit = (id) => {
    navigate(`/Content-Admin/category/edit/${id}`);
  };

  const handleDelete = () => {
    setCategories(categories.filter(category => !selectedCategories.includes(category.id)));
    setSelectedCategories([]);
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
            <MdSearch className="absolute right-2 top-2 text-gray-500" size={20} />
          </div>
         
          <button
            onClick={() => navigate('/Content-Admin/category/create')}
            className="bg-orange-600 text-white px-4 py-2 rounded-3xl"
          >
            + Create
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
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4">
                <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
              </th>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map(category => (
              <tr key={category.id} className="border-b">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleSelectCategory(category.id)}
                  />
                </td>
                <td className="p-4">
                  <img src={category.image} alt={category.name} className="w-10 h-10 object-cover rounded-full" />
                </td>
                <td className="p-4">{category.name}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleEdit(category.id)}
                    className="text-orange-500 hover:text-orange-600"
                    aria-label="Edit"
                  >
                    <MdModeEditOutline size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryList;
