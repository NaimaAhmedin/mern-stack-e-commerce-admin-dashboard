import React, { useState } from 'react';
import {
  MenuFoldOutlined,

} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {  Layout, Menu, theme } from 'antd';
import { AiOutlineDashboard } from "react-icons/ai";
import { IoMdNotifications } from "react-icons/io";
import { FaUsersCog,FaUsers,FaUserPlus,FaChartLine,FaUserCircle,FaCog } from "react-icons/fa";
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
              key: '',
              icon: <AiOutlineDashboard className='fs-4' />,
              label: 'Dashboard',
            },
            {
              key: 'ManageAdmin',
              icon: <FaUsersCog className='fs-4' />, // Icon for managing admins
              label: 'Manage Admin',
              children: [
                {
                  key: 'AdminList',
                  icon: <FaUserCircle className='fs-4' />,  // Icon for user profile or admin
                  label: 'All Admins',
                },
                {
                  key: 'DeliveryAdmins',
                  icon: <FaUserCircle className='fs-4' />,  // Icon for delivery admin
                  label: 'Delivery Admins',
                },
                {
                  key: 'ContentAdmins',
                  icon: <FaUserCircle className='fs-4' />,  // Icon for content admin
                  label: 'Content Admins',
                },
                {
                  key: 'AddAdmin',
                  icon: <FaUserPlus className='fs-4' />, // Icon for adding a user
                  label: 'Add Admin',
                },
              ],
            },
            {
              key: 'ManageUsers',
              icon: <FaUsers className='fs-4' />, // Icon for managing groups of people
              label: 'Manage Users',
              children: [
                {
                  key: 'ViewAllUsers',
                  icon: <FaUserCircle className='fs-4' />,  // Icon for user profile or admin
                  label: 'View All Users',
                },
                {
                  key: 'Sellers',
                  icon: <FaUserPlus className='fs-4' />, // Icon for adding a user
                  label: 'Seller',
                },
                {
                  key: 'Customer',
                  icon: <FaUserPlus className='fs-4' />, // Icon for adding a user
                  label: 'Customers',
                },
              ],
            },
           
            {
              key: 'ReportsConfig',
              icon: <FaChartLine className='fs-4' />, // Icon for reports and statistics
              label: 'Reports & Config',
            },
            {
              key: 'Settings',
              icon: <FaCog className='fs-4' />,  // Changed from FaCo to FaUsers (group icon)
              label: 'Settings',
              children: [
                {
                  key:'Profile',
                  icon: <FaUserCircle className='fs-4' />,  // Correct profile icon
                  label: 'Profile',
                },
              ],
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