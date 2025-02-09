import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Spin, Tooltip } from 'antd';
// import Ordereditemlist from './Ordereditemlist';  // Removed as file does not exist
import { useNavigate } from 'react-router-dom';
import { MdSearch } from "react-icons/md";
import { getOrders } from '../../services/orderService';
import { getProduct } from '../../services/productService';
import handleViewDetails from './handleViewDetails';
import { updateOrderStatus } from '../../services/orderService';
// const { Option } = Select;



const OrderManagementPage = () => {

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderDetailModalVisible, setOrderDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [costBreakdownModalVisible, setCostBreakdownModalVisible] = useState(false);
  const [costDetails, setCostDetails] = useState(null);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilters, setStatusFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      console.log('FULL RESPONSE:', JSON.stringify(response, null, 2));
  
      const ordersArray = Array.isArray(response) ? response : response.data;
      
      const formattedOrders = ordersArray
        .filter(order => {
          const normalizedStatus = order.status.toLowerCase();
          return normalizedStatus === 'pending' || normalizedStatus === 'readytodelivery';
        })
        .map((order, index) => {
          console.log(`ORDER ${index} FULL DETAILS:`, JSON.stringify(order, null, 2));
    
          const orderProducts = order.products.map((productItem) => {
            return {
              productId: productItem.product?._id || 'N/A',
              productName: productItem.product?.name || 'No Name', 
              quantity: productItem.quantity || 0,
              price: productItem.price || 0,
              // sellerName:  productItem.seller_id?.name || 'No Name',
              // sellerPhone:  productItem.seller_id?.phone || 'No Phone',
              // sellerEmail:  productItem.seller_id?.email || 'No Email',
              // sellerAddress:  productItem.seller_id?.address || 'No Address',
              color:  productItem.product?.color || 'No Name',
              warranty:  productItem.product?.warranty,
              description:  productItem.product?.description || 'No Name',
            };
          });
    
          return {
            key: order._id,           
            customerName: order.userId?.name || 'N/A',
            customerPhone: order.userId?.phone || 'N/A',
            customerEmail  : order.userId?.email || 'N/A',
            id: order._id,
            totalPrice: order.totalPrice || 0,
            status: order.status || 'N/A',
            orderedAt: order.orderedAt,
            orderDate: new Date(order.createdAt).toLocaleDateString(),
            orderTime: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            products: orderProducts,
          };
        });
  
      console.log('FORMATTED ORDERS:', JSON.stringify(formattedOrders, null, 2));
      setOrders(formattedOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  // const filteredOrders = orders.filter((order) => {
  //   // If search term is empty, return all orders
  //   if (!searchTerm) return true;

  //   // Safely handle different searchable fields
  //   const searchTermLower = searchTerm.toLowerCase();
    
  //   const customerNameMatch = (order.customerName || '')
  //     .toLowerCase()
  //     .includes(searchTermLower);
    
  //   const statusMatch = (order.status || '')
  //     .toLowerCase()
  //     .includes(searchTermLower);
    
  //   const orderIdMatch = (order.id || order._id || '')
  //     .toString()
  //     .toLowerCase()
  //     .includes(searchTermLower);

  //   // Return true if any field matches the search term
  //   return customerNameMatch || statusMatch || orderIdMatch;
  // });

useEffect(() => {
  fetchOrders();
}, []);

const filteredOrders = orders.filter(order =>
  (order.customerName || "").toLowerCase().startsWith((searchTerm || "").toLowerCase())
);

  // const showProductDetails = (product) => {
  //   setSelectedProduct([product]);
  //   setDetailModalVisible(true);
  // };

  // const showOrderDetails = (product) => {
  //   setSelectedOrder(product);
  //   setOrderDetailModalVisible(true);
  // };

  // const showCostBreakdown = (order) => {
  //   setCostDetails({
  //     itemsPrice: order.price,
  //     vat: order.price * 0.15, // Example: 15% VAT
  //     tax: order.price * 0.05,  // Example: 5% tax
  //     shipmentFee: 10.00,       // Example: fixed shipment fee
  //     totalCost: order.totalCost,
  //   });
  //   setCostBreakdownModalVisible(true);
  // };

  
  

  // const handleDetailModalClose = () => {
  //   setDetailModalVisible(false);
  //   setSelectedProduct(null);
  // };

  // const handleOrderDetailModalClose = () => {
  //   setOrderDetailModalVisible(false);
  //   setSelectedOrder(null);
  // };

  const handleOrderDetails = (order) => {
    Modal.info({
      title: 'Order Details',
      width: '60%',
      content: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: '280px'}}>
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Customer Name:</strong> {order.customerName}</p>
            <p><strong>Customer Phone:</strong> {order.customerPhone || 'N/A'}</p>
            <p><strong>Customer Email:</strong> {order.customerEmail || 'N/A'}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total Price:</strong> {order.totalPrice}</p>
            <p><strong>Order Time:</strong> {order.orderTime}</p>
            <p><strong>Order Date:</strong> {order.orderDate}</p>
          </div>
          {/* <div style={{ flex: 1, minWidth: '280px' }}>
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
          </div> */}
        </div>
      ),
      onOk() {},
    });
  };

  const handleUpdateOrderStatus = (record) => {
    console.log('Updating order status for record:', record);

    updateOrderStatus(record.id, { status: 'ReadytoDelivery' })
      .then((response) => {
        if (response.success) {
          message.success('Order status updated to Ready to Delivery');
          fetchOrders(); // Refresh the orders list
        } else {
          message.error(response.message || 'Failed to update order status');
          console.error('Order status update failed:', response.error);
        }
      })
      .catch((error) => {
        message.error('Error updating order status');
        console.error('Unexpected error updating order status:', error);
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
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-full pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <MdSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          </div>
        </div>
      </div>

      <Table dataSource={filteredOrders} pagination={false} rowKey="key">
       
        <Table.Column 
          title={<span className="font-semibold text-lg">SNo</span>} 
          dataIndex="key" 
          key="key" 
          render={(text, record, index) => <span className="font-semibold">{index + 1}</span>} 
          
        />
        <Table.Column 
          title={<span className="font-semibold text-lg">Customer Name</span>} 
          dataIndex="customerName" 
          key="customerName" 
          render={(text) => <span className="font-semibold">{text}</span>} 
        />
        <Table.Column 
    title= "Status"
    dataIndex= "status"
    filters={statusFilters}
    onFilter={(value, record) => record.status.includes(value)} 
  />
       <Table.Column 
          title="Total Price" 
          dataIndex="totalPrice" 
          key="totalPrice" 
          render={(totalPrice) => totalPrice !== undefined && totalPrice !== null ? `${totalPrice.toFixed(2)}` : 'N/A'}
        />
        <Table.Column 
          title="Order Time" 
          dataIndex="orderedAt" 
          key="orderTime"
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
          title="Order Date" 
          dataIndex="orderedAt" 
          key="orderDate"
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
        {/* <Table.Column 
          title="Stock" 
          dataIndex="stock" 
          key="stock" 
        /> */}
        <Table.Column
  title="Action"
  key="action"
  align="center"
  render={(text, record) => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
      <Button type="link" onClick={() => handleViewDetails(record)}>
        Items
      </Button>
    <Button type="link" onClick={() => handleOrderDetails(record)}>
     Order Details
    </Button>
    {record.status === 'Pending' ? (
  <Tooltip title="Pending Order">
    <Button
      onClick={() => handleUpdateOrderStatus(record)}
      style={{
        backgroundColor: '#E8F5E9',
        color: '#43A047',
        border: 'none',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
      }}
    >
     Ready to Delivery
    </Button>
  </Tooltip>
) : (
  <Tooltip title="Ready Order">
    <Button
    disabled 
      onClick={() => handleUpdateOrderStatus(record)}
      style={{
        backgroundColor: '#E8F5E9',
        color: '#43A047',
        border: 'none',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        opacity: 0.5, 
        gap: '5px'
      }}
    >
       Ready Order
    </Button>
  </Tooltip>
)}
    </div> 
  )}
/>
      </Table>
    </div>
  );
  
};

export default OrderManagementPage;

