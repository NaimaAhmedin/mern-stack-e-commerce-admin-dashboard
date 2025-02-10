import React from 'react';
import { Card, Row, Col } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { FaTruck, FaClock, FaCheckCircle } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import { BsArrowUpRight } from 'react-icons/bs';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Monthly Delivery Overview data
  const deliveryData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Deliveries',
        data: [85, 90, 75, 120, 95, 110, 85, 90],
        backgroundColor: '#ffd333',
        borderRadius: 6,
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
        ticks: {
          stepSize: 30,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Delivery Performance pie chart data
  const performanceData = {
    labels: ['On-Time', 'Delayed', 'Early'],
    datasets: [
      {
        data: [75, 15, 10],
        backgroundColor: ['#ffd333', '#ff9f43', '#28c76f'],
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="p-4">
      <div className="bg-[#ffd333] rounded-lg p-4 mb-6">
        <h1 className="text-2xl font-bold text-white">Merkato Delivery Dashboard</h1>
      </div>

      {/* Delivery Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card bordered={false} className="bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <FaTruck className="text-blue-600" size={20} />
                  <span className="text-gray-600">Active Orders</span>
                </div>
                <h2 className="text-2xl font-bold mt-2">1,200</h2>
                <p className="text-xs text-green-600">+10% from last month</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="bg-yellow-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <IoMdTime className="text-yellow-600" size={20} />
                  <span className="text-gray-600">Pending Deliveries</span>
                </div>
                <h2 className="text-2xl font-bold mt-2">300</h2>
                <p className="text-xs text-red-600">+5% from last month</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-600" size={20} />
                  <span className="text-gray-600">Completed Deliveries</span>
                </div>
                <h2 className="text-2xl font-bold mt-2">900</h2>
                <p className="text-xs text-green-600">+15% from last month</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Delivery Metrics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card bordered={false} className="bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-2">On-Time Delivery Rate</p>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">88%</h2>
                  <BsArrowUpRight className="text-green-600" />
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-2">Average Delivery Time</p>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">30 mins</h2>
                  <FaClock className="text-blue-600" />
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="bg-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-2">Delivery Success Rate</p>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">93%</h2>
                  <BsArrowUpRight className="text-purple-600" />
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Monthly Delivery Overview" bordered={false}>
            <div style={{ height: '300px' }}>
              <Bar data={deliveryData} options={chartOptions} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Delivery Performance" bordered={false}>
            <div style={{ height: '300px' }}>
              <Pie data={performanceData} options={pieOptions} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
