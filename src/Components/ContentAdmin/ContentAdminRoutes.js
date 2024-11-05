import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard1 from '../../Pages/ContentAdmin/Dashboard';
import ContentadminMainLayout from '../../Components/ContentAdmin/ContentadminMainLayout';
import ProductControl from '../../Pages/ContentAdmin/ProductControl'
import Promotions from '../../Pages/ContentAdmin/Promotions';
import CreatePromotion from '../../Pages/ContentAdmin/CreatePromotion'; 
import EditPromotion from '../../Pages/ContentAdmin/EditPromotion'; 
import CategoryList from '../../Pages/ContentAdmin/CategoryList';
import CreateCategory from '../../Pages/ContentAdmin/CreateCategory';
import EditCategory from '../../Pages/ContentAdmin/EditCategory';
import SubCategoryList from '../../Pages/ContentAdmin/SubCategoryList';
import CreateSubCategory from '../../Pages/ContentAdmin/CreateSubCategory';
import EditSubCategory from '../../Pages/ContentAdmin/EditSubCategory';
import Profile from '../../Pages/ContentAdmin/Profile';

  function ContentAdminRoutes({ categories, setCategories, subCategories, setSubCategories, addCategory, addSubCategory }){
  return [
    <Route path="/Content-Admin" element={<ContentadminMainLayout />} key="ContentAdminMainLayout">
      <Route index element={<Dashboard1 />} />
      <Route path="Promotion" element={<Promotions />} />
      <Route path="Promotion/create" element={<CreatePromotion/>}/>
      <Route path="Promotion/edit/:id" element={<EditPromotion/>}/>
      <Route path="settings/profile" element={<Profile />} />
      <Route path="category" element={<CategoryList categories={categories} setCategories={setCategories} />} />
      <Route path="category/create" element={<CreateCategory addCategory={addCategory} />} />
      <Route path="category/edit/:id" element={<EditCategory categories={categories} setCategories={setCategories} />} />
      <Route path="subcategory" element={<SubCategoryList subCategories={subCategories} categories={categories} setSubCategories={setSubCategories} />} />
      <Route path="subcategory/create" element={<CreateSubCategory addSubCategory={addSubCategory} categories={categories} />} />
      <Route path="subcategory/edit/:id" element={<EditSubCategory />} />
      <Route path='ProductList' element={<ProductControl />} />
      <Route path='dashboard' element={<Dashboard1 />} />
    </Route>
  ];
}

export default ContentAdminRoutes;