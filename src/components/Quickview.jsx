import React from "react";
import { useNavigate } from "react-router-dom";
import { Bed, Bath, Car, Ruler, Phone, Mail } from "lucide-react"; 

const QuickView = ({ property, onClose }) => {
   const COMPANY_PHONE = import.meta.env.VITE_COMPANY_PHONE_NUMBER;
   const COMPANY_EMAIL = import.meta.env.VITE_COMPANY_EMAIL;
   const navigate = useNavigate();
   if (!property) return null;

   const id = property._id?.$oid || property._id;

   const {
     images,
     listingType = "For Rent",
     basicDetails = {},
     location = {},
     contactInfo = {},
     description,
   } = property;

   const title = basicDetails.title || "No Title";
   const price = basicDetails.price || basicDetails.monthlyRent || 0;
   const imageUrl = images?.[0]?.url || "https://via.placeholder.com/400x250";
   const fullAddress = location.fullAddress || location.city || "Unknown Location";

   const handleViewFullDetails = () => {
     if (!id) {
       alert("Sorry, property details are unavailable. Missing ID.");
       onClose();
       return;
     }
     onClose();
     navigate(`/property/${id}`, { state: { listingType } });
   };

   const formatPrice = (value) => {
     if (!value) return "0";
     if (value >= 10000000) return (value / 10000000).toFixed(2) + " Cr";
     if (value >= 100000) return (value / 100000).toFixed(2) + " Lakhs";
     return value.toLocaleString();
   };

   return (
     // FIX: items-end for mobile, but items-center for tablet/desktop (sm:items-center)
     <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
       <div
         className="
           bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl 
           
           /* Width/Height for better responsiveness */
           w-full sm:w-11/12 md:w-[70vw] lg:w-[60vw]
           h-[95vh] sm:h-auto sm:max-h-[85vh] 
           
           rounded-b-none sm:rounded-2xl
           overflow-y-auto transition-all duration-300
           animate-fadeIn
         "
       >
         {/* Header - Padding reduced */}
         <div className="sticky top-0 bg-white border-b flex justify-between items-center px-4 py-3 z-20">
           <h2 className="text-lg sm:text-xl font-bold text-gray-800">
             Quick View
           </h2>
           <button
             onClick={onClose}
             className="text-xl font-bold text-gray-600 hover:text-red-500 transition cursor-pointer"
             aria-label="Close"
           >
             ×
           </button>
         </div>

         {/* Body - Padding reduced */}
         <div className="flex flex-col md:flex-row gap-3 p-3 sm:p-4">
           {/* Image Section - Height reduced for compactness */}
           <div className="md:w-1/2 w-full">
             <div className="relative w-full h-48 sm:h-64 md:h-72 rounded-xl overflow-hidden shadow-md">
               <img
                 src={imageUrl}
                 alt="Property"
                 className="w-full h-full object-cover"
               />
               {/* Tag size slightly smaller */}
               <span
                 className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium text-white shadow-md ${
                   listingType.toLowerCase().includes("rent")
                     ? "bg-gradient-to-r from-green-500 to-green-600"
                     : "bg-gradient-to-r from-blue-500 to-blue-600"
                 }`}
               >
                 {listingType}
               </span>
             </div>
           </div>

           {/* Info Section - Spacing reduced */}
           <div className="md:w-1/2 w-full space-y-3">
             {/* Title size reduced */}
             <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
               {title}
             </h3>
             <p className="text-xs text-gray-600">{fullAddress}</p>

             {/* Price size reduced */}
             <p className="text-xl sm:text-2xl font-extrabold text-indigo-600 mt-1">
               ₹{formatPrice(price)}
               {listingType.toLowerCase().includes("rent") && (
                 <span className="text-xs font-normal text-gray-500"> / month</span>
               )}
             </p>

             {/* Features - Grid gap reduced */}
             <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
               <Feature icon={<Bed size={14} />} label={basicDetails.bhkType || "NA"} subLabel="Bedrooms" />
               <Feature icon={<Ruler size={14} />} label={basicDetails.Area || "NA"} subLabel="Area (sq.ft)" />
               <Feature icon={<Bath size={14} />} label={basicDetails.bathrooms || "NA"} subLabel="Bathrooms" />
               <Feature icon={<Car size={14} />} label={basicDetails.garages || "NA"} subLabel="Garage" />
             </div>

             {/* Description - Text size reduced */}
             <div>
               <strong className="text-gray-800 text-sm">
                 Description:
               </strong>
               <p className="text-gray-600 mt-0.5 text-xs leading-relaxed max-h-16 overflow-hidden">
                 {description || "No description provided."}
               </p>
             </div>

             {/* Contact Buttons - Text size and padding reduced */}
             <div className="flex flex-wrap gap-2 pt-2">
               <a
                 href={`tel:${COMPANY_PHONE}`}
                 className="flex-1 bg-yellow-400 text-black font-medium px-3 py-1.5 rounded-lg hover:bg-yellow-500 flex items-center justify-center gap-1 text-xs"
               >
                 <Phone size={14} /> Call Now
               </a>
               <a
                 href={`mailto:${COMPANY_EMAIL}`}
                 className="flex-1 border border-gray-300 px-3 py-1.5 rounded-lg font-medium flex items-center justify-center gap-1 hover:bg-gray-100 text-xs"
               >
                 <Mail size={14} /> Mail
               </a>
             </div>
           </div>
         </div>

         {/* Footer - Padding and text size reduced */}
         <div className="text-center px-4 py-3 border-t bg-white sticky bottom-0">
           <button
             onClick={handleViewFullDetails}
             className="w-full sm:w-auto px-4 py-1.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md text-sm cursor-pointer"
           >
             View Full Details
           </button>
         </div>
       </div>
     </div>
   );
};

// Feature Component - Made more compact
const Feature = ({ icon, label, subLabel }) => (
  <div className="flex items-center gap-1.5">
    <div className="p-1 bg-gray-100 rounded-full text-gray-700 flex items-center justify-center">{icon}</div> 
    <div>
      <div className="font-semibold text-gray-800 text-xs">{label}</div>
      <div className="text-xs text-gray-500">{subLabel}</div>
    </div>
  </div>
);

export default QuickView;
