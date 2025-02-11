import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Spin, message } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FaBox, FaListUl, FaPercentage, FaUsers } from 'react-icons/fa';
import { getDashboardStats, getMonthlyProductStats, getRecentProducts } from '../../services/contentAdminService';
import { useNavigate } from 'react-router-dom';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalPromotions: 0,
    totalUsers: 0
  });
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsResponse, monthlyResponse, recentResponse] = await Promise.all([
          getDashboardStats(),
          getMonthlyProductStats(),
          getRecentProducts()
        ]);

        if (statsResponse?.success) {
          setStats(statsResponse.data);
        }

        if (monthlyResponse?.success) {
          setMonthlyStats(monthlyResponse.data || Array(12).fill(0));
        }

        if (recentResponse?.success) {
          setRecentProducts((recentResponse.data || []).map(product => ({
            key: product._id,
            name: product.name,
            category: product.category || 'Uncategorized',
            status: product.status || 'Unknown',
            price: parseFloat(product.price).toFixed(2),
            date: new Date(product.createdAt).toLocaleDateString()
          })));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        message.error('Failed to fetch dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const productData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Products',
        data: monthlyStats,
        backgroundColor: '#9333ea',
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

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ 
          color: status === 'In Stock' ? '#52c41a' : status === 'Out of Stock' ? '#f5222d' : '#faad14'
        }}>
          {status}
        </span>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Date Added',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Content Management Dashboard</h1>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="bg-blue-50 h-full">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-blue-600 mb-2">
                  <FaBox size={24} />
                </div>
                <p className="text-sm text-gray-600">Total Products</p>
                {loading ? (
                  <Spin size="small" />
                ) : (
                  <h2 className="text-2xl font-bold">{stats.totalProducts || 0}</h2>
                )}
              </div>
              <div className="w-24 h-2 bg-blue-200 rounded-full">
                <div className="w-3/4 h-full bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="bg-green-50 h-full">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-green-600 mb-2">
                  <FaListUl size={24} />
                </div>
                <p className="text-sm text-gray-600">Active Categories</p>
                {loading ? (
                  <Spin size="small" />
                ) : (
                  <h2 className="text-2xl font-bold">{stats.totalCategories || 0}</h2>
                )}
              </div>
              <div className="w-24 h-2 bg-green-200 rounded-full">
                <div className="w-3/4 h-full bg-green-600 rounded-full"></div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="bg-purple-50 h-full">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-purple-600 mb-2">
                  <FaPercentage size={24} />
                </div>
                <p className="text-sm text-gray-600">Active Promotions</p>
                {loading ? (
                  <Spin size="small" />
                ) : (
                  <h2 className="text-2xl font-bold">{stats.totalPromotions || 0}</h2>
                )}
              </div>
              <div className="w-24 h-2 bg-purple-200 rounded-full">
                <div className="w-3/4 h-full bg-purple-600 rounded-full"></div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="bg-red-50 h-full">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-red-600 mb-2">
                  <FaUsers size={24} />
                </div>
                <p className="text-sm text-gray-600">Active Sellers</p>
                {loading ? (
                  <Spin size="small" />
                ) : (
                  <h2 className="text-2xl font-bold">{stats.totalUsers || 0}</h2>
                )}
              </div>
              <div className="w-24 h-2 bg-red-200 rounded-full">
                <div className="w-3/4 h-full bg-red-600 rounded-full"></div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts and Table */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="Monthly Product Statistics" bordered={false}>
            <div style={{ height: '300px' }}>
              <Bar data={productData} options={chartOptions} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Recent Products" bordered={false}>
            <Table
              columns={columns}
              dataSource={recentProducts}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            className="bg-blue-50 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleNavigate('/Content-Admin/category')}
          >
            <div className="text-blue-600 mb-2">
              <FaListUl size={24} />
            </div>
            <h3 className="font-semibold">Categories</h3>
            <p className="text-sm text-gray-600">Manage product categories</p>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            className="bg-green-50 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleNavigate('/Content-Admin/Promotion')}
          >
            <div className="text-green-600 mb-2">
              <FaPercentage size={24} />
            </div>
            <h3 className="font-semibold">Promotions</h3>
            <p className="text-sm text-gray-600">Manage active promotions</p>
          </Card>
        </Col>
      
      </Row>
    </div>
  );
};

export default Dashboard;
