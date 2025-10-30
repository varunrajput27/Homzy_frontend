import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import PropertyCard from "./Propertycard";
import { Loader2 } from 'lucide-react';

const Properties = ({ filters }) => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const propertiesPerPage = 6;

    // Fetch properties from API
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/user/rentandsale`
                );

                if (res.data.properties) {
                    const mapped = res.data.properties
                        // 💡 FIX 1: Filter out properties that are Closed/Sold Out/Rent Out directly after fetching
                        .filter(p => p.listingType === 'For Rent' || p.listingType === 'For Sale')
                        .map((p) => ({
                            ...p,
                            // Ensure 'type' is correctly determined for filtering
                            // Use basicDetails.price for better rent/sale detection if listingType is not reliable
                            type: p.listingType === 'For Sale' ? 'sale' : 'rent', 
                        }));
                    setProperties(mapped);
                } else {
                    setProperties([]);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch properties");
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    // Reset page to 1 whenever filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    // Filter properties based on filters
    const filteredProperties = useMemo(() => {
        // Since we already filtered for 'For Rent'/'For Sale' in useEffect,
        // this useMemo handles the remaining filters (city, type, bedrooms).
        return properties.filter((property) => {
            // Property Type filter
            if (filters.propertyType && property.propertyType !== filters.propertyType) {
                return false;
            }

            // City filter
            if (filters.city) {
                if (!property.location || property.location.city.toLowerCase() !== filters.city.toLowerCase()) {
                    return false;
                }
            }

            // Rent/Buy filter (e.g., 'rent' or 'sale')
            if (
                filters.rentBuy &&
                property.type?.toLowerCase() !== filters.rentBuy.toLowerCase()
            ) {
                return false;
            }

            // Bedrooms filter
            if (filters.bedrooms) {
                const bhkType = property.basicDetails?.bhkType;
                if (!bhkType || bhkType.toLowerCase() !== filters.bedrooms.toLowerCase())
                    return false;
            }

            // If all filters pass
            return true;
        });
    }, [properties, filters]);

    // Pagination logic
    const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
    const indexOfLastProperty = currentPage * propertiesPerPage;
    const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
    const currentProperties = filteredProperties.slice(
        indexOfFirstProperty,
        indexOfLastProperty
    );

    // Pagination handlers
    const goToPage = (pageNumber) => setCurrentPage(pageNumber);
    const goToNextPage = () =>
        currentPage < totalPages && setCurrentPage(currentPage + 1);
    const goToPrevPage = () =>
        currentPage > 1 && setCurrentPage(currentPage - 1);

    if (loading)
        return (
            <div className="py-20 px-4 text-center text-xl text-indigo-600 font-semibold flex items-center justify-center">
                <Loader2 className="animate-spin w-6 h-6 mr-3" />
                Loading properties...
            </div>
        );
    if (error)
        return (
            <div className="py-20 px-4 text-center text-xl text-red-500 font-semibold">{error}</div>
        );

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-4 text-gray-900">Featured Properties</h2>
            <p className="text-sm sm:text-base text-gray-500 text-center mb-10 max-w-lg mx-auto">
                Discover the best properties handpicked for you. Use the filters above to narrow your search.
            </p>

            {/* Property Grid - RESPONSIVE */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 justify-items-center">
                {currentProperties.length > 0 ? (
                    currentProperties.map((property) => (
                        <PropertyCard key={property._id} property={property} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-lg text-gray-500 py-10">
                        No properties found matching your criteria.
                    </p>
                )}
            </div>

            {/* Pagination - RESPONSIVE */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 space-x-2 sm:space-x-3">
                    <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 sm:px-4 sm:py-2 text-sm border-2 cursor-pointer rounded-lg font-medium transition duration-200 ${
                            currentPage === 1
                                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                : "text-indigo-600 border-indigo-600 hover:bg-indigo-100 active:scale-95"
                        }`}
                    >
                        Previous
                    </button>

                    {[...Array(totalPages)].map((_, idx) => {
                        const pageNum = idx + 1;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => goToPage(pageNum)}
                                className={`px-3 py-1 sm:px-4 sm:py-2 text-sm cursor-pointer border-2 rounded-lg font-medium transition duration-200 ${
                                    currentPage === pageNum
                                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                                        : "text-indigo-600 border-indigo-600 hover:bg-indigo-100"
                                }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages} 
                        className={`px-3 py-1 sm:px-4 sm:py-2 text-sm border-2 cursor-pointer rounded-lg font-medium transition duration-200 ${
                            currentPage === totalPages
                                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                : "text-indigo-600 border-indigo-600 hover:bg-indigo-100 active:scale-95"
                        }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Properties;


