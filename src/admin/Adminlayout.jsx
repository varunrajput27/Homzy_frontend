import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import DashboardLayouts from './DashboardLayouts';
import Users from './Users';
import BookedVisits from './BookedVisits';
import Allrent from './Allrent';
import Allsale from './Allsale';
import Rentout from './Rentout';
import Soldout from './Soldout';
import { HiMenu } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // detect screen size
  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
      setSidebarOpen(false);
    } else {
      setIsMobile(false);
      setSidebarOpen(true);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard': return <DashboardLayouts />;
      case 'Users': return <Users />;
      case 'Rent': return <Allrent />;
      case 'Sale': return <Allsale />;
      case 'Visits': return <BookedVisits />;
      case 'RentOut': return <Rentout />;
      case 'SoldOut': return <Soldout />;
      default: return <DashboardLayouts />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-h-screen ml-0 md:ml-64">
        {/* 🔹 Fixed Navbar */}
        <header className="fixed top-0 left-0 md:left-64 right-0 z-40 flex items-center justify-between p-4 border-b bg-white shadow-md">
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              {sidebarOpen ? <IoClose size={24} /> : <HiMenu size={24} />}
            </button>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 ml-2">
            {activeTab}
          </h1>
        </header>

        {/* 🔹 Scrollable main content */}
        <main className="flex-1 overflow-y-auto p-6 pt-20">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
