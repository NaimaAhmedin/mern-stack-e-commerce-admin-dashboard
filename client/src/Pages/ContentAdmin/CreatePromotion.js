import React, { useState } from 'react';
import { 
  Form, 
  DatePicker, 
  Button, 
  Upload, 
  message, 
  Input
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;

const CreatePromotion = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle file upload
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  // Convert file to base64
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Submit form
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Get token from local storage
      const token = localStorage.getItem('token');
      console.log('Token:', token);  // Log the token for debugging

      // Convert image to base64
      const imageBase64 = await getBase64(fileList[0].originFileObj);

      // Prepare promotion data
      const promotionData = {
        image: imageBase64,
        startDate: values.dateRange[0].toISOString(),
        endDate: values.dateRange[1].toISOString(),
        link: values.link || '' // Add optional link
      };

      console.log('Promotion Data:', promotionData);  // Log the promotion data

      // Send API request with Authorization header
      const response = await axios.post('/api/promotions', promotionData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Success handling
      message.success('Promotion created successfully!', 1, () => {
        navigate('/Content-Admin/Promotion');
      });
    } catch (error) {
      console.error('Promotion Creation Error:', error);
      console.error('Error Response:', error.response);  // Log full error response
      message.error(error.response?.data?.message || 'Failed to create promotion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Promotion</h1>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="image"
          label="Promotion Image"
          rules={[{ required: true, message: 'Please upload an image' }]}
        >
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false} // Prevent auto upload
            accept="image/*"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>
              Click to Upload
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="link"
          label="Promotion Link (Optional)"
          rules={[
            {
              type: 'url',
              message: 'Please enter a valid URL',
            }
          ]}
        >
          <Input 
            placeholder="Enter promotion link (e.g., https://example.com)"
          />
        </Form.Item>

        <Form.Item
          name="dateRange"
          label="Promotion Duration"
          rules={[{ required: true, message: 'Please select promotion dates' }]}
        >
          <RangePicker 
            style={{ width: '100%' }}
            disabledDate={(current) => 
              current && current < moment().startOf('day')
            }
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            block
          >
            Create Promotion
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreatePromotion;
