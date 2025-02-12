import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  message, 
  Spin, 
  Popconfirm, 
  Space, 
  Input 
} from 'antd';
import { 
  DeleteOutlined, 
  EyeOutlined, 
  SearchOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
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
      setLoading(true);
      const response = await getProducts();
      console.log('Products response:', response);

      if (response && (Array.isArray(response) || Array.isArray(response.data))) {
        const productsArray = Array.isArray(response) ? response : response.data;
        
        const formattedProducts = productsArray.map((product) => ({
          key: product._id,           
          seller: product.seller_id?.name || 'N/A',
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
        }));

        setProducts(formattedProducts);
        
        // Extract unique categories
        const categories = [...new Set(formattedProducts.map(product => product.category))];
        setCategoryFilters(categories.map(cat => ({ text: cat, value: cat })));
      } else {
        console.error('Invalid products response:', response);
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
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle select/deselect for individual products
  const toggleSelectProduct = (id) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(productId => productId !== id) : [...prev, id]
    );
  };

  // Delete selected products
  const handleDeleteSelected = async () => {
    if (selectedProducts.length === 0) {
      message.warning('Please select products to delete');
      return;
    }

    Modal.confirm({
      title: 'Confirm Deletion',
      content: `Are you sure you want to delete ${selectedProducts.length} ${
        selectedProducts.length === 1 ? "product" : "products"
      }?`,
      onOk: async () => {
        try {
          await Promise.all(selectedProducts.map(id => deleteProduct(id)));
          message.success(`Successfully deleted ${selectedProducts.length} products`);
          setSelectedProducts([]);
          fetchProducts(); // Refresh the product list
        } catch (err) {
          console.error('Error deleting products:', err);
          message.error('Failed to delete some products');
        }
      }
    });
  };

  // New method to handle individual product deletion
  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      message.success('Product deleted successfully');
      fetchProducts(); // Refresh the product list
    } catch (err) {
      console.error('Error deleting product:', err);
      message.error('Failed to delete product');
    }
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

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: categoryFilters,
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toFixed(2)}`
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewDetails(record)}
          >
            Detail
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDeleteProduct(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Table 
        columns={columns}
        dataSource={filteredProducts}
        loading={loading}
        rowSelection={{
          selectedRowKeys: selectedProducts,
          onChange: (selectedRowKeys) => setSelectedProducts(selectedRowKeys),
        }}
        pagination={{ 
          pageSize: 10, 
          showSizeChanger: true 
        }}
        title={() => (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Button 
                type="primary" 
                danger 
                disabled={selectedProducts.length === 0}
                onClick={handleDeleteSelected}
              >
                Delete Selected
              </Button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Input 
                prefix={<SearchOutlined />}
                placeholder="Search products" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 200 }}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default ProductControl;