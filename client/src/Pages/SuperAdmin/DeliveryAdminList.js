import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Card, message, Spin } from 'antd';
import { FaEdit, FaTrashAlt, FaUserPlus, FaUserShield } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DeliveryAdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch delivery admins from backend
  const fetchDeliveryAdmins = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users/admins/DeliveryAdmin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Log the response for debugging
      console.log('Delivery Admins Response:', response.data);
      
      // Ensure we're accessing the correct data property
      setAdmins(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch delivery admin list:', error.response ? error.response.data : error);
      message.error('Failed to fetch delivery admin list');
      setLoading(false);
    }
  };

  // Delete admin with confirmation
  const handleDelete = (admin) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: `Are you sure you want to delete the delivery admin ${admin.userName}?`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No, Cancel',
      onOk() {
        deleteAdmin(admin._id);
      }
    });
  };

  // Actual delete function
  const deleteAdmin = async (adminId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/users/admin/${adminId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      message.success('Delivery Admin deleted successfully');
      fetchDeliveryAdmins(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete delivery admin:', error.response ? error.response.data : error);
      
      const errorMessage = error.response?.data?.message || 'Failed to delete delivery admin';
      message.error(errorMessage);
    }
  };

  // Edit admin 
  const handleEdit = (admin) => {
    setEditAdmin(admin);
    setIsModalVisible(true);
  };

  // Save edited admin
  const handleSave = async (values) => {
    console.log('Attempting to update delivery admin with values:', values);
    console.log('Editing admin details:', editAdmin);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/users/admin/${editAdmin._id}`, 
        { role: values.role }, // Explicitly send only role
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Update response:', response.data);
      message.success('Admin role updated successfully');
      setIsModalVisible(false);
      fetchDeliveryAdmins(); // Refresh the list
    } catch (error) {
      // Log the full error for debugging
      console.error('Failed to update delivery admin:', {
        errorResponse: error.response ? error.response.data : error,
        errorMessage: error.message,
        values: values,
        adminId: editAdmin._id
      });
      
      // Show specific error message from backend, or a generic error
      const errorMessage = error.response?.data?.message || 'Failed to update admin role';
      message.error(errorMessage);
    }
  };

  // Fetch admins on component mount
  useEffect(() => {
    fetchDeliveryAdmins();
  }, []);

  const columns = [
    {
      title: 'Admin Name',
      dataIndex: 'userName',
      key: 'userName',
      render: (text) => <span style={{ color: '#1A3C9C', fontWeight: '500' }}>{text}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <span style={{ color: '#666' }}>{text}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button
            onClick={() => handleEdit(record)}
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
            <FaEdit /> Edit
          </Button>
          <Button
            onClick={() => handleDelete(record)}
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
            <FaTrashAlt /> Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddAdminRedirect = () => {
    navigate('/admin/AddAdmin');
  };

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
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: '#1A3C9C', fontWeight: 'bold', margin: 0 }}>
            <FaUserShield style={{ marginRight: '10px' }} />
            Delivery Admin List
          </h1>
          <Button
            onClick={handleAddAdminRedirect}
            style={{
              backgroundColor: '#E8F5E9',
              color: '#43A047',
              border: 'none',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              height: '40px'
            }}
          >
            <FaUserPlus /> Add Admin
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={admins}
          rowKey="_id"
          pagination={false}
          style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            overflow: 'hidden'
          }}
        />
      </Card>

      {/* Modal for Editing Admin */}
      <Modal
        title={<div style={{ color: '#1A3C9C', fontWeight: 'bold' }}>Edit Admin Role</div>}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          initialValues={{ 
            role: editAdmin?.role 
          }}
          onFinish={handleSave}
        >
          <div style={{ 
            backgroundColor: '#F0F2F5', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            <p><strong>Current Admin Details:</strong></p>
            <p>Name: {editAdmin?.userName}</p>
            <p>Email: {editAdmin?.email}</p>
            <p>Current Role: {editAdmin?.role}</p>
          </div>

          <Form.Item 
            label="Change Role" 
            name="role" 
            rules={[{ required: true, message: 'Please select a new role' }]}
          >
            <Select placeholder="Select new role">
              <Select.Option value="SuperAdmin">Super Admin</Select.Option>
              <Select.Option value="DeliveryAdmin">Delivery Admin</Select.Option>
              <Select.Option value="ContentAdmin">Content Admin</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              style={{
                backgroundColor: '#E1F5FE',
                color: '#0288D1',
                border: 'none',
                borderRadius: '6px',
                width: '100%'
              }}
            >
              Update Role
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DeliveryAdminList;
