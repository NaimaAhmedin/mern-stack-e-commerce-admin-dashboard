import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from '../../Pages/DeliveryAdmin/Dashboard';
import Profile from '../../Pages/DeliveryAdmin/Profile';
import DeliveryAdminMainLayout from './DeliveryAdminMainLayout';
import Deliverer from '../../Pages/DeliveryAdmin/Deliverer';
import CustomerComplaints from '../../Pages/DeliveryAdmin/CustomerComplaints'
import Allorders from '../../Pages/DeliveryAdmin/Allorders';
import Pendingorders from '../../Pages/DeliveryAdmin/Pendingorders';
import Processingorders from '../../Pages/DeliveryAdmin/Processingorders';
import Deliveredorders from '../../Pages/DeliveryAdmin/Deliveredorders';
import FailedOrders from '../../Pages/DeliveryAdmin/FailedOrders'; 
import DelivererList from '../../Pages/DeliveryAdmin/DelivererList';
const DeliveryAdminRoutes = () => {
  return [
    <Route path="/DeliveryAdmin" element={<DeliveryAdminMainLayout />} key="DeliveryAdminMainLayout">
      <Route index element={<Dashboard />} />
      <Route path='dashboard' element={<Dashboard/>}/>
      <Route index element={<Dashboard />} />
      <Route path='Allorders' element={<Allorders/>}/>
      <Route path='PendingOrders' element={<Pendingorders/>}/>
      <Route path='ProcessingOrders' element={<Processingorders/>}/>
      <Route path="DeliveredOrders" element={<Deliveredorders />} />
      <Route path='failedOrders' element={<FailedOrders/>}/>
      <Route path='Personnel-List' element={<DelivererList/>}/>
      <Route path='complaints' element={<CustomerComplaints/>}/>
      <Route path="settings/profile" element={<Profile />} />
    </Route>
    ];
}

export default DeliveryAdminRoutes