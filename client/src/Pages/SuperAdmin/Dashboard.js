import React from "react";
import { Layout, Row, Col, Card } from "antd";
import { FaChartBar } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const { Content } = Layout;

const Dashboard = () => {
  // Example data for the chart (this can be fetched dynamically)
  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"], // Months
    datasets: [
      {
        label: "Sales",
        data: [10000, 15000, 12000, 18000, 22000, 21000, 25000], // Example sales data
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Sales Performance',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Sales ($)'
        }
      }
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Main Content Area */}
      <Layout>
        <Content
          style={{
            margin: "24px 16px 0",
            padding: "20px",
            background: "#f0f2f5", // Light background for contrast
            overflow: "auto",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h1>Welcome to the Admin Dashboard</h1>
            <p>
              Use the sections below to navigate through user management, sales performance, system health, and more.
            </p>
          </div>

          {/* Dashboard Overview */}
          <div style={{ marginTop: "20px" }}>
            <Row gutter={[16, 16]} justify="space-around">
              {/* Total Users Box */}
              <Col span={8}>
                <Card
                  style={{
                    background: "linear-gradient(145deg, #ff7f50, #f39c12)",
                    color: "white",
                    borderRadius: "20px",
                    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                  }}
                >
                  <h2>Total Users</h2>
                  <p style={{ fontSize: "28px" }}>1,450</p>
                </Card>
              </Col>

              {/* Total Sales Box */}
              <Col span={8}>
                <Card
                  style={{
                    background: "linear-gradient(145deg, #1abc9c, #16a085)",
                    color: "white",
                    borderRadius: "20px",
                    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                  }}
                >
                  <h2>Total Sales</h2>
                  <p style={{ fontSize: "28px" }}>$120,500</p>
                </Card>
              </Col>

              {/* Pending Tasks Box */}
              <Col span={8}>
                <Card
                  style={{
                    background: "linear-gradient(145deg, #e74c3c, #c0392b)",
                    color: "white",
                    borderRadius: "20px",
                    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                  }}
                >
                  <h2>Pending Tasks</h2>
                  <p style={{ fontSize: "28px" }}>5 Approvals</p>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Sales Performance Chart */}
          <div style={{ marginTop: "40px" }}>
            <h2 style={{ textAlign: "center" }}>Sales Performance</h2>
            <div style={{ width: "80%", margin: "0 auto" }}>
              <Line data={salesData} options={chartOptions} />
            </div>
          </div>

          {/* Super Admin-Specific Data */}
          <div style={{ marginTop: "40px" }}>
            <h2 style={{ textAlign: "center" }}>System Health & Admin Monitoring</h2>
            <Row gutter={[16, 16]} justify="space-around">
              {/* Active Users */}
              <Col span={8}>
                <Card
                  title="Active Users"
                  style={{ textAlign: "center", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                >
                  <p>1,200 active users</p>
                </Card>
              </Col>

              {/* Server Health */}
              <Col span={8}>
                <Card
                  title="Server Health"
                  style={{ textAlign: "center", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                >
                  <p>Status: <strong>All systems go</strong></p>
                </Card>
              </Col>

              {/* New Pending Requests */}
              <Col span={8}>
                <Card
                  title="New Requests"
                  style={{ textAlign: "center", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                >
                  <p>12 New requests</p>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Super Admin Extra - More Metrics */}
          <div style={{ marginTop: "40px" }}>
            <h2 style={{ textAlign: "center" }}>System Overview</h2>
            <Row gutter={[16, 16]} justify="space-around">
              {/* Platform Uptime */}
              <Col span={8}>
                <Card
                  title="Platform Uptime"
                  style={{ textAlign: "center", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                >
                  <p>99.9% Uptime</p>
                </Card>
              </Col>

              {/* Support Tickets */}
              <Col span={8}>
                <Card
                  title="Support Tickets"
                  style={{ textAlign: "center", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                >
                  <p>3 Tickets Pending</p>
                </Card>
              </Col>

              {/* Revenue */}
              <Col span={8}>
                <Card
                  title="Monthly Revenue"
                  style={{ textAlign: "center", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                >
                  <p>75,000</p>
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;