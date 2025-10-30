import React, { useState } from 'react';
import {
  LayoutGrid,
  Users,
  Home,
  DollarSign,
  CalendarCheck,
  CheckCircle,
  XCircle
} from "lucide-react";
import { IoClose, IoLogOut } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', key: 'Dashboard', icon: LayoutGrid },
  { name: 'Users', key: 'Users', icon: Users },
  { name: 'All Rent Properties', key: 'Rent', icon: Home },
  { name: 'Rent Out Properties', key: 'RentOut', icon: CheckCircle },
  { name: 'All Sale Properties', key: 'Sale', icon: DollarSign },
  { name: 'Sold Out Properties', key: 'SoldOut', icon: XCircle },
  { name: 'Book Visit Requests', key: 'Visits', icon: CalendarCheck },
];

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, toggleSidebar, isMobile }) => {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLinkClick = (key) => {
    setActiveTab(key);
    if (isMobile) toggleSidebar();
  };

  const handleLogout = () => {
    setLoggingOut(true); // show spinner
    setTimeout(() => {
      setLoggingOut(false);
      // Optional: clear auth tokens/session here
      navigate('/adminlogin');
    }, 2000); // 2 seconds delay
  };

  return (
    <>
      <div
        className={`
          bg-gray-900 text-white p-4 shadow-2xl h-screen flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out
          ${isMobile ? 'fixed top-0 left-0 z-50 w-64' : 'fixed top-0 left-0 w-64 z-40'}
          ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        <div>
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              <IoClose size={24} />
            </button>
          )}

          <div className="text-2xl font-extrabold mb-8 border-b border-gray-700 pb-4 text-indigo-400">
            HOMZY
          </div>

          <nav>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => handleLinkClick(item.key)}
                  className={`w-full text-left py-3 px-4 rounded-lg transition duration-200 mb-2 flex items-center space-x-3
                    ${activeTab === item.key
                      ? 'bg-indigo-600 font-semibold text-white shadow-lg'
                      : 'hover:bg-gray-700 text-gray-300 cursor-pointer'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout button at bottom */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center py-3 px-4 rounded-lg mt-4 bg-red-600 hover:bg-red-700 transition-colors font-semibold text-white cursor-pointer"
          disabled={loggingOut}
        >
          {loggingOut ? (
            <div className="w-5 h-5 border-2 border-t-2 border-white rounded-full animate-spin mr-2"></div>
          ) : (
            <IoLogOut className="w-5 h-5 mr-2" />
          )}
          {loggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}
    </>
  );
};

export default Sidebar;

