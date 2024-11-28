import React, { useEffect } from 'react';
import { Form, Input, DatePicker, Button, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';

const EditPromotion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Retrieve the promotion data passed from the previous page
  const promotion = location.state;

  // Create the form instance
  const [form] = Form.useForm();

  useEffect(() => {
    if (promotion) {
      // Log the promotion data to ensure it's being received
      console.log('Promotion data received:', promotion);

      // Set the form fields with the promotion data
      form.setFieldsValue({
        name: promotion.name,
        description: promotion.description,
        startDate: moment(promotion.startDate), // Convert to moment for DatePicker
        endDate: moment(promotion.endDate),     // Convert to moment for DatePicker
      });
    } else {
      message.error('No promotion data found!');
    }
  }, [promotion, form]); // Include form in dependencies

  const handleFinish = async (values) => {
    // Here you would typically make an API call to save the updated promotion
    console.log('Updated Promotion Data:', {
      ...values,
      startDate: values.startDate.format('YYYY-MM-DD'), // Format date for API
      endDate: values.endDate.format('YYYY-MM-DD'),     // Format date for API
    });
    
    // Show a success message
    message.success('Promotion updated successfully!');
    
    // Navigate back to the promotions list after saving
    navigate('/Content-Admin/promotion');
  };

  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: '8px' }}>
      <h2 className="text-2xl font-bold mb-4">Edit Promotion</h2>
      <Form
        form={form} // Pass the form instance
        layout="vertical"
        onFinish={handleFinish}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="Promotion Name"
          name="name"
          rules={[{ required: true, message: 'Please input the promotion name!' }]}
        >
          <Input placeholder="Enter promotion name" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input the description!' }]}
        >
          <Input.TextArea placeholder="Enter description" rows={4} />
        </Form.Item>

        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true, message: 'Please select the start date!' }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="End Date"
          name="endDate"
          rules={[{ required: true, message: 'Please select the end date!' }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="bg-orange-600 text-white rounded-full px-4 py-2">
            Update Promotion
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditPromotion;
