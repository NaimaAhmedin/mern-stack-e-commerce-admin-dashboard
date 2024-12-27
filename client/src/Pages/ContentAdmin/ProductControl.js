import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MdSearch } from "react-icons/md";
import { deleteProduct, getProducts } from '../../services/productService';

const ProductControl = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      console.log('Products response:', response); // Debug response

      // Check if response has the expected structure
      if (response && (Array.isArray(response) || Array.isArray(response.data))) {
        const productsArray = Array.isArray(response) ? response : response.data;
        
        const formattedProducts = productsArray.map((product, index) => {
          console.log('Processing product:', product); // Debug individual product
          return {
            key: product._id,           
            seller: product.seller_id?.username || 'N/A',
            id: product._id,
            name: product.name || 'N/A',
            brand: product.brand || 'N/A',
            category: product.categoryId?.name || 'N/A',
            color: product.color || 'N/A',
            price: product.price || 0,
            stock: product.quantity || 0,
            description: product.description || 'N/A',
            images: product.images || [],
            image: product.image || null,
            warranty: product.warranty || 0,
            subcategory: product.subcategoryId?.name || 'N/A',
            categoryId: product.categoryId?._id,
            subcategoryId: product.subcategoryId?._id,
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
      setLoading(false);
    } catch (err) {
      console.error('Error loading products:', err);
      message.error(err.message || 'Failed to load products');
      setProducts([]);
      setCategoryFilters([]);
      setLoading(false);
    }
  };

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

 // Handle select/deselect all
 const toggleSelectAll = () => {
  if (selectedProducts.length === filteredProducts.length) {
    setSelectedProducts([]);
  } else {
    const allProductIds = filteredProducts.map(product => product.id);
    setSelectedProducts(allProductIds);
  }
};

  // Delete selected products
  const handleDeleteSelected = async () => {
    if (selectedProducts.length === 0) {
      message.warning('Please select products to delete');
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedProducts.length} ${
        selectedProducts.length === 1 ? "product" : "products"
      }?`
    );

    if (!confirmDelete) return;

    try {
      await Promise.all(selectedProducts.map(id => deleteProduct(id)));
      message.success(`Successfully deleted ${selectedProducts.length} products`);
      setSelectedProducts([]);
      fetchProducts(); // Refresh the product list
    } catch (err) {
      console.error('Error deleting products:', err);
      message.error('Failed to delete some products');
    }
  };

  const handleEdit = (id) => {
    navigate(`/seller/ProductList/product/edit/${id}`);
  };

  const handleViewDetails = (product) => {
    Modal.info({
      title: 'Product Details',
      width: 'fit-content',
      content: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: '280px'}}>
            <p><strong>Product ID:</strong> {product.id}</p>
            <p><strong>Seller :</strong> {product.seller}</p>
            <p><strong>Product Name:</strong> {product.name}</p>
            <p><strong>Brand:</strong> {product.brand || 'N/A'}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Subcategory:</strong> {product.subcategory}</p>
            <p><strong>Color:</strong> {product.color || 'N/A'}</p>
            <p><strong>Quantity in Stock:</strong> {product.stock}</p>
            <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
            <p><strong>Description:</strong> {product.description || 'N/A'}</p>
          </div>
          <div style={{ flex: 1, minWidth: '280px' }}>
            {product.images && product.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 max-w-full">
                {product.images.slice(0, 5).map((image, index) => (
                  <div 
                    key={index} 
                    className="relative overflow-hidden rounded-lg shadow-md"
                    style={{ 
                      width: '150px', 
                      height: '150px',
                      aspectRatio: '1/1'
                    }}
                  >
                    <img 
                      src={typeof image === 'string' ? image : image.url} 
                      alt={`${product.name} ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            ) : product.image ? (
              <div 
                className="relative overflow-hidden rounded-lg shadow-md"
                style={{ 
                  width: '250px', 
                  height: '250px',
                  aspectRatio: '1/1'
                }}
              >
                <img 
                  src={typeof product.image === 'string' ? product.image : product.image.url}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ) : (
              <p className="text-gray-500 italic">No images available</p>
            )}
          </div>
        </div>
      ),
      onOk() {},
    });
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-full pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <MdSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          </div>
          {selectedProducts.length > 0 && (
            <Button
              type="primary"
              danger
              onClick={handleDeleteSelected}
              className="bg-orange-500 hover:bg-orange-600 rounded-full flex items-center gap-2"
            >
              Delete Selected ({selectedProducts.length})
            </Button>
          )}
        </div>
      </div>

      <Table dataSource={filteredProducts} pagination={false} rowKey="key">
        {/* Select column */}
        <Table.Column
          title={
            <input
              type="checkbox"
              checked={selectedProducts.length === filteredProducts.length}
              onChange={toggleSelectAll}
            />
          }
          key="select"
          render={(_, record) => (
            <input
              type="checkbox"
              checked={selectedProducts.includes(record.id)}
              onChange={() => toggleSelectProduct(record.id)}
            />
          )}
        />
        <Table.Column 
          title={<span className="font-semibold text-lg">SNo</span>} 
          dataIndex="key" 
          key="key" 
          render={(text, record, index) => <span className="font-semibold">{index + 1}</span>} 
          
        />
      {/* <Table.Column 
          title={<span className="font-semibold text-lg">Product ID</span>} 
          dataIndex="id" 
          key="id" 
          render={(text) => <span className="font-semibold">{text}</span>} 
        /> */}
        <Table.Column 
          title={<span className="font-semibold text-lg">Name</span>} 
          dataIndex="name" 
          key="name" 
          render={(text) => <span className="font-semibold">{text}</span>} 
        />
        <Table.Column 
    title= "Category"
    dataIndex= "category"
    filters={categoryFilters}
    onFilter={(value, record) => record.category.includes(value)} 
  />
       <Table.Column 
          title="Price" 
          dataIndex="price" 
          key="price" 
          render={(price) => price !== undefined && price !== null ? `${price.toFixed(2)}` : 'N/A'}
        />
        <Table.Column 
          title="Posted Time" 
          dataIndex="createdAt" 
          key="postedTime"
          render={(timestamp) => {
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
          }}
        />
        <Table.Column 
          title="Posted Date" 
          dataIndex="createdAt" 
          key="postedDate"
          render={(timestamp) => {
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
          }}
          sorter={(a, b) => {
            if (!a.createdAt || !b.createdAt) return 0;
            return new Date(a.createdAt) - new Date(b.createdAt);
          }}
        />
        <Table.Column 
          title="Stock" 
          dataIndex="stock" 
          key="stock" 
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
        onClick={() => handleEdit(record.id)}
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

export default ProductControl;
