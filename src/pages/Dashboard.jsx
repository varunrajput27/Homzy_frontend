import React, { useState, useEffect, useMemo } from 'react';
import PropertyCard from '../components/Propertycard';
import { User, Home, Receipt, Trash2, X, Loader2, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import EditProfileModel from '../components/EditProfileModel';
import { toast, Toaster } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getListingStyle = (type = "") => {
    const normalized = type.trim().toLowerCase();
    switch (normalized) {
        case 'for rent':
            return 'bg-blue-500 text-white';
        case 'rent out':
            return 'bg-red-700 text-white';
        case 'for sale':
            return 'bg-green-500 text-white';
        case 'sold out':
            return 'bg-red-700 text-white';
        default:
            return 'bg-gray-500 text-white';
    }
};


// Utility function to get style for booking status
const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
        case 'approved':
        case 'success':
            return 'bg-green-100 text-green-800 border border-green-300';
        case 'rejected':
        case 'cancelled':
            return 'bg-red-100 text-red-800 border border-red-300';
        default:
            return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
};

const interleaveProperties = (rents, sales) => {
  const combined = [];
  const rentProps = [...rents];
  const saleProps = [...sales];
  let i = 0;

  while (rentProps.length > 0 || saleProps.length > 0) {
    if (i % 2 === 0 && rentProps.length > 0) {
      combined.push(rentProps.shift());
    } else if (saleProps.length > 0) {
      combined.push(saleProps.shift());
    } else if (rentProps.length > 0) {
      combined.push(rentProps.shift());
    }
    i++;
  }

  // ✅ Normalize listing type properly
  return combined.map(p => {
    const raw = (p.listingType || "").toString().trim().toLowerCase();

    let normalized = "For Rent";

    if (raw.includes("rent out") || raw.includes("closed rent") || p.isClosed)
      normalized = "Rent Out";
    else if (raw.includes("for rent"))
      normalized = "For Rent";
    else if (raw.includes("sold out") || raw.includes("sold") || raw.includes("closed sale"))
      normalized = "Sold Out";
    else if (raw.includes("for sale"))
      normalized = "For Sale";

    return { ...p, listingType: normalized };
  });
};



// DeleteConfirmationModal (Same as before)
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm mx-4 rounded-xl shadow-lg p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                    disabled={isDeleting}
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center">
                    <Trash2 className="w-10 h-10 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Are you absolutely sure?
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                        This action <strong>cannot be undone</strong>. Your profile, listings, and bookings will be permanently deleted.
                    </p>

                    <div className="flex justify-around space-x-4">
                        <button
                            onClick={onClose}
                            className="w-full py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="w-full py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition flex justify-center items-center cursor-pointer"
                            disabled={isDeleting}
                        >
                            {isDeleting && <Loader2 className="animate-spin w-5 h-5 mr-2" />}
                            Yes, Delete My Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// DashboardHeader (Same as before)
const DashboardHeader = ({ onEditClick, onDeleteClick }) => {
    const { user } = useAuth();
    return (
        <header className="relative bg-gray-800 text-white p-4 sm:p-6 shadow-md">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start space-x-3 relative w-full sm:w-auto">
                    <div className="bg-indigo-500 p-2 rounded-full mt-1">
                        <User className="w-6 h-6" />
                    </div>
                        <div>
                        <h1 className="text-lg sm:text-xl font-bold">
                            Hello, {user?.fullname || "User"}
                        </h1>
                        <p className="text-sm text-gray-400">{user?.email || "example@email.com"}</p>
                        <button
                            onClick={onEditClick}
                            className="flex items-center bg-yellow-400 text-gray-900 font-semibold py-1.5 px-3 mt-3 rounded-lg hover:bg-yellow-500 transition text-xs sm:text-sm cursor-pointer"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                        </button>
                    </div>
                </div>

                <button
                    onClick={onDeleteClick}
                    className="absolute cursor-pointer top-8 right-3 p-2 rounded-lg text-white hover:text-red-500 transition"
                    title="Delete Account"
                >
                    <Trash2 className="w-6 h-6" />
                </button>
            </div>
        </header>
    );
};

