// src/pages/Restaurants/RestaurantLogin.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// const API_URL = "https://quickbite-backend-6dvr.onrender.com";
const API_URL = "http://localhost:4000";
const RestaurantLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

 const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await axios.post(`${API_URL}/api/user/login`, form);

    if (!res.data.success) {
      alert(res.data.message || "Login failed");
      return;
    }

    if (res.data.user.role !== "restaurant") {
      alert("Only restaurant owners can login here");
      return;
    }

    // ✅ MUST EXIST
    if (!res.data.restaurantId) {
      alert("Restaurant not linked to this account");
      return;
    }

    // ✅ STORE EVERYTHING REQUIRED
   localStorage.setItem("authToken", res.data.token);
localStorage.setItem("restaurantId", res.data.restaurantId);
localStorage.setItem("role", res.data.user.role);

    localStorage.setItem(
      "loginData",
      JSON.stringify({
        id: res.data.user._id,
        email: res.data.user.email,
        role: res.data.user.role,
      })
    );

    navigate("/restaurant/dashboard");
  } catch (err) {
    console.error("Restaurant login error:", err);
    alert("Login error");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-200 p-6">
      <div className="bg-white w-full max-w-md shadow-2xl rounded-2xl p-8 border border-green-100">
        <h2 className="text-3xl font-extrabold text-green-700 text-center mb-6">Restaurant Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input name="email" type="email" onChange={handleChange} required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input name="password" type="password" onChange={handleChange} required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-gray-600 text-sm mt-4">
          Don't have a restaurant account?
          <a href="/apply-restaurant" className="text-green-700 font-semibold ml-1">Apply Now</a>
        </p>
      </div>
    </div>
  );
};

export default RestaurantLogin;
