import React from 'react';
import { Card, Row, Col } from 'antd';
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
import { FaUsers, FaShoppingCart, FaUserTie, FaFileAlt } from 'react-icons/fa';

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
  // Sample data for monthly sales performance
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

  // Sample data for weekly user activity
  const userActivityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Active Users',
        data: [120, 190, 150, 180, 200, 170, 160],
        backgroundColor: '#95DE64',
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Super Admin Dashboard</h1>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="bg-blue-50 h-full">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-blue-600 mb-2">
                  <FaUsers size={24} />
                </div>
                <p className="text-sm text-gray-600">Total Users</p>
                <h2 className="text-2xl font-bold">112,893</h2>
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
                  <FaShoppingCart size={24} />
                </div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <h2 className="text-2xl font-bold">$150,000</h2>
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
                  <FaUserTie size={24} />
                </div>
                <p className="text-sm text-gray-600">Active Sellers</p>
                <h2 className="text-2xl font-bold">75+</h2>
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
                  <FaFileAlt size={24} />
                </div>
                <p className="text-sm text-gray-600">Reports</p>
                <h2 className="text-2xl font-bold">93</h2>
              </div>
              <div className="w-24 h-2 bg-red-200 rounded-full">
                <div className="w-3/4 h-full bg-red-600 rounded-full"></div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="Sales Analytics" bordered={false}>
            <div style={{ height: '300px' }}>
              <Line data={salesData} options={chartOptions} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="User Activity" bordered={false}>
            <div style={{ height: '300px' }}>
              <Bar data={userActivityData} options={chartOptions} />
            </div>
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
              <FaUsers size={24} />
            </div>
            <h3 className="font-semibold">Quick Settings</h3>
            <p className="text-sm text-gray-600">Configure system preferences</p>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            className="bg-green-50 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="text-green-600 mb-2">
              <FaShoppingCart size={24} />
            </div>
            <h3 className="font-semibold">Statistics</h3>
            <p className="text-sm text-gray-600">View detailed analytics</p>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            className="bg-red-50 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="text-red-600 mb-2">
              <FaFileAlt size={24} />
            </div>
            <h3 className="font-semibold">Performance</h3>
            <p className="text-sm text-gray-600">Monitor system metrics</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
