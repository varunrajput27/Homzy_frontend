import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaNewspaper } from 'react-icons/fa';
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

// 💡 NOTE: VITE_API_BASE_URL is assumed to be defined in your environment
const BASE_URL = import.meta.env.VITE_API_BASE_URL; 

// 🔹 Info Card Component (Reusable and Styled)
const InfoCard = ({ icon, title, content }) => {
     
    
    return (
        <article className="flex items-start gap-4 p-6 bg-white border border-blue-100 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-0.5 cursor-default">
            <div className="p-4 rounded-full bg-blue-100 flex-shrink-0">{icon}</div>
            <div>
                <h3 className="text-xl font-bold text-blue-800 mb-1">{title}</h3>
                <p className="text-gray-600 text-md">{content}</p>
            </div>
        </article>
    );
};

const Contactus = () => {
    const COMPANY_PHONE = import.meta.env.VITE_COMPANY_PHONE_NUMBER;
    const COMPANY_EMAIL = import.meta.env.VITE_COMPANY_EMAIL;
    // State for Contact Form
    const [contactData, setContactData] = useState({
        fullname: '',
        email: '',
        phone: '',
        message: '',
    });
    const [contactLoading, setContactLoading] = useState(false);

    // State for Newsletter Subscription
    const [subscribeEmail, setSubscribeEmail] = useState('');
    const [subscribeLoading, setSubscribeLoading] = useState(false);

    // Handles changes for the Contact Form inputs
    const handleContactChange = (e) => {
        const { id, value } = e.target;
        // Optional validation: limit phone length to 10
        if (id === "phone" && value.length > 10) return;
        setContactData((prev) => ({ ...prev, [id]: value }));
    };

    // Handle Contact Form Submission (AXIOS POST)
    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setContactLoading(true);

        try {
            // Using axios.post(url, data) simplified syntax
            const res = await axios.post(
                `${BASE_URL}/api/user/getintouch`,
                contactData
            );
            
            toast.success(res.data.message || "Thank you for reaching out! We'll contact you shortly.", { duration: 3000, position: "top-right" });
            setContactData({ fullname: '', email: '', phone: '', message: '' }); // Clear form

        } catch (error) {
            console.error('Contact Form Error:', error);
            // Use standard axios error response handling
            toast.error(error.response?.data?.message || "Something went wrong. Please try again.", { duration: 3000, position: "top-right" });
        } finally {
            setContactLoading(false);
        }
    };

    // Handle Newsletter Subscription (AXIOS POST)
    const handleSubscribeSubmit = async (e) => {
        e.preventDefault();
        setSubscribeLoading(true);

        if (!subscribeEmail) {
            toast.error("Please enter a valid email address.", { duration: 3000 });
            setSubscribeLoading(false);
            return;
        }

        try {
            // Using axios.post(url, data) simplified syntax
            const res = await axios.post(`${BASE_URL}/api/user/subscribe`, { email: subscribeEmail });

            toast.success(res.data.message || `Successfully subscribed with ${subscribeEmail}!`, { duration: 3000, position: "top-right" });
            setSubscribeEmail(''); // Clear input

        } catch (error) {
            console.error('Subscription Error:', error);
            toast.error(error.response?.data?.message || "Subscription failed. Please try again.", { duration: 3000, position: "top-right" });
        } finally {
            setSubscribeLoading(false);
        }
    };

    return (
        <div className="font-sans bg-gray-50 text-gray-800">
            <Toaster position="top-right" reverseOrder={false} />
            
            {/* 1. Hero Section: Text Position Adjusted */}
            <section
                className="relative h-80 md:h-96 bg-cover bg-center flex items-start justify-center text-white shadow-xl"
                style={{ backgroundImage: "url('/images/contact.jfif')" }}
            >
                {/* Overlay slightly adjusted for better text visibility */}
                <div className="absolute inset-0 bg-gray-900/60 opacity-60"></div> 
                
                <div className="relative z-10 text-center px-4 pt-10 md:pt-16"> 
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
                        Let's Connect
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-200 max-w-xl mx-auto font-light">
                        Your dream home is just a conversation away
                    </p>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                
                {/* 2. Get in Touch (Image-Form Layout) */}
                <section className="mb-16 lg:mb-24">
                    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl bg-white/70 border border-white/40 transition-all duration-300">
                        
                        {/* Left Side - Image with Text on Top */}
                        <div
                            className="relative flex flex-col items-start text-white overflow-hidden h-64 sm:h-80 lg:h-auto p-6 sm:p-10 justify-start"
                            style={{
                                backgroundImage: "url('/images/building.jfif')", 
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="absolute inset-0 bg-gray-900/60"></div> 

                            <div className="relative z-10 mt-4 sm:mt-8 lg:mt-10">
                                <h2 className="text-xl sm:text-2xl lg:text-4xl font-extrabold leading-snug drop-shadow-md">
                                    Ready to find your{" "}
                                    <span className="text-blue-300">perfect property</span>?
                                </h2>
                                <p className="text-gray-200 text-xs sm:text-sm lg:text-base max-w-sm drop-shadow-sm mt-2">
                                    Our team is here to guide you through every step of your real estate journey.
                                </p>
                            </div>
                        </div>

                        {/* Right Side - Contact Form */}
                        <div className="p-6 sm:p-8 flex flex-col justify-center bg-white">
                            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
                                Get in Touch
                            </h3>

                            <form className="space-y-4 sm:space-y-5" onSubmit={handleContactSubmit}>
                                
                                {/* Form Fields */}
                                {["fullname", "email", "phone"].map((field) => (
                                    <div key={field}>
                                        <label
                                            htmlFor={field}
                                            className="block text-sm sm:text-base font-medium text-gray-700 mb-1"
                                        >
                                            {field === 'fullname' ? 'Full Name' : field.charAt(0).toUpperCase() + field.slice(1)}
                                        </label>
                                        <input
                                            type={
                                                field === "email" ? "email" : field === "phone" ? "tel" : "text"
                                            }
                                            id={field}
                                            value={contactData[field]}
                                            onChange={handleContactChange}
                                            placeholder={`Your ${field === 'fullname' ? 'Full Name' : field.charAt(0).toUpperCase() + field.slice(1)}`}
                                            className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 text-gray-900 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition shadow-sm"
                                            required
                                        />
                                    </div>
                                ))}

                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-sm sm:text-base font-medium text-gray-700 mb-1"
                                    >
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        value={contactData.message}
                                        onChange={handleContactChange}
                                        rows="4"
                                        placeholder="Write your message..."
                                        className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 text-gray-900 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition shadow-sm"
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={contactLoading}
                                    className={`w-full py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg text-white font-semibold text-sm sm:text-base shadow-xl transition-transform duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                                        contactLoading ? "opacity-70 cursor-not-allowed" : ""
                                    }`}
                                >
                                    {contactLoading ? "Sending..." : "Send Message"} <FaPaperPlane />
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
                
                {/* 3. Contact Info Cards */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 lg:mb-24">
                    {/* Note: InfoCard uses blue-related styles, which complement the Indigo theme */}
                    <InfoCard
                        icon={<FaPhoneAlt className="text-blue-600" size={24} />}
                        title="Contact Phone Number"
                        content={COMPANY_PHONE}
                    />
                    <InfoCard
                        icon={<FaEnvelope className="text-blue-600" size={24} />}
                        title="Our Email Address"
                        content={COMPANY_EMAIL}
                    />
                    <InfoCard
                        icon={<FaMapMarkerAlt className="text-blue-600" size={24} />}
                        title="Our Location"
                        content="Noida, Uttar Pradesh, India"
                    />
                </section>

                {/* 4. Embedded Google Map */}
                <section className="w-full h-[350px] md:h-[500px] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xl mb-16 lg:mb-24">
                    <iframe
                        title="Noida Location Map"
                        // 💡 IMPORTANT: Please replace this placeholder src with your actual Google Maps Embed code for Noida.
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112101.4402633099!2d77.3050047!3d28.583521!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf213197f1f01%3A0x1d54e4437e403d99!2sNoida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1699092000000!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full"
                    />
                </section>
                
                {/* 5. Subscribe Our Newsletter - OPTION 1: Clean & Minimal (UPDATED) */}
                <section className="py-16 lg:py-24 bg-gray-100">
                    <div className="max-w-3xl mx-auto text-center p-8 md:p-12 rounded-xl shadow-xl bg-white border border-indigo-200">
                        
                        <div className="flex justify-center items-center mb-4">
                            <FaNewspaper className="text-indigo-600" size={48} />
                        </div>

                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                            Unlock Property Alerts
                        </h2>
                        
                        <p className="text-lg mb-8 text-gray-600 max-w-xl mx-auto font-medium">
                            **Subscribe** for exclusive access to **new property listings**, personalized market analysis, and real estate investment tips.
                        </p>
                        
                        <form onSubmit={handleSubscribeSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={subscribeEmail}
                                onChange={(e) => setSubscribeEmail(e.target.value)}
                                className="flex-grow w-full sm:max-w-xs p-3 rounded-lg border-2 border-indigo-300 text-gray-800 bg-white focus:outline-none focus:ring-4 focus:ring-indigo-200 shadow-md transition duration-300"
                                required
                            />
                            <button 
                                type="submit"
                                disabled={subscribeLoading}
                                className={`bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition duration-300 w-full sm:w-auto shadow-xl cursor-pointer transform active:scale-[0.98] ${
                                    subscribeLoading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                            >
                                {subscribeLoading ? "Subscribing..." : "Subscribe Now"}
                            </button>
                        </form>
                        <p className='text-xs text-gray-500 mt-4'>Your data is safe. We only send relevant property updates.</p>
                    </div>
                </section>

            </main>
        </div>
    );
};

export default Contactus;
