import React from "react";
import { Layout, Row, Col, Card, Statistic } from "antd";
import { FaHome, FaUsers, FaChartLine, FaCog, FaFileAlt } from "react-icons/fa";
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
import { Line } from "react-chartjs-2";

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
  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: "#1890ff",
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
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Content style={{ padding: "20px" }}>
        <h1 style={{ textAlign: "center", fontWeight: "bold", color: "#003a8c", marginBottom: "20px" }}>
          Super Admin Dashboard
        </h1>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={12} lg={8}>
            <Card
              style={{
                borderRadius: "10px",
                backgroundColor: "#e6f7ff",
              }}
              bordered={false}
            >
              <Statistic
                title="Total Users"
                value={2500}
                prefix={<FaUsers />}
                valueStyle={{ color: "#1890ff", fontSize: "24px" }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card
              style={{
                borderRadius: "10px",
                backgroundColor: "#fff1f0",
              }}
              bordered={false}
            >
              <Statistic
                title="Total Revenue"
                value={150000}
                suffix="Birr"
                prefix={<FaChartLine />}
                valueStyle={{ color: "#ff4d4f", fontSize: "24px" }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card
              style={{
                borderRadius: "10px",
                backgroundColor: "#f6ffed",
              }}
              bordered={false}
            >
              <Statistic
                title="Active Sellers"
                value={75}
                prefix={<FaHome />}
                valueStyle={{ color: "#52c41a", fontSize: "24px" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Sales Chart */}
        <div
          style={{
            marginTop: "40px",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 style={{ textAlign: "center", color: "#003a8c", marginBottom: "20px" }}>
            Sales Performance
          </h2>
          <div style={{ width: "80%", margin: "0 auto" }}>
            <Line data={salesData} options={chartOptions} />
          </div>
        </div>

        {/* Quick Actions */}
        <Row gutter={[16, 16]} style={{ marginTop: "40px" }}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                borderRadius: "10px",
                backgroundColor: "#e6f7ff",
                textAlign: "center",
              }}
              bordered={false}
            >
              <FaCog style={{ fontSize: "24px", color: "#1890ff" }} />
              <h3 style={{ marginTop: "10px", color: "#1890ff" }}>Settings</h3>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                borderRadius: "10px",
                backgroundColor: "#fff1f0",
                textAlign: "center",
              }}
              bordered={false}
            >
              <FaFileAlt style={{ fontSize: "24px", color: "#ff4d4f" }} />
              <h3 style={{ marginTop: "10px", color: "#ff4d4f" }}>Reports</h3>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Dashboard;
