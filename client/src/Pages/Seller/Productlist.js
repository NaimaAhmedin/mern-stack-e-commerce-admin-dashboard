import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MdSearch } from "react-icons/md";
import { getSellerProducts, deleteProduct } from '../../services/productService';

const Productlist = () => {
  // Dummy data for product
  // const initialProducts = [
  //   {
  //     key: 0,
  //     id: "P001",
  //     name: "Running Shoes",
  //     brand: "Nike",
  //     category: "Footwear",
  //     color: "Red",
  //     price: 49.99,
  //     stock: 15,
  //     postedTime:"02:17",
  //     postedDate:"11/27/2024",
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
  //     stock: 30,
  //     postedTime:"02:17",
  //     postedDate:"11/27/2024",
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
  //     price: 299.99,
  //     stock: 0,
  //     postedTime:"02:17",
  //     postedDate:"11/27/2024",
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
  //     price: 89.99,
  //     stock: 8,
  //     postedTime:"02:17",
  //     postedDate:"11/27/2024",
  //     rating: 2.5,
  //     warranty: 18,
  //     description: "Powerful vacuum cleaner for effortless cleaning.",
  //     image: "https://th.bing.com/th/id/OIP.db1WiNLMX5iZJWJGVCSHMgHaE8?rs=1&pid=ImgDetMain"
  //   },
  // ];

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const navigate = useNavigate();
  const fetchProducts = async () => {
    try {
      const response = await getSellerProducts();
      console.log('Products response:', response); // Debug response

      // Check if response has the expected structure
      if (response && (Array.isArray(response) || Array.isArray(response.data))) {
        const productsArray = Array.isArray(response) ? response : response.data;
        
        const formattedProducts = productsArray.map((product, index) => {
          console.log('Processing product:', product); // Debug individual product
          return {
            key: product._id,
            id: product._id,
            name: product.name || 'N/A',
            brand: product.brand || 'N/A',
            category: product.categoryId?.name || 'N/A',
            color: product.color || 'N/A',
            price: product.price || 0,
            stock: product.quantity || 0,
            description: product.description || 'N/A',
            image: product.image ? `/uploads/${product.image}` : 'fallback-image-url',
            createdAt: product.createdAt
          };
        });

        console.log('Formatted products:', formattedProducts); // Debug formatted products
        setProducts(formattedProducts);
        
        // Extract unique categories
        const categories = [...new Set(formattedProducts.map(product => product.category))];
        setCategoryFilters(categories.map(cat => ({ text: cat, value: cat })));
      } else {
        console.error('Invalid products response:', response); // Debug invalid response
        message.error('Invalid products data received');
        setProducts([]);
        setCategoryFilters([]);
      }
    } catch (err) {
      console.error('Error loading products:', err);
      message.error(err.message || 'Failed to load products');
      setProducts([]);
      setCategoryFilters([]);
    }
  };
// Fetch product from the backend
// const fetchProducts = async () => {
//   try {
//     const response = await getProducts();
//     if (response.success && Array.isArray(response.data)) {
//       setProducts(response.data);
//       // Extract unique categories
//       const categories = [...new Set(response.data.map(product => product.category))];
//       setCategoryFilters(categories.map(cat => ({ text: cat, value: cat })));
//     } else {
//       message.error(response.message || 'Failed to load products');
//       setProducts([]);
//       setCategoryFilters([]);
//     }
//   } catch (err) {
//     console.error('Error loading products:', err);
//     message.error(err.message || 'Failed to load products');
//     setProducts([]);
//     setCategoryFilters([]);
//   }
// };

useEffect(() => {
  fetchProducts();
}, []);

 // Filtered products based on search input
 const filteredProducts = Array.isArray(products) 
 ? products.filter((product) =>
  product.name.toLowerCase().includes(searchTerm.toLowerCase())
   )
 : [];

  // const filteredProducts = products.filter(product =>
  //   product.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

 // Handle select/deselect for individual products
 const toggleSelectProduct = (id) => {
  setSelectedProducts(prev =>
    prev.includes(id) ? prev.filter(productId => productId !== id) : [...prev, id]
  );
};

  // Check if all products are selected
  const allSelected =
  selectedProducts.length > 0 &&
  selectedProducts.length === filteredProducts.length;

  // Handle select/deselect all
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((product) => product.id));
    }
  };

  // Navigate to the edit product page
  // const handleEdit = (id) => {
  //   navigate(`/product/edit/${id}`);
  // };

  const handleEdit = (id) => {
    navigate(`/seller/ProductList/product/edit/${id}`);
  };

  // Delete selected products
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedProducts.length} ${
        selectedProducts.length === 1 ? "product" : "products"
      }?`
    );

    if (!confirmDelete) return;

    try {
      // Attempt to delete selected products
      const deletePromises = selectedProducts.map(id => deleteProduct(id));
      await Promise.all(deletePromises);

      // Refresh the product list after deletion
      await fetchProducts();

      // Clear selected products
      setSelectedProducts([]);

      message.success(`Successfully deleted ${selectedProducts.length} product(s)`);
    } catch (error) {
      console.error('Error deleting products:', error);
      message.error(error.message || 'Failed to delete products');
    }
  };

  // Handle bulk delete of selected products
  const handleDeleteSelected = () => {
    handleDelete();
  };

  const handleViewDetails = (product) => {
    Modal.info({
      title: 'Product Details',
      width: 'fit-content',
      content: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: '280px'}}>
            <p><strong>Product ID:</strong> {product.id}</p>
            <p><strong>Product Name:</strong> {product.name}</p>
            <p><strong>Brand:</strong> {product.brand || 'N/A'}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Color:</strong> {product.color || 'N/A'}</p>
            <p><strong>Stock:</strong> {product.stock}</p>
            <p><strong>Price:</strong> {product.price.toFixed(2)}</p>
            <p><strong>Description:</strong> {product.description || 'N/A'}</p>
          </div>
          <div style={{ flex: 1, minWidth: '280px', textAlign: 'center' }}>
            <img 
              src={product.image} 
              alt={product.name} 
              style={{ maxWidth: '250px', borderRadius: '8px' }} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'fallback-image-url';
              }}
            />
          </div>
        </div>
      ),
      onOk() { console.log('Modal closed'); },
    });
  };

  const columns = [
    {
      title: "Select",
      key: "select",
      render: (text, record) => (
        <input
          type="checkbox"
          checked={selectedProducts.includes(record.id)}
          onChange={() => toggleSelectProduct(record.id)}
        />
      ),
    },
    {
      title: "SNo",
      dataIndex: "key",
      key: "key",
      render: (text, record, index) => <span className="font-semibold">{index + 1}</span>,
    },
    // {
    //   title: "Product ID",
    //   dataIndex: "id",
    //   key: "id",
    //   render: (text) => <span className="font-semibold">{text}</span>,
    // },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Category",
      dataIndex: "category",
      filters: categoryFilters,
      onFilter: (value, record) => record.category.includes(value),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => price !== undefined && price !== null ? `${price.toFixed(2)}` : 'N/A',
    },
    {
      title: "Posted Time",
      dataIndex: "createdAt",
      key: "postedTime",
      render: (timestamp) => {
        if (!timestamp) return 'N/A';
        try {
          const date = new Date(timestamp);
          return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
        } catch (err) {
          console.error('Error formatting time:', err);
          return 'Invalid Time';
        }
      },
    },
    {
      title: "Posted Date",
      dataIndex: "createdAt",
      key: "postedDate",
      render: (timestamp) => {
        if (!timestamp) return 'N/A';
        try {
          const date = new Date(timestamp);
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        } catch (err) {
          console.error('Error formatting date:', err);
          return 'Invalid Date';
        }
      },
      sorter: (a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return new Date(a.createdAt) - new Date(b.createdAt);
      },
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      sorter: (a, b) => a.stock - b.stock,
      render: (stock) => {
        const stockColor = stock === 0 ? 'text-red-500' : 
                               stock < 10 ? 'text-yellow-500' : 
                               'text-green-500';
        return (
          <span className={`font-semibold ${stockColor}`}>
            {stock}
          </span>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Button type="link" onClick={() => handleViewDetails(record)}>
            Detail
          </Button>
          <Button 
            type="link" 
            onClick={() => handleEdit(record.id)}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Products</h2>
        
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
            + Add Product
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
      <Table
        rowSelection={{
          selectedRowKeys: selectedProducts,
          onSelect: (record) => toggleSelectProduct(record.id),
          onSelectAll: toggleSelectAll
        }}
        columns={columns}
        dataSource={filteredProducts}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} products`
        }}
        rowKey="id"
      />
      {/* Bulk Actions */}
      <div className="flex space-x-2">
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
  );
};

export default Productlist;
