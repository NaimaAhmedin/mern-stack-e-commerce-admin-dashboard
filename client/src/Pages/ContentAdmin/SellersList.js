import React, { useState, useEffect } from 'react';
import { getSellers, updateSellerStatus } from '../../services/sellerService';

const SellersList = () => {
  const [sellers, setSellers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'all' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setIsLoading(true);
        const queryFilters = filters.status !== 'all' 
          ? { 'sellerDetails.status': filters.status } 
          : {};

        const response = await getSellers(queryFilters);
        const sellersData = response.data.map(seller => ({
          id: seller._id,
          name: `${seller.firstName} ${seller.lastName}`.trim(),
          contactInfo: seller.email,
          phone: seller.phone,
          status: seller.sellerDetails?.status || 'active',
          businessLicense: seller.sellerDetails?.businessLicense || 'N/A',
          address: seller.address ? 
            `${seller.address.street}, ${seller.address.city}, ${seller.address.state}` 
            : 'N/A'
        }));

        setSellers(
          sellersData.filter(seller => 
            seller.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchSellers();
  }, [searchTerm, filters]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateSellerStatus(id, newStatus);
      setSellers(prevSellers => 
        prevSellers.map(seller => 
          seller.id === id ? { ...seller, status: newStatus } : seller
        )
      );
    } catch (err) {
      console.error('Failed to update seller status:', err);
    }
  };

  if (isLoading) return <div>Loading sellers...</div>;
  if (error) return <div>Error: {error}</div>;

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
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-2 py-2 border-b font-semibold text-left">Name</th>
              <th className="px-2 py-2 border-b font-semibold text-left">Contact Info</th>
              <th className="px-2 py-2 border-b font-semibold text-left">Phone</th>
              <th className="px-2 py-2 border-b font-semibold text-left">Status</th>
              <th className="px-2 py-2 border-b font-semibold text-left">Business License</th>
              <th className="px-2 py-2 border-b font-semibold text-left">Address</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller.id} className="border-t hover:bg-gray-100">
                <td className="px-2 py-2 border-b">{seller.name}</td>
                <td className="px-2 py-2 border-b">{seller.contactInfo}</td>
                <td className="px-2 py-2 border-b">{seller.phone}</td>
                <td className="px-2 py-2 border-b">
                  <select
                    value={seller.status}
                    onChange={(e) => handleStatusChange(seller.id, e.target.value)}
                    className="p-1 border rounded"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </td>
                <td className="px-4 py-2 border-b">{seller.businessLicense}</td>
                <td className="px-4 py-2 border-b">{seller.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellersList;
