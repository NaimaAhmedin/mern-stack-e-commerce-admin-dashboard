import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Badge, 
  Space, 
  Button, 
  Tooltip, 
  Popconfirm, 
  message, 
  Drawer, 
  Tabs, 
  Statistic, 
  Spin,
  Rate 
} from 'antd';
import { 
  FaUserCircle, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaUserTie, 
  FaTrash, 
  FaUndo, 
  FaInfoCircle,
  FaChartLine,
  FaShoppingCart,
  FaBox
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const { TabPane } = Tabs;

const ViewAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(response.data.data);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch users list');
      setLoading(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const formatCurrency = (value) => {
    return `${value.toFixed(2)} Birr`;
  };

  const handleRemoveUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
    message.success('User removed successfully');
  };

  const handleUnsuspendUser = (id) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, status: 'Active' } : user
    ));
    message.success('User unsuspended successfully');
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setIsDrawerVisible(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Active': '#43A047',
      'Suspended': '#E53935',
      'Pending': '#FFA000'
    };
    return colors[status] || '#666';
  };

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaUserCircle style={{ color: '#1A3C9C' }} />
          <div>
            <div style={{ color: '#1A3C9C', fontWeight: '500' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Badge 
          status={role === 'Super Admin' ? 'processing' : role === 'Seller' ? 'warning' : 'success'}
          text={role}
        />
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div><FaPhone style={{ marginRight: '8px' }} />{record.phone}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.address}</div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          color={getStatusColor(status)}
          text={status}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Profile">
            <Button 
              type="link" 
              icon={<FaInfoCircle />} 
              onClick={() => handleViewProfile(record)}
            />
          </Tooltip>

          <Button
            onClick={() => handleUnsuspendUser(record.id)}
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

          <Popconfirm
            title="Are you sure you want to remove this user?"
            onConfirm={() => handleRemoveUser(record.id)}
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

  const renderRecentOrders = (orders) => (
    <Table
      dataSource={orders}
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

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

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
            <FaUserTie /> Manage Users
          </h1>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} users`,
          }}
          style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            overflow: 'hidden'
          }}
        />
      </Card>

      <Drawer
        title={
          <div style={{ 
            color: '#1A3C9C',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <FaUserCircle /> User Profile
          </div>
        }
        width={700}
        placement="right"
        onClose={() => setIsDrawerVisible(false)}
        visible={isDrawerVisible}
      >
        {selectedUser && (
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  <FaInfoCircle /> Overview
                </span>
              }
              key="1"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Card>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <FaUserCircle style={{ fontSize: '48px', color: '#1A3C9C' }} />
                    <div>
                      <h2 style={{ margin: 0, color: '#1A3C9C' }}>{selectedUser.name}</h2>
                      <div style={{ color: '#666' }}>{selectedUser.email}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '16px', display: 'flex', gap: '16px' }}>
                    <div>
                      <FaPhone style={{ marginRight: '8px', color: '#1A3C9C' }} />
                      {selectedUser.phone}
                    </div>
                    <div>
                      <FaMapMarkerAlt style={{ marginRight: '8px', color: '#1A3C9C' }} />
                      {selectedUser.address}
                    </div>
                    <div>
                      <FaCalendarAlt style={{ marginRight: '8px', color: '#1A3C9C' }} />
                      {selectedUser.joinDate}
                    </div>
                  </div>
                </Card>

                <Card title="Performance Metrics">
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    {selectedUser.role === 'Customer' && (
                      <>
                        <Statistic
                          title="Total Orders"
                          value={selectedUser.totalOrders}
                          prefix={<FaShoppingCart />}
                          valueStyle={{ color: '#1A3C9C' }}
                        />
                        <Statistic
                          title="Total Spent"
                          value={formatCurrency(selectedUser.totalSpent)}
                          prefix={<FaChartLine />}
                          valueStyle={{ color: '#43A047' }}
                        />
                      </>
                    )}
                    {selectedUser.role === 'Seller' && (
                      <>
                        <Statistic
                          title="Monthly Revenue"
                          value={formatCurrency(selectedUser.totalSales)}
                          prefix={<FaChartLine />}
                          valueStyle={{ color: '#1A3C9C' }}
                        />
                        <Statistic
                          title="Order Completion"
                          value={selectedUser.performanceMetrics.orderCompletion}
                          suffix="%"
                          valueStyle={{ color: '#43A047' }}
                        />
                      </>
                    )}
                    {selectedUser.role === 'Super Admin' && (
                      <>
                        <Statistic
                          title="System Uptime"
                          value={selectedUser.performanceMetrics.systemUptime}
                          suffix="%"
                          valueStyle={{ color: '#1A3C9C' }}
                        />
                        <Statistic
                          title="Total System Users"
                          value={selectedUser.performanceMetrics.totalSystemUsers}
                          prefix={<FaBox />}
                          valueStyle={{ color: '#43A047' }}
                        />
                      </>
                    )}
                  </div>
                </Card>

                {selectedUser.role === 'Customer' && selectedUser.recentOrders && (
                  <Card title="Recent Orders">
                    {renderRecentOrders(selectedUser.recentOrders)}
                  </Card>
                )}
              </div>
            </TabPane>
          </Tabs>
        )}
      </Drawer>
    </div>
  );
};

export default ViewAllUsers;