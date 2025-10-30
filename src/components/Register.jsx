import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { AiOutlineHome, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Register = () => {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fullnameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const passwordRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      // Only allow digits and limit to 10 characters
      if (/^\d*$/.test(value) && value.length <= 10) {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef?.current?.focus();
    }
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullname.trim()) return toast.error("Full Name is required");
    if (!form.email.trim() || !isValidEmail(form.email)) return toast.error("Enter a valid email");
    if (!form.phone || form.phone.length !== 10) return toast.error("Phone must be 10 digits");
    if (!form.password) return toast.error("Password is required");

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/register`,
        form,
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success(response.data.message || "Registered successfully!", { duration: 2000 });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", { duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 relative">
      <Toaster position="top-right" />

      {/* Home Button */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-4 left-4 bg-white shadow-lg flex items-center gap-1 px-3 py-2 rounded-full hover:bg-gray-100 transition cursor-pointer z-50"
      >
        <AiOutlineHome className="text-[#3d5a80]" size={20} />
        <span className="text-[#3d5a80] font-semibold hidden sm:inline">Home</span>
      </button>

      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#3d5a80]">Create Account</h2>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullname"
              value={form.fullname}
              ref={fullnameRef}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, emailRef)}
              placeholder="Enter your full name"
              autoComplete="off"
              className="w-full border border-gray-300 rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#3d5a80]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              ref={emailRef}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, phoneRef)}
              placeholder="Enter your email"
              autoComplete="off"
              className="w-full border border-gray-300 rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#3d5a80]"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              ref={phoneRef}
              onChange={handleChange}
              onKeyDown={(e) => handleKeyDown(e, passwordRef)}
              placeholder="Enter 10-digit phone number"
              maxLength={10}
              autoComplete="off"
              className="w-full border border-gray-300 rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#3d5a80]"
            />
          </div>

          {/* Password - FIX START */}
          <div> 
            <label className="block mb-1 font-medium text-gray-700">Password</label>
            {/* New relative wrapper for input and icon */}
            <div className="relative"> 
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                ref={passwordRef}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="new-password"
                className="w-full border border-gray-300 rounded px-3 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#3d5a80]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                // These classes now center the button relative to the input field height
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          </div>
          {/* Password - FIX END */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#3d5a80] text-white py-3 rounded-xl hover:bg-[#2c4460] transition cursor-pointer font-medium text-lg ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600 font-medium">
          Already have an account?{" "}
          <Link to="/login" className="text-[#3d5a80] hover:underline cursor-pointer font-semibold">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
