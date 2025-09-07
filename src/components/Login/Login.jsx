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
const ADMIN_PANEL_URL = 'https://quickbite-adminapp.netlify.app/';

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
  const [showAdminModal, setShowAdminModal] = useState(false);

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

  const isValidGmail = email => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.email.trim() || !isValidGmail(formData.email)) {
      setInvalidEmail(true);
      setToast({ visible: true, message: 'Please enter a valid Gmail address!', isError: true });
      return;
    }
    setInvalidEmail(false);

    try {
      const res = await axios.post(`${url}/api/user/login`, {
        email: formData.email,
        password: formData.password,
      });

      if (res.status === 200 && res.data.success && res.data.token && res.data.user) {
        localStorage.setItem('authToken', res.data.token);

        const userData = {
          id: res.data.user.id || res.data.user._id,
          name: res.data.user.username || res.data.user.name,
          email: res.data.user.email,
          role: res.data.user.role,
        };
        localStorage.setItem('loginData', JSON.stringify(userData));

        window.dispatchEvent(new Event('authChange'));

        formData.rememberMe
          ? localStorage.setItem('rememberMe', JSON.stringify(formData))
          : localStorage.removeItem('rememberMe');

        setToast({ visible: true, message: 'Login successful!', isError: false });

        setTimeout(() => {
          setToast({ visible: false, message: '', isError: false });
          if (userData.role === 'admin') {
            setShowAdminModal(true);
          } else {
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
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl absolute -top-40 -left-40" />
        <div className="w-[500px] h-[500px] bg-green-500/10 rounded-full blur-3xl absolute bottom-0 right-0" />
      </div>

      {/* Toast Notification */}
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

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#142019] p-8 rounded-xl shadow-2xl max-w-sm w-full text-center space-y-4">
            <h2 className="text-2xl font-bold text-amber-400">Admin Logged In</h2>
            <p className="text-amber-100">You are logged in as an Admin. Choose where to go:</p>
            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={() => window.open(ADMIN_PANEL_URL, '_blank')}
                className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition"
              >
                Go to Admin Panel
              </button>
              <button
                onClick={() => {
                  setShowAdminModal(false);
                  navigate('/');
                }}
                className="bg-gray-700 text-amber-300 px-4 py-2 rounded-md hover:bg-gray-800 transition"
              >
                Continue on Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-3xl font-bold text-center text-amber-400 mb-6">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
            <input
              type="email"
              name="email"
              placeholder="Enter your Gmail"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 rounded-lg bg-gray-900/60 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400 focus:outline-none ${
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
              className="w-full pl-10 pr-10 py-3 rounded-lg bg-gray-900/60 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-amber-400 focus:outline-none"
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
              className="h-5 w-5 rounded border-gray-600 text-amber-500 focus:ring-amber-500 bg-gray-700"
            />
            <span className="text-gray-300 text-sm">Remember me</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-500 via-lime-500 to-green-600 text-[#07120a] font-bold rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg"
          >
            Sign In <FaArrowRight />
          </button>
        </form>

        {/* Signup Link */}
        <div className="text-center mt-6">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-500 transition-colors"
          >
            <FaUserPlus /> Create New Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
