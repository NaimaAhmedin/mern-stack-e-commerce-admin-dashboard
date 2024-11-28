import React from 'react';

const SellerCard = ({ seller }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-semibold">{seller.name}</h2>
      <p className="text-sm text-gray-600">{seller.contactInfo}</p>
      <p className="mt-2">Status: <span className={`font-semibold ${seller.status === 'active' ? 'text-green-500' : seller.status === 'suspended' ? 'text-red-500' : 'text-yellow-500'}`}>{seller.status}</span></p>
      
      <p className="mt-2">Account No: <span className="font-semibold">{seller.accountNumber}</span></p>
      <p>Business License: <span className="font-semibold">{seller.businessLicense}</span></p>

      <p className="mt-2">Approved Products: {seller.approvedProducts}</p>
      <p className="mt-1">Rejected Products: {seller.rejectedProducts}</p>
      
      <div className="flex justify-between mt-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">View Profile</button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded">Send Warning</button>
        <button
          className={`px-4 py-2 rounded text-white ${seller.status === 'active' ? 'bg-red-500' : 'bg-green-500'}`}
        >
          {seller.status === 'active' ? 'Suspend' : 'Reactivate'}
        </button>
      </div>
    </div>
  );
};

export default SellerCard;
