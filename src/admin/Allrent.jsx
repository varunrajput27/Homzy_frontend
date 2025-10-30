import React, { useState, useEffect } from "react";
import axios from "axios";

const Allrent = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/rent/all`);
        setProperties(res.data.properties || []);
      } catch (err) {
        console.error("Rent API Error:", err);
        setError("Failed to fetch rent properties.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const openDeleteModal = (id) => {
    setSelectedPropertyId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/rent/delete/${selectedPropertyId}`);
      setProperties(properties.filter((p) => p._id !== selectedPropertyId));
      setShowDeleteModal(false);
      setSelectedPropertyId(null);
    } catch (err) {
      console.error("Delete Property Error:", err);
      alert("Failed to delete property.");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedPropertyId(null);
  };

  if (loading) return <p className="text-center text-gray-500 mt-8">Loading rent properties...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50 space-y-6">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
        All Rent Properties ({properties.length})
      </h2>

      {/* Mobile / Small Screens */}
      <div className="block md:hidden space-y-4">
        {properties.map((prop) => (
          <div key={prop._id} className="bg-white p-4 rounded-lg shadow-md space-y-2">
            <div>
              <span className="font-semibold text-gray-600">Title: </span>
              <span className="text-gray-800">{prop.basicDetails.title}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Location: </span>
              <span className="text-gray-800">{prop.location.fullAddress}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Rent: </span>
              <span className="text-gray-800">{prop.basicDetails.monthlyRent || "N/A"}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Owner: </span>
              <span className="text-gray-800">{prop.contactInfo.owner}</span>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => openDeleteModal(prop._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tablet / Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase">Title</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase">Location</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase">Rent</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase">Owner</th>
              <th className="py-3 px-4 text-center text-sm font-medium text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {properties.map((prop) => (
              <tr key={prop._id} className="hover:bg-gray-50 transition-colors">
                <td className="py-2 px-4 text-gray-700">{prop.basicDetails.title}</td>
                <td className="py-2 px-4 text-gray-700">{prop.location.fullAddress}</td>
                <td className="py-2 px-4 text-gray-700">{prop.basicDetails.monthlyRent || "N/A"}</td>
                <td className="py-2 px-4 text-gray-700">{prop.contactInfo.owner}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => openDeleteModal(prop._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-sm">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6 text-gray-700">Are you sure you want to delete this property?</p>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="py-2 px-4 bg-gray-300 rounded hover:bg-gray-400 w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 w-full sm:w-auto"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Allrent;


