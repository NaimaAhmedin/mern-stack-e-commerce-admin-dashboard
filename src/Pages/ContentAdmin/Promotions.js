import React, { useState } from 'react';
import { Table, Button, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MdSearch } from "react-icons/md";

const Promotions = () => {
  // Dummy data for promotions
  const initialPromotions = [
    {
      key: '1',
      name: 'New Year Discount',
      description: 'Get 30% off on all products during the New Year.',
      startDate: '2024-01-01',
      endDate: '2024-01-10',
    },
    {
      key: '2',
      name: 'Spring Clearance',
      description: 'Up to 50% off on selected items.',
      startDate: '2024-03-01',
      endDate: '2024-03-15',
    },
    {
      key: '3',
      name: 'Holiday Special',
      description: 'Exclusive holiday discounts for loyal customers.',
      startDate: '2024-12-01',
      endDate: '2024-12-25',
    },
  ];

  const [promotions, setPromotions] = useState(initialPromotions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const navigate = useNavigate();

  const filteredPromotions = promotions.filter(promotion =>
    promotion.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

 

  const handleViewDetails = (promotion) => {
    Modal.info({
      title: `Promotion Details: ${promotion.name}`,
      content: (
        <div>
          <p>Description: {promotion.description}</p>
          <p>Start Date: {promotion.startDate}</p>
          <p>End Date: {promotion.endDate}</p>
        </div>
      ),
      onOk() {},
    });
  };

  const toggleSelectPromotion = (key) => {
    setSelectedPromotions(prev =>
      prev.includes(key) ? prev.filter(promotionKey => promotionKey !== key) : [...prev, key]
    );
  };

  const handleDeleteSelected = () => {
    setPromotions(promotions.filter(promotion => !selectedPromotions.includes(promotion.key)));
    setSelectedPromotions([]);
    message.success('Selected promotions deleted successfully!');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-4xl font-bold">Promotions</h2>
        
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
            onClick={() => navigate('/Content-Admin/promotion/create')}
            className="bg-orange-600 text-white px-4 py-2 rounded-3xl"
          >
            + Create
          </button>
          {selectedPromotions.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="bg-orange-600 text-white px-4 py-2 rounded-3xl"
            >
              Delete
            </button>
)}

          
        </div>
      </div>

      <Table dataSource={filteredPromotions} pagination={false} rowKey="key">
        <Table.Column
          title="Select"
          key="select"
          render={(text, record) => (
            <input
              type="checkbox"
              checked={selectedPromotions.includes(record.key)}
              onChange={() => toggleSelectPromotion(record.key)}
            />
          )}
        />
        <Table.Column 
          title={<span className="font-semibold text-lg">Name</span>} 
          dataIndex="name" 
          key="name" 
          render={(text) => <span className="font-semibold">{text}</span>} 
        />
        <Table.Column title="Description" dataIndex="description" key="description" />
        <Table.Column title="Start Date" dataIndex="startDate" key="startDate" />
        <Table.Column title="End Date" dataIndex="endDate" key="endDate" />
        <Table.Column
          title="Action"
          key="action"
          render={(text, record) => (
            <span>
              <Button type="link" onClick={() => handleViewDetails(record)}>
                View
              </Button>
              <Button 
                type="link" 
                onClick={() => navigate(`/Content-Admin/promotion/edit/${record.key}`, { state: record })}>
                Edit
              </Button>
            </span>
          )}
        />
      </Table>
    </div>
  );
};

export default Promotions;
