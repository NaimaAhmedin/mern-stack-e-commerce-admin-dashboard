import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from '../../Pages/Seller/Dashboard';
import Profile from '../../Pages/Seller/Profile';
import SellerMainLayout from './SellerMainLayout';
import Processingorders from '../../Pages/DeliveryAdmin/Processingorders';
import Deliveredorders from '../../Pages/DeliveryAdmin/Deliveredorders';
import OrderManagement from '../../Pages/Seller/OrderManagementPage';
const SellerRoutes = () => {
  return [
    <Route path="/Seller" element={<SellerMainLayout />} key="SellerMainLayout">
      <Route index element={<Dashboard />} />
      <Route path='dashboard' element={<Dashboard/>}/>
      <Route index element={<Dashboard />} />
      <Route path='Order-management' element={<OrderManagement/>}/>
      <Route path='ProcessingOrders' element={<Processingorders/>}/>
      <Route path="DeliveredOrders" element={<Deliveredorders />} />
      <Route path="settings/profile" element={<Profile />} />
    </Route>
    ];
}

export default SellerRoutes