import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from '../../Pages/Seller/Dashboard';
import Profile from '../../Pages/Seller/Profile';
import SellerMainLayout from './SellerMainLayout';
import ProductList from '../../Pages/Seller/Productlist';
import Addproduct from '../../Pages/Seller/Addproduct';
import Editproduct from '../../Pages/Seller/Editproduct';
import SalesHistory from '../../Pages/Seller/SalesHistory';
import SalesInsights from '../../Pages/Seller/SalesInsights';
import OrderManagement from '../../Pages/Seller/OrderManagementPage';
const SellerRoutes = () => {
  return [
    <Route path="/seller" element={<SellerMainLayout />} key="SellerMainLayout">
      <Route index element={<Dashboard />} />
      <Route path='dashboard' element={<Dashboard/>}/>
      <Route path='productList'  element={<ProductList/>}/>
      <Route path='Addproduct'  element={<Addproduct/>}/>
      <Route path='Editproduct'  element={<Editproduct/>}/>
      <Route path='Order-management' element={<OrderManagement/>}/>
      <Route path='sales-insight' element={<SalesInsights/>}/>
      <Route path="salesHistory" element={<SalesHistory />} />
      <Route path="settings/profile" element={<Profile />} />
    </Route>
    ];
}

export default SellerRoutes