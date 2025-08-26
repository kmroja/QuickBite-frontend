// frontend/src/components/SignUp.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

const url = 'https://quickbite-backend-6dvr.onrender.com';

const AwesomeToast = ({ message, icon }) => (
  <div className="animate-slide-in fixed bottom-6 right-6 flex items-center bg-gradient-to-br from-amber-500 to-amber-600 px-6 py-4 rounded-lg shadow-lg border-2 border-amber-300/20">
    <span className="text-2xl mr-3 text-[#2D1B0E]">{icon}</span>
    <span className="font-semibold text-[#2D1B0E]">{message}</span>
  </div>
);

const SignUp = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', icon: null });
  const [invalidEmail, setInvalidEmail] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (toast.visible && toast.message === 'Sign Up Successful!') {
      const timer = setTimeout(() => {
        setToast({ visible: false, message: '', icon: null });
        navigate('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toast, navigate]);

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const isValidGmail = email => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const handleSubmit = async e => {
    e.preventDefault();

    // Frontend validation
    if (!formData.username.trim()) {
      setToast({ visible: true, message: 'Username is required!', icon: <FaCheckCircle /> });
      return;
    }
    if (!formData.email.trim() || !isValidGmail(formData.email)) {
      setInvalidEmail(true);
      setToast({ visible: true, message: 'Please enter a valid Gmail address!', icon: <FaCheckCircle /> });
      return;
    }
    setInvalidEmail(false);
    if (!formData.password.trim() || formData.password.length < 6) {
      setToast({ visible: true, message: 'Password must be at least 6 characters!', icon: <FaCheckCircle /> });
      return;
    }

    try {
      const res = await axios.post(`${url}/api/user/register`, formData);
      if (res.data.success && res.data.token) {
        localStorage.setItem('authToken', res.data.token);
        setToast({ visible: true, message: 'Sign Up Successful!', icon: <FaCheckCircle /> });
        return;
      }
      throw new Error(res.data.message || 'Registration failed.');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed.';
      setToast({ visible: true, message: msg, icon: <FaCheckCircle /> });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0fdf4] p-4">
      {toast.visible && <AwesomeToast message={toast.message} icon={toast.icon} />}
      <div className="w-full max-w-md bg-gradient-to-br from-[#bbf7d0] to-[#86efac] p-8 rounded-xl shadow-lg border-4 border-green-700/20 transform transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-green-500 to-lime-600 bg-clip-text text-transparent mb-6 hover:scale-105 transition-transform">
          Create Account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-[#ecfdf5] text-green-900 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-600 transition-all duration-200 hover:scale-[1.02]"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg bg-[#ecfdf5] text-green-900 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-600 transition-all duration-200 hover:scale-[1.02] ${invalidEmail ? 'border-2 border-red-500' : ''}`}
            required
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#ecfdf5] text-green-900 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-600 transition-all duration-200 hover:scale-[1.02]"
              required
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute inset-y-0 right-4 flex items-center text-green-600 hover:text-green-800 transition-colors transform hover:scale-125"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-lime-400 to-green-500 text-white font-bold rounded-lg hover:scale-105 transition-transform duration-300 hover:shadow-lg"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="group inline-flex items-center text-green-600 hover:text-green-800 transition-all duration-300"
          >
            <FaArrowLeft className="mr-2 transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
            <span className="transform group-hover:-translate-x-2 transition-all duration-300">
              Back To Login
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
