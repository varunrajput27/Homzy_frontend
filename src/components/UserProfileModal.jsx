import React from 'react';
import { FaTimes, FaEnvelope, FaPhone, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
const UserProfileModal = ({ isOpen, onClose }) => {
    // Auth context 
    const { user } = useAuth(); 

    if (!isOpen) return null;

    // Default values
    const userName = user?.fullname || "N/A"; 
    const userEmail = user?.email || "N/A";
    const userPhone = user?.phone || "N/A";

    return (
        // Modal Backdrop
        <div 
            className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center p-4 z-50 transition-opacity"
            onClick={onClose} 
        >
            {/* Modal Content */}
            <div 
                className="bg-white rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100 opacity-100"
                onClick={(e) => e.stopPropagation()} 
            >
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <FaUserCircle className="mr-3 text-indigo-600" /> User Profile
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
                        aria-label="Close modal"
                    >
                        <FaTimes className="h-6 w-6" />
                    </button>
                </div>

                {/* Body - Profile Details */}
                <div className="p-6 space-y-4">
                    <div className="text-center mb-6">
                        <div className="mx-auto h-20 w-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-4xl mb-3">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">{userName}</h3>
                        <p className="text-sm text-indigo-500">Registered User</p>
                    </div>

                    <div className="space-y-3">
                        {/* Email */}
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <FaEnvelope className="text-gray-500 mr-4 h-5 w-5" />
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Email Address</p>
                                <p className="text-sm font-semibold text-gray-800 break-words">{userEmail}</p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <FaPhone className="text-gray-500 mr-4 h-5 w-5" />
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Phone Number</p>
                                <p className="text-sm font-semibold text-gray-800">{userPhone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;