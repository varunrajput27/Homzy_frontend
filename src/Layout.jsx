import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UserProfileModal from "./components/UserProfileModal";
import QuickView from "./components/Quickview"; 

const Layout = ({ children, onListPropertyClick }) => {
  //  For User Profile Modal
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  //  For QuickView Modal
  const [selectedProperty, setSelectedProperty] = useState(null);
  const handleQuickView = (property) => setSelectedProperty(property);
  const closeQuickView = () => setSelectedProperty(null);

  //  Inject onQuickView prop into all children (Home, Rent, Buy, etc.)
  const enhancedChildren = React.cloneElement(children, {
    onQuickView: handleQuickView,
  });

  return (
    <>
      {/* Navbar */}
      <Navbar
        onListPropertyClick={onListPropertyClick}
        openProfileModal={openProfileModal}
      />

      {/* Main Page Content */}
      <main className="pt-20">{enhancedChildren}</main>

      <Footer />

      {/*  User Profile Modal */}
      <UserProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} />

      {/* Quick View Modal */}
      {selectedProperty && (
        <QuickView property={selectedProperty} onClose={closeQuickView} />
      )}
    </>
  );
};

export default Layout;
