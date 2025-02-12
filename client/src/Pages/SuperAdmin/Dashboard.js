import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { 
  FaUsers, 
  FaUserTie, 
  FaUsersCog, 
  FaShoppingCart 
} from 'react-icons/fa';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalSellers: 0,
    totalSales: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/superadmin/stats', {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
    
        // Update to use response.data.data
        setDashboardStats({
          totalUsers: response.data.data.totalUsers || 0,
          totalAdmins: response.data.data.totalAdmins || 0,
          totalSellers: response.data.data.totalSellers || 0,
          totalSales: response.data.data.totalSalesAmount || 0
        });
        setLoading(false);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        // Update error handling
        setError(error.response?.data?.message || 'An error occurred');
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Sample chart data (you can replace with actual data later)
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  const handleSetting = () => {
    navigate('/admin/Profile');
  };

  const handleAddAdmins = () => {
    navigate('/admin/AddAdmin');
  };

  const handleManageUsers = () => {
    navigate('/admin/ViewAllUsers');
  };
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Super Admin Dashboard</h1>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        {/* Total Users Card */}
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="bg-blue-50 h-full">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-blue-600 mb-2">
                  <FaUsers size={24} />
                </div>
                <p className="text-sm text-gray-600">Total Users</p>
                <h2 className="text-2xl font-bold">{dashboardStats.totalUsers.toLocaleString()}</h2>
              </div>
              <div className="w-24 h-2 bg-blue-200 rounded-full">
                <div className="w-3/4 h-full bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Total Admins Card */}
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="bg-green-50 h-full">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-green-600 mb-2">
                  <FaUsersCog size={24} />
                </div>
                <p className="text-sm text-gray-600">Total Admins</p>
                <h2 className="text-2xl font-bold">{dashboardStats.totalAdmins.toLocaleString()}</h2>
              </div>
              <div className="w-24 h-2 bg-green-200 rounded-full">
                <div className="w-3/4 h-full bg-green-600 rounded-full"></div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Total Sellers Card */}
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="bg-purple-50 h-full">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-purple-600 mb-2">
                  <FaUserTie size={24} />
                </div>
                <p className="text-sm text-gray-600">Total Sellers</p>
                <h2 className="text-2xl font-bold">{dashboardStats.totalSellers.toLocaleString()}</h2>
              </div>
              <div className="w-24 h-2 bg-purple-200 rounded-full">
                <div className="w-3/4 h-full bg-purple-600 rounded-full"></div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Total Sales Card */}
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="bg-red-50 h-full">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-red-600 mb-2">
                  <FaShoppingCart size={24} />
                </div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <h2 className="text-2xl font-bold">{dashboardStats.totalSales.toLocaleString()}</h2>
              </div>
              <div className="w-24 h-2 bg-red-200 rounded-full">
                <div className="w-3/4 h-full bg-red-600 rounded-full"></div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

     {/* Sales Analysis - Full Width */}
    <Row gutter={[16, 16]} className="mb-6">
      <Col xs={24}>
        <Card title="Sales Analysis" bordered={false}>
          <div style={{ height: '400px' }}>
            <Line 
              data={salesData} 
              options={{
                ...chartOptions,
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top'
                  },
                  title: {
                    display: true,
                    text: 'Monthly Sales Overview'
                  }
                }
              }} 
            />
          </div>
        </Card>
      </Col>
    </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} sm={8}>
          <Card
           onClick={handleSetting}
            bordered={false}
            className="bg-blue-50 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="text-blue-600 mb-2">
              <FaUsers size={24} />
            </div>
            <h3 className="font-semibold">Quick Settings</h3>
            <p className="text-sm text-gray-600">Configure system preferences</p>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
           onClick={handleAddAdmins}
            bordered={false}
            className="bg-green-50 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="text-green-600 mb-2">
              <FaUsersCog size={24} />
            </div>
            <h3 className="font-semibold">Add Admins</h3>
            <p className="text-sm text-gray-600">Create new admin account</p>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
           onClick={handleManageUsers}
            bordered={false}
            className="bg-red-50 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="text-red-600 mb-2">
              <FaUserTie size={24} />
            </div>
            <h3 className="font-semibold">Manage users</h3>
            <p className="text-sm text-gray-600">Monitor system users</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;