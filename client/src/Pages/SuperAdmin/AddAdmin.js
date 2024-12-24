import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Select } from 'antd';
import { FaUserShield, FaEnvelope, FaLock, FaUserPlus, FaUserTag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddAdmin = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');

      // Make API call to register admin
      const response = await axios.post('/api/auth/register-admin', 
        {
          username: values.username,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
          role: values.role
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      message.success(`${values.role} Admin added successfully`);
      navigate('/admin/AdminList');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to add admin');
    } finally {
      setLoading(false);
    }
  };

  const adminRoles = [
    { value: 'SuperAdmin', label: 'Super Admin' },
    { value: 'DeliveryAdmin', label: 'Delivery Admin' },
    { value: 'ContentAdmin', label: 'Content Admin' },
    { value: 'seller', label: 'Seller' }
  ];

  return (
    <div style={{ 
      padding: '20px',
      background: '#f4f6f9',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: '40px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '500px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <FaUserPlus style={{ fontSize: '48px', color: '#1A3C9C', marginBottom: '16px' }} />
          <h1 style={{ color: '#1A3C9C', fontWeight: 'bold', margin: 0 }}>Add New Admin</h1>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {/* Username Input */}
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please enter username' }]}
          >
            <Input
              prefix={<FaUserShield style={{ color: '#1A3C9C' }} />}
              placeholder="Username"
              size="large"
              style={{
                borderRadius: '6px',
                backgroundColor: '#E1F5FE',
                border: 'none',
                color: '#0288D1'
              }}
            />
          </Form.Item>

          {/* Email Input */}
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input
              prefix={<FaEnvelope style={{ color: '#1A3C9C' }} />}
              placeholder="Email"
              size="large"
              style={{
                borderRadius: '6px',
                backgroundColor: '#E1F5FE',
                border: 'none',
                color: '#0288D1'
              }}
            />
          </Form.Item>

          {/* Role Selection */}
          <Form.Item
            name="role"
            rules={[{ required: true, message: 'Please select admin role' }]}
          >
            <Select
              prefix={<FaUserTag style={{ color: '#1A3C9C' }} />}
              placeholder="Select Admin Role"
              size="large"
              style={{
                borderRadius: '6px',
                backgroundColor: '#E1F5FE',
                border: 'none',
                color: '#0288D1'
              }}
              suffixIcon={<FaUserTag style={{ color: '#1A3C9C' }} />}
            >
              {adminRoles.map(role => (
                <Select.Option key={role.value} value={role.value}>
                  {role.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Password Input */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter password' }]}
          >
            <Input.Password
              prefix={<FaLock style={{ color: '#1A3C9C' }} />}
              placeholder="Password"
              size="large"
              style={{
                borderRadius: '6px',
                backgroundColor: '#E1F5FE',
                border: 'none',
                color: '#0288D1'
              }}
            />
          </Form.Item>

          {/* Confirm Password Input */}
          <Form.Item
            name="confirmPassword"
            rules={[{ required: true, message: 'Please confirm password' }]}
          >
            <Input.Password
              prefix={<FaLock style={{ color: '#1A3C9C' }} />}
              placeholder="Confirm Password"
              size="large"
              style={{
                borderRadius: '6px',
                backgroundColor: '#E1F5FE',
                border: 'none',
                color: '#0288D1'
              }}
            />
          </Form.Item>

          {/* Submit and Cancel Buttons */}
          <Form.Item style={{ marginTop: '30px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  flex: 1,
                  height: '45px',
                  backgroundColor: '#E8F5E9',
                  color: '#43A047',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <FaUserPlus /> Add Admin
              </Button>
              <Button
                onClick={() => navigate('/admin/AdminList')}
                style={{
                  flex: 1,
                  height: '45px',
                  backgroundColor: '#FFEBEE',
                  color: '#E53935',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '500'
                }}
              >
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddAdmin;