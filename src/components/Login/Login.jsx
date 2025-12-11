import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
} from 'react-icons/fa';

const url = 'https://quickbite-backend-6dvr.onrender.com';
// const url="http://localhost:4000"

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', isError: false });
  const [invalidEmail, setInvalidEmail] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('rememberMe');
    if (stored) setFormData(JSON.parse(stored));
  }, []);

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  const handleChange = ({ target: { name, value, type, checked } }) =>
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      setInvalidEmail(true);
      setToast({ visible: true, message: 'Please enter a valid email address!', isError: true });
      return;
    }
    setInvalidEmail(false);

    try {
      const res = await axios.post(`${url}/api/user/login`, {
        email: formData.email,
        password: formData.password,
      });

      if (res.status === 200 && res.data.success && res.data.token && res.data.user) {
        
        // 🔥 Store token
        localStorage.setItem('authToken', res.data.token);

        // 🔥 Store logged in user info
        const userData = {
          id: res.data.user._id,
          name: res.data.user.username || "User",
          email: res.data.user.email,
          role: res.data.user.role,   // ⭐ IMPORTANT
        };

        localStorage.setItem('loginData', JSON.stringify(userData));

        window.dispatchEvent(new Event('authChange'));

        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', JSON.stringify(formData));
        } else {
          localStorage.removeItem('rememberMe');
        }

        setToast({ visible: true, message: 'Login successful!', isError: false });

        // ⭐ ROLE-BASED REDIRECTION (Final correct flow)
        setTimeout(() => {
          setToast({ visible: false, message: '', isError: false });

          if (userData.role === 'admin') {
            navigate('/admin');
          } 
          else if (userData.role === 'restaurant') {
            navigate('/restaurant/dashboard');   // ⭐ Restaurant dashboard route
          } 
          else {
            navigate('/');
          }
        }, 1000);

      } else {
        throw new Error(res.data.message || 'Login failed.');
      }

    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed.';
      setToast({ visible: true, message: msg, isError: true });
      setTimeout(() => setToast({ visible: false, message: '', isError: false }), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f1a12] via-[#142019] to-[#0f1a12] relative">

      {/* Toast */}
      <div
        className={`fixed top-6 right-6 z-50 transition-all duration-300 ${
          toast.visible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
        }`}
      >
        <div
          className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm ${
            toast.isError ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
          }`}
        >
          <FaCheckCircle className="flex-shrink-0" />
          <span>{toast.message}</span>
        </div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-3xl font-bold text-center text-amber-400 mb-6">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
            <input
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-900/60 text-white ${
                invalidEmail ? 'border-2 border-red-500' : 'border border-gray-700'
              }`}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 rounded-lg bg-gray-900/60 text-white border border-gray-700"
              required
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-5 w-5 rounded border-gray-600 text-amber-500 bg-gray-700"
            />
            <span className="text-gray-300 text-sm">Remember me</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-500 via-lime-500 to-green-600 text-[#07120a] font-bold rounded-lg flex items-center justify-center gap-2"
          >
            Sign In <FaArrowRight />
          </button>
        </form>

        {/* Signup */}
        <div className="text-center mt-6">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-500"
          >
            <FaUserPlus /> Create New Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