// BookingItem (Same as before)
const BookingItem = ({ booking }) => {
    // Access nested details safely (This structure works because the backend is now fixed)
    const property = booking.propertyDetails || {};
    const basicDetails = property.basicDetails || {};
    const location = property.location || {};
    
    // Property Title and Location
    const title = basicDetails.title || `Property ID: ${booking.propertyId || booking._id}`;
    const fullAddress = location.fullAddress || "Unknown";
    const city = location.city || "Unknown";
    
    // Application Date
    const appliedAt = new Date(booking.createdAt || Date.now());
    const appliedDate = appliedAt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    
    // Listing Type and Status
    const listingType = property.listingType || 'N/A';
    const listingTypeStyle = getListingStyle(listingType); 
    const status = booking.status || 'N/A';
    const statusStyle = getStatusStyle(status);

    return (
        <div className="bg-white rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm hover:shadow-md transition mb-4 border border-gray-200">
            <div className="flex flex-col gap-2 w-full sm:w-auto">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
                <div className="flex items-center text-sm text-gray-700 gap-1 flex-wrap">
                    <FaMapMarkerAlt className="text-gray-500" />
                    <span>{fullAddress}, {city}</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-700 flex-wrap mt-2">
                    {/* Booking Application Date (Only this remains) */}
                    <div className="flex items-center gap-1">
                        <FaCalendarAlt className="text-gray-500" />
                        <span>**Applied On**: {appliedDate}</span>
                    </div>
                </div>
            </div>
            
            <div className="mt-3 sm:mt-0 flex flex-col items-start sm:items-end gap-2">
                {/* Booking Status */}
                <span className={`text-sm px-3 py-1 rounded-full font-bold ${statusStyle} uppercase`}>
                    {status}
                </span>
                {/* Property Listing Type (Context) */}
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${listingTypeStyle}`}>
                    ({listingType})
                </span>
            </div>
        </div>
    );
};

// ---------------- DashboardPage ----------------
const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState('myListings');
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // State holds ALL properties fetched for Rent and Sale
    const [allRentProperties, setAllRentProperties] = useState([]);
    const [allSaleProperties, setAllSaleProperties] = useState([]);
    const [myBookings, setMyBookings] = useState([]);

    const [isRentLoading, setIsRentLoading] = useState(true);
    const [isSaleLoading, setIsSaleLoading] = useState(true);
    const [isBookingLoading, setIsBookingLoading] = useState(true);

    const [rentError, setRentError] = useState(null);
    const [saleError, setSaleError] = useState(null);
    const [bookingError, setBookingError] = useState(null);

    const { user, isLoadingAuth, logout } = useAuth();
    const authToken = localStorage.getItem('token');

    // Utility function to filter properties based on listingType
    const filterProperties = (properties, allowedTypes) => {
        return properties.filter(p => allowedTypes.includes(p.listingType));
    };


    // ✅ Fetch Rent & Sale Properties (SAME AS BEFORE)
    useEffect(() => {
        const fetchData = async () => {
            if (!authToken) return;
            
            setIsRentLoading(true);
            setIsSaleLoading(true);
            setRentError(null);
            setSaleError(null);

            try {
                const [rentRes, saleRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/rent/getuserrent`, {
                        headers: { Authorization: `Bearer ${authToken}` },
                    }),
                    axios.get(`${API_BASE_URL}/api/sale/getusersale`, {
                        headers: { Authorization: `Bearer ${authToken}` },
                    }),
                ]);
                
                const rentProps = (rentRes.data.properties || []).map(p => {
    const isClosed = p.isClosed === true || p.is_closed === true;
    const type = (p.listingType || "").toLowerCase();

    let listingType = 'For Rent';
    if (isClosed || type.includes('rent out')) listingType = 'Rent Out';
    else if (type.includes('for rent')) listingType = 'For Rent';

    return { ...p, listingType };
});

