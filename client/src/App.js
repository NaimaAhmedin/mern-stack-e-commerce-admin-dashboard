import React , { useState }from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./Pages/CommanPages/Login";
import Register from './Pages/CommanPages/Register'
import RestPassword from './Pages/CommanPages/RestPassword';
import ForgotPassword from './Pages/CommanPages/ForgotPassword';
import ContentAdminRoutes from './Components/ContentAdmin/ContentAdminRoutes';
import SuperAdminRoutes from './Components/SuperAdmin/SuperAdminRoutes';
import DeliveryAdminRoutes from './Components/DeliveryAdmin/DeliveryAdminRoutes';
import SellerRoutes from './Components/seller/SellerRoutes';

function App() {

  const [categories, setCategories] = useState([
   
  ]);
  
  const addCategory = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
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
        {ContentAdminRoutes({ categories, setCategories, addCategory })}
        {DeliveryAdminRoutes()} 

        {/* seller Routes */}
        {SellerRoutes()}          
      </Routes>
    </Router>
  );
}

export default App;
