import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

// Delete Confirmation Modal
const DeleteModal = ({ user, isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 px-4">
      <Toaster position="top-right" />
      <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-sm shadow-lg">
        <h2 className="text-lg sm:text-xl font-bold mb-3">Confirm Delete</h2>
        <p className="text-sm sm:text-base mb-5">
          Are you sure you want to delete <strong>{user.fullname || user.name}</strong>?
        </p>
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 w-full sm:w-auto"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/all`);
        setUsers(res.data?.data || res.data || []);
        setError(null);
      } catch (err) {
        console.error("User Fetch Error:", err);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    try {
      const userId = selectedUser._id?.$oid || selectedUser._id || selectedUser.id;
      if (!userId) return toast.error("User ID not found");

      const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/user/delete/${userId}`);
      setUsers(users.filter(u => (u._id?.$oid || u._id || u.id) !== userId));
      toast.success(res.data.message || "User deleted successfully");
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  if (loading) return <p className="text-center text-gray-500 mt-8">Loading users...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
        All Registered Users ({users.length})
      </h2>

      {/* Mobile Cards */}
      <div className="block md:hidden space-y-4">
        {users.map(user => (
          <div key={user._id?.$oid || user._id || user.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col space-y-2">
            <div>
              <span className="font-semibold text-gray-600">Name: </span>
              <span className="text-gray-800">{user.fullname || user.name}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Email: </span>
              <span className="text-gray-800">{user.email}</span>
            </div>
            <div className="flex justify-center mt-2">
              <button
                onClick={() => openDeleteModal(user)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-full max-w-xs text-center"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop / Tablet Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-md divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user._id?.$oid || user._id || user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-700">{user.fullname || user.name}</td>
                <td className="px-6 py-4 text-gray-700">{user.email}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => openDeleteModal(user)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <DeleteModal
          user={selectedUser}
          isOpen={isModalOpen}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default Users;


