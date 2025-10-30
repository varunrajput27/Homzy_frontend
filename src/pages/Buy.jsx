import React, { useState, useEffect } from "react";
import axios from "axios";
import Propertycard from "../components/Propertycard";
import { X, Filter } from "lucide-react"; // Filter icon import kiya gaya

const Buy = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false); // Mobile filter state

  const DESKTOP_STICKY_TOP = "top-24"; // Desktop par navbar ke neeche chipkane ke liye

  // 1. Initial/Default Filter State
  const initialFilters = {
    propertyType: "",
    bhk: "",
    furnishing: "",
    minPrice: 2000000,
    maxPrice: 300000000,
  };
  
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);


  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 6;
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // ------------------- API Logic -------------------

  const fetchProperties = async (currentFilters) => {
    setIsLoading(true);
    try {
      const params = {
        propertyFor: "sale",
      };

      // Construct API parameters based on currentFilters
      if (currentFilters.propertyType) params.propertyType = currentFilters.propertyType;
      if (currentFilters.bhk) params.bhkType = currentFilters.bhk;
      if (currentFilters.furnishing) params.furnishingStatus = currentFilters.furnishing;
      // Ensure prices are passed as Numbers if your API expects them as such
      if (currentFilters.minPrice) params.minPrice = Number(currentFilters.minPrice);
      if (currentFilters.maxPrice) params.maxPrice = Number(currentFilters.maxPrice);

      const res = await axios.get(`${VITE_API_BASE_URL}/api/sale/all`, {
        params
      });

      setProperties(Array.isArray(res.data?.properties) ? res.data.properties : []);
      setCurrentPage(1);
      // Update applied filters state only after successful fetch
      setAppliedFilters(currentFilters); 

    } catch (err) {
      console.error("Error fetching properties", err);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch/Re-fetch when filters are applied/reset
  useEffect(() => {
    fetchProperties(appliedFilters);
  }, [appliedFilters]); 

  // ------------------- Filter & Effect Handlers -------------------

  // Universal handler to update the selection/draft filters
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for range input (Price)
  const handleRangeChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      maxPrice: Number(e.target.value),
    }));
  };

  // Handler for the "Apply Filters" button click
  const handleApplyFilters = () => {
    fetchProperties(filters);
    setShowFilters(false); // Close mobile drawer after applying
  };
  
  // Function to clear all filters
  const handleClearFilters = () => {
    const clear = initialFilters;
    setFilters(clear);
    // Setting appliedFilters triggers the useEffect to re-fetch
    setAppliedFilters(clear); 
    setShowFilters(false); // Close mobile drawer after clearing
  };

  const filteredProperties = properties.filter(
  (property) => property.listingType === "For Sale"
);

const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
const indexOfLast = currentPage * propertiesPerPage;
const indexOfFirst = indexOfLast - propertiesPerPage;
const currentProperties = filteredProperties.slice(indexOfFirst, indexOfLast);


  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPrevPage = () => handlePageChange(currentPage - 1);
  const goToNextPage = () => handlePageChange(currentPage + 1);
  const goToPage = (page) => handlePageChange(page);

  // Reusable Filter Form Content
  const FilterFormContent = ({ isMobile }) => (
    <>
      {/* Top section: Title and Close/Clear Button */}
      <div className="flex justify-between items-center mb-6 pt-4 md:pt-0 border-b pb-2">
        <h2 className="text-xl font-semibold">Find Sale By</h2>
        {/* Mobile Close Button / Desktop Clear Button */}
        {isMobile ? (
          <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-red-500">
            <X size={24} />
          </button>
        ) : (
          <button
            onClick={handleClearFilters}
            className="text-gray-500 hover:text-red-500 cursor-pointer flex items-center"
            title="Clear filters"
          >
            <X size={20} className="mr-1" />
            Clear
          </button>
        )}
      </div>

      {/* Filter Inputs */}
      <div className="mb-5">
        <label className="block mb-1 font-medium">Property Type</label>
        <select
          name="propertyType"
          className="w-full border rounded px-3 py-2 cursor-pointer"
          value={filters.propertyType}
          onChange={handleChange}
        >
          <option value="">All</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Commercial">Commercial</option>
        </select>
      </div>

      <div className="mb-5">
        <label className="block mb-1 font-medium">BHK</label>
        <select
          name="bhk"
          className="w-full border rounded px-3 py-2 cursor-pointer"
          value={filters.bhk}
          onChange={handleChange}
        >
          <option value="">All</option>
          <option value="1BHK">1 BHK</option>
          <option value="2BHK">2 BHK</option>
          <option value="3BHK">3 BHK</option>
          <option value="4BHK">4 BHK</option>
          <option value="5BHK">5 BHK+</option>
        </select>
      </div>

      <div className="mb-5">
        <label className="block mb-1 font-medium">Furnishing</label>
        <select
          name="furnishing"
          className="w-full border rounded px-3 py-2 cursor-pointer"
          value={filters.furnishing}
          onChange={handleChange}
        >
          <option value="">All</option>
          <option value="Fully Furnished">Fully Furnished</option>
          <option value="Semi Furnished">Semi Furnished</option>
          <option value="Unfurnished">Unfurnished</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium">Max Price</label>
        <div className="flex justify-between text-sm mb-1 text-gray-600">
          <span>Min: ₹{filters.minPrice.toLocaleString()}</span>
          <span>Max: ₹{filters.maxPrice.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={2000000}
          // The range maximum seems to be limited to 30,000,000 in your code, so I'm using that.
          max={30000000} 
          step={500000}
          value={filters.maxPrice}
          onChange={handleRangeChange}
          className="w-full cursor-pointer"
        />
      </div>

      {/* Apply Filters Button */}
      <button
        onClick={handleApplyFilters}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer transition duration-150 mb-3"
        disabled={isLoading}
      >
        {isLoading ? "Searching..." : "Apply Filters"}
      </button>

      {/* Mobile Clear Filters Button */}
      {isMobile && (
        <button
          onClick={handleClearFilters}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 cursor-pointer transition"
        >
          Clear Filters
        </button>
      )}
    </>
  );

  // ------------------- Render -------------------

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      
      {/* 1. Mobile Filter Button (Visible only on mobile/tablet) */}
      <div className="flex justify-between items-center mb-6 md:hidden">
        <h1 className="text-2xl font-semibold">For Sale</h1>
        <button
          onClick={() => setShowFilters(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Filter size={18} /> Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-8">
        
        {/* 2. DESKTOP FILTER ASIDE (Mobile par hidden, Desktop par Sticky) */}
        <aside 
          className={`
            hidden md:block 
            md:w-1/4 bg-white rounded-lg shadow-md p-6 mb-8 md:mb-0 
            sticky ${DESKTOP_STICKY_TOP}
            // Removed self-start to fix premature scrolling on desktop
          `}
        >
          <FilterFormContent isMobile={false} />
        </aside>

        {/* 3. MOBILE FILTER DRAWER (Left Slide-in - Desktop par hidden) */}
        <div 
          className={`
            md:hidden // Hidden on desktop
            fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-[90] shadow-xl p-6 
            transform transition-transform duration-300 ease-in-out overflow-y-auto
            
            // Left to Right Slide:
            ${showFilters ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <FilterFormContent isMobile={true} />
        </div>

        {/* 4. Overlay (Black screen when mobile filter is open) */}
        {showFilters && (
          <div
            onClick={() => setShowFilters(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          ></div>
        )}

        {/* Property Listings */}
        <main className="w-full md:w-3/4">
          {isLoading ? (
            <p className="text-center text-gray-500 mt-10">Loading properties...</p>
          ) : currentProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProperties.map((property) => (
                <Propertycard 
                    key={property._id} 
                    property={property} 
                    className="cursor-pointer" 
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">No properties found matching your criteria.</p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-3 flex-wrap">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-blue-600 hover:text-white cursor-pointer transition duration-150"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => goToPage(i + 1)}
                  className={`px-4 py-2 border rounded cursor-pointer transition duration-150 ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "hover:bg-blue-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-blue-600 hover:text-white cursor-pointer transition duration-150"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Buy;
