import React, { useState } from 'react';
import { MenuFoldOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';
import { Layout, Menu, Dropdown, theme } from 'antd';
import { AiOutlineProduct } from 'react-icons/ai';
import { IoMdNotifications } from 'react-icons/io';
import { Outlet } from 'react-router-dom';
import { MdCategory } from "react-icons/md";
import { TbCategoryPlus } from "react-icons/tb";
import { MdOutlineCampaign } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { MdOutlineControlCamera } from "react-icons/md";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import { FaUserTie } from "react-icons/fa"; // Icon for Sellers

const { Header, Sider, Content } = Layout;

const ContentadminMainLayout = () => {
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
          navigate('/Content-Admin/settings/profile');
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
              key: "content-management",
              icon: <MdOutlineContentPasteSearch className="fs-4" />,
              label: 'Contents',
              children: [
                {
                  key: "ProductList",
                  icon: <MdOutlineControlCamera className="fs-4" />,
                  label: 'Product List',
                },
                {
                  key: "SellerList",
                  icon: <FaUserTie className="fs-4" />,
                  label: 'Sellers List',
                },
              ],
            },            
            {
              key: "promotion-management",
              icon: <AiOutlineProduct className="fs-4" />,
              label: 'Promotions',
              children: [
                {
                  key: "promotion",
                  icon: <MdOutlineCampaign className="fs-4" />,
                  label: 'Promotion',
                },
              ],
            },
            {
              key: "categories",
              icon: <TbCategoryPlus className="fs-4" />,
              label: 'Categories',
              children: [
                {
                  key: "category",
                  icon: <MdCategory className="fs-4" />,
                  label: 'Categories',
                },
                {
                  key: "subcategory",
                  icon: <MdCategory className="fs-4" />,
                  label: 'Sub Category',
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
                  <h5 className="mb-0">Content Admin</h5>
                  <p className="mb-0">contentadmin@gmail.com</p>
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

export default ContentadminMainLayout;
