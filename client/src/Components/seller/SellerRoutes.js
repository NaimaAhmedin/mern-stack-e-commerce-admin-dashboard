import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from '../../Pages/Seller/Dashboard';
import Profile from '../../Pages/Seller/Profile';
import SellerMainLayout from './SellerMainLayout';
import SalesHistory from '../../Pages/Seller/SalesHistory';
import SalesInsights from '../../Pages/Seller/SalesInsights';
import OrderManagement from '../../Pages/Seller/OrderManagementPage';
import Productlist from '../../Pages/Seller/Productlist';
import Editproduct from '../../Pages/Seller/Editproduct';
import Addproduct from '../../Pages/Seller/Addproduct';

function SellerRoutes({ products, setProducts, addProduct }){
  return [
    <Route path="/seller" element={<SellerMainLayout />} key="SellerMainLayout">
      <Route index element={<Dashboard />} />
      <Route path='dashboard' element={<Dashboard/>}/>
      <Route index element={<Dashboard />} />
      <Route path='Order-management' element={<OrderManagement/>}/>
      <Route path='sales-insight' element={<SalesInsights/>}/>
      <Route path="salesHistory" element={<SalesHistory />} />
      <Route path="settings/profile" element={<Profile />} />
      
      <Route path="ProductList" element ={<Productlist products={products} setProducts={setProducts}/> }/>
      <Route path="/seller/ProductList/product/edit/:id" element={<Editproduct products={products} setProducts={setProducts} />  }/>
      <Route path="ProductList/add" element={<Addproduct addProduct={addProduct}/> }/>
    </Route>
    ];
}

export default SellerRoutes