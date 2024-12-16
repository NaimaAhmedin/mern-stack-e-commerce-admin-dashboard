import React, { useState } from 'react';
import { Table, Button, Space, message, Popconfirm, Modal, Input, Select, Card, Tabs, Badge, Tooltip, Drawer, Rate, Statistic } from 'antd';
import { 
  FaUndo, 
  FaTrash, 
  FaExclamationTriangle, 
  FaStore, 
  FaUserTie, 
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaChartLine,
  FaBox,
  FaStar,
  FaHistory,
  FaShoppingCart,
  FaMoneyBillWave,
  FaUserCircle,
  FaInfoCircle
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { TabPane } = Tabs;

const Sellers = () => {
  const [sellers, setSellers] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'johndoe@example.com', 
      phone: '+1 (555) 123-4567',
      shop: 'Doe Electronics', 
      status: 'Suspended',
      address: '123 Tech Street, Silicon Valley, CA',
      joinDate: '2023-01-15',
      rating: 4.5,
      totalProducts: 150,
      totalSales: 25000,
      recentSales: [
        { id: 1, date: '2024-01-10', product: 'Smartphone X', amount: 999.99, status: 'Delivered' },
        { id: 2, date: '2024-01-05', product: 'Laptop Pro', amount: 1499.99, status: 'Processing' },
        { id: 3, date: '2023-12-28', product: 'Wireless Earbuds', amount: 199.99, status: 'Delivered' },
      ],
      products: [
        { id: 1, name: 'Smartphone X', price: 999.99, stock: 50, category: 'Electronics' },
        { id: 2, name: 'Laptop Pro', price: 1499.99, stock: 30, category: 'Electronics' },
        { id: 3, name: 'Wireless Earbuds', price: 199.99, stock: 100, category: 'Electronics' },
      ],
      performanceMetrics: {
        monthlyRevenue: 45000,
        orderCompletion: 98,
        customerSatisfaction: 4.5,
        returnRate: 2.5
      }
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'janesmith@example.com', 
      phone: '+1 (555) 987-6543',
      shop: 'Smith Fashions', 
      status: 'Suspended',
      address: '456 Fashion Ave, New York, NY',
      joinDate: '2023-02-20',
      rating: 4.8,
      totalProducts: 200,
      totalSales: 35000,
      recentSales: [
        { id: 4, date: '2024-01-09', product: 'Designer Dress', amount: 299.99, status: 'Delivered' },
        { id: 5, date: '2024-01-03', product: 'Luxury Handbag', amount: 899.99, status: 'Delivered' },
      ],
      products: [
        { id: 4, name: 'Designer Dress', price: 299.99, stock: 25, category: 'Fashion' },
        { id: 5, name: 'Luxury Handbag', price: 899.99, stock: 15, category: 'Accessories' },
      ],
      performanceMetrics: {
        monthlyRevenue: 55000,
        orderCompletion: 99,
        customerSatisfaction: 4.8,
        returnRate: 1.8
      }
    },
    { 
      id: 3, 
      name: 'Robert Brown', 
      email: 'robertbrown@example.com', 
      phone: '+1 (555) 246-8135',
      shop: 'Brown Groceries', 
      status: 'Suspended',
      address: '789 Market St, Chicago, IL',
      joinDate: '2023-03-10',
      rating: 4.2,
      totalProducts: 300,
      totalSales: 15000,
      recentSales: [
        { id: 6, date: '2024-01-08', product: 'Organic Food Bundle', amount: 149.99, status: 'Delivered' },
        { id: 7, date: '2024-01-02', product: 'Fresh Produce Box', amount: 79.99, status: 'Processing' },
      ],
      products: [
        { id: 6, name: 'Organic Food Bundle', price: 149.99, stock: 40, category: 'Groceries' },
        { id: 7, name: 'Fresh Produce Box', price: 79.99, stock: 60, category: 'Groceries' },
      ],
      performanceMetrics: {
        monthlyRevenue: 25000,
        orderCompletion: 95,
        customerSatisfaction: 4.2,
        returnRate: 3.2
      }
    },
  ]);

  const [penaltyModalVisible, setPenaltyModalVisible] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [penaltyType, setPenaltyType] = useState('');
  const [penaltyAmount, setPenaltyAmount] = useState('');
  const [penaltyReason, setPenaltyReason] = useState('');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const navigate = useNavigate();

  const handleUnsuspendSeller = (id) => {
    setSellers(sellers.map(seller =>
      seller.id === id ? { ...seller, status: 'Active' } : seller
    ));
    message.success('Seller unsuspended successfully');
  };

  const handleRemoveSeller = (id) => {
    setSellers(sellers.filter(seller => seller.id !== id));
    message.success('Seller removed successfully');
  };

  const handleSendPenalty = () => {
    if (!penaltyType || !penaltyAmount || !penaltyReason) {
      message.error('Please fill in all the penalty details');
      return;
    }
    message.success(`Penalty sent to ${selectedSeller?.name}: ${penaltyType} - Birr ${penaltyAmount}`);
    setPenaltyModalVisible(false);
    setSelectedSeller(null);
    setPenaltyType('');
    setPenaltyAmount('');
    setPenaltyReason('');
  };

  const handleViewProfile = (seller) => {
    setSelectedSeller(seller);
    setIsDrawerVisible(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Delivered': '#43A047',
      'Processing': '#1A3C9C',
      'Pending': '#FFA000',
      'Cancelled': '#E53935'
    };
    return colors[status] || '#666';
  };

  const formatCurrency = (value) => {
    return `${value.toFixed(2)} Birr`;
  };

  const columns = [
    {
      title: 'Seller Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaUserTie style={{ color: '#1A3C9C' }} />
          <div>
            <div style={{ color: '#1A3C9C', fontWeight: '500' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Shop',
      dataIndex: 'shop',
      key: 'shop',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaStore style={{ color: '#0288D1' }} />
          <div>
            <div style={{ color: '#0288D1', fontWeight: '500' }}>{text}</div>
            <Rate disabled defaultValue={record.rating} style={{ fontSize: '12px' }} />
          </div>
        </div>
      ),
    },
    {
      title: 'Performance',
      key: 'performance',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>
            <Badge 
              count={`${record.performanceMetrics.orderCompletion}%`} 
              style={{ 
                backgroundColor: '#1A3C9C',
                fontSize: '12px'
              }} 
            />
            <span style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>Completion Rate</span>
          </div>
          <div>
            <Badge 
              count={`${record.totalProducts}`} 
              style={{ 
                backgroundColor: '#0288D1',
                fontSize: '12px'
              }} 
            />
            <span style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>Products</span>
          </div>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{
          color: status === 'Active' ? '#43A047' : '#E53935',
          fontWeight: '500',
          backgroundColor: status === 'Active' ? '#E8F5E9' : '#FFEBEE',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '14px'
        }}>
          {status}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Profile">
            <Button
              onClick={() => handleViewProfile(record)}
              style={{
                backgroundColor: '#E3F2FD',
                color: '#1A3C9C',
                border: 'none',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <FaUserCircle /> Profile
            </Button>
          </Tooltip>

          <Button
            onClick={() => handleUnsuspendSeller(record.id)}
            style={{
              backgroundColor: '#E8F5E9',
              color: '#43A047',
              border: 'none',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <FaUndo /> Unsuspend
          </Button>

          <Button
            onClick={() => {
              setSelectedSeller(record);
              setPenaltyModalVisible(true);
            }}
            style={{
              backgroundColor: '#E1F5FE',
              color: '#0288D1',
              border: 'none',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <FaExclamationTriangle /> Penalty
          </Button>

          <Popconfirm
            title="Are you sure you want to remove this seller?"
            onConfirm={() => handleRemoveSeller(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              style={{
                backgroundColor: '#FFEBEE',
                color: '#E53935',
                border: 'none',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <FaTrash /> Remove
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const renderProducts = (products) => (
    <Table
      dataSource={products}
      columns={[
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Category', dataIndex: 'category', key: 'category' },
        { 
          title: 'Price', 
          dataIndex: 'price', 
          key: 'price',
          render: (price) => formatCurrency(price)
        },
        { 
          title: 'Stock', 
          dataIndex: 'stock', 
          key: 'stock',
          render: (stock) => (
            <Badge 
              status={stock > 20 ? 'success' : stock > 10 ? 'warning' : 'error'} 
              text={stock} 
            />
          )
        },
      ]}
      pagination={false}
    />
  );

  const renderSales = (sales) => (
    <Table
      dataSource={sales}
      columns={[
        { title: 'Date', dataIndex: 'date', key: 'date' },
        { title: 'Product', dataIndex: 'product', key: 'product' },
        { 
          title: 'Amount', 
          dataIndex: 'amount', 
          key: 'amount',
          render: (amount) => formatCurrency(amount)
        },
        { 
          title: 'Status', 
          dataIndex: 'status', 
          key: 'status',
          render: (status) => (
            <Badge 
              status={status === 'Delivered' ? 'success' : 'processing'} 
              text={status} 
            />
          )
        },
      ]}
      pagination={false}
    />
  );

  return (
    <div style={{ padding: '20px', background: '#f4f6f9', minHeight: '100vh' }}>
      <Card style={{
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ 
            color: '#1A3C9C',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <FaStore /> Manage Sellers
          </h1>
        </div>

        <Table
          columns={columns}
          dataSource={sellers}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} sellers`,
          }}
          style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            overflow: 'hidden'
          }}
        />
      </Card>

      <Modal
        title={
          <div style={{ 
            color: '#1A3C9C',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <FaExclamationTriangle />
            Send Penalty to {selectedSeller?.name}
          </div>
        }
        visible={penaltyModalVisible}
        onOk={handleSendPenalty}
        onCancel={() => setPenaltyModalVisible(false)}
        okButtonProps={{
          style: {
            backgroundColor: '#E53935',
            borderColor: '#E53935',
          }
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Select
            placeholder="Select Penalty Type"
            style={{ width: '100%' }}
            onChange={(value) => setPenaltyType(value)}
            value={penaltyType}
          >
            <Option value="warning">Warning</Option>
            <Option value="fine">Fine</Option>
            <Option value="suspension">Suspension</Option>
          </Select>

          <Input
            prefix="Birr"
            placeholder="Penalty Amount"
            type="number"
            value={penaltyAmount}
            onChange={(e) => setPenaltyAmount(e.target.value)}
          />

          <Input.TextArea
            placeholder="Reason for Penalty"
            value={penaltyReason}
            onChange={(e) => setPenaltyReason(e.target.value)}
            rows={4}
          />
        </Space>
      </Modal>

      <Drawer
        title={
          <div style={{ 
            color: '#1A3C9C',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <FaUserCircle /> Seller Profile
          </div>
        }
        width={700}
        placement="right"
        onClose={() => setIsDrawerVisible(false)}
        visible={isDrawerVisible}
      >
        {selectedSeller && (
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  <FaInfoCircle /> Overview
                </span>
              }
              key="1"
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Card>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FaStore style={{ color: '#1A3C9C', fontSize: '24px' }} />
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: '500' }}>{selectedSeller.shop}</div>
                        <Rate disabled defaultValue={selectedSeller.rating} style={{ fontSize: '14px' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FaUserTie style={{ color: '#1A3C9C' }} />
                      <span><strong>Owner:</strong> {selectedSeller.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FaEnvelope style={{ color: '#1A3C9C' }} />
                      <span><strong>Email:</strong> {selectedSeller.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FaPhone style={{ color: '#1A3C9C' }} />
                      <span><strong>Phone:</strong> {selectedSeller.phone}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FaMapMarkerAlt style={{ color: '#1A3C9C' }} />
                      <span><strong>Address:</strong> {selectedSeller.address}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FaCalendarAlt style={{ color: '#1A3C9C' }} />

                      <span><strong>Join Date:</strong> {selectedSeller.joinDate}</span>
                    </div>
                  </Space>
                </Card>

                <Card title="Performance Metrics">
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <Statistic
                      title="Monthly Revenue"
                      value={formatCurrency(selectedSeller.performanceMetrics.monthlyRevenue)}
                      valueStyle={{ color: '#1A3C9C' }}
                    />
                    <Statistic
                      title="Order Completion"
                      value={selectedSeller.performanceMetrics.orderCompletion}
                      suffix="%"
                      valueStyle={{ color: '#43A047' }}
                    />
                    <Statistic
                      title="Customer Satisfaction"
                      value={selectedSeller.performanceMetrics.customerSatisfaction}
                      suffix="/5"
                      valueStyle={{ color: '#0288D1' }}
                    />
                    <Statistic
                      title="Return Rate"
                      value={selectedSeller.performanceMetrics.returnRate}
                      suffix="%"
                      valueStyle={{ color: '#E53935' }}
                    />
                  </div>
                </Card>
              </Space>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <FaBox /> Products
                </span>
              }
              key="2"
            >
              {renderProducts(selectedSeller.products)}
            </TabPane>

            <TabPane
              tab={
                <span>
                  <FaHistory /> Recent Sales
                </span>
              }
              key="3"
            >
              {renderSales(selectedSeller.recentSales)}
            </TabPane>
          </Tabs>
        )}
      </Drawer>
    </div>
  );
};

export default Sellers;