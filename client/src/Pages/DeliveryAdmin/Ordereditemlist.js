import React, { useState } from 'react';
import { Table, Button, Modal  } from 'antd';

// const { Option } = Select;

// Updated columns with new fields and modified stock & category filters
const columns = (showProductDetails, filterCategory) => [
  {
    title: "SNo",
    dataIndex: "key",
    render: (text, record, index) => index + 1,
  },
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
    filters: [
      { text: "Footwear", value: "Footwear" },
      { text: "Clothing", value: "Clothing" },
      { text: "Electronics", value: "Electronics" },
      { text: "Home Appliance", value: "Home Appliance" },
      { text: "Accessories", value: "Accessories" },
    ],
    onFilter: (value, record) => record.category.includes(value),
  },
 
  {
    title: "Price",
    dataIndex: "price",
    render: (price) => `${price.toFixed(2)}`,
  },
  {
    title: "Amount",
    dataIndex: "amount",
  },
  {
    title: "Rating",
    dataIndex: "rating",
    render: (rating) => `${rating} / 5`,
  },
  {
    title: "Actions",
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
];

// Updated sample data with more products and images
const data1 = [
  {
    key: 0,
    id: "P001",
    name: "Running Shoes",
    brand: "Nike",
    category: "Footwear",
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
    color: "Blue",
    price: 19.99,
    amount: 30,
    rating: 3.8,
    warranty: 6,
    description: "Comfortable cotton T-shirt in various colors.",
    image: "https://www.80scasualclassics.co.uk/images/adidas-originals-ess-t-shirt-deep-blue-p15587-85997_image.jpg"
  },
  {
    key: 2,
    id: "P003",
    name: "Smartphone",
    brand: "Samsung",
    category: "Electronics",
    color: "Black",
    price: 299.99,
    amount: 0,
    rating: 4.2,
    warranty: 24,
    description: "Latest smartphone with advanced features.",
    image: "https://th.bing.com/th/id/OIP.2dgnlgwui_l94zZyUthS-gHaIv?w=508&h=600&rs=1&pid=ImgDetMain"
  },
  {
    key: 3,
    id: "P004",
    name: "Vacuum Cleaner",
    brand: "Dyson",
    category: "Home Appliance",
    color: "Gray",
    price: 89.99,
    amount: 8,
    rating: 2.5,
    warranty: 18,
    description: "Powerful vacuum cleaner for effortless cleaning.",
    image: "https://th.bing.com/th/id/OIP.db1WiNLMX5iZJWJGVCSHMgHaE8?rs=1&pid=ImgDetMain"
  },
  ];

const Ordereditemlist = () => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  
  const showProductDetails = (product) => {
    setSelectedProduct(product);
    setDetailModalVisible(true);
  };

  const handleDetailModalClose = () => {
    setDetailModalVisible(false);
    setSelectedProduct(null);
  };


  return (
    <div>
      <Table 
        columns={columns(showProductDetails)} 
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
              <p><strong>Price:</strong> {selectedProduct.price.toFixed(2)}</p>
              <p><strong>Amount:</strong> {selectedProduct.amount}</p>
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
    </div>
  );
};

export default Ordereditemlist;
