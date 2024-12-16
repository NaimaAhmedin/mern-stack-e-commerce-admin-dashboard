import React, { useState } from 'react';
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
import ProtectedRoute from './Components/ProtectedRoute';
import NotAuthorized from './Pages/CommanPages/NotAuthorized';

function App() {

  const [categories, setCategories] = useState([]);
  
  const addCategory = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
  };

  const [products, setProducts] = useState([]);
  
  const addProduct = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/reset-password" element={<RestPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<NotAuthorized />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['SuperAdmin']} />}>
          {SuperAdminRoutes()}
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ContentAdmin']} />}>
          {ContentAdminRoutes({ categories, setCategories, addCategory })}
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['DeliveryAdmin']} />}>
          {DeliveryAdminRoutes()} 
        </Route>


        {/* seller Routes */}
 
        <Route element={<ProtectedRoute allowedRoles={['seller']} />}>
              {SellerRoutes({ products, setProducts, addProduct })}           
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
