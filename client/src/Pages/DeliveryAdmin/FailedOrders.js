import React, { useState } from 'react';
import { Table, Button, Modal, message,  } from 'antd';

// const { Option } = Select;

// Updated columns with new fields and modified stock & category filters
const columns = (approveProduct, removeProduct, showProductDetails, showOrderDetails, filterCategory) => [
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
    title: "Status",
    dataIndex: "status",
    filters: [
      { text: "Pending", value: "Pending" },
      { text: "Processing", value: "Processing" },
      { text: "Delivered", value: "Delivered" },
      { text: "Failed", value: "Failed" },
    ],
    onFilter: (value, record) => record.status.includes(value),
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
    render: (_, record) => (
      <div>
        <Button 
          onClick={() => showProductDetails(record)} 
          style={{ marginLeft: '10px', backgroundColor: '#007bff', color: 'white' }}
        >
          Details
        </Button>
      </div>
    ),
  },
  {
    title: "Total Cost",
    dataIndex: "totalCost",
    render: (totalCost) => `$${totalCost.toFixed(2)}`,
  },
  {
    title: "Actions",
    render: (_, record) => (
      <div>
        <Button 
          onClick={() => approveProduct(record)} 
          style={{ marginRight: '10px', backgroundColor: 'green', color: 'white' }}
        >
          Approve
        </Button>
        <Button 
          onClick={() => removeProduct(record.key)} 
          style={{ backgroundColor: 'red', color: 'white' }}
        >
          Remove
        </Button>
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
    status: "Delivered",
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
    status: "Delivered",
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
    status: "Delivered",
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
    status: "Pending",
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
    status: "Processing",
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
    status: "Failed",
    shippingAddress: "Bole, Addis Ababa",
    paymentMethod: "Telebirr",
    orderDate: "3/07/2024",
    totalCost: 350.00,
    price: 350.00,
    stockAddress: "Mexico, Addis Ababa",
    description: "Modern office chair with ergonomic design.",
    
  }
];

const Failedorders = () => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [orderDetailModalVisible, setOrderDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const approveProduct = (product) => {
    if (product.price < 20) {
      message.error(`Product ${product.name} cannot be approved due to low price.`);
      return;
    }
    if (product.rating < 3) {
      message.error(`Product ${product.name} cannot be approved due to low rating.`);
      return;
    }
    if (!product.stock) {
      message.error(`Product ${product.name} cannot be approved as it is out of stock.`);
      return;
    }
    message.success(`Product ${product.name} approved successfully.`);
  };

  const removeProduct = (key) => {
    message.success(`Product removed successfully.`);
  };
  
  const showProductDetails = (product) => {
    setSelectedProduct(product);
    setDetailModalVisible(true);
  };

  const showOrderDetails = (product) => {
    setSelectedOrder(product);
    setOrderDetailModalVisible(true);
  };

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
      <h3 className="mb-4 text-3xl font-bold">Order List</h3>
      <Table 
        columns={columns(approveProduct, removeProduct, showProductDetails, showOrderDetails)} 
        dataSource={data1} 
        pagination={{ pageSize: 10 }}
      />

    
      <Modal
        title="Product Details"
        visible={detailModalVisible}
        footer={null}
        onCancel={handleDetailModalClose}
      >
        {selectedProduct && (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1 }}>
              <p><strong>Name:</strong> {selectedProduct.name}</p>
              <p><strong>Brand:</strong> {selectedProduct.brand}</p>
              <p><strong>Category:</strong> {selectedProduct.category}</p>
              <p><strong>Color:</strong> {selectedProduct.color}</p>
              <p><strong>Price:</strong> ${selectedProduct.price.toFixed(2)}</p>
              <p><strong>Stock:</strong> {selectedProduct.stock}</p>
              <p><strong>Rating:</strong> {selectedProduct.rating} / 5</p>
              <p><strong>Warranty:</strong> {selectedProduct.warranty} months</p>
              <p><strong>Description:</strong> {selectedProduct.description}</p>
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <img src={selectedProduct.image} alt={selectedProduct.name} style={{ maxWidth: '250px', borderRadius: '8px' }} />
            </div>
          </div>
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
              <p><strong>Order Date:</strong> {selectedOrder.orderDate.toLocaleDateString()}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Shipping Address:</strong> {selectedOrder.shippingAddress}</p>
              <p><strong>Stock Address:</strong> {selectedOrder.description}</p>
              <p><strong>Payment Method:</strong> {selectedOrder.description}</p>
              <p><strong>Price:</strong> ${selectedOrder.totalCost.toFixed(2)}</p>
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <img src={selectedProduct.image} alt={selectedProduct.name} style={{ maxWidth: '250px', borderRadius: '8px' }} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Failedorders;
