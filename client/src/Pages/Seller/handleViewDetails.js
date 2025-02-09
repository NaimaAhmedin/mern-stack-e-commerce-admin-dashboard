import React from 'react';
import { Modal, Table, Button } from 'antd';
import { getProduct } from '../../services/productService';

export const handleViewDetails = async (record) => {
  try {
    const columns = [
      {
        title: 'SNo',
        dataIndex: 'key',
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Product Name',
        dataIndex: 'productName',
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
      },
      {
        title: 'Price',
        dataIndex: 'price',
        render: (price) => price ? `$${price.toFixed(2)}` : 'N/A',
      },
      // {
      //   title: 'Seller Name',
      //   dataIndex: 'sellerName',
      // },
      {
        title: 'Actions',
        key: 'actions',
        align: 'center',
        render: (text, productRecord) => (
          <Button 
            type="link" 
            onClick={async () => {
              try {
                const fullProduct = await getProduct(productRecord.productId);
                
                Modal.info({
                  title: 'Product Details',
                  width: 'fit-content',
                  content: (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                      <div style={{ flex: 1, minWidth: '280px'}}>
                        {/* <p><strong>Seller:</strong></p>
                        <p>• Name:  {productRecord.sellerName || 'N/A'}</p>
                        <p>• Phone:  {productRecord.sellerPhone || 'N/A'}</p>
                        <p>• Email:  {productRecord.sellerEmail || 'N/A'}</p>
                        <p>• Address:  {productRecord.sellerAddress || 'N/A'}</p> */}
                        <p><strong>Product ID:</strong> {fullProduct._id}</p>
                        <p><strong>Product Name:</strong> {fullProduct.name}</p>
                        <p><strong>Brand:</strong> {fullProduct.brand || 'N/A'}</p>
                        <p><strong>Category:</strong> {fullProduct.categoryId?.name || 'N/A'}</p>
                        <p><strong>Subcategory:</strong> {fullProduct.subcategoryId?.name || 'N/A'}</p>
                        <p><strong>Color:</strong> {fullProduct.color || 'N/A'}</p>
                        <p><strong>Warranty:</strong> {fullProduct.warranty || 'N/A'}</p>
                        <p><strong>Description:</strong> {fullProduct.description || 'N/A'}</p>
                      </div>
                      <div style={{ flex: 1, minWidth: '280px' }}>
                        {fullProduct.images && fullProduct.images.length > 0 ? (
                          <div className="grid grid-cols-2 gap-4 max-w-full">
                            {fullProduct.images.slice(0, 5).map((image, index) => (
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
                                  alt={`${fullProduct.name} ${index + 1}`}
                                  className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                            ))}
                          </div>
                        ) : fullProduct.image ? (
                          <div 
                            className="relative overflow-hidden rounded-lg shadow-md"
                            style={{ 
                              width: '250px', 
                              height: '250px',
                              aspectRatio: '1/1'
                            }}
                          >
                            <img 
                              src={typeof fullProduct.image === 'string' ? fullProduct.image : fullProduct.image.url}
                              alt={fullProduct.name}
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
              } catch (error) {
                console.error('Error fetching product details:', error);
                Modal.error({
                  title: 'Error',
                  content: 'Failed to fetch product details',
                });
              }
            }}
          >
            Product Details
          </Button>
        ),
      },
    ];

    const dataSource = record.products.map((product, index) => ({
      key: index,
      productId: product.productId,
      productName: product.productName,
      quantity: product.quantity,
      price: product.price,
      // sellerName: product.sellerName || 'Unknown Seller',
      // sellerPhone: product.sellerPhone || 'N/A',
      // sellerEmail: product.sellerEmail || 'N/A',
      // sellerAddress: product.sellerAddress || 'N/A',
    }));

    Modal.info({
      title: 'Ordered Items',
      width: 'fit-content',
      content: (
        <Table 
          columns={columns} 
          dataSource={dataSource} 
          pagination={false} 
        />
      ),
      onOk() {},
    });
  } catch (error) {
    console.error('Error in handleViewDetails:', error);
  }
};

export default handleViewDetails;