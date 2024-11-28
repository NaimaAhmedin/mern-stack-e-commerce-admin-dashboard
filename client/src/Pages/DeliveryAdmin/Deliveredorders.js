import React, { useState } from 'react';
import { Table, Button, Modal  } from 'antd';
import Ordereditemlist from './Ordereditemlist';
import { MdSearch } from "react-icons/md";
// const { Option } = Select;

// Updated columns with new fields and modified stock & category filters
const columns = (showProductDetails, showOrderDetails, showCostBreakdown, filterCategory) => [
  {
    title: "SNo",
    dataIndex: "key",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Order ID",
    dataIndex: "orderId",
  },
  {
    title: "Customer Name",
    dataIndex: "customerName",
  },
 
  {
    title: "Deliverer Name",
    dataIndex: "delivererName",
  },
  {
    title: "Shipping Address",
    dataIndex: "shippingAddress",
  },
  {
    title: "Order Date",
    dataIndex: "orderDate",
    render: (orderDate) => new Date(orderDate).toLocaleDateString(),
  },
  {
    title: "Items",
    align: "center",
    render: (_, record) => (
      <div>
        <Button 
          onClick={() => showProductDetails(record)} 
          style={{ backgroundColor: '#007bff', color: 'white' }}
        >
          Item Details
        </Button>
      </div>
    ),
  },
  {
    title: "Total Cost",
    dataIndex: "totalCost",
    render: (text, record) => (
      <Button 
        onClick={() => showCostBreakdown(record)} 
        style={{ backgroundColor: '#28a745', color: 'white' }}
      >
        {record.totalCost.toFixed(2)}
      </Button>
    ),
  },
  {
    title: "Actions",
    render: (_, record) => (
      <div>
        <Button 
          onClick={() => showOrderDetails(record)} 
          style={{ marginLeft: '10px', backgroundColor: '#007bff', color: 'white' }}
        >
        Details
        </Button>
      </div>
    ),
  },
];

// Updated sample data with more products and images
const data1 = [
  {
    key: 0,
    orderId: "P001",
    customerName: "Abubeker",
    delivererName: "Amir",
    shippingAddress: "Weyra, Addis Ababa",
    paymentMethod:"Telebirr",
    orderDate: "5/02/2024",
    totalCost: 49.99,

    price: 49.99,
    stockAddress:"Bethel,Addis Ababa",
    description: "High-quality running shoes for daily workouts.",
    
  },
  {
    key: 2,
    orderId: "P002",
    customerName: "Rejeb",
    delivererName: "Robel",
    shippingAddress: "Bethel, Addis Ababa",
    paymentMethod: "Telebirr",
    orderDate: "10/03/2024",
    totalCost: 120.75,
    price: 120.75,
    stockAddress: "Mexico, Addis Ababa",
    description: "Noise-cancelling headphones with Bluetooth connectivity.",
    
  },
  {
    key: 3,
    orderId: "P003",
    customerName: "Ahmed",
    delivererName: "Desta",
    shippingAddress: "Mexico, Addis Ababa",
    paymentMethod: "Telebirr",
    orderDate: "2/04/2024",
    totalCost: 150.00,
    price: 150.00,
    stockAddress: "Kasanchs, Addis Ababa",
    description: "Smartphone with a high-definition camera and long-lasting battery.",
    
  },
  {
    key: 4,
    orderId: "P004",
    customerName: "Neima",
    delivererName: "Nahom",
    shippingAddress: "Megenagna, Addis Ababa",
    paymentMethod: "Telebirr",
    orderDate: "05/05/2024",
    totalCost: 85.50,
    price: 85.50,
    stockAddress: "Piasa, Addis Ababa",
    description: "Comfortable running shoes for outdoor activities.",
    
  },
  {
    key: 5,
    orderId: "P005",
    customerName: "Seniya",
    delivererName: "Daniel",
    shippingAddress: "Saris, Addis Ababa",
    paymentMethod: "Telebirr",
    orderDate: "12/06/2024",
    totalCost: 220.30,
    price: 220.30,
    stockAddress: "Kera, Addis Ababa",
    description: "High-efficiency washing machine with energy-saving features.",
    
  },
  {
    key: 6,
    orderId: "P006",
    customerName: "Meskerem",
    delivererName: "Natnael",
    shippingAddress: "Bole, Addis Ababa",
    paymentMethod: "Telebirr",
    orderDate: "3/07/2024",
    totalCost: 350.00,
    price: 350.00,
    stockAddress: "Mexico, Addis Ababa",
    description: "Modern office chair with ergonomic design.",
    
  }
];

