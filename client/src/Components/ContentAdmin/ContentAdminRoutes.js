import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard1 from '../../Pages/ContentAdmin/Dashboard';
import ContentadminMainLayout from './ContentadminMainLayout';
import ProductControl from '../../Pages/ContentAdmin/ProductControl'
import SellersList from '../../Pages/ContentAdmin/SellersList';
import Promotions from '../../Pages/ContentAdmin/Promotions';
import CreatePromotion from '../../Pages/ContentAdmin/CreatePromotion'; 
import EditPromotion from '../../Pages/ContentAdmin/EditPromotion'; 
import CategoryList from '../../Pages/ContentAdmin/CategoryList';
import CreateCategory from '../../Pages/ContentAdmin/CreateCategory';
import EditCategory from '../../Pages/ContentAdmin/EditCategory';
import Profile from '../../Pages/ContentAdmin/Profile';

function ContentAdminRoutes({ categories, setCategories, addCategory }){
  return [
    <Route path="/Content-Admin" element={<ContentadminMainLayout />} key="ContentAdminMainLayout">
      <Route index element={<Dashboard1 />} />
      <Route path='ProductList' element={<ProductControl />} />
      <Route path="SellerList" element={<SellersList />} />
      <Route path="Promotion" element={<Promotions />} />
      <Route path="promotion/create" element={<CreatePromotion/>}/>
      <Route path="promotion/edit/:id" element={<EditPromotion/>}/>
      <Route path="settings/profile" element={<Profile />} />
      <Route path="category" element={<CategoryList categories={categories} setCategories={setCategories} />} />
      <Route path="category/create" element={<CreateCategory addCategory={addCategory} />} />
      <Route path="category/edit/:id" element={<EditCategory categories={categories} setCategories={setCategories} />} />
      <Route path='dashboard' element={<Dashboard1 />} />
    </Route>
  ];
}

export default ContentAdminRoutes;