import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RestaurantLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://quickbite-backend-6dvr.onrender.com/api/user/login",
        form
      );

      if (!res.data.success) {
        alert(res.data.message);
        return;
      }

      if (res.data.user.role !== "restaurant") {
        alert("Only restaurant owners can login here");
        return;
      }

      // Save token
      localStorage.setItem("authToken", res.data.token);

      // Save correct loginData format
      localStorage.setItem(
        "loginData",
        JSON.stringify({
          _id: res.data.user._id,       // <-- IMPORTANT
          name: res.data.user.name,
          email: res.data.user.email,
          role: res.data.user.role,
        })
      );

      localStorage.setItem("role", "restaurant");

      navigate("/restaurant/dashboard");

    } catch (err) {
      console.error(err);
      alert("Login error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-200 p-6">
      <div className="bg-white w-full max-w-md shadow-xl rounded-2xl p-8 border border-green-100">

        <h2 className="text-3xl font-extrabold text-green-700 text-center mb-6">
          Restaurant Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Don’t have a restaurant account?
          <a href="/apply-restaurant" className="text-green-700 font-semibold ml-1">
            Apply Now
          </a>
        </p>
      </div>
    </div>
  );
};

export default RestaurantLogin;
