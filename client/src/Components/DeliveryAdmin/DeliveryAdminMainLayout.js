import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Menu, theme, Dropdown } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';
import { IoSettingsSharp } from 'react-icons/io5';
import { CgProfile } from 'react-icons/cg';
import { MdOutlineControlCamera } from 'react-icons/md';
import { IoMdNotifications, IoMdPerson } from 'react-icons/io';
import { MdOutlineLocalShipping, MdOutlinePending, MdOutlineSmsFailed } from 'react-icons/md';
import { AiOutlineShoppingCart, AiOutlineUser } from 'react-icons/ai';
import { TbCategoryPlus } from "react-icons/tb";
import { MdCategory } from "react-icons/md";
import { FaClipboardList, FaUser } from "react-icons/fa";
import { GrCompliance } from 'react-icons/gr';

const { Header, Sider, Content } = Layout;

const DeliveryAdminMainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profileImage: null,
    department: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeliveryAdminProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const response = await axios.get('/api/users/delivery-admin/menu-profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Update profile data
        setProfileData({
          name: response.data.data.name || '',
          email: response.data.data.email || '',
          profileImage: response.data.data.profileImage,
          department: response.data.data.department || ''
        });
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching delivery admin profile:', err);
        console.error('Full error details:', {
          message: err.message,
          response: err.response ? {
            status: err.response.status,
            data: err.response.data,
            headers: err.response.headers
          } : 'No response',
          request: err.request ? 'Request exists' : 'No request',
          config: err.config ? {
            url: err.config.url,
            method: err.config.method,
            headers: err.config.headers
          } : 'No config'
        });
        setError(err);
        setIsLoading(false);
        
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/');
        }
      }
    };

    fetchDeliveryAdminProfile();
  }, [navigate]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading admin profile...</p>
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
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
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
