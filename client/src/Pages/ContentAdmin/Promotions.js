import React, { useState, useEffect } from 'react';
import { Table, message, Tooltip } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
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

  // Columns for Promotions Table
  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        <img 
          src={image} 
          alt="Promotion" 
          style={{ width: 100, height: 50, objectFit: 'cover' }} 
        />
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
        <span>
          <button 
            onClick={() => handleEdit(record)}
          >
            Edit
          </button>
          <button 
            onClick={() => handleDelete(record._id)}
          >
            Delete
          </button>
        </span>
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
        <button 
          onClick={() => navigate('/Content-Admin/promotion/create')}
        >
          Create Promotion
        </button>
      </div>

      <Table 
        columns={columns} 
        dataSource={promotions} 
        loading={loading}
        rowKey="_id"
      />
    </div>
  );
};

export default Promotions;
