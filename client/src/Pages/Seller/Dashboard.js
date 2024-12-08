import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {  ShoppingCartOutlined, BarChartOutlined } from '@ant-design/icons';

const Dashboard = () => {
  // Sample data for sales insights
  const salesData = [
    { month: 'Jan', sales: 400 },
    { month: 'Feb', sales: 700 },
    { month: 'Mar', sales: 600 },
    { month: 'Apr', sales: 800 },
    { month: 'May', sales: 1200 },
    { month: 'Jun', sales: 900 },
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', fontWeight: 'bold', color: '#003a8c', marginBottom: '20px' }}>
        Seller Dashboard
      </h1>

      {/* Performance Metrics */}
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} lg={8}>
          <Card
            style={{
              borderRadius: '10px',
              backgroundColor: '#e6f7ff',
            }}
            bordered={false}
          >
            <Statistic
              title="Total Revenue"
              value={5000}
              suffix="Birr"
              valueStyle={{ color: '#1890ff', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            style={{
              borderRadius: '10px',
              backgroundColor: '#fff1f0',
            }}
            bordered={false}
          >
            <Statistic
              title="Total Sales"
              value={150}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#ff4d4f', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            style={{
              borderRadius: '10px',
              backgroundColor: '#f6ffed',
            }}
            bordered={false}
          >
            <Statistic
              title="Active Products"
              value={75}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#52c41a', fontSize: '24px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Sales Insights Chart */}
      <div
        style={{
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ textAlign: 'center', color: '#003a8c', marginBottom: '20px' }}>
          Sales Insights
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={salesData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#1890ff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;