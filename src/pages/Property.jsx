import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from "react-hot-toast";
import {
    Bed, Bath, Car, Ruler, Phone, Mail, MapPin,
    Shield, Home, Wrench, Building, Compass, Clock, CheckCircle, Sofa, Calendar, Video, BookOpen, Heart, Coffee, Plane,
    HardHat
} from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Helper Functions  ---
const formatPrice = (value) => {
    if (!value) return "N/A";
    const numValue = Number(value);
    if (numValue >= 10000000) {
        return `₹${(numValue / 10000000).toFixed(2)} Cr`;
    } else if (numValue >= 100000) {
        return `₹${(numValue / 100000).toFixed(2)} Lakh`;
    } else {
        return `₹${numValue.toLocaleString('en-IN')}`;
    }
};

const fetchPropertyDetails = async (id, endpoint) => {
    const apiUrl = `${BASE_URL}/api/${endpoint}/${id}`;
    const token = localStorage.getItem('token');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await axios.get(apiUrl, config);
    return response.data.property || response.data;
};

const fetchActualRelatedListings = async (listingType, currentPropertyId) => {
    if (!listingType) return [];
    const endpoint = listingType.toLowerCase().includes('rent') ? 'api/rent/all' : 'api/sale/all';
    const cacheBuster = `?t=${Date.now()}`;
    const apiUrl = `${BASE_URL}/${endpoint}${cacheBuster}`;

    try {
        const response = await axios.get(apiUrl);
        const fetchedProperties = response.data?.properties || [];
        return Array.isArray(fetchedProperties)
            ? fetchedProperties.filter(property => property._id !== currentPropertyId)
            : [];
    } catch (error) {
        console.error(`Failed to fetch related listings for type '${listingType}':`, error);
        toast.warn(`Could not load related ${listingType} listings.`);
        return [];
    }
};

const getBedroomCount = (bhkType) => {
    if (typeof bhkType === 'string') {
        const match = bhkType.match(/(\d+)/);
        return match ? match[1] : 'N/A';
    }
    return 'N/A';
};

// --- UI Components (Responsive Changes applied here) ---
const KeyDetail = ({ icon: Icon, label, value }) => (
    <div className="flex items-center space-x-2 rounded-lg bg-slate-100 p-2 shadow-sm">
        <Icon className="h-5 w-5 text-indigo-500 flex-shrink-0" />
        <div>
            <p className="text-xs text-slate-500">{label}</p>
            <p className="font-bold text-sm text-slate-800">{value || 'N/A'}</p>
        </div>
    </div>
);

