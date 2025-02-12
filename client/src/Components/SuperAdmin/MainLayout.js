import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Menu, theme, Dropdown } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';
import { MdDashboard, MdOutlineContentPasteSearch, MdOutlineControlCamera } from 'react-icons/md';
import { IoMdSettings, IoMdNotifications, IoMdPerson } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';
import { FcMoneyTransfer } from 'react-icons/fc';
import { AiOutlineOrderedList, AiOutlineBarChart } from 'react-icons/ai';
import { FaUsers, FaCog, FaChartLine } from 'react-icons/fa';

const SuperAdminMainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profileImage: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuperAdminProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }
    
        const response = await axios.get('/api/users/superadmin/menu-profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
    
        // Update profile data
        setProfileData({
          name: response.data.data.name || '',
          email: response.data.data.email || '',
          profileImage: response.data.data.profileImage
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching superadmin profile:', error);
        setError(error);
        setIsLoading(false);
        
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/');
        }
      }
    };

    fetchSuperAdminProfile();
  }, [navigate]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading superadmin profile...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="error-container">
        <p>Error loading profile. Please try again later.</p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  }

  const profileMenu = (
    <Menu
      onClick={({ key }) => {
        switch(key) {
          case "signout":
            localStorage.removeItem('token');
            navigate('/');
            break;
          case "profile":
            navigate('/admin/Profile');
            break;
          default:
            break;
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
      <Layout.Sider trigger={null} collapsible collapsed={collapsed}>
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
              key: "user-management",
              icon: <FaUsers className="fs-4" />,
              label: 'User Management',
              children: [
                {
                  key: "/admin/ViewAllUsers",
                  icon: <IoMdPerson className="fs-4" />,
                  label: 'All Users',
                },
                {
                  key: "/admin/AddAdmin",
                  icon: <MdOutlineControlCamera className="fs-4" />,
                  label: 'Add Admin',
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
              key: "settings",
              icon: <IoMdSettings  className="fs-4" />,
              label: 'Settings',
              children: [
                {
                  key: "/admin/Profile",
                  icon: <CgProfile className="fs-4" />,
                  label: 'Profile',
                },
              ],
            },
          ]}
        />
      </Layout.Sider>
      <Layout>
      <Layout.Header
        className="d-flex justify-content-between ps-3 pe-5"
        style={{
          padding: 0,
          background: colorBgContainer,
        }}
      >
        {React.createElement(
          collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
          {
            className: "trigger",
            onClick: () => setCollapsed(!collapsed),
          }
        )}

        <div className="d-flex gap-3 align-items-center">
          <Dropdown 
            overlay={profileMenu} 
            placement="bottomRight"
            trigger={['click']} // Explicitly set trigger to click
          >
            <div 
              className="d-flex align-items-center gap-2 cursor-pointer"
              onClick={(e) => e.preventDefault()} // Prevent default to ensure dropdown works
            >
              <img 
                src={profileData.profileImage || '/default-avatar.png'} 
                alt="Profile" 
                className="rounded-circle" 
                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
              />
              <div>
                <h5 className="mb-0">{profileData.name}</h5>
                <p className="mb-0 text-muted">{profileData.email}</p>
              </div>
            </div>
          </Dropdown>
        </div>
      </Layout.Header>


        <Layout.Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default SuperAdminMainLayout;