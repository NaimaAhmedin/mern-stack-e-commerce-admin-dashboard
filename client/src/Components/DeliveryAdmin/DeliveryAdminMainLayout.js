import React, { useState } from 'react';
import { MenuFoldOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { MdDashboard, MdOutlineLocalShipping,  MdOutlinePending, MdOutlineSmsFailed } from 'react-icons/md';
import { Layout, Menu, Dropdown, theme } from 'antd';
import {  AiOutlineShoppingCart, AiOutlineUser } from 'react-icons/ai';
import { IoMdNotifications } from 'react-icons/io';
import { Outlet } from 'react-router-dom';
import { MdCategory } from "react-icons/md";
import { TbCategoryPlus } from "react-icons/tb";
import { IoSettingsSharp } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { MdOutlineControlCamera } from "react-icons/md";
import { FaClipboardList, FaUser} from "react-icons/fa"; // Icon for Sellers
import { GrCompliance } from 'react-icons/gr';

const { Header, Sider, Content } = Layout;

const DeliveryAdminMainLayout = () => {
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
          navigate('/DeliveryAdmin/settings/profile');
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
              key: "Order",
              icon: <FaClipboardList className="fs-4" />,
              label: 'Order',
              children: [
                {
                  key: "AllOrders",
                  icon: <AiOutlineShoppingCart className="fs-4" />,
                  label: 'AllOrders',
                },
                {
                  key: "PendingOrders",
                  icon: <MdOutlinePending className="fs-4" />,
                  label: 'Pending Orders',
                },
                
                {
                  key: "ProcessingOrders",
                  icon: <MdOutlineLocalShipping className="fs-4" />,
                  label: 'Processing Orders',
                },
                {
                  key: "DeliveredOrders",
                  icon: <GrCompliance className="fs-4" />,
                  label: 'Delivered Orders',
                },
                {
                  key: "failedOrders",
                  icon: <MdOutlineSmsFailed className="fs-4" />,
                  label: 'Failed Orders',
                },
              ],
            },            
            {
              key: "Delivery-Personnel",
              icon: <FaUser className="fs-4" />,
              label: 'Delivery Personnel',
              children: [
                {
                  key: "Personnel-List",
                  icon: <AiOutlineUser className="fs-4" />,
                  label: 'Personnel List',
                },
              ],
            },
            {
              key: "Follow-ups",
              icon: <TbCategoryPlus className="fs-4" />,
              label: 'Follow Ups',
              children: [
                {
                  key: "complaints",
                  icon: <MdCategory className="fs-4" />,
                  label: 'complaints',
                },
               
              ],
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
                  <h5 className="mb-0">Mayita</h5>
                  <p className="mb-0">naimaahmedin@gmail.com</p>
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

export default DeliveryAdminMainLayout;
