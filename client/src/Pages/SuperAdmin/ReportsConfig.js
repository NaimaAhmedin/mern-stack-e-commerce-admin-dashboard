import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Switch, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Space, 
  Tag, 
  Tooltip, 
  message 
} from 'antd';
import { 
  FaChartBar, 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaFileDownload, 
  FaFilter 
} from 'react-icons/fa';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ReportsConfig = () => {
  const [reportConfigs, setReportConfigs] = useState([
    {
      id: 1,
      name: 'Monthly Sales Report',
      type: 'Sales',
      frequency: 'Monthly',
      isActive: true,
      recipients: ['admin@example.com'],
      lastGenerated: '2024-01-15',
      format: ['PDF', 'CSV']
    },
    {
      id: 2,
      name: 'Quarterly Customer Insights',
      type: 'Customer',
      frequency: 'Quarterly',
      isActive: false,
      recipients: ['management@example.com'],
      lastGenerated: '2023-12-31',
      format: ['PDF']
    },
    {
      id: 3,
      name: 'Weekly Inventory Status',
      type: 'Inventory',
      frequency: 'Weekly',
      isActive: true,
      recipients: ['inventory@example.com'],
      lastGenerated: '2024-01-10',
      format: ['CSV', 'Excel']
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [form] = Form.useForm();

  const handleToggleReportStatus = (id) => {
    setReportConfigs(reportConfigs.map(report => 
      report.id === id 
        ? { ...report, isActive: !report.isActive } 
        : report
    ));
  };

  const handleEditReport = (report) => {
    setEditingReport(report);
    setIsModalVisible(true);
    form.setFieldsValue({
      name: report.name,
      type: report.type,
      frequency: report.frequency,
      recipients: report.recipients,
      format: report.format
    });
  };

  const handleDeleteReport = (id) => {
    setReportConfigs(reportConfigs.filter(report => report.id !== id));
    message.success('Report configuration deleted successfully');
  };

  const handleAddNewReport = () => {
    setEditingReport(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleModalSubmit = () => {
    form.validateFields().then(values => {
      if (editingReport) {
        // Update existing report
        setReportConfigs(reportConfigs.map(report => 
          report.id === editingReport.id 
            ? { ...report, ...values } 
            : report
        ));
        message.success('Report configuration updated successfully');
      } else {
        // Add new report
        const newReport = {
          id: reportConfigs.length + 1,
          ...values,
          isActive: true,
          lastGenerated: null
        };
        setReportConfigs([...reportConfigs, newReport]);
        message.success('New report configuration added successfully');
      }
      setIsModalVisible(false);
    }).catch(errorInfo => {
      console.log('Validation Failed:', errorInfo);
    });
  };

  const columns = [
    {
      title: 'Report Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaChartBar style={{ color: '#1A3C9C' }} />
          <span style={{ color: '#1A3C9C', fontWeight: '500' }}>{name}</span>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag 
          color={
            type === 'Sales' ? 'blue' : 
            type === 'Customer' ? 'green' : 
            type === 'Inventory' ? 'purple' : 'default'
          }
        >
          {type}
        </Tag>
      ),
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive, record) => (
        <Switch 
          checked={isActive} 
          onChange={() => handleToggleReportStatus(record.id)}
        />
      ),
    },
    {
      title: 'Last Generated',
      dataIndex: 'lastGenerated',
      key: 'lastGenerated',
    },
    {
      title: 'Format',
      dataIndex: 'format',
      key: 'format',
      render: (formats) => (
        <Space>
          {formats.map(format => (
            <Tag key={format} color="default">{format}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Report">
            <Button 
              icon={<FaEdit />} 
              type="link" 
              onClick={() => handleEditReport(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Report">
            <Button 
              icon={<FaTrash />} 
              type="link" 
              danger 
              onClick={() => handleDeleteReport(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', background: '#f4f6f9', minHeight: '100vh' }}>
      <Card 
        title={
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <div style={{ 
              color: '#1A3C9C', 
              fontWeight: 'bold', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px' 
            }}>
              <FaChartBar /> Reports Configuration
            </div>
            <Button 
              type="primary" 
              icon={<FaPlus />} 
              onClick={handleAddNewReport}
            >
              Add New Report
            </Button>
          </div>
        }
        style={{
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Table
          columns={columns}
          dataSource={reportConfigs}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} report configurations`,
          }}
        />
      </Card>

      <Modal
        title={editingReport ? 'Edit Report Configuration' : 'Add New Report Configuration'}
        visible={isModalVisible}
        onOk={handleModalSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Report Name"
            rules={[{ required: true, message: 'Please enter report name' }]}
          >
            <Input prefix={<FaChartBar />} placeholder="Enter report name" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Report Type"
            rules={[{ required: true, message: 'Please select report type' }]}
          >
            <Select placeholder="Select report type">
              <Option value="Sales">Sales</Option>
              <Option value="Customer">Customer</Option>
              <Option value="Inventory">Inventory</Option>
              <Option value="Financial">Financial</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="frequency"
            label="Report Frequency"
            rules={[{ required: true, message: 'Please select report frequency' }]}
          >
            <Select placeholder="Select report frequency">
              <Option value="Daily">Daily</Option>
              <Option value="Weekly">Weekly</Option>
              <Option value="Monthly">Monthly</Option>
              <Option value="Quarterly">Quarterly</Option>
              <Option value="Annually">Annually</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="recipients"
            label="Report Recipients"
            rules={[{ required: true, message: 'Please add at least one recipient' }]}
          >
            <Select 
              mode="tags" 
              placeholder="Enter email addresses"
              tokenSeparators={[',']}
            />
          </Form.Item>

          <Form.Item
            name="format"
            label="Report Formats"
            rules={[{ required: true, message: 'Please select at least one format' }]}
          >
            <Select 
              mode="multiple" 
              placeholder="Select report formats"
            >
              <Option value="PDF">PDF</Option>
              <Option value="CSV">CSV</Option>
              <Option value="Excel">Excel</Option>
              <Option value="HTML">HTML</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReportsConfig;