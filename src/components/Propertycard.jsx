import React, { useState } from "react";
import { Bed, Bath, Car, Ruler, Phone, Mail } from "lucide-react";
import QuickView from "../components/Quickview"; 

const PropertyCard = ({ property, onContactClick }) => {
    const COMPANY_PHONE = import.meta.env.VITE_COMPANY_PHONE_NUMBER;
    const COMPANY_EMAIL = import.meta.env.VITE_COMPANY_EMAIL;
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  if (!property) return null;
  const listingType = property.listingType || "For Rent";
  const imageUrl =
    property.images?.[0]?.url ||
    property.image ||
    "https://via.placeholder.com/400x250";
  const title =
    property.basicDetails?.title || property.title || "Property Title";
  const price =
    property.basicDetails?.price ||
    property.basicDetails?.monthlyRent ||
    property.price ||
    0;

  const beds = property.basicDetails?.bhkType || "NA";
  const baths = property.basicDetails?.bathrooms || "NA";

  const areaValue = property.basicDetails?.Area;
  const areaUnit = property.basicDetails?.areaUnit || "sq ft";
  const area = areaValue ? `${areaValue} ${areaUnit}` : "NA";

  const garages = property.basicDetails?.garages || "NA";
  const location =
    property.location?.fullAddress ||
    property.location?.city ||
    "Location not available";
  const description = property.description || "No description available.";

  const formatPrice = (value) => {
    if (value >= 10000000) return (value / 10000000).toFixed(2) + " Cr";
    if (value >= 100000) return (value / 100000).toFixed(2) + " Lakhs";
    return value.toLocaleString();
  };

  return (
    <>
      <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-transform duration-300 hover:-translate-y-2 border border-gray-200 overflow-hidden max-w-sm w-full">
        {/* 🔹 Image Section */}
        <div className="relative group h-56 overflow-hidden">
          <div
  className={`absolute top-4 left-4 px-4 py-1 rounded-full text-xs font-semibold text-white z-10 shadow-lg ${
    listingType.toLowerCase().includes("rent out") ||
    listingType.toLowerCase().includes("sold out")
      ? "bg-red-700"
      : listingType.toLowerCase().includes("for sale")
      ? "bg-green-600"
      : listingType.toLowerCase().includes("for rent")
      ? "bg-blue-500"
      : "bg-gray-500"
  }`}
>
  {listingType}
</div>


          {/* Image */}
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/400x250";
            }}
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* 🔹 Content Section */}
        <div className="p-5 flex flex-col gap-3">
          <h3 className="text-xl font-bold text-gray-900 truncate hover:text-indigo-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600">{location}</p>
          <p className="text-gray-600 text-sm line-clamp-3">{description}</p>

          {/* 🔹 Price */}
          <p className="text-2xl font-extrabold text-indigo-600 mt-2">
            ₹{formatPrice(price)}
            {listingType === "For Rent" && (
              <span className="text-sm font-normal"> / month</span>
            )}
          </p>

          {/* 🔹 Features */}
          <div className="grid grid-cols-4 gap-3 text-center mt-3">
            <FeatureIcon icon={<Bed size={20} />} label={beds} subLabel="Bedrooms" />
            <FeatureIcon icon={<Bath size={20} />} label={baths} subLabel="Bathrooms" />
            <FeatureIcon icon={<Ruler size={20} />} label={area} subLabel="Area" />
            <FeatureIcon icon={<Car size={20} />} label={garages} subLabel="Garage" />
          </div>

          {/* 🔹 Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => {
                if (property.contactInfo?.phone) {
                  window.open(`tel:${COMPANY_PHONE}`);
                } else {
                  alert("Phone number not available");
                }
                if (onContactClick) onContactClick(property);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition cursor-pointer"
            >
              <Phone size={16} /> Call
            </button>

            <button
              onClick={() => window.open(`mailto:${COMPANY_EMAIL}`)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition cursor-pointer"
            >
              <Mail size={16} /> Mail
            </button>

            <button
              onClick={() => setIsQuickViewOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-400 text-white font-semibold rounded-lg hover:bg-yellow-500 transition cursor-pointer"
            >
              View
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 QuickView Modal */}
      {isQuickViewOpen && (
        <QuickView
          property={property}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </>
  );
};

// 🔹 Feature icon component
const FeatureIcon = ({ icon, label, subLabel }) => (
  <div className="flex flex-col items-center justify-center gap-1">
    <div className="p-2 bg-gray-100 rounded-full text-gray-700">{icon}</div>
    <div className="font-semibold text-gray-800">{label}</div>
    <div className="text-xs text-gray-500">{subLabel}</div>
  </div>
);

export default PropertyCard;
