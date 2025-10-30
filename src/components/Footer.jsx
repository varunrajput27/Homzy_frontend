import React from "react";
import { Link } from "react-router-dom";
import { FaYoutube, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

const Footer = () => {
  const COMPANY_PHONE = import.meta.env.VITE_COMPANY_PHONE_NUMBER;
    const COMPANY_EMAIL = import.meta.env.VITE_COMPANY_EMAIL;
  return (
    <footer className="bg-[#0b0b2b] text-white px-4 sm:px-8 md:px-12 py-8">
      {/* Top Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 border-b border-gray-700 pb-8">
        
        {/* Column 1: Logo & Description */}
        <div>
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-md flex items-center justify-center mb-3 shadow-md">
            <img
              src="/images/logo.jfif"
              alt="Grihamate Logo"
              className="w-10 h-10 object-contain"
            />
          </div>
          <h2 className="text-lg font-bold mb-2">HOMZY</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Your trusted partner in finding the perfect residential and commercial properties.
          </p>
          <div className="flex gap-4 mt-2 text-white text-lg">
            <FaYoutube className="hover:text-red-500 transition duration-300 cursor-pointer" />
            <FaFacebookF className="hover:text-blue-500 transition duration-300 cursor-pointer" />
            <FaLinkedinIn className="hover:text-blue-400 transition duration-300 cursor-pointer" />
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-base font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link to="/rent" className="hover:text-white transition duration-200">
                Properties for Rent
              </Link>
            </li>
            <li>
              <Link to="/buy" className="hover:text-white transition duration-200">
                Properties for Sale
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition duration-200">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition duration-200">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Property Types */}
        <div>
          <h3 className="text-base font-semibold mb-3">Property Types</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="hover:text-white cursor-pointer transition">Commercial Office</li>
            <li className="hover:text-white cursor-pointer transition">Retail Space</li>
            <li className="hover:text-white cursor-pointer transition">Apartments</li>
            <li className="hover:text-white cursor-pointer transition">Villas</li>
          </ul>
        </div>

        {/* Column 4: Contact Info */}
        <div>
          <h3 className="text-base font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-center gap-3">
              <MdPhone className="text-lg sm:text-xl" /> {COMPANY_PHONE}
            </li>
            <li className="flex items-center gap-3">
              <MdEmail className="text-lg sm:text-xl" /> {COMPANY_EMAIL}
            </li>
            <li className="flex items-start gap-3">
              <MdLocationOn className="text-lg sm:text-xl mt-1" />
              <span>
                Sector 62, Noida
                <br />
                Uttar Pradesh, 201002
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center pt-4 text-xs sm:text-sm text-gray-400 gap-3 mt-1 flex-wrap">
        <div className="flex flex-wrap gap-4">
          <Link to="#" className="hover:text-white transition">Privacy Policy</Link>
          <Link to="#" className="hover:text-white transition">Terms & Conditions</Link>
          <Link to="#" className="hover:text-white transition">Support</Link>
        </div>
        <div>© {new Date().getFullYear()} HOMZY. All Rights Reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;

