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
//   {
//     key: 0,
//     id: "P001",
//     name: "Running Shoes",
//     brand: "Nike",
//     status: "Footwear",
//     color: "Red",
//     totalCost: 49.99,
//     stock: 15,
//     rating: 4.5,
//     warranty: 12,
//     description: "High-quality running shoes for daily workouts.",
//     image: "https://launches-media.endclothing.com/AQ1763-600_launches_hero_portrait_1.jpg"
//   },
//   {
//     key: 1,
//     id: "P002",
//     name: "Cotton T-Shirt",
//     brand: "Adidas",
//     category: "Clothing",
//     color: "Blue",
//     price: 19.99,
//     totalCost: 30,
//     rating: 3.8,
//     warranty: 6,
//     description: "Comfortable cotton T-shirt in various colors.",
//     image: "https://www.80scasualclassics.co.uk/images/adidas-originals-ess-t-shirt-deep-blue-p15587-85997_image.jpg"
//   },
//   {
//     key: 2,
//     id: "P003",
//     name: "Smartphone",
//     brand: "Samsung",
//     category: "Electronics",
//     color: "Black",
//     totalCost: 299.99,
//     stock: 0,
//     rating: 4.2,
//     warranty: 24,
//     description: "Latest smartphone with advanced features.",
//     image: "https://th.bing.com/th/id/OIP.2dgnlgwui_l94zZyUthS-gHaIv?w=508&h=600&rs=1&pid=ImgDetMain"
//   },
//   {
//     key: 3,
//     id: "P004",
//     name: "Vacuum Cleaner",
//     brand: "Dyson",
//     category: "Home Appliance",
//     color: "Gray",
//     totalCost: 89.99,
//     stock: 8,
//     rating: 2.5,
//     warranty: 18,
//     description: "Powerful vacuum cleaner for effortless cleaning.",
//     image: "https://th.bing.com/th/id/OIP.db1WiNLMX5iZJWJGVCSHMgHaE8?rs=1&pid=ImgDetMain"
//   },
//   {
//     key: 4,
//     id: "P005",
//     name: "Leather Jacket",
//     brand: "Levi's",
//     category: "Clothing",
//     color: "Black",
//     totalCost: 120.0,
//     stock: 5,
//     rating: 4.7,
//     warranty: 12,
//     description: "Premium leather jacket for stylish looks.",
//     image: "https://th.bing.com/th/id/OIP.r5Z5XK-O2RWnF8LS_KMUzgAAAA?w=474&h=726&rs=1&pid=ImgDetMain"
//   },
//   {
//     key: 5,
//     id: "P006",
//     name: "Laptop",
//     brand: "Dell",
//     category: "Electronics",
//     color: "Silver",
//     totalCost: 799.99,
//     stock: 10,
//     rating: 4.3,
//     warranty: 24,
//     description: "High-performance laptop for all your needs.",
//     image: "https://th.bing.com/th/id/OIP.upOHHLyQpVZImW-vGWM9ZwHaFY?rs=1&pid=ImgDetMain"
//   },
//   {
//     key: 6,
//     id: "P007",
//     name: "Headphones",
//     brand: "Sony",
//     category: "Electronics",
//     color: "Black",
//     totalCost: 49.99,
//     stock: 20,
//     rating: 4.5,
//     warranty: 12,
//     description: "Noise-canceling headphones for immersive sound.",
//     image: "https://th.bing.com/th/id/OIP.akpF3DzW2omMrrAawWSl-gHaFY?rs=1&pid=ImgDetMain"
//   },
//   {
//     key: 7,
//     id: "P008",
//     name: "Microwave Oven",
//     brand: "Panasonic",
//     category: "Home Appliance",
//     color: "White",
//     totalCost: 99.99,
//     stock: 15,
//     rating: 3.9,
//     warranty: 24,
//     description: "Convenient microwave oven for quick meals.",
//     image: "https://th.bing.com/th/id/R.dee1940112555e43cad67786f6f6fa83?rik=nlg4OUtJOyE9WQ&pid=ImgRaw&r=0"
//   },
//   {
//     key: 8,
//     id: "P009",
//     name: "Bluetooth Speaker",
//     brand: "JBL",
//     category: "Electronics",
//     color: "Blue",
//     totalCost: 59.99,
//     stock: 25,
//     rating: 4.6,
//     warranty: 12,
//     description: "Portable Bluetooth speaker with great sound.",
//     image: "https://th.bing.com/th/id/OIP.fp_H7rXPXLBHuIWR5gAKLAHaHa?rs=1&pid=ImgDetMain"
//   },
//   {
//     key: 9,
//     id: "P010",
//     name: "Smartwatch",
//     brand: "Apple",
//     category: "Electronics",
//     color: "Black",
//     totalCost: 199.99,
//     stock: 12,
//     rating: 4.8,
//     warranty: 12,
//     description: "Feature-rich smartwatch for daily use.",
//     image: "https://th.bing.com/th/id/OIP.Cs8c-5Uf4kyMV8T-8cnGFAHaFT?w=600&h=430&rs=1&pid=ImgDetMain"
//   },
//   {
//     key: 10,
//     id: "P011",
//     name: "Coffee Maker",
//     brand: "Keurig",
//     category: "Home Appliance",
//     color: "Black",
//     totalCost: 79.99,
//     stock: 10,
//     rating: 4.2,
//     warranty: 12,
//     description: "Quick and easy coffee maker for daily brews.",
//     image: "https://th.bing.com/th/id/OIP.54DwS8p5Dy_Maf5-pCFEFQAAAA?rs=1&pid=ImgDetMain"
//   },
//   {
//     key: 11,
//     id: "P012",
//     name: "Gaming Console",
//     brand: "Sony",
//     category: "Electronics",
//     color: "White",
//     totalCost: 399.99,
//     stock: 8,
//     rating: 4.9,
//     warranty: 24,
//     description: "Next-gen gaming console with high performance.",
//     image: "https://th.bing.com/th/id/OIP.TQK42gp0mU_SmiQ4jUAUJQHaHa?rs=1&pid=ImgDetMain"
//   },
//   {
//     key: 12,
//     id: "P013",
//     name: "Blender",
//     brand: "NutriBullet",
//     category: "Home Appliance",
//     color: "Silver",
//     totalCost: 49.99,
//     stock: 20,
//     rating: 3.5,
//     warranty: 6,
//     description: "Compact blender for smoothies and shakes.",
//     image: "https://th.bing.com/th/id/OIP.7lcNpkMF6L-l0liXeaq8_AAAAA?rs=1&pid=ImgDetMain"
//   },
//   {
//     key: 13,
//     id: "P014",
//     name: "Wristwatch",
//     brand: "Casio",
//     category: "Accessories",
//     color: "Silver",
//     totalCost: 29.99,
//     stock: 50,
//     rating: 4.3,
//     warranty: 24,
//     description: "Durable wristwatch with stylish design.",
//     image: "https://th.bing.com/th/id/R.1131df6eeb5a8757af66a3034e6ee28b?rik=l8b2uUah1ENaUw&pid=ImgRaw&r=0"
//   },
//   {
//     key: 14,
//     id: "P015",
//     name: "Formal Shoes",
//     brand: "Clarks",
//     category: "Footwear",
//     color: "Brown",
//     totalCost: 69.99,
//     stock: 20,
//     rating: 4.1,
//     warranty: 12,
//     description: "Comfortable and stylish formal shoes.",
//     image: "https://th.bing.com/th/id/OIP.b9ldHiIdZ33OXKEYijUIeQHaHa?rs=1&pid=ImgDetMain"
//   },
//   {
//     key: 15,
//     id: "P016",
//     name: "Tablet",
//     brand: "Lenovo",
//     category: "Electronics",
//     color: "Black",
//     totalCost: 249.99,
//     stock: 14,
//     rating: 4.4,
//     warranty: 12,
//     description: "Lightweight tablet for entertainment and work.",
//     image: "https://i.ebayimg.com/images/g/Og0AAOSwD7ljYBr9/s-l1600.jpg"
//   },
//   {
//     key: 16,
//     id: "P017",
//     name: "Sunglasses",
//     brand: "Ray-Ban",
//     category: "Accessories",
//     color: "Black",
//     totalCost: 89.99,
//     stock: 35,
//     rating: 4.7,
//     warranty: 6,
//     description: "Stylish sunglasses for sun protection.",
//     image: "https://th.bing.com/th/id/R.f6829ec5b8f74147ffa1d85487dcc170?rik=ssbxuoks%2fBnKSA&pid=ImgRaw&r=0"
//   },
//   {
//     key: 17,
//     id: "P018",
//     name: "Electric Kettle",
//     brand: "Philips",
//     category: "Home Appliance",
//     color: "Silver",
//     totalCost: 29.99,
//     stock: 15,
//     rating: 3.9,
//     warranty: 12,
//     description: "Electric kettle for quick boiling.",
//     image: "https://th.bing.com/th/id/OIP.W_whh2_ETWV1UYOEGnOWhgHaHa?rs=1&pid=ImgDetMain"
//   },
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
