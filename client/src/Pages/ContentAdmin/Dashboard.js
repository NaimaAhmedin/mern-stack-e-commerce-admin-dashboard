import React from 'react';
import { Card, Row, Col, Table } from 'antd';
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
  // Sample data for monthly product statistics
  const productData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Products',
        data: [25, 45, 28, 32, 28, 42, 45, 25, 23, 45, 40, 35],
        backgroundColor: '#9333ea', // Purple color
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

  // Sample data for recent products table
  const recentProducts = [
    {
      key: '1',
      name: 'Wireless Earbuds',
      category: 'Electronics',
      status: 'Active',
      price: '$129.99',
    },
    {
      key: '2',
      name: 'Leather Wallet',
      category: 'Accessories',
      status: 'Pending',
      price: '$49.99',
    },
    {
      key: '3',
      name: 'Smart Watch',
      category: 'Electronics',
      status: 'Active',
      price: '$199.99',
    },
    {
      key: '4',
      name: 'Running Shoes',
      category: 'Sports',
      status: 'Active',
      price: '$89.99',
    },
  ];

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
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            status === 'Active'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
  ];

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
                <h2 className="text-2xl font-bold">1,234</h2>
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
                <h2 className="text-2xl font-bold">48</h2>
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
                <h2 className="text-2xl font-bold">15</h2>
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
                <h2 className="text-2xl font-bold">256</h2>
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
          >
            <div className="text-green-600 mb-2">
              <FaPercentage size={24} />
            </div>
            <h3 className="font-semibold">Promotions</h3>
            <p className="text-sm text-gray-600">Manage active promotions</p>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            className="bg-red-50 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="text-red-600 mb-2">
              <FaBox size={24} />
            </div>
            <h3 className="font-semibold">Statistics</h3>
            <p className="text-sm text-gray-600">View detailed reports</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
