import React, { useState } from "react";

const Deliverer = () => {
  const [personnel, setPersonnel] = useState([
    {
      id: 1,
      name: "John Doe",
      contact: "123-456-7890",
      region: "East",
      status: "Active",
      nationalId: "AB12345678",
      performance: "95%",
    },
    {
      id: 2,
      name: "Jane Smith",
      contact: "987-654-3210",
      region: "West",
      status: "Inactive",
      nationalId: "CD98765432",
      performance: "85%",
    },
    {
      id: 3,
      name: "Alice Johnson",
      contact: "555-012-3456",
      region: "North",
      status: "Active",
      nationalId: "EF12345987",
      performance: "92%",
    },
    {
      id: 4,
      name: "Bob Williams",
      contact: "555-987-6543",
      region: "South",
      status: "Active",
      nationalId: "GH98765123",
      performance: "98%",
    },
    {
      id: 5,
      name: "Charlie Brown",
      contact: "555-654-1234",
      region: "Central",
      status: "Inactive",
      nationalId: "IJ65412345",
      performance: "75%",
    },
    {
      id: 6,
      name: "Diana Prince",
      contact: "555-321-9876",
      region: "East",
      status: "Active",
      nationalId: "KL32198765",
      performance: "90%",
    },
  ]);

  const [selectedIds, setSelectedIds] = useState([]); // Stores selected personnel ids
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
  const [editingPerson, setEditingPerson] = useState(null); // Stores the person being edited

  // Handle Select All checkbox change
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = personnel.map((person) => person.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  // Handle individual checkbox change
  const handleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Handle deleting selected personnel
  const handleDeleteSelected = () => {
    const updatedPersonnel = personnel.filter(
      (person) => !selectedIds.includes(person.id)
    );
    setPersonnel(updatedPersonnel);
    setSelectedIds([]); // Clear selected IDs after deletion
  };

  // Handle opening the edit modal
  const handleEdit = (person) => {
    setEditingPerson(person);
    setIsModalOpen(true);
  };

  // Handle saving the edited details
  const handleSave = () => {
    const updatedPersonnel = personnel.map((person) =>
      person.id === editingPerson.id ? editingPerson : person
    );
    setPersonnel(updatedPersonnel);
    setIsModalOpen(false);
    setEditingPerson(null);
  };

  // Handle changes in the editing form (status, contact, name, etc.)
  const handleChange = (e) => {
    setEditingPerson({
      ...editingPerson,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-2 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-2">Delivery Personnel List</h1>

      {/* Search Bar and Delete Selected button */}
      <div className="flex justify-end items-center gap-2 mb-2">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className=" px-4 py-2 border border-gray-300 rounded-3xl"
          />
        </div>

        {/* Only show the Delete Selected button if items are selected */}
        {selectedIds.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="px-4 py-1 rounded-3xl bg-orange-500 text-white"
          >
            Delete Selected
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-lg">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border-b-2 p-3 text-left">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedIds.length === personnel.length}
                />
              </th>
              <th className="border-b-2 p-3 text-left">Name</th>
              <th className="border-b-2 p-3 text-left">Contact</th>
              <th className="border-b-2 p-3 text-left">Region</th>
              <th className="border-b-2 p-3 text-left">National ID</th>
              <th className="border-b-2 p-3 text-left">Performance</th>
              <th className="border-b-2 p-3 text-left">Status</th>
              <th className="border-b-2 p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {personnel.map((person) => (
              <tr key={person.id} className="border-b">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(person.id)}
                    onChange={() => handleSelect(person.id)}
                  />
                </td>
                <td className="p-3">{person.name}</td>
                <td className="p-3">{person.contact}</td>
                <td className="p-3">{person.region}</td>
                <td className="p-3">{person.nationalId}</td>
                <td className="p-3">{person.performance}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded ${
                      person.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {person.status}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleEdit(person)}
                    className="px-4 py-1 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Edit Delivery Personnel</h2>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-1">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={editingPerson.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="contact" className="block mb-1">
                Contact:
              </label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={editingPerson.contact}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="region" className="block mb-1">
                Region:
              </label>
              <input
                type="text"
                id="region"
                name="region"
                value={editingPerson.region}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="status" className="block mb-1">
                Status:
              </label>
              <select
                id="status"
                name="status"
                value={editingPerson.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="px-4 py-1 bg-green-500 text-white rounded mr-2 hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deliverer;
