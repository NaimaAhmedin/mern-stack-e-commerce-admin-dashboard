import React, { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { FaUserShield, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AddAdmin = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    console.log('Admin added:', values);
    message.success('Admin added successfully');
    navigate('/main-admin/AdminList');
  };

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

Senu, [12/13/2024 5:50 AM]
{/* Submit and Cancel Buttons */}
          <Form.Item style={{ marginTop: '30px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button
                type="primary"
                htmlType="submit"
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
                onClick={() => navigate('/main-admin/AdminList')}
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