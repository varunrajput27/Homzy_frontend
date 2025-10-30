import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const ResetPasswordModal = ({ onClose, token }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/resetpassword`,
        { newPassword, token }
      );
      toast.success(response.data.message || "Password reset successful!");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <Toaster position="top-right" />
      <div
        className="absolute inset-0 bg-black opacity-40"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-2xl shadow-2xl z-50 w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl cursor-pointer"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-center text-[#3d5a80] mb-6">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3d5a80] cursor-pointer"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3d5a80] cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3d5a80] text-white py-3 rounded hover:bg-[#2c4460] cursor-pointer transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
