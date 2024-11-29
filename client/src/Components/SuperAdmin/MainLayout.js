import React, { useState } from 'react';
import {
  MenuFoldOutlined,

} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { MdDashboard } from "react-icons/md";
import { TiShoppingCart } from "react-icons/ti";
import {  Layout, Menu, theme } from 'antd';
import { FaUser } from "react-icons/fa";
import { AiOutlineProduct } from "react-icons/ai";
import { FaProductHunt,FaBloggerB } from "react-icons/fa6";
import { TbBrandBeats } from "react-icons/tb";
import { BiCategoryAlt } from "react-icons/bi";
import { IoIosColorPalette, IoMdNotifications } from "react-icons/io";
import { FaClipboardList } from "react-icons/fa";
import { ImBlog } from "react-icons/im";
import{Outlet} from "react-router-dom"
const { Header, Sider, Content } = Layout;
const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate=useNavigate();
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
            <h2 className="text-white fs-5  text-center py-4 mb-0">Markato</h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[""]}
          onClick={ ({ key })=>{
            if (key === "signout"){}
            else {
                navigate(key);
            }
          }}
          items={[
            {
              key: "",
              icon: <MdDashboard className="fs-4"/>,
              label: 'Dashboard',
            },
            {
                key: "Customer",
                icon: <FaUser className="fs-4"/>,
                label: 'Customer',
              },
              {
                key: "Catalog",
                icon: <AiOutlineProduct className="fs-4"/>,
                label: 'Catalog',
                children:[{
                    key: "Product",
                    icon: <TiShoppingCart className="fs-4"/>,
                    label: ' Add product',
                },
                {
                    key: " Product-list",
                    icon: <FaProductHunt className="fs-4"/>,
                    label: 'product-list',
                },
                {
                    key: "Brand",
                    icon: <TbBrandBeats className="fs-4"/>,
                    label: 'Brand',
                },
                {
                    key: "List-Brand",
                    icon: <TbBrandBeats className="fs-4"/>,
                    label: 'Brand list',
                },
                {
                    key: "Category",
                    icon: <BiCategoryAlt className="fs-4"/>,
                    label: 'Category',
                },
                {
                    key: "List-Category",
                    icon: <BiCategoryAlt className="fs-4"/>,
                    label: 'category list',
                },
                {
                    key: "Color",
                    icon: <IoIosColorPalette className="fs-4"/>,
                    label: 'Color',
                },
                {
                    key: "List-Color",
                    icon: <IoIosColorPalette className="fs-4"/>,
                    label: 'Color list',
                },
            ]
              },
              {
                key: "Order",
                icon: <FaClipboardList className="fs-4"/>,
                label: 'Order',
            },
           
            {
                key: "blogs",
                icon: <FaBloggerB className="fs-4"/>,
                label: 'Blogs',
                children:[
                    {
                        key: "blog",
                        icon: <ImBlog className="fs-4"/>,
                        label: 'Add blog',
                    },
                    {
                        key: "List-blog",
                        icon: <FaClipboardList className="fs-4"/>,
                        label: 'Blog List',
                    },
                    {
                        key: "blog-category",
                        icon: <ImBlog className="fs-4"/>,
                        label: 'Add Blog Category',
                    },
                    {
                        key: "blog-category-list",
                        icon: <FaClipboardList className="fs-4"/>,
                        label: 'Blog Category List',
                    },
                ]
            },
            {
                key: "enquiries",
                icon: <FaClipboardList className="fs-4"/>,
                label: 'Enquiries',
            },
            
          ]}
        />
      </Sider>
      <Layout>
        <Header
        className="d-flex justify-content-between ps-3 pe-5"
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
            {React.createElement(
                collapsed?MenuFoldOutlined: MenuFoldOutlined,
                {
                    className:"trigger",
                    onClick:()=> setCollapsed(!collapsed),
                }
            )}
            <div className="d-flex gap-4 align-item-center">
            <div className="position-relative">
                <IoMdNotifications className="fs-4"/> <span className="badge bg-warning rounded-circle p-1 position-absolute">3</span>
                </div>
            <div className='d-flex gap-3 align-items-center'>
  <img
    src='https://i.pinimg.com/originals/d9/0b/e3/d90be382685a71af0369e49b352f0ba1.jpg'
    className='w-[64px] h-[64px]'
    alt=''
    style={{ width: '32px', height: '32px' }}
  />
</div>

               <div>
                <h5 className='mb-0'>Super Admin</h5>
                <p className='mb-0'>admin@gmail.com</p>
               </div>
            </div>
         
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet/>
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;