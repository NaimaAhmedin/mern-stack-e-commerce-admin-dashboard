import React, { useState } from "react";

const CustomerComplaints = () => {
  const [deliveryStatus, setDeliveryStatus] = useState([
    { id: 1, orderId: "ORD001", status: "In Progress", customerName: "John Doe" },
    { id: 2, orderId: "ORD002", status: "Delivered", customerName: "Jane Smith" },
    { id: 3, orderId: "ORD003", status: "Pending", customerName: "Alice Johnson" },
  ]);
  
  const [complaints, setComplaints] = useState([
    { id: 1, orderId: "ORD001", complaint: "Package damaged", status: "Pending" },
    { id: 2, orderId: "ORD003", complaint: "Delivery delayed", status: "Resolved" },
    { id: 3, orderId: "ORD005", complaint: "Incorrect address", status: "Pending" },
    { id: 4, orderId: "ORD006", complaint: "Item missing from package", status: "Pending" },
    { id: 5, orderId: "ORD007", complaint: "Driver was rude", status: "Resolved" },
    { id: 6, orderId: "ORD008", complaint: "Package arrived too late", status: "Pending" },
    { id: 7, orderId: "ORD009", complaint: "Delivery went to the wrong address", status: "Resolved" },
    { id: 8, orderId: "ORD010", complaint: "Wrong item delivered", status: "Pending" },
    { id: 9, orderId: "ORD011", complaint: "Order not delivered", status: "Pending" },
    { id: 10, orderId: "ORD012", complaint: "Package crushed", status: "Resolved" },
    { id: 11, orderId: "ORD013", complaint: "Delivery was not made on the scheduled time", status: "Pending" },
    { id: 12, orderId: "ORD014", complaint: "Package had a tear", status: "Resolved" },
    { id: 13, orderId: "ORD015", complaint: "Tracking info was incorrect", status: "Resolved" },
    { id: 14, orderId: "ORD016", complaint: "Wrong size delivered", status: "Pending" },
    { id: 15, orderId: "ORD017", complaint: "Package delivered to wrong floor", status: "Pending" },
  ]);
  
  const handleStatusUpdate = (id, newStatus) => {
    const updatedStatus = deliveryStatus.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setDeliveryStatus(updatedStatus);
  };

  const handleComplaintResolution = (id) => {
    const updatedComplaints = complaints.map(item =>
      item.id === id ? { ...item, status: "Resolved" } : item
    );
    setComplaints(updatedComplaints);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Delivery Admin Dashboard</h1>

      {/* Delivery Status Updates Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Delivery Status Updates</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border-b-2 p-3 text-left">Order ID</th>
                <th className="border-b-2 p-3 text-left">Customer Name</th>
                <th className="border-b-2 p-3 text-left">Status</th>
                <th className="border-b-2 p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {deliveryStatus.map(item => (
                <tr key={item.id} className="border-b">
                  <td className="p-3">{item.orderId}</td>
                  <td className="p-3">{item.customerName}</td>
                  <td className="p-3">{item.status}</td>
                  <td className="p-3">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded"
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Pending">Pending</option>
                      <option value="Delayed">Delayed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Complaints Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Delivery-Related Complaints</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border-b-2 p-3 text-left">Order ID</th>
                <th className="border-b-2 p-3 text-left">Complaint</th>
                <th className="border-b-2 p-3 text-left">Status</th>
                <th className="border-b-2 p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(item => (
                <tr key={item.id} className="border-b">
                  <td className="p-3">{item.orderId}</td>
                  <td className="p-3">{item.complaint}</td>
                  <td className="p-3">{item.status}</td>
                  <td className="p-3">
                    {item.status === "Pending" && (
                      <button
                        onClick={() => handleComplaintResolution(item.id)}
                        className="px-4 py-1 bg-blue-500 text-white rounded"
                      >
                        Resolve
                      </button>
                    )}
                    {item.status === "Resolved" && (
                      <span className="px-4 py-1 bg-green-100 text-green-700 rounded">
                        Resolved
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerComplaints;
