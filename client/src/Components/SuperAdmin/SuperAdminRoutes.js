import React from 'react';
import { Route } from 'react-router-dom';
import MainLayout from './MainLayout';
import Dashboard from '../../Pages/SuperAdmin/Dashboard';
import Enquiries from '../../Pages/SuperAdmin/Enquries';
import BlogList from '../../Pages/SuperAdmin/BlogList';
import BlogCatList from '../../Pages/SuperAdmin/BlogCatList';
import Order from '../../Pages/SuperAdmin/Order';
import Customer from '../../Pages/SuperAdmin/Customer';
import Colorlist from '../../Pages/SuperAdmin/Colorlist';
import Categorylist from '../../Pages/SuperAdmin/Categorylist';
import Brandlist from '../../Pages/SuperAdmin/Brandlist';
import Productlist from '../../Pages/SuperAdmin/Productlist';
import AddBlog from '../../Pages/SuperAdmin/Addblog';
import Blogcategory from '../../Pages/SuperAdmin/Addblogcat';
import Addcolor from '../../Pages/SuperAdmin/Addcolor';
import Addcat from '../../Pages/SuperAdmin/Addcat';
import Addbrand from '../../Pages/SuperAdmin/Addbrand';
import Addproduct from '../../Pages/SuperAdmin/Addproduct';


function SuperAdminRoutes() {
    return (

        <Route path="/admin" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="enquiries" element={<Enquiries />} />
        <Route path="List-blog" element={<BlogList />} />
        <Route path="blog-category-list" element={<BlogCatList />} />
        <Route path="Order" element={<Order />} />
        <Route path="Customer" element={<Customer />} />
        <Route path="List-Color" element={<Colorlist />} />
        <Route path="Color" element={<Addcolor />} />
        <Route path="Category" element={<Addcat />} />
        <Route path="List-Category" element={<Categorylist />} />
        <Route path="Brand" element={<Addbrand />} />
        <Route path="List-Brand" element={<Brandlist />} />
        <Route path="Product" element={<Addproduct />} />
        <Route path="Product-list" element={<Productlist />} />
        <Route path="blog" element={<AddBlog />} />
        <Route path="blog-category" element={<Blogcategory />} />
      </Route>
    );
}

export default SuperAdminRoutes;