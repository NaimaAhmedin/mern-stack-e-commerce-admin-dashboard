import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Select, Upload } from 'antd';
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

const Addproduct = ({ setProducts }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const newProduct = {
      key: `${Date.now()}`, // Unique key based on timestamp
      name: values.name,
      category: values.category,
      brand: values.brand,
      color: values.color,
      price: values.price,
      stock: values.stock,
      description: values.description,
      startDate: values.startDate.format('YYYY-MM-DD'),
      endDate: values.endDate.format('YYYY-MM-DD'),
    };

    // Update the products list in ProductManager
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    
    message.success('Product added successfully!');
    navigate('/admin/list-product'); // Redirect to product list
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Product Name"
          name="name"
          rules={[{ required: true, message: 'Please enter product name!' }]}
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
          rules={[{ required: true, message: 'Please enter the description!' }]}
        >
          <Input.TextArea placeholder="Enter product description" rows={4} />
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
          <Button type="primary" htmlType="submit" className="bg-orange-600 text-white rounded-full">
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Addproduct;
