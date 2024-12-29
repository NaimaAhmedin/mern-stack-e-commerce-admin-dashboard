import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Menu, theme, Dropdown } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';
import { MdDashboard, MdOutlineContentPasteSearch } from 'react-icons/md';
import { IoSettingsSharp } from 'react-icons/io5';
import { CgProfile } from 'react-icons/cg';
import { MdOutlineControlCamera } from 'react-icons/md';
import { FcMoneyTransfer } from 'react-icons/fc';
import { IoMdNotifications, IoMdPerson } from 'react-icons/io';
import { AiOutlineOrderedList,AiOutlineBarChart } from 'react-icons/ai';
import { FaClipboardList } from 'react-icons/fa';

const SellerMainLayout = () => {
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
    const fetchSellerProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const response = await axios.get('/api/users/seller/menu-profile', {
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
      } catch (err) {
        console.error('Error fetching seller profile:', err);
        setError(err);
        setIsLoading(false);
        
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/');
        }
      }
    };

    fetchSellerProfile();
  }, [navigate]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading seller profile...</p>
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

  // Profile dropdown menu
  const profileMenu = (
    <Menu
      onClick={({ key }) => {
        if (key === "signout") {
          localStorage.removeItem('token');
          navigate('/');
        } else if (key === "profile") {
          navigate('settings/profile');
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
                {profileData.profileImage ? (
                  <img
                    src={profileData.profileImage}
                    alt="Profile"
                    style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                  />
                ) : (
                  <div 
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      background: '#e0e0e0', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}
                  >
                    <IoMdPerson size={20} color="#666" />
                  </div>
                )}
                <div>
                  {profileData.name && <h5 className="mb-0">{profileData.name}</h5>}
                  {profileData.email && <p className="mb-0">{profileData.email}</p>}
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

export default SellerMainLayout;
