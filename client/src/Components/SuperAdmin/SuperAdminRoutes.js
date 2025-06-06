import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './MainLayout';
import Dashboard from '../../Pages/SuperAdmin/Dashboard';
import Customers from '../../Pages/SuperAdmin/Customers';
import Sellers from '../../Pages/SuperAdmin/Sellers';
import ReportsConfig from '../../Pages/SuperAdmin/ReportsConfig';
import AdminList from '../../Pages/SuperAdmin/AdminList';
import AddAdmin from '../../Pages/SuperAdmin/AddAdmin';
import ViewAllUsers from '../../Pages/SuperAdmin/ViewAllUsers';
import DeliveryAdminList from '../../Pages/SuperAdmin/DeliveryAdminList';
import ContentAdminList from '../../Pages/SuperAdmin/ContentAdminList';
import Profile from '../../Pages/SuperAdmin/Profile';

function SuperAdminRoutes() {
    return (
        <Route path="/admin" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="ViewAllUsers" element={<ViewAllUsers/>}/>
            <Route path="Customer" element={<Customers />} />
            <Route path="sellers" element={<Sellers />} />
            <Route path="ReportsConfig" element={<ReportsConfig />} />
            <Route path="AdminList" element={<AdminList />} />
            <Route path="AddAdmin" element={<AddAdmin />} />
            <Route path="DeliveryAdmins" element={<DeliveryAdminList />} />
            <Route path="ContentAdmins" element={<ContentAdminList />} />
            <Route path="Profile" element={<Profile />} />
        </Route>
    );
}

export default SuperAdminRoutes;