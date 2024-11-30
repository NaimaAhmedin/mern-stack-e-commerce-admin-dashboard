import React, { useState } from 'react';
import { Table, Button, Input, Row, Col, Tabs } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const SalesHistory = () => {
  const [transactions, setTransactions] = useState([
    { key: '1', transactionId: 'TXN001', date: '2024-11-25', amount: 200.75, status: 'Completed' },
    { key: '2', transactionId: 'TXN002', date: '2024-11-24', amount: 120.50, status: 'Pending' },
    { key: '3', transactionId: 'TXN003', date: '2024-11-23', amount: 340.00, status: 'Completed' },
    { key: '4', transactionId: 'TXN004', date: '2024-11-22', amount: 45.30, status: 'Failed' },
    { key: '5', transactionId: 'TXN005', date: '2024-11-21', amount: 500.00, status: 'Completed' },
  ]);

  const [refunds, setRefunds] = useState([
    { key: '1', refundId: 'RFN001', date: '2024-11-20', amount: 50.00, status: 'Processed' },
    { key: '2', refundId: 'RFN002', date: '2024-11-19', amount: 75.50, status: 'Pending' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const transactionColumns = [
    { title: 'Transaction ID', dataIndex: 'transactionId', key: 'transactionId' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Amount (USD)', dataIndex: 'amount', key: 'amount' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  const refundColumns = [
    { title: 'Refund ID', dataIndex: 'refundId', key: 'refundId' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Amount (USD)', dataIndex: 'amount', key: 'amount' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  const filteredTransactions = transactions.filter(transaction =>
    transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRefunds = refunds.filter(refund =>
    refund.refundId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    refund.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '30px', backgroundColor: '#FFF0F0', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center', color: '#FF4D4D', fontWeight: 'bold' }}>Sales History</h2>

      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={12} offset={6}>
          <Input
            placeholder="Search by ID or Status"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined />}
          />
        </Col>
      </Row>

      <Tabs defaultActiveKey="1" style={{ margin: '0 auto', maxWidth: '800px' }}>
        <Tabs.TabPane tab="Transaction History" key="1">
          <Table
            columns={transactionColumns}
            dataSource={filteredTransactions}
            pagination={false}
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Refunds/Exchanges Processed" key="2">
          <Table
            columns={refundColumns}
            dataSource={filteredRefunds}
            pagination={false}
          />
        </Tabs.TabPane>
      </Tabs>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <Button
          type="primary"
          style={{
            backgroundColor: '#FF4D4D',
            borderColor: '#FF4D4D',
            borderRadius: '20px',
            padding: '10px 20px',
            fontSize: '16px',
          }}
          onClick={() => alert('Download Sales Data (Coming Soon)')}
        >
          Download Sales Data
        </Button>
      </div>
    </div>
  );
};

export default SalesHistory;
