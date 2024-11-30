import React, { useState } from 'react';
import { Card, Col, Row, Statistic, Tooltip, Button, Table } from 'antd';
import { AiOutlineShoppingCart, AiOutlineDollarCircle } from 'react-icons/ai';
import { SiProducthunt } from 'react-icons/si';

const SalesInsights = () => {
  // Mock sales data (you can fetch this from an API or state)
  const totalSales = 1250.75;
  const totalOrders = 345;
  const topSellingProduct = "Product A";

  // State to handle report visibility and selection
  const [selectedPart, setSelectedPart] = useState(null);

  // Data for the report (for table rendering)
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

  // Detailed information for each report
  const reportDetails = {
    totalSales: "This report shows the total sales for the selected period, including all successful transactions.",
    totalOrders: "This report indicates the number of orders placed, reflecting overall demand and customer engagement.",
    topSellingProduct: "This report highlights the top-selling product, providing insights into customer preferences and trends."
  };

  // Columns for the table
  const columns = [
    { title: 'Label', dataIndex: 'label', key: 'label' },
    { title: 'Value', dataIndex: 'value', key: 'value' },
    { title: 'Unit', dataIndex: 'unit', key: 'unit' },
  ];

  const handleButtonClick = (part) => {
    setSelectedPart(part);  // Set the selected part
  };

  const handleHideReport = () => {
    setSelectedPart(null);  // Hide the report
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#FFF0F0', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center', color: '#FF4D4D', fontWeight: 'bold' }}>Sales Insights</h2>

      <Row gutter={16} justify="center" style={{ marginTop: '30px' }}>
        {/* Total Sales Card */}
        <Col span={8}>
          <Card
            style={{ backgroundColor: '#FFB3C1', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
            hoverable
          >
            <Statistic
              title="Total Sales"
              value={totalSales}
              prefix={<AiOutlineDollarCircle style={{ fontSize: '24px', color: '#FF4D4D' }} />}
              valueStyle={{ fontSize: '24px', color: '#FF4D4D' }}
              suffix="USD"
            />
          </Card>
        </Col>

        {/* Total Orders Card */}
        <Col span={8}>
          <Card
            style={{ backgroundColor: '#FFB3C1', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
            hoverable
          >
            <Statistic
              title="Total Orders"
              value={totalOrders}
              prefix={<AiOutlineShoppingCart style={{ fontSize: '24px', color: '#FF4D4D' }} />}
              valueStyle={{ fontSize: '24px', color: '#FF4D4D' }}
            />
          </Card>
        </Col>

        {/* Top Selling Product Card */}
        <Col span={8}>
          <Card
            style={{ backgroundColor: '#FFB3C1', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
            hoverable
          >
            <Tooltip title="Product performance">
              <Statistic
                title="Top Selling Product"
                value={topSellingProduct}
                prefix={<SiProducthunt style={{ fontSize: '24px', color: '#FF4D4D' }} />}
                valueStyle={{ fontSize: '24px', color: '#FF4D4D' }}
              />
            </Tooltip>
          </Card>
        </Col>
      </Row>
      {/* Part Selection Buttons */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <Button
          type="primary"
          style={{ marginRight: '10px', backgroundColor: '#FF4D4D', borderColor: '#FF4D4D', borderRadius: '20px' }}
          onClick={() => handleButtonClick('totalSales')}
        >
          View Total Sales Report
        </Button>
        <Button
          type="primary"
          style={{ marginRight: '10px', backgroundColor: '#FF4D4D', borderColor: '#FF4D4D', borderRadius: '20px' }}
          onClick={() => handleButtonClick('totalOrders')}
        >
          View Total Orders Report
        </Button>
        <Button
          type="primary"
          style={{ marginRight: '10px', backgroundColor: '#FF4D4D', borderColor: '#FF4D4D', borderRadius: '20px' }}
          onClick={() => handleButtonClick('topSellingProduct')}
        >
          View Top Selling Product Report
        </Button>
      </div>

      {/* Table View and Detailed Description for Selected Part */}
      {selectedPart && (
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <h3 style={{ color: '#FF4D4D', fontWeight: 'bold' }}>Detailed Report</h3>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={reportData[selectedPart]}
            pagination={false}
            style={{ margin: '0 auto', maxWidth: '600px' }}
          />

          {/* Report Description */}
          <div style={{ marginTop: '20px', color: '#333', fontSize: '16px' }}>
            <p>{reportDetails[selectedPart]}</p>
          </div>

          {/* Hide Report Button */}
          <div style={{ marginTop: '20px' }}>
            <Button
              type="default"
              style={{ backgroundColor: '#D3D3D3', borderRadius: '20px', padding: '10px 20px' }}
              onClick={handleHideReport}
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