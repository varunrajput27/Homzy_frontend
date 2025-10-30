import React, { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { User, Phone, Lock, X, Loader2, Mail, Eye, EyeOff } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditProfileModel = ({ isOpen, onClose }) => {
    const { user, login } = useAuth();

    const [formData, setFormData] = useState({
        fullname: "",
        phone: "",
        email: "",
        password: "",
        currentPassword: "",
    });

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const authToken = localStorage.getItem("token");

    useEffect(() => {
        if (isOpen && user) {
            setFormData({
                fullname: user.fullname || "",
                phone: user.phone || "",
                email: user.email || "",
                password: "",
                currentPassword: "",
            });
            setShowNewPassword(false);
            setShowCurrentPassword(false);
        }
    }, [isOpen, user]);

    if (!isOpen || !user) return null;

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        const userId = user?._id?.$oid || user?._id || user?.id;
        if (!userId) {
            toast.error("User ID missing — please log in again.");
            setLoading(false);
            return;
        }

        if (!formData.currentPassword) {
            toast.error("Please enter your current password.");
            setLoading(false);
            return;
        }

        try {
            const payload = {
                fullname: formData.fullname,
                phone: formData.phone,
                email: formData.email,
                currentPassword: formData.currentPassword,
            };
            if (formData.password) payload.password = formData.password;

            const res = await axios.put(`${API_BASE_URL}/api/user/update/${userId}`, payload, {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            const updatedUser = res.data?.user;
            if (updatedUser) {
                login(authToken, updatedUser);
                setFormData({
                    fullname: updatedUser.fullname || "",
                    phone: updatedUser.phone || "",
                    email: updatedUser.email || "",
                    password: "",
                    currentPassword: "",
                });
            }

            toast.success("Profile updated successfully! 🎉");
            setTimeout(onClose, 1500);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Update failed. Please check your details.");
        } finally {
            setLoading(false);
            setFormData((p) => ({ ...p, password: "", currentPassword: "" }));
            setShowNewPassword(false);
            setShowCurrentPassword(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm px-4">
            <Toaster position="top-right" />
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5 cursor-pointer" />
                </button>

                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <User className="w-5 h-5 mr-2 text-indigo-600" /> Edit Profile
                </h2>

                <form onSubmit={handleUpdate} className="space-y-4">
                    {/* Full Name */}
                    <InputField
                        label="Full Name"
                        name="fullname"
                        type="text"
                        icon={<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />}
                        value={formData.fullname}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                    />

                    {/* Phone */}
                    <InputField
                        label="Phone"
                        name="phone"
                        type="tel"
                        icon={<Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />}
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        required
                    />

                    {/* Email */}
                    <InputField
                        label="Email"
                        name="email"
                        type="email"
                        icon={<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />}
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />

                    {/* New Password */}
                    <PasswordField
                        label="New Password"
                        name="password"
                        value={formData.password}
                        showPassword={showNewPassword}
                        toggleShow={() => setShowNewPassword(!showNewPassword)}
                        onChange={handleChange}
                        placeholder="Enter new password"
                    />

                    {/* Current Password */}
                    <PasswordField
                        label="Current Password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        showPassword={showCurrentPassword}
                        toggleShow={() => setShowCurrentPassword(!showCurrentPassword)}
                        onChange={handleChange}
                        placeholder="Type current password"
                        required
                    />

                    {/* Save Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex items-center justify-center font-semibold py-2 px-4 rounded-lg transition cursor-pointer ${
                            loading ? "bg-indigo-400 cursor-not-allowed text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin w-5 h-5 mr-2" /> Updating...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Reusable Input Field Component
const InputField = ({ label, name, type, value, onChange, placeholder, icon, required }) => (
    <div>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="relative mt-1">
            {icon}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={type === "email" ? "email" : "tel"}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                required={required}
            />
        </div>
    </div>
);

// Reusable Password Field Component
const PasswordField = ({ label, name, value, onChange, showPassword, toggleShow, placeholder, required }) => (
    <div className={name === "currentPassword" ? "pt-2 border-t mt-4" : ""}>
        <label className="text-sm font-medium text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
        <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                type={showPassword ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete="new-password"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                required={required}
            />
            <button
                type="button"
                onClick={toggleShow}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600"
            >
                {showPassword ? <EyeOff className="w-5 h-5 cursor-pointer" /> : <Eye className="w-5 h-5 cursor-pointer" />}
            </button>
        </div>
    </div>
);

export default EditProfileModel;
