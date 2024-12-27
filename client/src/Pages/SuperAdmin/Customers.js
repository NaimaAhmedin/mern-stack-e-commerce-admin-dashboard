import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Card, Tabs, Badge, Tooltip, Drawer, Spin } from 'antd';
import { 
  FaBan, 
  FaUndo, 
  FaEye, 
  FaUser, 
  FaEnvelope, 
  FaExclamationTriangle, 
  FaHistory, 
  FaShoppingCart,
  FaUserCircle,
  FaMapMarkerAlt,
  FaPhone,
  FaCalendarAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

const { TabPane } = Tabs;

const Customers = () => {
  const [users, setUsers] = useState([
    // { 
    //   id: 1, 
    //   name: 'John Doe', 
    //   email: 'johndoe@example.com', 
    //   status: 'Active',
    //   phone: '+1 (555) 123-4567',
    //   address: '123 Main St, New York, NY 10001',
    //   joinDate: '2023-01-15',
    //   totalOrders: 25,
    //   recentOrders: [
    //     { id: 1, date: '2024-01-10', amount: 150.00, status: 'Delivered' },
    //     { id: 2, date: '2024-01-05', amount: 89.99, status: 'Processing' },
    //     { id: 3, date: '2023-12-28', amount: 299.99, status: 'Delivered' },
    //   ]
    // },
    // { 
    //   id: 2, 
    //   name: 'Jane Smith', 
    //   email: 'janesmith@example.com', 
    //   status: 'Active',
    //   phone: '+1 (555) 987-6543',
    //   address: '456 Oak Ave, Los Angeles, CA 90001',
    //   joinDate: '2023-03-20',
    //   totalOrders: 18,
    //   recentOrders: [
    //     { id: 4, date: '2024-01-08', amount: 199.99, status: 'Delivered' },
    //     { id: 5, date: '2023-12-30', amount: 75.50, status: 'Delivered' },
    //   ]
    // },
    // { 
    //   id: 3, 
    //   name: 'Robert Brown', 
    //   email: 'robertbrown@example.com', 
    //   status: 'Suspended',
    //   phone: '+1 (555) 246-8135',
    //   address: '789 Pine St, Chicago, IL 60601',
    //   joinDate: '2023-06-10',
    //   totalOrders: 12,
    //   recentOrders: [
    //     { id: 6, date: '2023-12-15', amount: 129.99, status: 'Delivered' },
    //     { id: 7, date: '2023-12-01', amount: 45.99, status: 'Delivered' },
    //   ]
    // },
  ]);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [actionType, setActionType] = useState('');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch customers from backend
  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users/users/Customer', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(response.data.data);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch customer list');
      setLoading(false);
    }
  };


  const handleSuspendUser = (id) => {
    const user = users.find(user => user.id === id);
    setUserToUpdate(user);
    setActionType('suspend');
    setIsModalVisible(true);
  };

  const handleUnsuspendUser = (id) => {
    const user = users.find(user => user.id === id);
    setUserToUpdate(user);
    setActionType('unsuspend');
    setIsModalVisible(true);
  };

  const confirmAction = () => {
    if (actionType === 'suspend') {
      setUsers(users.map(user =>
        user.id === userToUpdate.id ? { ...user, status: 'Suspended' } : user
      ));
      message.success('Customer suspended successfully');
    } else if (actionType === 'unsuspend') {
      setUsers(users.map(user =>
        user.id === userToUpdate.id ? { ...user, status: 'Active' } : user
      ));
      message.success('Customer unsuspended successfully');
    }
    setIsModalVisible(false);
    setUserToUpdate(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setIsDrawerVisible(true);
  };

  const handleViewOrders = (id) => {
    navigate(`/orders/${id}`);
  };

  const getOrderStatusColor = (status) => {
    const colors = {
      'Delivered': '#43A047',
      'Processing': '#1A3C9C',
      'Pending': '#FFA000',
      'Cancelled': '#E53935'
    };
    return colors[status] || '#666';
  };

  const formatCurrency = (value) => {
    return `$${value.toFixed(2)} Birr`;
  };

  const renderOrders = (orders) => {
    const columns = [
      {
        title: 'Order ID',
        dataIndex: 'id',
        key: 'id',
        render: (id) => `#${id}`
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render: (date) => new Date(date).toLocaleDateString()
      },
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
          <span 
            style={{ 
              color: getOrderStatusColor(status), 
              fontWeight: 'bold' 
            }}
          >
            {status}
          </span>
        )
      }
    ];

    return (
      <Table 
        columns={columns} 
        dataSource={orders} 
        pagination={false} 
        size="small"
        rowKey="id"
      />
    );
  };

 // Fetch users on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const columns = [
    {
      title: 'Customer Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaUser style={{ color: '#1A3C9C' }} />
          <span style={{ color: '#1A3C9C', fontWeight: '500' }}>{text}</span>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaEnvelope style={{ color: '#0288D1' }} />
          <span style={{ color: '#666' }}>{text}</span>
        </div>
      ),
    },
    {
      title: 'Account Status',
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
      title: 'Total Orders',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      render: (total) => (
        <Badge 
          count={total} 
          style={{ 
            backgroundColor: '#1A3C9C',
            fontWeight: '500'
          }} 
        />
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
          
          <Tooltip title="View Order History">
            <Button
              onClick={() => handleViewOrders(record.id)}
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
              <FaHistory /> History
            </Button>
          </Tooltip>

          {record.status === 'Active' ? (
            <Tooltip title="Suspend Customer">
              <Button
                onClick={() => handleSuspendUser(record.id)}
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
                <FaBan /> Suspend
              </Button>
            </Tooltip>
          ) : (
            <Tooltip title="Unsuspend Customer">
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
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

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
            <FaUser /> Manage Customers
          </h1>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} customers`,
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
            {actionType === 'suspend' ? 'Suspend Customer' : 'Unsuspend Customer'}
          </div>
        }
        visible={isModalVisible}
        onOk={confirmAction}
        onCancel={handleCancel}
        okButtonProps={{
          style: {
            backgroundColor: actionType === 'suspend' ? '#E53935' : '#43A047',
            borderColor: actionType === 'suspend' ? '#E53935' : '#43A047',
          }
        }}
      >
        <p>Are you sure you want to {actionType} this customer?</p>
        {userToUpdate && (
          <div style={{ marginTop: '10px' }}>
            <p><strong>Name:</strong> {userToUpdate.name}</p>
            <p><strong>Email:</strong> {userToUpdate.email}</p>
          </div>
        )}
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
            <FaUserCircle /> Customer Profile
          </div>
        }
        width={600}
        placement="right"
        onClose={() => setIsDrawerVisible(false)}
        visible={isDrawerVisible}
      >
        {selectedUser && (
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  <FaUser /> Profile Details
                </span>
              }
              key="1"
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaUser style={{ color: '#1A3C9C' }} />
                  <span><strong>Name:</strong> {selectedUser.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaEnvelope style={{ color: '#1A3C9C' }} />
                  <span><strong>Email:</strong> {selectedUser.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaPhone style={{ color: '#1A3C9C' }} />
                  <span><strong>Phone:</strong> {selectedUser.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaMapMarkerAlt style={{ color: '#1A3C9C' }} />
                  <span><strong>Address:</strong> {selectedUser.address}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaCalendarAlt style={{ color: '#1A3C9C' }} />
                  <span><strong>Join Date:</strong> {selectedUser.joinDate}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaShoppingCart style={{ color: '#1A3C9C' }} />
                  <span><strong>Total Orders:</strong> {selectedUser.totalOrders}</span>
                </div>
              </Space>
            </TabPane>
            
            <TabPane
              tab={
                <span>
                  <FaHistory /> Recent Orders
                </span>
              }
              key="2"
            >
              {renderOrders(selectedUser.recentOrders)}
            </TabPane>
          </Tabs>
        )}
      </Drawer>
    </div>
  );
};

export default Customers;