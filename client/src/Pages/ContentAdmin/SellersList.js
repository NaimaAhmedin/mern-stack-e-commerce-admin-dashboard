import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  message, 
  Popconfirm, 
  Card, 
  Input, 
  Select, 
  Tooltip, 
  Drawer, 
  Tag,
  Avatar,
  Descriptions
} from 'antd';
import { 
  FaUndo, 
  FaExclamationTriangle, 
  FaUserTie, 
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaStore
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;

const SellersList = () => {
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const navigate = useNavigate();

  // Fetch sellers from backend
  const fetchSellers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users/sellers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const formattedSellers = response.data.data.map(seller => ({
        ...seller,
        key: seller.id,
        joinedDate: moment(seller.createdAt).format('MMMM D, YYYY')
      }));

      setSellers(formattedSellers);
      setFilteredSellers(formattedSellers);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch sellers:', error);
      message.error('Failed to fetch sellers list');
      setLoading(false);
    }
  };

  // Suspend seller
  const handleSuspendSeller = async (sellerId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/users/sellers/${sellerId}/status`, 
        { status: 'Suspended' },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      // Update local state
      const updatedSellers = sellers.map(seller => 
        seller.id === sellerId 
          ? { ...seller, status: 'Suspended' } 
          : seller
      );

      setSellers(updatedSellers);
      setFilteredSellers(updatedSellers);
      message.success('Seller suspended successfully');
    } catch (error) {
      message.error('Failed to suspend seller');
      console.error('Suspension error:', error);
    }
  };

  // Activate seller
  const handleActivateSeller = async (sellerId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/users/sellers/${sellerId}/status`, 
        { status: 'Active' },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      // Update local state
      const updatedSellers = sellers.map(seller => 
        seller.id === sellerId 
          ? { ...seller, status: 'Active' } 
          : seller
      );

      setSellers(updatedSellers);
      setFilteredSellers(updatedSellers);
      message.success('Seller activated successfully');
    } catch (error) {
      message.error('Failed to activate seller');
      console.error('Activation error:', error);
    }
  };

  // View seller profile in drawer
  const handleViewProfile = (seller) => {
    setSelectedSeller(seller);
    setIsDrawerVisible(true);
  };

  // Filter sellers
  const handleSearch = (value) => {
    setSearchText(value);
    filterSellers(value, statusFilter);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    filterSellers(searchText, value);
  };

  const filterSellers = (search, status) => {
    let result = sellers;

    if (search) {
      result = result.filter(seller => 
        seller.name.toLowerCase().includes(search.toLowerCase()) ||
        seller.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== 'All') {
      result = result.filter(seller => seller.status === status);
    }

    setFilteredSellers(result);
  };

  // Fetch sellers on component mount
  useEffect(() => {
    fetchSellers();
  }, []);

  // Table columns
  const columns = [
    {
      title: 'Seller Profile',
      dataIndex: 'profileImage',
      render: (profileImage, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Avatar 
            src={profileImage} 
            icon={<FaUserTie />} 
            size={50} 
          />
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.name}</div>
            <div style={{ color: 'gray', fontSize: '12px' }}>{record.email}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Joined Date',
      dataIndex: 'joinedDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => (
        <Tag 
          color={status === 'Active' ? 'green' : 'red'}
        >
          {status}
        </Tag>
      )
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Profile">
            <Button 
              type="primary" 
              ghost 
              onClick={() => handleViewProfile(record)}
            >
              <FaUserCircle /> View
            </Button>
          </Tooltip>
          {record.status === 'Active' ? (
            <Popconfirm
              title="Are you sure you want to suspend this seller?"
              onConfirm={() => handleSuspendSeller(record.id)}
            >
              <Button type="danger">
                <FaExclamationTriangle /> Suspend
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Are you sure you want to activate this seller?"
              onConfirm={() => handleActivateSeller(record.id)}
            >
              <Button type="success">
                <FaUndo /> Activate
              </Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  // Seller Profile Drawer
  const SellerProfileDrawer = () => (
    <Drawer
      width={500}
      placement="right"
      onClose={() => setIsDrawerVisible(false)}
      visible={isDrawerVisible}
      title="Seller Profile Details"
    >
      {selectedSeller && (
        <div>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            marginBottom: '20px' 
          }}>
            <Avatar 
              src={selectedSeller.profileImage} 
              size={100} 
              icon={<FaUserTie />} 
              style={{ marginBottom: '10px' }}
            />
            <h2 style={{ margin: 0 }}>{selectedSeller.name}</h2>
            <p style={{ color: 'gray' }}>{selectedSeller.email}</p>
          </div>
          
          <Card>
            <Descriptions 
              column={1} 
              bordered 
              size="small"
            >
              <Descriptions.Item label={<><FaEnvelope /> Email</>}>
                {selectedSeller.email}
              </Descriptions.Item>
              <Descriptions.Item label={<><FaPhone /> Phone</>}>
                {selectedSeller.businessDetails?.phoneNumber || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label={<><FaMapMarkerAlt /> Address</>}>
                {selectedSeller.businessDetails?.address || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label={<><FaCalendarAlt /> Joined Date</>}>
                {moment(selectedSeller.createdAt).format('MMMM D, YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedSeller.status === 'Active' ? 'green' : 'red'}>
                  {selectedSeller.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      )}
    </Drawer>
  );

  return (
    <div>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            <Input.Search 
              placeholder="Search sellers" 
              onSearch={handleSearch}
              style={{ width: 200 }}
            />
            <Select 
              defaultValue="All" 
              style={{ width: 120 }}
              onChange={handleStatusFilter}
            >
              <Option value="All">All Status</Option>
              <Option value="Active">Active</Option>
              <Option value="Suspended">Suspended</Option>
            </Select>
          </Space>

          <Table 
            columns={columns}
            dataSource={filteredSellers}
            loading={loading}
            pagination={{ 
              pageSize: 10, 
              showSizeChanger: true 
            }}
          />
        </Space>
      </Card>

      <SellerProfileDrawer />
    </div>
  );
};

export default SellersList;