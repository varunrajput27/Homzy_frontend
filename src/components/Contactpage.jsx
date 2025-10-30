import React, { useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "phone" && value.length > 10) return;
    if (id === "email" && value.length > 50) return;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/getintouch`,
        formData
      );
      toast.success(res.data.message, { duration: 3000, position: "top-right" });
      setFormData({ fullname: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.", {
        duration: 3000,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white flex items-center justify-center px-4 py-12 relative">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl bg-white/70 border border-white/40 transition-all duration-300">
        {/*  Left Side - Image with Text on Top */}
        <div
          className="relative flex flex-col items-start text-white overflow-hidden h-64 sm:h-80 lg:h-auto p-6 sm:p-10 justify-start"
          style={{
            backgroundImage: "url('/images/apartment.jfif')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark overlay for better text visibility */}
          <div className="absolute inset-0 "></div>

          {/* Text Container */}
          <div className="relative z-10 mt-4 sm:mt-8 lg:mt-10">
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-extrabold leading-snug drop-shadow-md">
              Let’s turn your{" "}
              <span className="text-blue-300">ideas</span> into reality...
            </h2>
            <p className="text-gray-200 text-xs sm:text-sm lg:text-base max-w-sm drop-shadow-sm mt-2">
              Whether you're dreaming big or solving small challenges — our team
              crafts meaningful digital experiences that leave a lasting impression.
            </p>
          </div>
        </div>

        {/*  Right Side - Contact Form */}
        <div className="p-6 sm:p-8 flex flex-col justify-center bg-white">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
            Get in Touch
          </h3>

          <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
            {["fullname", "email", "phone"].map((field) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="block text-sm sm:text-base font-medium text-gray-700 mb-1"
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={
                    field === "email" ? "email" : field === "phone" ? "tel" : "text"
                  }
                  id={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={`Your ${
                    field.charAt(0).toUpperCase() + field.slice(1)
                  }`}
                  className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 text-gray-900 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
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
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Write your message..."
                className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 text-gray-900 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg text-white font-semibold text-sm sm:text-base shadow-md transition-transform duration-200 cursor-pointer ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
