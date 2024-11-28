import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdModeEditOutline, MdSearch } from "react-icons/md";

const SubCategoryList = ({ subCategories, categories, setSubCategories }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  
    const filteredSubCategories = subCategories.filter(subCategory =>
      subCategory.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const toggleSelectSubCategory = (id) => {
      setSelectedSubCategories(prev =>
        prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]
      );
    };
  
    const allSelected = filteredSubCategories.length > 0 && selectedSubCategories.length === filteredSubCategories.length;
  
    const toggleSelectAll = () => {
      if (allSelected) {
        setSelectedSubCategories([]);
      } else {
        setSelectedSubCategories(filteredSubCategories.map(subCategory => subCategory.id));
      }
    };
  
    const handleEdit = (id) => {
      navigate(`/Content-Admin/subcategory/edit/${id}`);
    };
  
    const handleDelete = () => {
      setSubCategories(subCategories.filter(subCategory => !selectedSubCategories.includes(subCategory.id)));
      setSelectedSubCategories([]);
    };
  
    return (
      <div className="p-4 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Subcategories</h1>
          
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
              onClick={() => navigate('/Content-Admin/subcategory/create')}
              className="bg-orange-600 text-white px-4 py-2 rounded-3xl"
            >
              + Create
            </button>
            {selectedSubCategories.length > 0 && (
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
                <th className="p-4">Parent Category</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubCategories.map(subCategory => (
                <tr key={subCategory.id} className="border-b">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedSubCategories.includes(subCategory.id)}
                      onChange={() => toggleSelectSubCategory(subCategory.id)}
                    />
                  </td>
                  <td className="p-4">
                    <img 
                      src={subCategory.imageUrl} 
                      alt={subCategory.name} 
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-4">{subCategory.name}</td>
                  <td className="p-4">
                    {categories.find(category => category.id === subCategory.parentCategoryId)?.name || 'N/A'}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleEdit(subCategory.id)}
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
  
  export default SubCategoryList;
  
