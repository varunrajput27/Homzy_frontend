import React, { useEffect, useState } from 'react';
import { FaSearch, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';

const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-gray-800"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
      5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const HeroSection = ({ onSearch }) => {
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Filters
  const [propertyType, setPropertyType] = useState('');
  const [location, setLocation] = useState('');
  const [rentBuy, setRentBuy] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  // Fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/cities`
        );
        if (res.data?.cities) {
          setCities(res.data.cities.sort((a, b) => a.localeCompare(b)));
        }
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, []);

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSearching(true);

    const filters = {
      propertyType,
      city: location,
      rentBuy,
      bedrooms,
    };

    setTimeout(() => {
      onSearch(filters);
      setIsSearching(false);
      window.scrollTo({ top: window.innerHeight * 1.0, behavior: 'smooth' });
    }, 800);
  };

  // Clear filters
  const handleClearFilters = () => {
    setPropertyType('');
    setLocation('');
    setRentBuy('');
    setBedrooms('');
  };

  return (
    <div
      className="relative h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{ backgroundImage: "url('/images/search.jfif')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 text-center text-white max-w-4xl mx-auto w-full">
        {/* Headings */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-snug mb-2 sm:mb-4 drop-shadow-lg">
          Apka Apna Property Saathi
        </h1>
        <p className="text-sm sm:text-base md:text-xl font-bold text-yellow-400 mb-3 sm:mb-6 drop-shadow-md">
          With 0% Brokerage
        </p>
        <p className="text-xs sm:text-sm md:text-lg mb-6 drop-shadow-sm">
          Find your perfect home or investment opportunity
        </p>

        {/* Search Form */}
        <div className="relative bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-5xl mx-auto">
          {/* Clear Filters */}
          <button
            type="button"
            onClick={handleClearFilters}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition duration-150 p-2 rounded-full flex items-center"
          >
            <FaTimesCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 cursor-pointer" />
          </button>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-3 sm:space-y-4 md:grid md:grid-cols-4 md:gap-4 md:items-end pt-6 sm:pt-4"
          >
            {/* Property Type */}
            <div className="flex flex-col">
              <label className="text-gray-700 text-xs sm:text-sm mb-1 cursor-pointer">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-1.5 sm:p-2 text-sm sm:text-base text-gray-800 cursor-pointer focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              >
                <option value="">All</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            {/* Location */}
            <div className="flex flex-col">
              <label className="text-gray-700 text-xs sm:text-sm mb-1 cursor-pointer">
                Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-1.5 sm:p-2 text-sm sm:text-base text-gray-800 cursor-pointer focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              >
                <option value="">All</option>
                {loadingCities ? (
                  <option disabled>Loading...</option>
                ) : (
                  cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Rent/Buy */}
            <div className="flex flex-col">
              <label className="text-gray-700 text-xs sm:text-sm mb-1 cursor-pointer">
                Rent/Buy
              </label>
              <select
                value={rentBuy}
                onChange={(e) => setRentBuy(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-1.5 sm:p-2 text-sm sm:text-base text-gray-800 cursor-pointer focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              >
                <option value="">All</option>
                <option value="Rent">Rent</option>
                <option value="Sale">Buy</option>
              </select>
            </div>

            {/* Bedrooms */}
            <div className="flex flex-col">
              <label className="text-gray-700 text-xs sm:text-sm mb-1 cursor-pointer">
                Bedrooms
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-1.5 sm:p-2 text-sm sm:text-base text-gray-800 cursor-pointer focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              >
                <option value="">All</option>
                <option value="1BHK">1 BHK</option>
                <option value="2BHK">2 BHK</option>
                <option value="3BHK">3 BHK</option>
                <option value="4BHK">4 BHK</option>
                <option value="5BHK">5 BHK</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="mt-2 md:col-span-4 flex">
              <button
                type="submit"
                disabled={isSearching}
                className={`w-full flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-medium rounded-md shadow-sm transition duration-150 ease-in-out cursor-pointer ${
                  isSearching
                    ? 'bg-yellow-400 opacity-80 cursor-not-allowed'
                    : 'bg-yellow-300 hover:bg-yellow-500 text-gray-800'
                }`}
              >
                {isSearching ? (
                  <>
                    <Spinner />
                    <span className="ml-2">Searching...</span>
                  </>
                ) : (
                  <>
                    <FaSearch className="mr-2" /> Search Properties
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
