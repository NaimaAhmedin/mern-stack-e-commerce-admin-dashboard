import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Card } from 'antd';
import { FaEdit, FaTrashAlt, FaUserPlus, FaUserShield } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminList = () => {
  const [admins, setAdmins] = useState([
    { id: 1, name: 'John Doe', role: 'Admin', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Smith', role: 'Editor', email: 'jane.smith@example.com' },
    { id: 3, name: 'Robert Brown', role: 'Admin', email: 'robert.brown@example.com' },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Admin Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span style={{ color: '#1A3C9C', fontWeight: '500' }}>{text}</span>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (text) => (
        <span style={{ 
          color: text === 'Admin' ? '#43A047' : '#0288D1',
          fontWeight: '500'
        }}>
          {text}
        </span>
      ),
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
            onClick={() => handleDelete(record.id)}
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

  const handleEdit = (admin) => {
    setEditAdmin(admin);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setAdmins(admins.filter((admin) => admin.id !== id));
  };

  const handleSave = (values) => {
    const updatedAdmins = admins.map((admin) =>
      admin.id === editAdmin.id ? { ...admin, ...values } : admin
    );
    setAdmins(updatedAdmins);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddAdminRedirect = () => {
    navigate('/main-admin/AddAdmin');
  };

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
            Admin List
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

Senu, [12/13/2024 5:50 AM]
<Table
          columns={columns}
          dataSource={admins}
          rowKey="id"
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
        title={<div style={{ color: '#1A3C9C', fontWeight: 'bold' }}>Edit Admin</div>}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          initialValues={{ name: editAdmin?.name, role: editAdmin?.role, email: editAdmin?.email }}
          onFinish={handleSave}
        >
          <Form.Item label="Admin Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Admin">Admin</Select.Option>
              <Select.Option value="Editor">Editor</Select.Option>
              <Select.Option value="Viewer">Viewer</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              style={{
                backgroundColor: '#E1F5FE',
                color: '#0288D1',
                border: 'none',
                borderRadius: '6px'
              }}
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminList;