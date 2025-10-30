import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { AiOutlineHome, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const phoneRef = useRef();
  const passwordRef = useRef();

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val) && val.length <= 10) setPhone(val);
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef?.current?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) return toast.error("Phone must be 10 digits");
    if (!password.trim()) return toast.error("Password is required");

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/login`,
        { phone, password }
      );
      login(response.data.token, response.data.user);

      toast.success(response.data.message || "Login successful!", { duration: 2000 });

      setTimeout(() => {
        navigate("/");
        setLoading(false);
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed", { duration: 3000 });
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-6 relative">
      <Toaster position="top-right" />

      {/* Home button */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-4 left-4 bg-white shadow-md flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition cursor-pointer z-50"
      >
        <AiOutlineHome className="text-[#3d5a80]" size={20} />
        <span className="text-[#3d5a80] font-semibold hidden sm:inline">Home</span>
      </button>

      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-[#3d5a80]">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Phone */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm sm:text-base">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              ref={phoneRef}
              onChange={handlePhoneChange}
              onKeyDown={(e) => handleKeyDown(e, passwordRef)}
              placeholder="Enter 10-digit phone number"
              maxLength={10}
              className="w-full border border-gray-300 rounded px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#3d5a80]"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block mb-1 font-medium text-gray-700 text-sm sm:text-base">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                ref={passwordRef}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded px-3 sm:px-4 py-2 sm:py-3 pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#3d5a80]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-[#3d5a80] hover:underline cursor-pointer font-medium text-sm sm:text-base"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#3d5a80] text-white py-2 sm:py-3 rounded-xl hover:bg-[#2c4460] transition cursor-pointer font-medium text-base sm:text-lg ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register / Don't have account */}
        <div className="mt-6 text-center text-sm sm:text-base">
          <span className="text-gray-600">Don’t have an account? </span>
          <Link
            to="/register"
            className="text-[#3d5a80] font-semibold hover:underline cursor-pointer"
          >
            Register here
          </Link>
        </div>
      </div>

      {showForgotModal && <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />}
    </div>
  );
};

export default Login;

