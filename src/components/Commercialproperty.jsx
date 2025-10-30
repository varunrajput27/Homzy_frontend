import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { FaBed, FaBath, FaHome } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const placeholderImage = "/assets/placeholder.jpg";

// 🏡 Property Card Component
const PropertyCard = ({ title, price, beds, baths, area, image }) => (
  <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden border border-gray-100 transform transition duration-300 hover:-translate-y-2 mx-auto w-[95%] sm:w-[90%]">
    <div className="relative">
      <img
        src={image}
        alt={title}
        className="w-full h-56 object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = placeholderImage;
        }}
      />
    </div>

    <div className="p-4 sm:p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{title}</h3>
      <p className="text-2xl font-bold text-indigo-700 mb-2">{price}</p>
      <div className="flex items-center border-t pt-2 mt-2 text-gray-600 text-sm sm:text-base justify-between">
        <div className="flex items-center gap-1">
          <FaBed className="text-indigo-600" />
          <span>{beds}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaBath className="text-indigo-600" />
          <span>{baths}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaHome className="text-indigo-600" />
          <span>{area}</span>
        </div>
      </div>
    </div>
  </div>
);

// 🏬 Main Component
const CommercialProperty = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // 🧠 Fetch Properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/sale/all`
        );
        if (response.data?.properties?.length) {
          const mapped = response.data.properties.map((prop) => ({
            id: prop._id,
            title: prop.basicDetails?.title || "No title",
            price: prop.basicDetails?.price
              ? `₹${prop.basicDetails.price.toLocaleString()}`
              : "Price N/A",
            beds: prop.basicDetails?.bhkType || "-",
            baths: prop.basicDetails?.bathrooms || "-",
            area: prop.basicDetails?.Area || "-",
            image: prop.images?.[0]?.url || placeholderImage,
          }));
          setProperties(mapped);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();

    // 🔄 Update width on resize (fix for mobile)
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 📱 Responsive logic (real device width detection)
  const slidesToShow =
    windowWidth < 768 ? 1 : windowWidth < 1280 ? 2 : 3;

  const settings = {
    dots: windowWidth < 768,
    infinite: properties.length > 1,
    speed: 600,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: properties.length > 1,
    autoplaySpeed: 3000,
    arrows: windowWidth >= 768,
    centerMode: false,
    adaptiveHeight: true,
  };

  // ⏳ Loading & Empty States
  if (loading)
    return (
      <div className="text-center py-16 text-gray-600 text-lg">
        Loading properties...
      </div>
    );

  if (properties.length === 0)
    return (
      <div className="text-center py-16 text-gray-600 text-lg">
        No commercial properties found.
      </div>
    );

  // 🖼️ Main Render
  return (
    <section className="bg-gradient-to-b from-gray-50 via-white to-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent mb-3">
            Commercial Properties
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            Explore premium commercial spaces designed to elevate your business — modern,
            strategic, and investment-worthy.
          </p>
        </div>

        <Slider {...settings}>
          {properties.map((property) => (
            <div key={property.id}>
              <PropertyCard {...property} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default CommercialProperty;
