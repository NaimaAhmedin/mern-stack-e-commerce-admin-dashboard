import React, { useState } from 'react';
import { Table, Button, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MdSearch } from "react-icons/md";

const Productlist = () => {
  // Dummy data for product
  const initialProducts = [
    {
      key: 0,
      id: "P001",
      name: "Running Shoes",
      brand: "Nike",
      category: "Footwear",
      color: "Red",
      price: 49.99,
      stock: 15,
      postedTime:"02:17",
      postedDate:"11/27/2024",
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
      stock: 30,
      postedTime:"02:17",
      postedDate:"11/27/2024",
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
      stock: 0,
      postedTime:"02:17",
      postedDate:"11/27/2024",
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
      stock: 8,
      postedTime:"02:17",
      postedDate:"11/27/2024",
      rating: 2.5,
      warranty: 18,
      description: "Powerful vacuum cleaner for effortless cleaning.",
      image: "https://th.bing.com/th/id/OIP.db1WiNLMX5iZJWJGVCSHMgHaE8?rs=1&pid=ImgDetMain"
    },
  ];

  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

 

  const handleViewDetails = (product) => {
   
    Modal.info({
      title: 'Product Details',
      width: 'fit-content',
      content: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px'  }}>
            <div style={{ flex: 1, minWidth: '280px'}}>
              <p><strong>Product ID:</strong> {product.id}</p>
              <p><strong>Product Name:</strong> {product.name}</p>
              <p><strong>Brand :</strong> {product.brand}</p>
              <p><strong>Category :</strong> {product.category}</p>
              <p><strong>Color :</strong> {product.category}</p>
              <p><strong>Posted Time :</strong> {new Date(`1970-01-01T${product.postedTime}:00`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
              <p><strong>Posted Date :</strong> {new Date(product.postedDate).toLocaleDateString()}</p>
              <p><strong>Stock :</strong> {product.stock}</p>
              <p><strong>Price :</strong> {product.price.toFixed(2)}</p>
             <p><strong>Description :</strong> {product.description}</p>
        </div>
        <div style={{  flex: 1, minWidth: '280px', textAlign: 'center' }}>
              <img src={product.image} alt={product.name} style={{ maxWidth: '250px', borderRadius: '8px' }} />
            </div>
          </div>
      ),
      onOk() { console.log('Modal closed');},
     
    });
  };

  const toggleSelectProduct = (key) => {
    setSelectedProducts(prev =>
      prev.includes(key) ? prev.filter(productKey => productKey !== key) : [...prev, key]
    );
  };

  const handleDeleteSelected = () => {
    setProducts(products.filter(product => !selectedProducts.includes(product.key)));
    setSelectedProducts([]);
    message.success('Selected products deleted successfully!');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-4xl font-bold">Products</h2>
        
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
          <button
            onClick={() => navigate('/seller/ProductList/add')}
            className="bg-orange-600 text-white px-4 py-2 rounded-3xl"
          >
            + Add
          </button>
          {selectedProducts.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="bg-orange-600 text-white px-4 py-2 rounded-3xl"
            >
              Delete
            </button>
)}

          
        </div>
      </div>

      <Table dataSource={filteredProducts} pagination={false} rowKey="key">
        <Table.Column
          title="Select"
          key="select"
          render={(text, record) => (
            <input
              type="checkbox"
              checked={selectedProducts.includes(record.key)}
              onChange={() => toggleSelectProduct(record.key)}
            />
          )}
        />
        <Table.Column 
          title={<span className="font-semibold text-lg">SNo</span>} 
          dataIndex="key" 
          key="key" 
          render={(text, record, index) => <span className="font-semibold">{index + 1}</span>} 
          
        />
        <Table.Column 
          title={<span className="font-semibold text-lg">Product ID</span>} 
          dataIndex="id" 
          key="id" 
          render={(text) => <span className="font-semibold">{text}</span>} 
        />
        <Table.Column 
          title={<span className="font-semibold text-lg">Name</span>} 
          dataIndex="name" 
          key="name" 
          render={(text) => <span className="font-semibold">{text}</span>} 
        />
        <Table.Column 
    title= "Category"
    dataIndex= "category"
    filters = {[
      { text: "Footwear", value: "Footwear" },
    { text: "Clothing", value: "Clothing" },
    { text: "Electronics", value: "Electronics" },
    { text: "Home Appliance", value: "Home Appliance" },
    { text: "Accessories", value: "Accessories" }
    ]}
    onFilter={ (value, record) => record.category.includes(value)} 
  />
       <Table.Column title="Price" dataIndex="price" key="price" 
       render= {(price) => price !== undefined && price !== null ? `${price.toFixed(2)}` : 'N/A'}/>
       <Table.Column title="Stock" dataIndex="stock" key="stock" />

       <Table.Column
  title="Posted Date & Time"
  key="postedDateTime"
  render={(text, record) => {
    const postedTime = record.postedTime;
    const postedDate = record.postedDate;

    // Format the time
    const time = new Date(`1970-01-01T${postedTime}:00`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Format the date
    const date = new Date(postedDate).toLocaleDateString();

    return (
      <div style={{ textAlign: 'center' }}>
        <span style={{ display: 'block', fontWeight: 'bold' }}>{time}</span>
        <span style={{ display: 'block', fontSize: '0.9em', color: '#555' }}>{date}</span>
      </div>
    );
  }}
/>
        <Table.Column
          title="Action"
          key="action"
          render={(text, record) => (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Button type="link" onClick={() => handleViewDetails(record)}>
              Detail
              </Button>
              <Button 
                type="link" 
                onClick={() => navigate(`product/edit/${record.key}`, { state: record })}
                // /Content-Admin/promotion/edit/
                >
                Edit
              </Button>
             </div>
          )}
        />
      </Table>
    </div>
  );
};

export default Productlist;
