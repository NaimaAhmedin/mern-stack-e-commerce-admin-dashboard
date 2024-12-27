import React, { useState, useEffect } from 'react';
import { getSellers, updateSellerStatus, getSeller } from '../../services/sellerService';

const SellerDetailsModal = ({ seller, onClose }) => {
  if (!seller) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Seller Details</h2>
          <button 
            onClick={onClose} 
            className="text-red-500 hover:text-red-700 text-2xl"
          >
            &times;
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <strong>Name:</strong> {seller.name}
          </div>
          <div>
            <strong>Email:</strong> {seller.contactInfo}
          </div>
          <div>
            <strong>Phone:</strong> {seller.phone}
          </div>
          <div>
            <strong>Status:</strong> {seller.status}
          </div>
          {seller.sellerDetails && (
            <>
              <div>
                <strong>Business License:</strong> {seller.sellerDetails.businessLicense || 'N/A'}
              </div>
              <div>
                <strong>Account Number:</strong> {seller.sellerDetails.accountNumber || 'N/A'}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const SellersList = () => {
  const [allSellers, setAllSellers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'all' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);

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
          name: seller.name || '',
          contactInfo: seller.email || '',
          phone: seller.phone || '',
          status: seller.sellerDetails?.status || 'active',
          sellerDetails: seller.sellerDetails || {}
        }));

        setAllSellers(sellersData);
        setSellers(sellersData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching sellers:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchSellers();
  }, [filters]);

  // Filter sellers when search term changes
  useEffect(() => {
    if (searchTerm === '') {
      setSellers(allSellers);
    } else {
      const filteredSellers = allSellers.filter(seller => 
        (seller.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (seller.contactInfo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (seller.phone || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSellers(filteredSellers);
    }
  }, [searchTerm, allSellers]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await updateSellerStatus(id, newStatus);
      
      setAllSellers(prevAllSellers => 
        prevAllSellers.map(seller => 
          seller.id === id ? { ...seller, status: newStatus } : seller
        )
      );
      setSellers(prevSellers => 
        prevSellers.map(seller => 
          seller.id === id ? { ...seller, status: newStatus } : seller
        )
      );
    } catch (err) {
      console.error('Failed to update seller status:', err);
      alert(`Failed to update seller status: ${err.message}`);
    }
  };

  const handleViewDetails = async (seller) => {
    try {
      // If you want to fetch additional details, uncomment the following:
      // const fullSellerDetails = await getSeller(seller.id);
      // setSelectedSeller(fullSellerDetails);
      setSelectedSeller(seller);
    } catch (err) {
      console.error('Failed to fetch seller details:', err);
      alert(`Failed to fetch seller details: ${err.message}`);
    }
  };

  if (isLoading) return <div>Loading sellers...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      {selectedSeller && (
        <SellerDetailsModal 
          seller={selectedSeller} 
          onClose={() => setSelectedSeller(null)} 
        />
      )}

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
              <th className="px-4 py-2 border-b font-semibold text-left">Name</th>
              <th className="px-4 py-2 border-b font-semibold text-left">Contact Info</th>
              <th className="px-4 py-2 border-b font-semibold text-left">Phone</th>
              <th className="px-4 py-2 border-b font-semibold text-left">Status</th>
              <th className="px-4 py-2 border-b font-semibold text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b">{seller.name}</td>
                <td className="px-4 py-2 border-b">{seller.contactInfo}</td>
                <td className="px-4 py-2 border-b">{seller.phone}</td>
                <td className="px-4 py-2 border-b">
                  <select
                    value={seller.status}
                    onChange={(e) => handleStatusChange(seller.id, e.target.value)}
                    className="w-full p-1 border rounded"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleViewDetails(seller)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellersList;