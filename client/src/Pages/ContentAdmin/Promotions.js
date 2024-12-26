import React, { useState, useEffect } from 'react';
import { Table, message, Tooltip, Button, Popconfirm, Space } from 'antd';
import { LinkOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();

  // Fetch Promotions
  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/promotions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPromotions(response.data.data);
    } catch (error) {
      console.error('Failed to fetch promotions:', error);
      message.error('Failed to fetch promotions');
    } finally {
      setLoading(false);
    }
  };

  // Delete Promotion
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/promotions/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      message.success('Promotion deleted successfully');
      fetchPromotions();
    } catch (error) {
      console.error('Failed to delete promotion:', error);
      message.error('Failed to delete promotion');
    }
  };

  // Edit Promotion
  const handleEdit = (record) => {
    navigate(`/Content-Admin/promotion/edit/${record._id}`);
  };

  // Open Promotion Link
  const handleOpenLink = (link) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  // Handle row selection
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // Handle batch delete
  const handleBatchDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await Promise.all(
        selectedRowKeys.map(id =>
          axios.delete(`/api/promotions/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        )
      );
      message.success(`Successfully deleted ${selectedRowKeys.length} promotions`);
      setSelectedRowKeys([]);
      fetchPromotions();
    } catch (error) {
      console.error('Failed to delete promotions:', error);
      message.error('Failed to delete promotions');
    }
  };

  // Row selection configuration
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_NONE,
    ]
  };

  // Columns for Promotions Table
  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        image?.url ? (
          <img 
            src={image.url} 
            alt="Promotion" 
            style={{ 
              width: 100, 
              height: 50, 
              objectFit: 'cover', 
              borderRadius: 4,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }} 
          />
        ) : (
          <div 
            style={{ 
              width: 100, 
              height: 50, 
              backgroundColor: '#f0f2f5', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              borderRadius: 4,
              color: '#8c8c8c',
              fontWeight: 'bold',
              fontSize: '12px',
              border: '1px dashed #d9d9d9'
            }}
          >
            No Image
          </div>
        )
      )
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Link',
      dataIndex: 'link',
      key: 'link',
      render: (link) => (
        link ? (
          <Tooltip title="Open Link">
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                handleOpenLink(link);
              }}
            >
              <LinkOutlined /> {link}
            </a>
          </Tooltip>
        ) : (
          <span>No Link</span>
        )
      )
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <span>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
          style={{ backgroundColor: '#1890ff' }}
        >
          Edit
        </Button>
      )
    }
  ];

  useEffect(() => {
    fetchPromotions();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Promotions</h1>
        <Space>
          {selectedRowKeys.length > 0 && (
            <Popconfirm
              title="Delete Selected Promotions"
              description={`Are you sure to delete ${selectedRowKeys.length} selected promotions? This action cannot be undone.`}
              onConfirm={handleBatchDelete}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="large"
              >
                Delete Selected ({selectedRowKeys.length})
              </Button>
            </Popconfirm>
          )}
          <Button 
            type="primary"
            onClick={() => navigate('/Content-Admin/promotion/create')}
            style={{ backgroundColor: '#1890ff' }}
            size="large"
          >
            Create Promotion
          </Button>
        </Space>
      </div>

      <Table 
        rowSelection={rowSelection}
        columns={columns} 
        dataSource={promotions} 
        loading={loading}
        rowKey="_id"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
        }}
      />
    </div>
  );
};

export default Promotions;