const Deliveredorders = () => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [orderDetailModalVisible, setOrderDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [costBreakdownModalVisible, setCostBreakdownModalVisible] = useState(false);
  const [costDetails, setCostDetails] = useState(null);

  const [orders] = useState(data1);
  const [searchTerm, setSearchTerm] = useState('');

  const showProductDetails = (product) => {
    setSelectedProduct([product]);
    setDetailModalVisible(true);
  };

  const showOrderDetails = (product) => {
    setSelectedOrder(product);
    setOrderDetailModalVisible(true);
  };

  const showCostBreakdown = (order) => {
    setCostDetails({
      itemsPrice: order.price,
      vat: order.price * 0.15, // Example: 15% VAT
      tax: order.price * 0.05,  // Example: 5% tax
      shipmentFee: 10.00,       // Example: fixed shipment fee
      totalCost: order.totalCost,
    });
    setCostBreakdownModalVisible(true);
  };

  const filteredOrders = orders.filter(order =>
    order.customerName.toLowerCase().startsWith(searchTerm.toLowerCase())
  );
  

  const handleDetailModalClose = () => {
    setDetailModalVisible(false);
    setSelectedProduct(null);
  };

  const handleOrderDetailModalClose = () => {
    setOrderDetailModalVisible(false);
    setSelectedOrder(null);
  };


  return (
    <div>
       <div className="flex justify-between items-center mb-4">
      <h3 className="mb-4 text-3xl font-bold">Order List</h3>

      <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-full pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <MdSearch className="absolute right-2 top-2 text-gray-500" size={20} />
          </div>
          </div>
          </div>
      <Table 
        columns={columns(showProductDetails, showOrderDetails, showCostBreakdown)} 
        dataSource={filteredOrders} 
        pagination={{ pageSize: 10 }}
      />

<Modal
        title="Item List"
        visible={detailModalVisible}
        footer={null}
        onCancel={handleDetailModalClose}
        width="auto"    // Allow width to adjust to content size
        style={{ maxWidth: '90vw' }}  // Optional: limit max size to 90% of the viewport width
         bodyStyle={{ padding: 0, margin: 0 }}
      >
        {selectedProduct ? (
          <Ordereditemlist products={selectedProduct} showProductDetails={showProductDetails} 
          style={{ margin: 0, padding: 0 }}/>
        ) : (
          <p>No product selected.</p>
        )}
      </Modal>

      <Modal
        title="Order Details"
        visible={orderDetailModalVisible}
        footer={null}
        onCancel={handleOrderDetailModalClose}
      >
        {selectedOrder && (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1 }}>
              <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
              <p><strong>Customer Name:</strong> {selectedOrder.customerName}</p>
              <p><strong>Customer Email :</strong> {selectedOrder.customerEmail}</p>
              <p><strong>Seller Name:</strong> {selectedOrder.sellerName}</p>
              <p><strong>Seller Email :</strong> {selectedOrder.sellerEmail}</p>
              <p><strong>Deliverer Name:</strong> {selectedOrder.delivererName}</p>
              <p><strong>Deliverer Email :</strong> {selectedOrder.delivererEmail}</p>
              <p><strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Shipping Address:</strong> {selectedOrder.shippingAddress}</p>
              <p><strong>Stock Address:</strong> {selectedOrder.stockAddress}</p>
              <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
              <p><strong>Total Cost:</strong> {selectedOrder.totalCost.toFixed(2)}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Cost Breakdown Modal */}
      <Modal
        title="Cost Breakdown"
        visible={costBreakdownModalVisible}
        footer={null}
        onCancel={() => setCostBreakdownModalVisible(false)}
      >
        {costDetails && (
          <div>
            <p><strong>Price:</strong> {costDetails.itemsPrice.toFixed(2)}</p>
            <p><strong>VAT:</strong> {costDetails.vat.toFixed(2)}</p>
            <p><strong>Tax:</strong> {costDetails.tax.toFixed(2)}</p>
            <p><strong>Shipment Fee:</strong> {costDetails.shipmentFee.toFixed(2)}</p>
            <p><strong>Total Cost:</strong> {costDetails.totalCost.toFixed(2)}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Deliveredorders;
