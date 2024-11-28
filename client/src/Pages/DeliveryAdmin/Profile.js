import React, { useState } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "Abubeker",
    firstname: "Abubeker",
    lastname: "Yirga",
    email: "abubeker@gmail.com",
    phone: "123-456-7890",
    address: "123 Main St, Addis Ababa, Ethiopia",
  });

  const [editMode, setEditMode] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleEdit = () => setEditMode(!editMode);
  const handleSave = () => {
    // Save logic here
    setEditMode(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onload = () => setImageUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      alert("Only JPG/PNG images are allowed and must be smaller than 2MB.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">Profile</h2>
        
        <div className="flex flex-col items-center mb-6">
          <label className="cursor-pointer">
            <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden shadow-md flex items-center justify-center">
              {imageUrl ? (
                <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-lg">Upload</span>
              )}
            </div>
            <input 
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          <p className="text-gray-500 mt-2 text-sm">Click to upload profile image</p>
        </div>

        <form>
          {['name', 'firstname', 'lastname', 'email', 'phone', 'address'].map((field, index) => (
            <div className="mb-4" key={index}>
              <label className="block text-gray-700 text-sm font-semibold mb-1 capitalize">
                {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
              <input 
                type={field === "email" ? "email" : "text"}
                name={field}
                value={profile[field]}
                onChange={handleInputChange}
                disabled={!editMode}
                className={`w-full px-3 py-2 border rounded-lg text-gray-700 ${
                  editMode ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500' : 'bg-gray-100 border-transparent'
                }`}
              />
            </div>
          ))}

          <div className="text-center">
            {editMode ? (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2 hover:bg-green-600 focus:outline-none"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleEdit}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
