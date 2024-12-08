import React, { useState } from 'react';
import { Card, Col, Row, Statistic, Tooltip, Button, Table } from 'antd';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { SiProducthunt } from 'react-icons/si';

const SalesInsights = () => {
  const totalSales = 1250.75;
  const totalOrders = 345;
  const topSellingProduct = "Product A";

  const [selectedPart, setSelectedPart] = useState(null);

  const reportData = {
    totalSales: [
      { key: '1', label: 'Total Sales', value: totalSales, unit: 'USD' },
    ],
    totalOrders: [
      { key: '1', label: 'Total Orders', value: totalOrders, unit: 'orders' },
    ],
    topSellingProduct: [
      { key: '1', label: 'Top Selling Product', value: topSellingProduct, unit: '' },
    ],
  };

  const reportDetails = {
    totalSales: "This report shows the total sales for the selected period, including all successful transactions.",
    totalOrders: "This report indicates the number of orders placed, reflecting overall demand and customer engagement.",
    topSellingProduct: "This report highlights the top-selling product, providing insights into customer preferences and trends.",
  };

  const columns = [
    { title: 'Label', dataIndex: 'label', key: 'label' },
    { title: 'Value', dataIndex: 'value', key: 'value' },
    { title: 'Unit', dataIndex: 'unit', key: 'unit' },
  ];

  const handleButtonClick = (part) => setSelectedPart(part);
  const handleHideReport = () => setSelectedPart(null);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', fontWeight: 'bold', color: '#003a8c', marginBottom: '20px' }}>
        Sales Insights
      </h1>

      <Row gutter={[16, 16]} justify="center">
        {/* Total Sales Card */}
        <Col xs={24} sm={12} lg={8}>
          <Card
            style={{ backgroundColor: '#e6f7ff', borderRadius: '10px' }}
            bordered={false}
            hoverable
          >
            <Statistic
              title="Total Sales"
              value={totalSales}
              suffix="Birr"
              valueStyle={{ color: '#1890ff', fontSize: '24px' }}
            />
          </Card>
        </Col>

        {/* Total Orders Card */}
        <Col xs={24} sm={12} lg={8}>
          <Card
            style={{ backgroundColor: '#fff1f0', borderRadius: '10px' }}
            bordered={false}
            hoverable
          >
            <Statistic
              title="Total Orders"
              value={totalOrders}
              prefix={<AiOutlineShoppingCart />}
              valueStyle={{ color: '#ff4d4f', fontSize: '24px' }}
            />
          </Card>
        </Col>

        {/* Top Selling Product Card */}
        <Col xs={24} sm={12} lg={8}>
          <Card
            style={{ backgroundColor: '#f6ffed', borderRadius: '10px' }}
            bordered={false}
            hoverable
          >
            <Tooltip title="Product performance">
              <Statistic
                title="Top Selling Product"
                value={topSellingProduct}
                prefix={<SiProducthunt />}
                valueStyle={{ color: '#52c41a', fontSize: '24px' }}
              />
            </Tooltip>
          </Card>
        </Col>
      </Row>
{/* Report Buttons */}
<div style={{ textAlign: 'center', marginTop: '20px' }}>
<Button
  type="primary"
  style={{ marginRight: '10px', backgroundColor: '#1890ff', borderColor: '#1890ff' }}
  onClick={() => handleButtonClick('totalSales')}
>
  View Total Sales Report
</Button>
<Button
  type="primary"
  style={{ marginRight: '10px', backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}
  onClick={() => handleButtonClick('totalOrders')}
>
  View Total Orders Report
</Button>
<Button
  type="primary"
  style={{ marginRight: '10px', backgroundColor: '#52c41a', borderColor: '#52c41a' }}
  onClick={() => handleButtonClick('topSellingProduct')}
>
  View Top Selling Product Report
</Button>
</div>

{/* Report Table and Details */}
{selectedPart && (
<div style={{ marginTop: '30px', backgroundColor: '#fff', padding: '20px', borderRadius: '10px' }}>
  <h3 style={{ color: '#003a8c', fontWeight: 'bold', textAlign: 'center' }}>Detailed Report</h3>
  <Table
    columns={columns}
    dataSource={reportData[selectedPart]}
    pagination={false}
    style={{ margin: '20px auto', maxWidth: '600px' }}
  />
  <p style={{ textAlign: 'center', color: '#595959', fontSize: '16px' }}>
    {reportDetails[selectedPart]}
  </p>
  <div style={{ textAlign: 'center', marginTop: '10px' }}>
    <Button
      onClick={handleHideReport}
      style={{ backgroundColor: '#f5f5f5', color: '#333', borderRadius: '5px' }}
    >
      Hide Report
    </Button>
  </div>
</div>
)}
</div>
);
};

export default SalesInsights;