const saleProps = (saleRes.data.properties || []).map(p => {
    const isClosed = p.isClosed === true || p.is_closed === true;
    const type = (p.listingType || "").toLowerCase();

    let listingType = 'For Sale';
    if (isClosed || type.includes('sold') || type.includes('sold out')) listingType = 'Sold Out';
    else if (type.includes('for sale')) listingType = 'For Sale';

    return { ...p, listingType };
});


                setAllRentProperties(rentProps);
                setAllSaleProperties(saleProps);
            } catch (err) {
                console.error("API Fetch Error:", err);
                setRentError("Failed to fetch rent properties.");
                setSaleError("Failed to fetch sale properties.");
            } finally {
                setIsRentLoading(false);
                setIsSaleLoading(false);
            }
        };
        fetchData();
    }, [authToken]);





    // ✅ Fetch Bookings (SIMPLIFIED: Assumes backend sends propertyDetails now)
    useEffect(() => {
        const fetchBookings = async () => {
            if (!authToken) return;
            
            setIsBookingLoading(true);
            setBookingError(null);

            try {
                // Fetch User's booking history from the single API endpoint
                const bookRes = await axios.get(`${API_BASE_URL}/api/user/booking`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                
                // The backend is now expected to send an array of bookings 
                // WITH 'propertyDetails' embedded in each item.
                const bookingsArray = bookRes.data.bookings || [];
                
                // Sort by creation date (newest first)
                const sortedBookings = bookingsArray
                    .sort((a, b) => new Date(b.createdAt?.$date || b.createdAt) - new Date(a.createdAt?.$date || a.createdAt));

                setMyBookings(sortedBookings);

            } catch (err) {
                console.error("Booking Fetch Error:", err);
                // The error message is updated for the single API failure
                setBookingError("Failed to fetch booking applications. Check if the backend API is populating property details.");
            } finally {
                setIsBookingLoading(false);
            }
        };
        fetchBookings();
    }, [authToken]);


    // ✅ Delete Account 
    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        const userId = user?._id?.$oid || user?._id;
        try {
            await axios.delete(`${API_BASE_URL}/api/user/delete/${userId}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            toast.success("Account deleted successfully 👋");
            setTimeout(() => logout(), 1500);
        } catch (err) {
            toast.error("Failed to delete account");
        } finally {
            setIsDeleting(false);
            setIsDeleteConfirmOpen(false);
        }
    };


    // --- 🚀 Memoized Lists for Performance and Stability --- (SAME AS BEFORE)
    const myActiveListings = useMemo(() => {
        const activeRents = filterProperties(allRentProperties, ['For Rent']);
        const activeSales = filterProperties(allSaleProperties, ['For Sale']);
        return interleaveProperties(activeRents, activeSales);
    }, [allRentProperties, allSaleProperties]);

    const myClosedServices = useMemo(() => {
        const closedRents = filterProperties(allRentProperties, ['Rent Out']);
        const closedSales = filterProperties(allSaleProperties, ['Sold Out']); 
        return interleaveProperties(closedRents, closedSales);
    }, [allRentProperties, allSaleProperties]);


    // ✅ Pagination setup for My Listings (SAME AS BEFORE)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(myActiveListings.length / itemsPerPage);

    const paginatedActive = myActiveListings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);


    // ✅ Render Listing (SAME AS BEFORE)
    const renderList = (props, loading, error, label, isPaginated = false) => {
        if (loading) return <div className="text-center py-12 text-lg font-medium"><Loader2 className="animate-spin inline mr-2 text-indigo-600 w-6 h-6" />Loading {label}...</div>;
        if (error) return <div className="text-center py-12 text-red-500 font-medium text-lg">{error}</div>;
        if (!props.length) return <div className="text-center py-12 text-gray-500 text-lg font-medium">No {label} found.</div>;

        return (
            <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {props.map(p => <PropertyCard key={p._id} property={p} />)}
                </div>
                {isPaginated && totalPages > 1 && (
                    <div className="flex justify-center mt-6 mb-12 space-x-2"> 
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className={`px-4 py-2 rounded-lg cursor-pointer font-semibold transition ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-gray-700 font-medium border rounded-lg bg-white">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className={`px-4 py-2 rounded-lg cursor-pointer font-semibold transition ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </>
        );
    };

    if (isLoadingAuth) return <div className="text-center py-12">Loading user info...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster />
            <DashboardHeader
                onEditClick={() => setIsEditOpen(true)}
                onDeleteClick={() => setIsDeleteConfirmOpen(true)}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 pb-20">
                {/* Tabs */}
                <div className="flex border-b border-gray-300 mb-6 overflow-x-auto whitespace-nowrap">
                    <button
                        onClick={() => setActiveTab('myListings')}
                        className={`py-3 px-4 sm:px-6 cursor-pointer font-semibold ${activeTab === 'myListings' ? 'border-b-4 border-indigo-600 text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                    >
                        <Home className="w-4 h-4 inline mr-2" /> **My Listings**
                    </button>
                    <button
                        onClick={() => setActiveTab('closedListings')}
                        className={`py-3 px-4 sm:px-6 cursor-pointer font-semibold ${activeTab === 'closedListings' ? 'border-b-4 border-indigo-600 text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                    >
                        <Home className="w-4 h-4 inline mr-2" /> **My Services**
                    </button>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`py-3 px-4 sm:px-6 cursor-pointer font-semibold ${activeTab === 'bookings' ? 'border-b-4 border-indigo-600 text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                    >
                        <Receipt className="w-4 h-4 inline mr-2" /> **Booking Applications**
                    </button>
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === 'myListings' &&
                        renderList(paginatedActive, isRentLoading || isSaleLoading, rentError || saleError, "Active Listings (For Rent/For Sale)", true)}
                    
                    {activeTab === 'closedListings' &&
                        renderList(myClosedServices, isRentLoading || isSaleLoading, rentError || saleError, "Closed Services (Rent Out/Sold Out)")}
                    
                    {activeTab === 'bookings' &&
                        (isBookingLoading ? (
                            <div className="text-center py-12 text-lg font-medium">
                                <Loader2 className="animate-spin inline mr-2 text-indigo-600 w-6 h-6" />Loading applications...
                            </div>
                        ) : bookingError ? (
                            <div className="text-center py-12 text-red-500 font-medium text-lg">{bookingError}</div>
                        ) : myBookings.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 text-lg font-medium">No booking applications found.</div>
                        ) : (
                            <div className="space-y-4">
                                {myBookings.map(b => <BookingItem key={b._id} booking={b} />)}
                            </div>
                        ))}
                </div>
            </div>

            {isEditOpen && <EditProfileModel isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />}
            <DeleteConfirmationModal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={handleDeleteAccount}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default DashboardPage;