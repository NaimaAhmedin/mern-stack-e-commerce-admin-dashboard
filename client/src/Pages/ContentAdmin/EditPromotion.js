import React, { useState, useEffect } from 'react';
import { 
  Form, 
  DatePicker, 
  Button, 
  Upload, 
  message, 
  Modal,
  Input 
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';

const { RangePicker } = DatePicker;

const EditPromotion = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [promotion, setPromotion] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch promotion details
  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/promotions/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const promotionData = response.data.data;
        setPromotion(promotionData);

        // Set initial form values
        form.setFieldsValue({
          dateRange: [
            moment(promotionData.startDate, 'YYYY-MM-DD'),
            moment(promotionData.endDate, 'YYYY-MM-DD')
          ],
          link: promotionData.link || '' // Set link value
        });

        // Set initial image
        if (promotionData.image) {
          setFileList([{
            uid: '-1',
            name: 'existing-image',
            status: 'done',
            url: promotionData.image
          }]);
        }
      } catch (error) {
        console.error('Failed to fetch promotion:', error);
        message.error('Failed to fetch promotion details');
      }
    };

    fetchPromotion();
  }, [id, form]);

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

      // Convert image to base64 if a new image is uploaded
      let imageBase64 = promotion.image;
      if (fileList.length > 0 && fileList[0].originFileObj) {
        imageBase64 = await getBase64(fileList[0].originFileObj);
      } else if (fileList.length === 0) {
        imageBase64 = null;
      }

      // Prepare promotion data
      const promotionData = {
        image: imageBase64,
        startDate: values.dateRange[0].toISOString(),
        endDate: values.dateRange[1].toISOString(),
        link: values.link || '' // Add link to promotion data
      };

      // Send API request
      await axios.put(`/api/promotions/${id}`, promotionData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Success handling
      message.success('Promotion updated successfully');
      navigate('/Content-Admin/Promotion');
    } catch (error) {
      console.error('Promotion Update Error:', error);
      message.error(error.response?.data?.message || 'Failed to update promotion');
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    navigate('/Content-Admin/Promotion');
  };

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
          rules={[
            {
              validator: async (_, value) => {
                // Only validate if no existing image and no new image is uploaded
                if (!promotion?.image && (!fileList || fileList.length === 0)) {
                  throw new Error('Please upload an image');
                }
              }
            }
          ]}
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
            disabledDate={(current) => {
              // Disable dates before today
              return current && current < moment().startOf('day');
            }}
            allowClear={true}
            showTime={false}
            format="YYYY-MM-DD"
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
          >
            Update Promotion
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title="Promotion Updated"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
      >
        <p>Your promotion has been successfully updated.</p>
      </Modal>
    </div>
  );
};

export default EditPromotion;
