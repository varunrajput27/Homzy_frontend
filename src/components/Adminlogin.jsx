import React, { useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AiOutlineHome, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Adminlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate 2-second spinner before API call (or while waiting)
    setTimeout(async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/login`,
          { email, password }
        );

        setLoading(false);

        if (response.data.success) {
          // Show toast for 2 seconds
          toast.success("Login successful.", { duration: 2000 });
          setTimeout(() => {
            navigate("/admin");
          }, 2000);
        } else {
          toast.error(response.data.message || "Login failed", { duration: 2000 });
        }
      } catch (error) {
        setLoading(false);
        if (!error.response) {
          toast.error("Network Error: Server down.", { duration: 2000 });
        } else {
          toast.error(
            error.response.data?.message || `Error ${error.response.status}`,
            { duration: 2000 }
          );
        }
      }
    }, 2000); // spinner delay
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Toaster position="top-right" />

      <div className="relative bg-white p-10 rounded-xl shadow-lg max-w-md w-full text-center">
        {/* Home Icon */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 text-gray-700 hover:text-black transition-colors cursor-pointer"
        >
          <AiOutlineHome size={24} />
        </button>

        {/* Logo */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-6 overflow-hidden rounded-full">
          <img
            src="/images/adminlogo.jfif"
            alt="admin"
            className={`w-full h-full object-cover transform transition-transform duration-300 hover:scale-110`}
          />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">
          Admin Login
        </h1>

        <form onSubmit={onSubmitHandler} className="space-y-5 text-left">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@gmail.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
              Password
            </label>
            <div className="relative w-full">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-900 transition duration-300 flex items-center justify-center cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white mr-2"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : null}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Adminlogin;


