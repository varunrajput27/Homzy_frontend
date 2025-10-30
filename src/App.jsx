import React, { useState } from "react"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./Layout";
import Home from "./pages/Home";
import Rent from "./pages/Rent";
import Buy from "./pages/Buy";
import About from "./pages/About";
import Contactus from "./pages/Contactus";
import Property from "./pages/Property";
import Login from "./components/Login";
import Adminlogin from "./components/Adminlogin";
import Register from "./components/Register";
import Listproperty from "./components/Listproperty";
import Dashboard from "./pages/Dashboard";
import ResetPasswordModal from "./components/ResetPasswordModal";
import AdminLayout from "./admin/Adminlayout";



// 👈 1. AuthProvider ko import karein (Assuming path is correct)
import { AuthProvider } from './context/AuthContext'; 

function App() {
  // 2. Define state for the modal's visibility and controller functions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 3. Update router configuration
  const router = createBrowserRouter([
    // Pass the openModal function to the Layout component in every route
    { path: "/", element: <Layout onListPropertyClick={openModal}><Home /></Layout> },
    { path: "/rent", element: <Layout onListPropertyClick={openModal}><Rent /></Layout> },
    { path: "/buy", element: <Layout onListPropertyClick={openModal}><Buy /></Layout> },
    { path: "/about", element: <Layout onListPropertyClick={openModal}><About /></Layout> },
    { path: "/contact", element: <Layout onListPropertyClick={openModal}><Contactus /></Layout> },
//     { path: "/login", element: <Layout onListPropertyClick={openModal}><AuthPage /></Layout> },
{ path: "/login", element: <Login /> },
{ path: "/adminlogin", element: <Adminlogin /> },
{ path: "/admin", element: <AdminLayout /> },
//     { path: "/register", element: <Layout onListPropertyClick={openModal}><Register /></Layout> },
{ path: "/register", element: <Register /> },
{ path: "/resetpassword/:token", element: <ResetPasswordModal /> },

 { path: "/dashboard",element: <Layout onListPropertyClick={openModal}><Dashboard/></Layout> },
{ path: "/property/:id",element: <Layout onListPropertyClick={openModal}><Property/></Layout> },
 
  ]);

  return (
    // 👈 2. AuthProvider se poore application ko wrap karein
    <AuthProvider> 
      <RouterProvider router={router} />
      <ToastContainer />
      
      {/* 4. Conditionally render the Listproperty modal */}
      {isModalOpen && (
        <Listproperty onClose={closeModal} />
      )}
    </AuthProvider> // Closing tag
  );
}

export default App;
