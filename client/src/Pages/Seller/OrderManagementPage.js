import React, { useState } from "react";
import { Table, Button, Modal, Tag } from "antd";

const initialOrders = [
  {
    orderId: "ORD001",
    customerName: "John Doe",
    date: "2024-11-29",
    status: "Pending",
    items: [
      {
        id: "P001",
        name: "Running Shoes",
        brand: "Nike",
        category: "Footwear",
        subcategory: "Shoes", 
        color: "Red",
        price: 49.99,
        amount: 15,
        rating: 4.5,
        warranty: 12,
        description: "High-quality running shoes for daily workouts.",
        image: "https://launches-media.endclothing.com/AQ1763-600_launches_hero_portrait_1.jpg"
      },
      {
         
    key: 1,
    id: "P002",
    name: "Cotton T-Shirt",
    brand: "Adidas",
    category: "Clothing",
    subcategory: "T-shirt",
    color: "Blue",
    price: 19.99,
    amount: 30,
    rating: 3.8,
    warranty: 6,
    description: "Comfortable cotton T-shirt in various colors.",
    image: "https://www.80scasualclassics.co.uk/images/adidas-originals-ess-t-shirt-deep-blue-p15587-85997_image.jpg"
  },
    ],
  },
  {
    orderId: "ORD002",
    customerName: "Jane Smith",
    date: "2024-11-28",
    status: "Pending",
    items: [
      {
        id: "P003",
    name: "Smartphone",
    brand: "Samsung",
    category: "Electronics",
    subcategory: "Smartphone",
    color: "Black",
    price: 299.99,
    amount: 0,
    rating: 4.2,
    warranty: 24,
    description: "Latest smartphone with advanced features.",
    image: "https://th.bing.com/th/id/OIP.2dgnlgwui_l94zZyUthS-gHaIv?w=508&h=600&rs=1&pid=ImgDetMain"
  },
    ],
  },
  {
    orderId: "ORD003",
    customerName: "Alice Johnson",
    date: "2024-11-27",
    status: "Pending",
    items: [
      {
        id: "P004",
        name: "Gaming Laptop",
        category: "Electronics",
        subcategory: "Laptops",
        amount: 1,
        rating: 4.2,
        warranty: 24,
        description: "High-performance gaming laptop with RTX 4090.",
        image: "https://example.com/laptop.jpg",
      },
      {
        id: "P005",
        name: "Wireless Headphones",
        category: "Electronics",
        subcategory: "Accessories",
        price: 149.99,
        amount: 2,
        rating: 4.6,
        warranty: 24,
        description: "Noise-cancelling over-ear wireless headphones.",
        image: "https://example.com/headphones.jpg",
      },
    ],
  },
];

const OrderManagementPage = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const showItemsDetails = (items) => {
    setSelectedItems(items);
    setItemModalVisible(true);
  };

  const showProductDetails = (product) => {
    setSelectedProduct(product);
    setProductModalVisible(true);
  };

  const handleItemModalClose = () => setItemModalVisible(false);
  const handleProductModalClose = () => setProductModalVisible(false);

  const markAsReadyForDelivery = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId
          ? { ...order, status: "Ready for Delivery" }
          : order
      )
    );
  };

  const orderColumns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Ready for Delivery" ? "green" : "orange"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Items",
      render: (_, record) => (
        <Button type="primary" onClick={() => showItemsDetails(record.items)}>
          Items Details
        </Button>
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => markAsReadyForDelivery(record.orderId)}
          disabled={record.status === "Ready for Delivery"}
        >
          Ready for Delivery
        </Button>
      ),
    },
  ];

  const itemColumns = [
    {
      title: "Product ID",
      dataIndex: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Subcategory",
      dataIndex: "subcategory",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => `${price.toFixed(2)}`,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      render: (rating) => `${rating} / 5`,
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button type="link" onClick={() => showProductDetails(record)}>
          Details
        </Button>
      ),
    },
  ];

  return (
<div style={{ padding: "20px", overflowX: "auto" }}>
  <h1 className="text-2xl my-4">Order List</h1>
  <Table
    columns={orderColumns}
    dataSource={orders}
    rowKey="orderId"
    pagination={{ pageSize: 5 }}
    scroll={{ x: "max-content" }}
    tableLayout="fixed"
  />

<Modal
  title="Items List"
  visible={itemModalVisible}
  footer={null}
  onCancel={handleItemModalClose}
  width={1000}
>
  <Table
    columns={itemColumns}
    dataSource={selectedItems}
    rowKey="id"
    pagination={false}
    scroll={{ x: "max-content" }}
  />
</Modal>


      <Modal
        title="Product Details"
        visible={productModalVisible}
        footer={null}
        onCancel={handleProductModalClose}
      >
        {selectedProduct && (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ flex: 1 }}>
              <p>
                <strong>Name:</strong> {selectedProduct.name}
              </p>
              <p>
                <strong>Category:</strong> {selectedProduct.category}
              </p>
              <p>
                <strong>Subcategory:</strong> {selectedProduct.subcategory}
              </p>
              <p>
                <strong>Price:</strong> {selectedProduct.price.toFixed(2)}
              </p>
              <p>
                <strong>Amount:</strong> {selectedProduct.amount}
              </p>
              <p>
                <strong>Rating:</strong> {selectedProduct.rating} / 5
              </p>
              <p>
                <strong>warranty:</strong> ${selectedProduct.warranty}
              </p>
              <p>
                <strong>Description:</strong> {selectedProduct.description}
              </p>
            </div>
            <div style={{ flex: 1, textAlign: "right" }}>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                style={{ maxWidth: "250px", borderRadius: "8px" }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderManagementPage;
