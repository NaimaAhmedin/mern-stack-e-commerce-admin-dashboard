import React, { useState, useEffect } from 'react';
import { 
  Form, 
  DatePicker, 
  Button, 
  Upload, 
  message, 
  Input,
  Alert 
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import { getPromotion, updatePromotion } from '../../services/promotionService';

const { RangePicker } = DatePicker;

const EditPromotion = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [promotion, setPromotion] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch promotion details
  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await getPromotion(id);
        
        const promotionData = response.data;
        setPromotion(promotionData);

        // Set initial form values
        form.setFieldsValue({
          dateRange: [
            moment(promotionData.startDate),
            moment(promotionData.endDate)
          ],
          link: promotionData.link || '' // Set link value
        });

        // Set initial image preview
        if (promotionData.image) {
          setImagePreview(promotionData.image);
        }
      } catch (error) {
        console.error('Failed to fetch promotion:', error);
        setError(error.message || 'Failed to fetch promotion details');
        message.error(error.message || 'Failed to fetch promotion details');
      }
    };

    fetchPromotion();
  }, [id, form]);

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
      // If no file, reset to original image or null
      setImagePreview(promotion?.image || null);
    }
  };

  // Submit form
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Prepare form data
      const formData = new FormData();
      
      // Append start and end dates
      formData.append('startDate', values.dateRange[0].toISOString());
      formData.append('endDate', values.dateRange[1].toISOString());
      
      // Add optional link
      if (values.link) {
        formData.append('link', values.link);
      }

      // Append image if a new file is uploaded
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('image', fileList[0].originFileObj);
      }

      // Update promotion
      const response = await updatePromotion(id, formData);

      // Success handling
      if (response.success) {
        message.success('Promotion updated successfully!', 1, () => {
          navigate('/Content-Admin/Promotion');
        });
      } else {
        throw new Error(response.message || 'Failed to update promotion');
      }
    } catch (error) {
      console.error('Promotion Update Error:', error);
      message.error(error.message || 'Failed to update promotion');
    } finally {
      setLoading(false);
    }
  };

  // If there's an error fetching the promotion
  if (error) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <Alert 
          message="Error" 
          description={error} 
          type="error" 
          showIcon 
          closable
          onClose={() => setError(null)}
        />
        <Button 
          type="primary" 
          onClick={() => navigate('/Content-Admin/Promotion')}
          className="mt-4"
        >
          Back to Promotions
        </Button>
      </div>
    );
  }

  // If promotion is not yet loaded
  if (!promotion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Promotion</h1>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="image"
          label="Promotion Image"
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
              Click to Upload New Image
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
            Update Promotion
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditPromotion;
