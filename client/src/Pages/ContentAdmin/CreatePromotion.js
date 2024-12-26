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
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { createPromotion } from '../../services/promotionService';

const { RangePicker } = DatePicker;

const CreatePromotion = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  // Handle file upload
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
    
    // Create image preview
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Submit form
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Validate file is uploaded
      if (fileList.length === 0) {
        message.error('Please upload an image');
        setLoading(false);
        return;
      }

      // Prepare form data
      const formData = new FormData();
      formData.append('image', fileList[0].originFileObj);
      formData.append('startDate', values.dateRange[0].toISOString());
      formData.append('endDate', values.dateRange[1].toISOString());
      
      // Add optional link
      if (values.link) {
        formData.append('link', values.link);
      }

      // Create promotion
      const response = await createPromotion(formData);

      // Success handling
      if (response.success) {
        message.success('Promotion created successfully!', 1, () => {
          navigate('/Content-Admin/Promotion');
        });
      } else {
        throw new Error(response.message || 'Failed to create promotion');
      }
    } catch (error) {
      console.error('Promotion Creation Error:', error);
      message.error(error.message || 'Failed to create promotion');
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
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-4">
              <img 
                src={imagePreview} 
                alt="Promotion Preview" 
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = '/default-promotion.png'; // Fallback image
                  console.warn('Failed to load promotion image preview');
                }}
              />
            </div>
          )}
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
