import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaCheckCircle,
  FaUser,
  FaEnvelope,
  FaLock,
  FaKey,
} from "react-icons/fa";

const url = "https://quickbite-backend-6dvr.onrender.com";
const ADMIN_SECRET_KEY = "admin123";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    adminKey: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    isError: false,
  });
  const [invalidEmail, setInvalidEmail] = useState(false);
  const navigate = useNavigate();

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ General email validation (not only Gmail)
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const toggleRole = () => {
    setFormData((prev) => ({
      ...prev,
      role: prev.role === "user" ? "admin" : "user",
      adminKey: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      setToast({
        visible: true,
        message: "Username is required!",
        isError: true,
      });
      return;
    }

    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      setInvalidEmail(true);
      setToast({
        visible: true,
        message: "Please enter a valid email address!",
        isError: true,
      });
      return;
    }

    setInvalidEmail(false);

    if (!formData.password.trim() || formData.password.length < 6) {
      setToast({
        visible: true,
        message: "Password must be at least 6 characters!",
        isError: true,
      });
      return;
    }

    if (formData.role === "admin" && formData.adminKey !== ADMIN_SECRET_KEY) {
      setToast({
        visible: true,
        message: "Invalid admin authentication key!",
        isError: true,
      });
      return;
    }

    try {
      const res = await axios.post(`${url}/api/user/register`, formData);

      if (res.data.success && res.data.token) {
        localStorage.setItem("authToken", res.data.token);

        if (formData.role === "admin") {
          // Redirect admins to Netlify admin panel
          window.location.href = "https://quickbite-adminapp.netlify.app/";
        } else {
          setToast({
            visible: true,
            message: "Sign Up Successful!",
            isError: false,
          });
          setTimeout(() => navigate("/login"), 2000);
        }
        return;
      }

      throw new Error(res.data.message || "Registration failed.");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Registration failed.";
      setToast({ visible: true, message: msg, isError: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f0a] via-[#0d1a0f] to-[#0a0f0a] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl absolute -top-40 -left-40" />
        <div className="w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl absolute bottom-0 right-0" />
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div
            className={`px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm ${
              toast.isError
                ? "bg-red-600 text-white"
                : "bg-green-600 text-white"
            }`}
          >
            <FaCheckCircle className="flex-shrink-0" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Sign Up Form */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-3xl font-bold text-center text-green-400 mb-6">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-900/60 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-900/60 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:outline-none ${
                invalidEmail
                  ? "border-2 border-red-500"
                  : "border border-gray-700"
              }`}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 rounded-lg bg-gray-900/60 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Role selection - toggle switch */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-300">
              {formData.role === "user" ? "User" : "Admin"}
            </span>
            <div
              onClick={toggleRole}
              className={`w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                formData.role === "admin" ? "bg-amber-500" : "bg-green-500"
              }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                  formData.role === "admin" ? "translate-x-8" : "translate-x-0"
                }`}
              />
            </div>
          </div>

          {/* Admin Key */}
          {formData.role === "admin" && (
            <div className="relative">
              <FaKey className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
              <input
                type="password"
                name="adminKey"
                placeholder="Enter Admin Authentication Key"
                value={formData.adminKey}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-900/60 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                required
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-green-400 via-lime-500 to-amber-500 text-[#07120a] font-bold rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg"
          >
            Sign Up
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-green-400 hover:text-green-500 transition-colors"
          >
            <FaArrowLeft /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
