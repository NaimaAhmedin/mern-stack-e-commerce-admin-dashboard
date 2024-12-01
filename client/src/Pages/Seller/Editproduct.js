import React, { useEffect } from 'react';
import { Form, Input, Button, message, Select, Upload } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
// import moment from 'moment';

import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const props = {
  name: 'file',
  multiple: true,
  action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};
const { Option } = Select;

const Editproduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Retrieve the product data passed from the previous page
  const product = location.state;

  // Create the form instance
  const [form] = Form.useForm();

  useEffect(() => {
    if (product) {
      // Log the product data to ensure it's being received
      console.log('Product data received:', product);

      // Set the form fields with the product data
      form.setFieldsValue({
        name: product.name,
        category: product.category,
        brand: product.brand,
        color: product.color,
        price: product.price,
        stock: product.stock,
        postedTime: product.postedTime,
        postedDate: product.postedDate,
        description: product.description,
        // startDate: moment(product.startDate), // Convert to moment for DatePicker
        // endDate: moment(product.endDate),     // Convert to moment for DatePicker
      });
    } else {
      message.error('No product data found!');
    }
  }, [product, form]); // Include form in dependencies

  const handleFinish = async (values) => {
    // Here you would typically make an API call to save the updated product
    console.log('Updated Product Data:', {
      ...values,
    //   startDate: values.startDate.format('YYYY-MM-DD'), // Format date for API
    //   endDate: values.endDate.format('YYYY-MM-DD'),     // Format date for API
    });
    
    // Show a success message
    message.success('Product updated successfully!');
    
    // Navigate back to the promotions list after saving
    // navigate('/Content-Admin/promotion');
    navigate('/seller/ProductList');
    
  };

  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: '8px' }}>
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <Form
        form={form} // Pass the form instance
        layout="vertical"
        onFinish={handleFinish}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="product Name"
          name="name"
          rules={[{ required: true, message: 'Please input the product name!' }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: 'Please select a category!' }]}
        >
          <Select placeholder="Select a category">
            <Option value="Footwear">Footwear</Option>
            <Option value="Clothing">Clothing</Option>
            <Option value="Electronics">Electronics</Option>
            <Option value="Home Appliance">Home Appliance</Option>
            <Option value="Accessories">Accessories</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Brand"
          name="brand"
          rules={[{ required: true, message: 'Please input the brand!' }]}
        >
          <Input.TextArea placeholder="Enter brand" rows={1} />
        </Form.Item>

        <Form.Item
          label="Color"
          name="color"
          rules={[{ required: true, message: 'Please input the color!' }]}
        >
          <Input.TextArea placeholder="Enter color" rows={1} />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: 'Please input the price!' }]}
        >
          <Input.TextArea placeholder="Enter Price" rows={1} />
        </Form.Item>

        <Form.Item
          label="Stock"
          name="stock"
          rules={[{ required: true, message: 'Please input the stock!' }]}
        >
          <Input.TextArea placeholder="Enter Stock" rows={1} />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input the description!' }]}
        >
          <Input.TextArea placeholder="Enter description" rows={4} />
        </Form.Item>

        <Form.Item>
        <Dragger {...props}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
    <p className="ant-upload-hint">
      Support for a single or bulk upload. Strictly prohibited from uploading company data or other
      banned files.
    </p>
  </Dragger>
  </Form.Item>
  
        <Form.Item>
          <Button type="primary" htmlType="submit" className="bg-orange-600 text-white rounded-full px-4 py-2">
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Editproduct;
