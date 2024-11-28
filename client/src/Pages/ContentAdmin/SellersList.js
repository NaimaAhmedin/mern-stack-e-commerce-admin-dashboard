import React, { useState, useEffect } from 'react';

const initialSellers = [
  {
    id: 1,
    name: 'John Doe',
    contactInfo: 'john.doe@example.com',
    status: 'active',
    approvedProducts: 12,
    rejectedProducts: 2,
    accountNumber: '123456789',
    businessLicense: 'BL123456',
  },
  {
    id: 2,
    name: 'Jane Smith',
    contactInfo: 'jane.smith@example.com',
    status: 'suspended',
    approvedProducts: 5,
    rejectedProducts: 3,
    accountNumber: '987654321',
    businessLicense: 'BL987654',
  },
  // other sellers
];

const SellersList = () => {
  const [sellers, setSellers] = useState(initialSellers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'all' });

  useEffect(() => {
    const filteredSellers = initialSellers.filter((seller) => {
      const matchesStatus = filters.status === 'all' || seller.status === filters.status;
      const matchesSearch = seller.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
    setSellers(filteredSellers);
  }, [searchTerm, filters]);

  const handleStatusChange = (id, newStatus) => {
    setSellers((prevSellers) =>
      prevSellers.map((seller) =>
        seller.id === id ? { ...seller, status: newStatus } : seller
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Sellers</h1>
      
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by seller name"
          className="p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="p-2 border rounded"
          value={filters.status}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-2 py-2 border-b font-semibold text-left">Name</th>
              <th className="px-2 py-2 border-b font-semibold text-left">Contact Info</th>
              <th className="px-2 py-2 border-b font-semibold text-left">Status</th>
              <th className="px-2 py-2 border-b font-semibold text-left">Approved Products</th>
              <th className="px-2 py-2 border-b font-semibold text-left">Rejected Products</th>
              <th className="px-2 py-2 border-b font-semibold text-left">Account Number</th>
              <th className="px-2 py-2 border-b font-semibold text-left">Business License</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller.id} className="border-t hover:bg-gray-100">
                <td className="px-2 py-2 border-b">{seller.name}</td>
                <td className="px-2 py-2 border-b">{seller.contactInfo}</td>
                <td className="px-2 py-2 border-b">
                  <select
                    value={seller.status}
                    onChange={(e) => handleStatusChange(seller.id, e.target.value)}
                    className="p-1 border rounded"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                  </select>
                </td>
                <td className="px-4 py-2 border-b">{seller.approvedProducts}</td>
                <td className="px-4 py-2 border-b">{seller.rejectedProducts}</td>
                <td className="px-4 py-2 border-b">{seller.accountNumber}</td>
                <td className="px-4 py-2 border-b">{seller.businessLicense}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellersList;