const RelatedListingCard = ({ property }) => {
    const isRent = property.listingType?.toLowerCase().includes('rent');
    const price = isRent ? property.basicDetails?.monthlyRent : property.basicDetails?.price;
    const imageUrl = property.images?.[0]?.url;

    return (
        <Link
            to={`/property/${property._id}`}
            state={{ listingType: property.listingType }}
            onClick={() => window.scrollTo(0, 0)}
            className="w-[90vw] xs:w-[80vw] sm:w-80 flex-shrink-0 rounded-xl overflow-hidden shadow-md bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 mx-2 snap-center"
        >
            <div className="relative h-36 sm:h-44"> 
                <img src={imageUrl || '/placeholder.jpg'} alt={property.basicDetails?.title} className="w-full h-full object-cover" />
                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold text-white ${isRent ? 'bg-red-600' : 'bg-blue-600'}`}>
                    {property.listingType}
                </span>
            </div>
            <div className="p-3"> 
                <h3 className="font-semibold text-base text-slate-800 truncate">{property.basicDetails?.title}</h3> {/* Smaller text */}
                <p className="text-xl font-bold text-indigo-600 my-1"> {/* Reduced margin/text size */}
                    {formatPrice(price)}
                    {isRent && <span className="text-sm font-medium text-slate-500">/month</span>}
                </p>
                <div className="flex justify-between text-slate-600 text-xs mt-2 border-t pt-2"> {/* Smaller text, padding, and margin */}
                    <span className="flex items-center"><Bed size={14} className="mr-1 text-indigo-500" />{getBedroomCount(property.basicDetails?.bhkType)} Beds</span>
                    <span className="flex items-center"><Bath size={14} className="mr-1 text-indigo-500" />{property.basicDetails?.bathrooms || 'N/A'} Baths</span>
                    <span className="flex items-center"><Ruler size={14} className="mr-1 text-indigo-500" />{property.basicDetails?.Area} sqft</span>
                </div>
            </div>
        </Link>
    );
};


// --- MAIN COMPONENT ---
const Property = () => {

     const COMPANY_PHONE = import.meta.env.VITE_COMPANY_PHONE_NUMBER;
    const COMPANY_EMAIL = import.meta.env.VITE_COMPANY_EMAIL;
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const carouselRef = useRef(null);
    const intervalRef = useRef(null);
    
    const isUserLoggedIn = localStorage.getItem('token'); 
    const [propertyDetails, setPropertyDetails] = useState(null);
    const [relatedListings, setRelatedListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeImage, setActiveImage] = useState('');
    const [booking, setBooking] = useState(false);

    const typeFromState = location.state?.listingType;

    // --- 1. Login Redirection Logic for Page Access ---
    useEffect(() => {
        if (!isUserLoggedIn) {
            toast.error("Please log in to view property details.");
            navigate('/login'); 
            return;
        }

        // Data loading logic (Only runs if user is logged in)
        const loadData = async () => {
            if (!id) {
                toast.error("Invalid property URL.");
                navigate('/');
                return;
            }
            setIsLoading(true);
            try {
                let details = null;
                const endpointsToTry = typeFromState
                    ? [typeFromState.toLowerCase().includes('rent') ? 'rent' : 'sale']
                    : ['rent', 'sale'];

                for (const endpoint of endpointsToTry) {
                    try {
                        details = await fetchPropertyDetails(id, endpoint);
                        if (details) break;
                    } catch (error) {
                        if (axios.isAxiosError(error) && error.response?.status === 404) continue;
                        throw error;
                    }
                }

                if (!details) throw new Error("Property not found.");

                setPropertyDetails(details);
                setActiveImage(details.images?.[0]?.url || '');

                // Fetch and filter related properties (Logic unchanged)
                const allRelated = await fetchActualRelatedListings(details.listingType, details._id);
                const currentListingType = details.listingType
                    ? details.listingType.toLowerCase().includes('rent') ? 'rent' : 'sale'
                    : '';
                const finalRelatedListings = allRelated.filter(p => {
                    if (!p.listingType) return false;
                    const relatedType = p.listingType.toLowerCase().includes('rent') ? 'rent' : 'sale';
                    return relatedType === currentListingType;
                });
                setRelatedListings(finalRelatedListings);

            } catch (error) {
                console.error("Data Load Error:", error);
                toast.error(error.message || "Failed to load property details.");
            } finally {
                setIsLoading(false);
            }
        };

        if (isUserLoggedIn) {
            loadData();
        }
        window.scrollTo(0, 0);

    }, [id, navigate, typeFromState, isUserLoggedIn]);

    // Carousel auto-scroll logic (Adjusted for dynamic card width on mobile)
    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        if (relatedListings.length > 3 && carouselRef.current) {
            const getCardScrollWidth = () => window.innerWidth < 640 ? window.innerWidth * 0.9 + 4 : 336;
            
            intervalRef.current = setInterval(() => {
                if (carouselRef.current) {
                    const cardWidth = getCardScrollWidth();
                    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
                    let newScroll = scrollLeft + cardWidth;

                    if (newScroll >= scrollWidth - clientWidth + cardWidth / 2) {
                        newScroll = 0;
                    }
                    carouselRef.current.scrollTo({ left: newScroll, behavior: 'smooth' });
                }
            }, 4000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [relatedListings]);

    // --- 2. Login Check in handleBookVisit ---
    const handleBookVisit = async () => {
        if (booking) return;
        setBooking(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Please login to book a site visit.");
                navigate('/login');
                setBooking(false);
                return;
            }
            
            // Logged-in user continues with booking
            const response = await axios.post(
                `${BASE_URL}/api/user/bookvisit/${propertyDetails._id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                toast.success("Site visit booked successfully! Check your email.");
            } else {
                toast.error(response.data.message || "Booking failed. Please try again.");
            }
        } catch (error) {
            console.error("Book Visit Error:", error);
            toast.error(error.response?.data?.message || "Something went wrong while booking.");
        } finally {
            setBooking(false);
        }
    };


    // --- Render Logic ---
    if (!isUserLoggedIn) {
        return <div className="min-h-screen flex items-center justify-center text-indigo-600 text-xl">Redirecting to Sign In...</div>;
    }

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-indigo-600 text-xl">Loading Property Details...</div>;
    }

    if (!propertyDetails) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
                <Home size={40} className="mb-4 text-red-500" />
                <h2 className="text-2xl font-bold text-red-600">Property Not Found</h2>
                <p className="text-slate-600 mt-2">The property you are looking for does not exist or has been removed.</p>
                <Link to="/" className="mt-6 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition">Go to Homepage</Link>
            </div>
        );
    }

    const {
        listingType, description, location: propLocation, images = [],
        contactInfo, basicDetails = {}, video, whatsNearby = {}
    } = propertyDetails;

    const isRental = listingType?.toLowerCase().includes("rent");
    const carouselTitle = isRental ? "Similar Rental Properties" : "Similar Properties for Sale";

    // Dynamic Key Details Filtering Logic (Unchanged)
    const allKeyDetails = [
        { key: 'propertyType', icon: Building, label: "Property Type", value: propertyDetails.propertyType },
        { key: 'bhkType', icon: Home, label: "BHK Type", value: basicDetails.bhkType },
        { key: 'Area', icon: Ruler, label: "Total Area", value: basicDetails.Area, suffix: " sqft" },
        { key: 'bathrooms', icon: Bath, label: "Bathrooms", value: basicDetails.bathrooms },
        { key: 'furnishingStatus', icon: Sofa, label: "Furnishing", value: basicDetails.furnishingStatus },
        { key: 'propertyFacing', icon: Compass, label: "Facing", value: basicDetails.propertyFacing },
        { key: 'propertyAge', icon: Calendar, label: "Property Age", value: basicDetails.propertyAge },
        { key: 'garages', icon: Car, label: "Parking", value: basicDetails.garages },
        { key: 'floor', icon: HardHat, label: "Floor", value: basicDetails.floor },
        { key: 'securityDeposit', icon: Shield, label: "Security Deposit", value: formatPrice(basicDetails.securityDeposit), isRentalOnly: true },
        { key: 'maintenanceCharges', icon: Wrench, label: "Maintenance", value: basicDetails.maintenanceCharges, isRentalOnly: true, suffix: "/mo" },
        { key: 'propertyStatus', icon: CheckCircle, label: "Status", value: basicDetails.propertyStatus, isSaleOnly: true },
    ];

    const keyDetailsData = allKeyDetails
        .filter(detail => {
            const isValuePresent = detail.value !== null && detail.value !== undefined && String(detail.value).trim() !== '' && String(detail.value).trim().toLowerCase() !== 'n/a';
            if (!isValuePresent) return false;
            if (detail.isSaleOnly && isRental) return false;
            if (detail.isRentalOnly && !isRental) return false;
            return true;
        })
        .map(detail => ({
            ...detail,
            value: (detail.key === 'Area' || detail.key === 'maintenanceCharges' || detail.key === 'garages' || detail.key === 'bathrooms') && detail.suffix
                ? `${detail.value}${detail.suffix}`
                : detail.value
        }));

    const nearbyIcons = {
        education: BookOpen,
        health: Heart,
        food: Coffee,
        travel: Plane,
    };

    return (
        // Reduced vertical padding on mobile
        <div className="min-h-screen bg-slate-50 py-6 md:py-12"> 
            <Toaster position="top-right" reverseOrder={false} />
            <div className="max-w-7xl mx-auto px-4">
                
                {/* --- MAIN GRID: Mobile Stacked, LG 2-Col/1-Col Sidebar --- */}
                <div className="lg:grid lg:grid-cols-3 lg:gap-8">

                    {/* Left Column: Images, Location & Details (lg: 2/3 width) */}
                    <div className="lg:col-span-2 space-y-6 lg:space-y-8"> {/* Reduced spacing on mobile */}
                        
                        {/* Image Gallery */}
                        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg"> {/* Reduced padding */}
                            {/* Main Image: Reduced height on mobile */}
                            <div className="relative w-full h-72 sm:h-96 md:h-[450px] bg-slate-200 rounded-lg overflow-hidden mb-3 shadow-inner">
                                <img src={activeImage || '/placeholder.jpg'} alt={basicDetails.title} className="w-full h-full object-cover" />
                            </div>
                            {images.length > 1 && (
                                <div className="flex space-x-2 overflow-x-auto pb-2">
                                    {images.map((img, i) => (
                                        <div
                                            key={img._id?.$oid || i}
                                            // Reduced thumbnail size on mobile
                                            className={`flex-shrink-0 bg-slate-200 h-16 w-20 sm:h-20 sm:w-24 rounded-md cursor-pointer overflow-hidden ring-2 ${activeImage === img.url ? 'ring-indigo-500' : 'ring-transparent'} hover:ring-indigo-400`}
                                            onClick={() => setActiveImage(img.url)}
                                        >
                                            <img src={img.url} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* DYNAMIC KEY DETAILS SECTION (Responsive: 2-col on mobile, 3-col on tablet/desktop) */}
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg"> 
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 border-b pb-2">Key Details</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3"> 
                                {keyDetailsData.length > 0 ? (
                                    keyDetailsData.map((detail, index) => (
                                        <KeyDetail
                                            key={index}
                                            icon={detail.icon}
                                            label={detail.label}
                                            value={detail.value}
                                        />
                                    ))
                                ) : (
                                    <p className="col-span-full text-center text-slate-500">No key details available.</p>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg"> {/* Reduced padding */}
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 border-b pb-2">Description</h2> {/* Smaller heading */}
                            <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">{description || "No description provided."}</p> {/* Smaller body text */}
                        </div>

                        {/* Location Details Section (Responsive: 2-col on mobile) */}
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg"> {/* Reduced padding */}
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 border-b pb-2 flex items-center"> 
                                <MapPin className="h-5 w-5 text-indigo-500 mr-2" /> Property Location
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                                <p><span className="font-semibold text-indigo-600">State:</span> {propLocation?.state || 'N/A'}</p>
                                <p><span className="font-semibold text-indigo-600">City:</span> {propLocation?.city || 'N/A'}</p>
                                <p><span className="font-semibold text-indigo-600">Pincode:</span> {propLocation?.pincode || 'N/A'}</p>
                                <p className="col-span-1 sm:col-span-2"><span className="font-semibold text-indigo-600">Full Address:</span> {propLocation?.fullAddress || 'N/A'}</p>
                            </div>
                        </div>

                        {/* What's Nearby Section (Responsive: 1-col on mobile, 2-col on tablet/desktop) */}
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg"> {/* Reduced padding */}
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 border-b pb-2">What's Nearby</h2> {/* Smaller heading */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Reduced gap */}
                                {Object.entries(whatsNearby).map(([category, items]) => {
                                    const Icon = nearbyIcons[category.toLowerCase()] || CheckCircle;
                                    return (
                                        <div key={category} className="border-l-4 border-indigo-500 pl-3"> {/* Reduced padding */}
                                            <h3 className="font-semibold text-base capitalize mb-1 flex items-center text-slate-800"> {/* Smaller text */}
                                                <Icon size={18} className="text-indigo-500 mr-2" />
                                                {category}
                                            </h3>
                                            {items && items.length > 0 ? (
                                                <ul className="space-y-0.5 text-slate-600 text-xs"> {/* Smaller text and space */}
                                                    {items.map((item, index) => (
                                                        <li key={index} className="flex justify-between">
                                                            <span>{item.name}</span>
                                                            <span className="font-medium text-slate-500">{item.distance}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-xs text-slate-500">No {category} spots listed.</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg"> {/* Reduced padding */}
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 border-b pb-2">Amenities</h2> {/* Smaller heading */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-slate-700"> {/* Reduced gap and text size */}
                                {basicDetails.amenities?.length > 0 ? basicDetails.amenities.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" /> {/* Smaller icon */}
                                        <span>{item}</span>
                                    </div>
                                )) : <p className="col-span-full text-center text-slate-500">No amenities listed.</p>}
                            </div>
                        </div>

                        {/* Video Section */}
                        {video && (
                            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg"> {/* Reduced padding */}
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 border-b pb-2 flex items-center"> {/* Smaller heading */}
                                    <Video className="h-5 w-5 text-red-500 mr-2" /> Property Video Tour
                                </h2 >
                                <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden bg-slate-200">
                                    <video
                                        controls
                                        src={video}
                                        className="absolute top-0 left-0 w-full h-full object-cover"
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div >
                            </div >
                        )}
                    </div>

                    {/* Right Sticky Column: Price & Contact (lg: 1/3 width, sticky on large screens) */}
                    <div className="lg:col-span-1 mt-6 lg:mt-0"> {/* Reduced top margin on mobile */}
                        <div className="lg:sticky lg:top-8 space-y-6 lg:space-y-8"> {/* Reduced spacing on mobile */}
                            
                            {/* Price Card */}
                            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-xl border border-slate-200"> {/* Reduced padding */}
                              {listingType && (
  <span
    className={`
      inline-block px-3 py-1 rounded-full 
      text-sm font-semibold uppercase tracking-wide 
      text-white shadow-md 
      mb-2 transition-all duration-300 
      ${isRental ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}
    `}
  >
    {listingType}
  </span>
)}

                                <h1 className="text-lg font-bold text-slate-900 sm:text-xl">{basicDetails.title}</h1> {/* Smaller text */}
                                <p className="text-slate-500 mt-1 flex items-center text-xs sm:text-sm"> {/* Smaller text */}
                                    <MapPin size={12} className="inline mr-1.5" />{propLocation?.fullAddress} {/* Smaller icon */}
                                </p>

                                <div className="my-4 border-y py-3"> {/* Reduced margin/padding */}
                                    <p className="text-xs text-slate-500 mb-1">{isRental ? 'Monthly Rent' : 'Total Price'}</p> {/* Smaller text */}
                                    <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600"> {/* Smaller text */}
                                        {formatPrice(isRental ? basicDetails.monthlyRent : basicDetails.price)}
                                        {isRental && <span className="text-sm font-medium text-slate-500">/month</span>}
                                    </p>
                                </div>

                                {/* DYNAMIC RENT/SALE EXTRA DETAILS */}
                                {isRental ? (
                                    <div className="text-xs sm:text-sm space-y-1 text-slate-600"> {/* Smaller text and space */}
                                        {basicDetails.securityDeposit && (
                                            <div className="flex justify-between">
                                                <span><Shield className="inline mr-2 h-3 w-3 text-indigo-500" />Security Deposit</span>
                                                <span className="font-semibold">{formatPrice(basicDetails.securityDeposit)}</span>
                                            </div>
                                        )}
                                        {basicDetails.maintenanceCharges && (
                                            <div className="flex justify-between">
                                                <span><Wrench className="inline mr-2 h-3 w-3 text-indigo-500" />Maintenance</span>
                                                <span className="font-semibold">{formatPrice(basicDetails.maintenanceCharges)}/mo</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-xs sm:text-sm text-slate-600 space-y-1"> {/* Smaller text and space */}
                                        <p className="flex items-center"><CheckCircle size={12} className="inline mr-1.5 text-green-500" />Price negotiable.</p>
                                        <p className="flex items-center"><CheckCircle size={12} className="inline mr-1.5 text-green-500" />Stamp duty & registration extra.</p>
                                        {basicDetails.Area && (
                                            <p className="flex items-center text-red-500 font-semibold mt-2"><Ruler size={12} className="inline mr-1.5" />Built-up Area: {basicDetails.Area} sqft</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Contact Card */}
                            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-xl border border-slate-200 text-center"> {/* Reduced padding */}
                                <h3 className="text-lg font-bold text-slate-800">Homzy Agent</h3> {/* Smaller heading */}
                                <p className="text-slate-500 text-xs sm:text-sm mb-3">Contact our Agent directly</p> {/* Smaller text and margin */}
                                <div className="space-y-3">
                                    <a href={`tel:${COMPANY_PHONE}`} className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition-colors text-sm"> {/* Reduced padding and text size */}
                                        <Phone size={16} className="mr-2" /> Call Now
                                    </a>
                                    <a href={`https://wa.me/${COMPANY_PHONE}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-lg transition-colors text-sm"> {/* Reduced padding and text size */}
                                        <Mail size={16} className="mr-2" /> Message on WhatsApp
                                    </a>
                                    <button
                                        onClick={handleBookVisit}
                                        disabled={booking}
                                        className={`w-full flex items-center justify-center bg-red-500 text-white font-bold py-2.5 rounded-lg transition-all duration-200 text-sm
                                            ${booking ? "opacity-70 cursor-not-allowed" : "hover:bg-red-600 active:scale-95 cursor-pointer"}
                                        `}
                                    >
                                        {booking ? "Booking..." : "Book Visit Site"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Listings Carousel (Responsive: Uses full width scroll on mobile) */}
                <div className="mt-8 pt-6 border-t lg:mt-12 lg:pt-8"> {/* Reduced top margin/padding on mobile */}
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 text-center"> {/* Smaller heading */}
                        {carouselTitle}
                    </h2>
                    <div className="relative">
                        <div
                            ref={carouselRef}
                            // Increased horizontal padding, but negative margin used to span edge-to-edge
                            className="flex overflow-x-auto snap-x snap-mandatory py-2 -mx-2 hide-scrollbar" 
                            style={{ scrollBehavior: 'smooth' }}
                        >
                            {relatedListings.length > 0 ? (
                                relatedListings.map((property) => <RelatedListingCard key={property._id} property={property} />)
                            ) : <p className="w-full text-center text-slate-500 py-8">No similar properties found for this listing type.</p>}
                        </div>
                        <style jsx="true">{`
                            .hide-scrollbar::-webkit-scrollbar {
                                display: none;
                            }
                            .hide-scrollbar {
                                -ms-overflow-style: none; /* IE and Edge */
                                scrollbar-width: none; /* Firefox */
                            }
                        `}</style>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Property;