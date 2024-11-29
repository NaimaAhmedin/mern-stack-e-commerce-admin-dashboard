import React , { useState }from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./Pages/CommanPages/Login";
import Register from './Pages/CommanPages/Register'
import RestPassword from './Pages/CommanPages/RestPassword';
import ForgotPassword from './Pages/CommanPages/ForgotPassword';
import HeadphoneImage from './Images/Headphone.jpg';
import PhoneImage from './Images/Phone.jpg'; 
import ContentAdminRoutes from './Components/ContentAdmin/ContentAdminRoutes';
import SuperAdminRoutes from './Components/SuperAdmin/SuperAdminRoutes';
import DeliveryAdminRoutes from './Components/DeliveryAdmin/DeliveryAdminRoutes';
import SellerRoutes from './Components/seller/SellerRoutes';

function App() {

  const [categories, setCategories] = useState([
    { id: 1, image: HeadphoneImage, name: 'Headphones'},
    { id: 2, image: PhoneImage, name: 'Phones' },
  ]);
  
  const addCategory = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
  };
  const [subCategories, setSubCategories] = useState([
    { id: 1, name: 'Headphone', parentCategoryId: 1, parentCategoryName: 'Headphones' },
    {id:2, name: 'smartPhone',parentCategoryId: 2, parentCategoryName: 'Phones' }
    
  ]);
  
  const addSubCategory = (newSubCategory) => {
    setSubCategories(prev => [...prev, newSubCategory]);
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/reset-password" element={<RestPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Main Admin Routes */}
        {SuperAdminRoutes()}

        {/* Content Admin Routes */}
        {ContentAdminRoutes({ categories, setCategories, subCategories, setSubCategories, addCategory, addSubCategory })}
        {DeliveryAdminRoutes()} 

        {/* seller Routes */}
        {SellerRoutes()}          
      </Routes>
    </Router>
  );
}

export default App;
