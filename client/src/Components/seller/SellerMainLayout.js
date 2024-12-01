import React, { useState } from 'react';
import { MenuFoldOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';
import { Layout, Menu, Dropdown, theme } from 'antd';
import { AiOutlineOrderedList,AiOutlineBarChart } from 'react-icons/ai';
import { IoMdNotifications } from 'react-icons/io';
import { Outlet } from 'react-router-dom';
import { IoSettingsSharp } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { MdOutlineControlCamera } from "react-icons/md";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import { FcMoneyTransfer } from "react-icons/fc";
import {FaClipboardList} from "react-icons/fa";
const { Header, Sider, Content } = Layout;

const SellerMainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  // Dropdown menu for profile options
  const profileMenu = (
    <Menu
      onClick={({ key }) => {
        if (key === "signout") {
          navigate('/');
        } else if (key === "profile") {
          navigate('seller/settings/profile');
        }
      }}
      items={[
        {
          label: 'Profile',
          key: 'profile',
          icon: <CgProfile />,
        },
        {
          label: 'Sign Out',
          key: 'signout',
          icon: <MdOutlineControlCamera />,
        },
      ]}
    />
  );

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <h2 className="text-white fs-5 text-center py-4 mb-0">Markato</h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          onClick={({ key }) => {
            if (key !== "signout") {
              navigate(key);
            }
          }}
          items={[
            {
              key: "dashboard",
              icon: <MdDashboard className="fs-4" />,
              label: 'Dashboard',
            },
            {
              key: "product-management",
              icon: <MdOutlineContentPasteSearch className="fs-4" />,
              label: 'Product Management',
              children: [
                {
                  key: "productList",
                  icon: <MdOutlineControlCamera className="fs-4" />,
                  label: 'Product List',
                },
                {
                  key: "Addproduct",
                  icon: <MdOutlineControlCamera className="fs-4" />,
                  label: 'Add product',
                },
                {
                  key: "Editproduct",
                  icon: <MdOutlineControlCamera className="fs-4" />,
                  label: 'Edit product',
                },
              ],
            },            
            {
              key: "Order-management",
              icon: <AiOutlineOrderedList className="fs-4" />,
              label: 'Orders',
            },
            {
              key: 'sales-insight',
              icon: <AiOutlineBarChart className='fs-4' />,
              label: 'Sales Insights',
            },
            {
              key: 'salesHistory',
              icon: <FaClipboardList className='fs-4' />,
              label: 'Sales History'
            },
            
            {
              key: "settings",
              icon: <IoSettingsSharp className="fs-4" />,
              label: 'Settings',
              children: [
                {
                  key: "settings/profile",
                  icon: <CgProfile className="fs-4" />,
                  label: 'Profile',
                },
                {
                  key: "settings/payment",
                  icon: <FcMoneyTransfer className="fs-4" />,
                  label: 'Payment Method',
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
            MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <div className="d-flex gap-4 align-items-center">
            <div className="position-relative">
              <IoMdNotifications className="fs-4" />
              <span className="badge bg-warning rounded-circle p-1 position-absolute">3</span>
            </div>
            <Dropdown overlay={profileMenu} trigger={['click']}>
              <div className="d-flex gap-3 align-items-center" style={{ cursor: 'pointer' }}>
                <img
                  src="https://i.pinimg.com/originals/d9/0b/e3/d90be382685a71af0369e49b352f0ba1.jpg"
                  alt="Profile"
                  style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                />
                <div>
                  <h5 className="mb-0">seller</h5>
                  <p className="mb-0">seller@gmail.com</p>
                </div>
              </div>
            </Dropdown>
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
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default SellerMainLayout;
