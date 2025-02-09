import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaTimes, FaUserCircle, FaShieldAlt } from 'react-icons/fa';
import axios from 'axios';

const  Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profileImage: {
      url: null,
      public_id: null
    },
    superAdminDetails: {
      role: "SuperAdmin"
    }
  });

  const [editMode, setEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data.data);
      } catch (error) {
        alert('Failed to fetch profile');
        console.error('Profile fetch error:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => setEditMode(!editMode);
  
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      Object.keys(profile).forEach(key => {
        if (key !== 'profileImage' && key !== 'superAdminDetails') {
          formData.append(key, profile[key]);
        }
      });

      if (imageFile) {
        formData.append('profileImage', imageFile);
      }

      const response = await axios.put('/api/users/profile', formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setProfile(response.data.data);
      setEditMode(false);
      setImageFile(null);
      alert('Profile updated successfully');
    } catch (error) {
      alert('Failed to update profile');
      console.error('Profile update error:', error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setProfile(prev => ({
        ...prev,
        profileImage: {
          url: reader.result,
          public_id: null
        }
      }));
      reader.readAsDataURL(file);
    } else {
      alert("Only JPG/PNG images are allowed and must be smaller than 2MB.");
    }
  };

  const profileFields = [
    { key: 'name', label: 'Full Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone', type: 'tel' },
    { key: 'address', label: 'Address', type: 'text' },
    { key: 'role', label: 'Role', type: 'text', disabled: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-8 text-center relative">
          <div className="absolute top-4 right-4 text-white">
            <FaShieldAlt className="text-3xl animate-pulse" />
          </div>
          <h2 className="text-4xl font-bold text-white tracking-tight">Super Admin Profile</h2>
        </div>
        
        <div className="p-10">
          <div className="flex flex-col items-center mb-10">
            <label className="relative cursor-pointer group">
              <div className="w-44 h-44 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full overflow-hidden shadow-xl flex items-center justify-center 
                            transition-all duration-300 group-hover:ring-4 group-hover:ring-purple-300">
                {profile.profileImage?.url ? (
                  <img 
                    src={profile.profileImage.url} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <FaUserCircle className="text-7xl text-purple-300 group-hover:text-purple-400 transition-colors" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full 
                              flex items-center justify-center transition-all duration-300">
                  <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">Update</span>
                </div>
              </div>
              <input 
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleImageUpload}
                className="hidden"
                disabled={!editMode}
              />
            </label>
          </div>

          <form className="space-y-8">
            {profileFields.map((field, index) => (
              <div key={index} className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  {field.label}
                </label>
                <div className="relative">
                  <input 
                    type={field.type}
                    name={field.key}
                    value={profile[field.key] || ''}
                    onChange={handleInputChange}
                    disabled={!editMode || field.disabled}
                    className={`w-full px-5 py-4 border-2 rounded-xl text-gray-800 transition-all duration-300 
                               ${editMode 
                                 ? 'border-purple-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200' 
                                 : 'bg-gray-50 border-transparent cursor-default'
                               } ${field.disabled ? 'text-gray-500 italic' : ''}`}
                  />
                  {!editMode && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <FaEdit className="text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="flex justify-center space-x-6 pt-6">
              {editMode ? (
                <>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl 
                             hover:from-purple-700 hover:to-pink-600 focus:outline-none transition-all duration-300 
                             shadow-lg hover:shadow-xl"
                  >
                    <FaSave className="mr-3" /> Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="flex items-center px-8 py-4 bg-gray-600 text-white rounded-xl 
                             hover:bg-gray-700 focus:outline-none transition-all duration-300 
                             shadow-lg hover:shadow-xl"
                  >
                    <FaTimes className="mr-3" /> Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-400 text-white rounded-xl 
                           hover:from-purple-600 hover:to-pink-500 focus:outline-none transition-all duration-300 
                           shadow-lg hover:shadow-xl"
                >
                  <FaEdit className="mr-3" /> Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;