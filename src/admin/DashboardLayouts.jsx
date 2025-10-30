import { 
  Users, Home, DollarSign, LayoutGrid, CalendarCheck 
} from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Admin layout wrapper
const AdminLayout = ({ children, title }) => (
  <div className="bg-gray-100 p-4 sm:p-6 md:p-8 rounded-xl shadow-lg min-h-screen">
    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">{title}</h1>
    {children}
  </div>
);

// Loader component
const Loader = ({ classname }) => (
  <div
    className={`animate-spin rounded-full border-4 border-t-4 border-indigo-200 border-t-indigo-500 ${classname}`}
  ></div>
);

const DashboardLayouts = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dashboard stats
  const [totalUser, setTotalUser] = useState(0);
  const [totalRentProperties, setTotalRentProperties] = useState(0);
  const [totalRentOut, setTotalRentOut] = useState(0);
  const [totalSoldOut, setTotalSoldOut] = useState(0);
  const [totalSaleProperties, setTotalSaleProperties] = useState(0);
  const [totalBookingRequests, setTotalBookingRequests] = useState(0);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [usersRes, rentRes, saleRes, bookingRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/user/totalusers`),
          axios.get(`${BASE_URL}/api/rent/all`),
          axios.get(`${BASE_URL}/api/sale/all`),
          axios.get(`${BASE_URL}/api/user/totalbooking`),
        ]);

        // Total users
        setTotalUser(Number(usersRes.data?.totalUsers || 0));

        // Rent properties
        const rentProps = rentRes.data?.properties || [];
        setTotalRentProperties(rentProps.filter(p => p.listingType === "For Rent").length);
        setTotalRentOut(rentProps.filter(p => p.listingType === "Rent Out").length);

        // Sale properties
        const saleProps = saleRes.data?.properties || [];
        setTotalSaleProperties(saleProps.filter(p => p.listingType === "For Sale").length);
        setTotalSoldOut(saleProps.filter(p => p.listingType === "Sold Out").length);

        // Total booking requests
        setTotalBookingRequests(Number(bookingRes.data?.totalBookings || 0));

        setError(null);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        setError("Failed to fetch dashboard data. Please check your API or server.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const safeNum = (n) => (isNaN(Number(n)) ? 0 : Number(n));

  // Total Overview
  const totalOverview =
    safeNum(totalUser) +
    safeNum(totalRentProperties) +
    safeNum(totalRentOut) +
    safeNum(totalSoldOut) +
    safeNum(totalSaleProperties) +
    safeNum(totalBookingRequests);

  // Dashboard Cards
  const dashboardCards = [
    { title: "Total Users", count: totalUser, icon: <Users className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-white" />, color: "bg-gradient-to-r from-indigo-500 to-purple-500" },
    { title: "Rent Properties", count: totalRentProperties, icon: <Home className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-white" />, color: "bg-gradient-to-r from-yellow-400 to-yellow-600" },
    { title: "Rent Out Properties", count: totalRentOut, icon: <Home className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-white" />, color: "bg-gradient-to-r from-green-500 to-emerald-600" },
    { title: "Sold Out Properties", count: totalSoldOut, icon: <DollarSign className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-white" />, color: "bg-gradient-to-r from-pink-500 to-red-500" },
    { title: "Sale Properties", count: totalSaleProperties, icon: <DollarSign className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-white" />, color: "bg-gradient-to-r from-teal-500 to-cyan-600" },
    { title: "Book Visit Requests", count: totalBookingRequests, icon: <CalendarCheck className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-white" />, color: "bg-gradient-to-r from-gray-500 to-gray-600" },
  ];

  return (
    <AdminLayout title="Admin Dashboard">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader classname="w-12 h-12" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-lg text-center font-semibold p-6 sm:p-8 bg-red-50 rounded-lg border border-red-200">
          {error}
        </div>
      ) : (
        <>
          {/* Total Overview */}
          <div className="mb-6 rounded-2xl shadow-2xl bg-gradient-to-r from-cyan-500 to-blue-600 p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            <div className="text-white text-center sm:text-left">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold opacity-80">
                Total Overview
              </h2>
              <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold animate-pulse">
                {safeNum(totalOverview)}
              </p>
            </div>
            <div className="bg-white/20 rounded-full p-4 sm:p-5 flex items-center justify-center">
              <LayoutGrid className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-white" />
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {dashboardCards.map((item, idx) => (
              <div key={idx} className={`rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 flex items-center justify-between hover:scale-[1.03] transition-transform duration-300 ${item.color}`}>
                <div className="text-white">
                  <h2 className="text-sm sm:text-base md:text-lg font-medium opacity-80">{item.title}</h2>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold">{safeNum(item.count)}</p>
                </div>
                <div className="bg-white/20 rounded-full p-2 sm:p-3 md:p-4 flex items-center justify-center">
                  {item.icon}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default DashboardLayouts;


