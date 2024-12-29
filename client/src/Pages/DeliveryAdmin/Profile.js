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
      role: "DeliveryAdmin"
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
      
      // Log all form data before sending
      console.log('Profile Data:', profile);
      
      // Ensure name is always sent
      const nameToSend = profile.name?.trim() || 'Unnamed User';
      formData.append('name', nameToSend);
      
      // Append other fields only if they exist
      if (profile.email) formData.append('email', profile.email);
      if (profile.phone) formData.append('phone', profile.phone);
      if (profile.address) formData.append('address', profile.address);
      
      // Append department for admin roles
      if (profile.adminDetails?.department) {
        formData.append('department', profile.adminDetails.department);
      }

      // Log FormData contents
      for (let [key, value] of formData.entries()) {
        console.log(`FormData - ${key}:`, value);
      }

      // Append profile image if a new file is selected
      if (imageFile) {
        formData.append('profileImage', imageFile);
        console.log('Profile Image File:', imageFile);
      }

      const response = await axios.put('/api/users/profile', formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        validateStatus: function (status) {
          return status >= 200 && status < 300; // Default
        }
      });

      setProfile(response.data.data);
      setEditMode(false);
      setImageFile(null);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error response:', error.response);
      
      // More detailed error handling
      if (error.response) {
        // Log full error response
        console.error('Full Error Response:', JSON.stringify(error.response.data, null, 2));
        
        // Attempt to parse and display more specific error messages
        const errorMessage = 
          error.response.data.message || 
          (error.response.data.errors 
            ? Object.values(error.response.data.errors).join(', ') 
            : JSON.stringify(error.response.data));
        
        alert(`Update failed: ${errorMessage}`);
      } else if (error.request) {
        // The request was made but no response was received
        alert('No response received from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        alert('Error setting up the request');
      }
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
          <h2 className="text-3xl font-bold text-white tracking-wide">Delivery Admin Profile</h2>
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
