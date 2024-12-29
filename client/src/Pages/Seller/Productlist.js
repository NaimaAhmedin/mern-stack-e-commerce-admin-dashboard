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
          
          // Safe image handling
          const processImages = (images) => {
            if (!images) return [];
            // If images is already a string or an array of strings, return it directly
            if (typeof images === 'string') return [images];
            if (Array.isArray(images)) {
              return images.filter(img => typeof img === 'string');
            }
            // If it's an object with a url property, return the url
            if (images.url && typeof images.url === 'string') return [images.url];
            return [];
          };

          const processedImages = processImages(product.images);

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
            images: processedImages,
            image: processedImages.length > 0 ? processedImages[0] : null,
            warranty: product.warranty || 0,
            subcategory: product.subcategoryId?.name || 'N/A',
            categoryId: product.categoryId?._id,
            seller_id: product.seller_id?._id,
            postedDate: new Date(product.createdAt).toLocaleDateString(),
            postedTime: new Date(product.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        });

        console.log('Formatted products:', formattedProducts);
        setProducts(formattedProducts);
        
        // Extract unique categories
        const categories = [...new Set(formattedProducts.map(product => product.category))];
        setCategoryFilters(categories.map(cat => ({ text: cat, value: cat })));
      } else {
        console.error('Invalid products response structure');
        setProducts([]);
        setCategoryFilters([]);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
      setCategoryFilters([]);
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
                      src={image} 
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
                  src={product.image}
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
          <Button
            type="primary"
            onClick={() => navigate('/seller/addProduct')}
            className="bg-orange-500 hover:bg-orange-600 rounded-full flex items-center gap-2"
          >
            Add New Product
          </Button>
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
          title="Posted Date" 
          dataIndex="postedDate" 
          key="postedDate"
          sorter={(a, b) => new Date(a.postedDate) - new Date(b.postedDate)}
        />
        <Table.Column 
          title="Posted Time" 
          dataIndex="postedTime" 
          key="postedTime"
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

export default Productlist;
