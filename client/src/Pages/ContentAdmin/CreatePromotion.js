import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, DatePicker, Button, message } from 'antd';

const CreatePromotion = ({ setPromotions }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const newPromotion = {
      key: `${Date.now()}`, // Unique key based on timestamp
      name: values.name,
      description: values.description,
      startDate: values.startDate.format('YYYY-MM-DD'),
      endDate: values.endDate.format('YYYY-MM-DD'),
    };

    // Update the promotions list in PromotionManager
    setPromotions((prevPromotions) => [...prevPromotions, newPromotion]);
    
    message.success('Promotion created successfully!');
    navigate('/Content-Admin/promotions'); // Redirect to promotions list
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Create New Promotion</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Promotion Name"
          name="name"
          rules={[{ required: true, message: 'Please enter promotion name!' }]}
        >
          <Input placeholder="Enter promotion name" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please enter description!' }]}
        >
          <Input.TextArea placeholder="Enter promotion description" />
        </Form.Item>
        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true, message: 'Please select start date!' }]}
        >
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item
          label="End Date"
          name="endDate"
          rules={[{ required: true, message: 'Please select end date!' }]}
        >
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="bg-orange-600 text-white rounded-full">
            Create Promotion
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreatePromotion;
