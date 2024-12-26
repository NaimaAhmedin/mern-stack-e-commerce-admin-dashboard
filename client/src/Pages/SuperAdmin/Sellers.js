import React, { useState, useEffect } from 'react';
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
import { getSellers, updateSellerStatus } from '../../services/sellerService';

const { Option } = Select;
const { TabPane } = Tabs;

const Sellers = () => {
  const [sellers, setSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [penaltyModalVisible, setPenaltyModalVisible] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [penaltyType, setPenaltyType] = useState('');
  const [penaltyAmount, setPenaltyAmount] = useState('');
  const [penaltyReason, setPenaltyReason] = useState('');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuspendedSellers = async () => {
      try {
        setIsLoading(true);
        const response = await getSellers({ 'sellerDetails.status': 'suspended' });
        
        const suspendedSellers = response.data.map(seller => ({
          id: seller._id,
          name: `${seller.firstName} ${seller.lastName}`.trim(),
          email: seller.email,
          phone: seller.phone,
          status: 'Suspended',
          address: seller.address ? 
            `${seller.address.street}, ${seller.address.city}, ${seller.address.state}` 
            : 'N/A',
          businessLicense: seller.sellerDetails?.businessLicense || 'N/A'
        }));

        setSellers(suspendedSellers);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchSuspendedSellers();
  }, []);

  const handleUnsuspendSeller = async (id) => {
    try {
      await updateSellerStatus(id, 'active');
      setSellers(sellers.filter(seller => seller.id !== id));
      message.success('Seller unsuspended successfully');
    } catch (err) {
      message.error('Failed to unsuspend seller');
      console.error(err);
    }
  };

  const handleRemoveSeller = (id) => {
    setSellers(sellers.filter(seller => seller.id !== id));
    message.success('Seller removed successfully');
  };

  const handleSendPenalty = async () => {
    if (!penaltyType || !penaltyAmount || !penaltyReason) {
      message.error('Please fill in all the penalty details');
      return;
    }
    
    try {
      // TODO: Implement actual penalty sending logic to backend
      await message.success(`Penalty sent to ${selectedSeller?.name}: ${penaltyType} - Birr ${penaltyAmount}`);
      setPenaltyModalVisible(false);
      setSelectedSeller(null);
      setPenaltyType('');
      setPenaltyAmount('');
      setPenaltyReason('');
    } catch (error) {
      message.error('Failed to send penalty');
      console.error(error);
    }
  };

  const handlePermanentRemoval = async (id) => {
    try {
      // TODO: Implement actual permanent seller removal logic
      await message.success('Seller permanently removed');
      setSellers(sellers.filter(seller => seller.id !== id));
    } catch (error) {
      message.error('Failed to remove seller');
      console.error(error);
    }
  };

  const handleViewProfile = (seller) => {
    setSelectedSeller(seller);
    setIsDrawerVisible(true);
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
      title: 'Contact',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaPhone style={{ color: '#0288D1' }} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaMapMarkerAlt style={{ color: '#43A047' }} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'Business License',
      dataIndex: 'businessLicense',
      key: 'businessLicense',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Tooltip title="Unsuspend Seller">
            <Button 
              onClick={() => handleUnsuspendSeller(record.id)}
              style={{
                backgroundColor: '#E8F5E9',
                color: '#43A047',
                border: 'none',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                width: '100%'
              }}
            >
              <FaUndo /> Unsuspend Seller
            </Button>
          </Tooltip>

          <Tooltip title="Send Penalty">
            <Button 
              onClick={() => {
                setSelectedSeller(record);
                setPenaltyModalVisible(true);
              }}
              style={{
                backgroundColor: '#FFF3E0',
                color: '#FB8C00',
                border: 'none',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                width: '100%'
              }}
            >
              <FaExclamationTriangle /> Send Penalty
            </Button>
          </Tooltip>

          <Popconfirm
            title="Are you sure you want to permanently remove this seller?"
            description="This action cannot be undone and will delete all seller data."
            onConfirm={() => handlePermanentRemoval(record.id)}
            okText="Yes, Remove Permanently"
            cancelText="No"
            okButtonProps={{
              style: { backgroundColor: '#D32F2F', borderColor: '#D32F2F' }
            }}
          >
            <Button 
              danger
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                width: '100%',
                backgroundColor: '#FFEBEE',
                color: '#D32F2F'
              }}
            >
              <FaTrash /> Permanent Removal
            </Button>
          </Popconfirm>

          <Tooltip title="View Seller Details">
            <Button 
              onClick={() => handleViewProfile(record)}
              style={{
                backgroundColor: '#E3F2FD',
                color: '#1976D2',
                border: 'none',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                width: '100%'
              }}
            >
              <FaUserCircle /> View Profile
            </Button>
          </Tooltip>
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
          render: (price) => `Birr ${price.toFixed(2)}`
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
          render: (amount) => `Birr ${amount.toFixed(2)}`
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

  if (isLoading) return <div>Loading suspended sellers...</div>;
  if (error) return <div>Error: {error}</div>;

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
            showSizeChanger: true 
          }}
          style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            overflow: 'hidden'
          }}
        />

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
                          <div style={{ fontSize: '18px', fontWeight: '500' }}>{selectedSeller.name}</div>
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
                    </Space>
                  </Card>

                  <Card title="Performance Metrics">
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                      <Statistic
                        title="Monthly Revenue"
                        value={`Birr 0`}
                        valueStyle={{ color: '#1A3C9C' }}
                      />
                      <Statistic
                        title="Order Completion"
                        value="0"
                        suffix="%"
                        valueStyle={{ color: '#43A047' }}
                      />
                      <Statistic
                        title="Customer Satisfaction"
                        value="0"
                        suffix="/5"
                        valueStyle={{ color: '#0288D1' }}
                      />
                      <Statistic
                        title="Return Rate"
                        value="0"
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
                {renderProducts([])}
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <FaHistory /> Recent Sales
                  </span>
                }
                key="3"
              >
                {renderSales([])}
              </TabPane>
            </Tabs>
          )}
        </Drawer>
      </Card>
    </div>
  );
};

export default Sellers;