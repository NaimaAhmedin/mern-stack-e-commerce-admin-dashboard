import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaTimes, FaUserCircle } from 'react-icons/fa';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profileImage: {
      url: null,
      public_id: null
    },
    adminDetails: {
      department: "",
      role: "ContentAdmin"
    }
  });

  const [editMode, setEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    // Fetch user profile on component mount
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
    
    // Handle nested adminDetails field
    if (name === 'department') {
      setProfile(prev => ({
        ...prev,
        adminDetails: {
          ...prev.adminDetails,
          department: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleEdit = () => setEditMode(!editMode);
  
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Append text fields
      Object.keys(profile).forEach(key => {
        if (key !== 'profileImage' && key !== 'adminDetails') {
          formData.append(key, profile[key]);
        }
      });

      // Append department
      if (profile.adminDetails?.department) {
        formData.append('department', profile.adminDetails.department);
      }

      // Append profile image if a new file is selected
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

  // Define fields based on schema
  const profileFields = [
    { key: 'name', label: 'Full Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone', type: 'tel' },
    { key: 'address', label: 'Address', type: 'text' },
    { key: 'department', label: 'Department', type: 'text', nestedKey: 'adminDetails.department' },
    { key: 'role', label: 'Role', type: 'text', disabled: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6 text-center">
          <h2 className="text-3xl font-bold text-white tracking-wide">Content Admin Profile</h2>
        </div>
        
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <label className="relative cursor-pointer group">
              <div className="w-40 h-40 bg-gray-200 rounded-full overflow-hidden shadow-lg flex items-center justify-center 
                             transition-all duration-300 group-hover:ring-4 group-hover:ring-indigo-300">
                {profile.profileImage?.url ? (
                  <img 
                    src={profile.profileImage.url} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <FaUserCircle className="text-6xl text-gray-400 group-hover:text-indigo-500 transition-colors" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full 
                                flex items-center justify-center transition-all duration-300">
                  <span className="text-white opacity-0 group-hover:opacity-100 text-sm">Change</span>
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

          <form className="space-y-6">
            {profileFields.map((field, index) => (
              <div key={index} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {field.label}
                </label>
                <div className="relative">
                  <input 
                    type={field.type}
                    name={field.key === 'department' ? 'department' : field.key}
                    value={
                      field.key === 'department' 
                        ? profile.adminDetails?.department || '' 
                        : profile[field.key] || ''
                    }
                    onChange={handleInputChange}
                    disabled={!editMode || field.disabled}
                    className={`w-full px-4 py-3 border rounded-lg text-gray-800 transition-all duration-300 
                               ${editMode 
                                 ? 'border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500' 
                                 : 'bg-gray-100 border-transparent cursor-default'
                               } ${field.disabled ? 'text-gray-500' : ''}`}
                  />
                  {!editMode && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <FaEdit className="text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="flex justify-center space-x-4 pt-4">
              {editMode ? (
                <>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg 
                               hover:bg-green-600 focus:outline-none transition-all duration-300 
                               transform hover:scale-105"
                  >
                    <FaSave className="mr-2" /> Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg 
                               hover:bg-gray-600 focus:outline-none transition-all duration-300 
                               transform hover:scale-105"
                  >
                    <FaTimes className="mr-2" /> Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="flex items-center px-6 py-3 bg-indigo-500 text-white rounded-lg 
                             hover:bg-indigo-600 focus:outline-none transition-all duration-300 
                             transform hover:scale-105"
                >
                  <FaEdit className="mr-2" /> Edit Profile
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
