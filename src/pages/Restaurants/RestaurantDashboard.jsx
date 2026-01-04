// src/pages/Restaurants/RestaurantDashboard.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { GiChefToque } from "react-icons/gi";
import { FaUtensils, FaList, FaShoppingBag, FaStore } from "react-icons/fa";

const API_URL = "https://quickbite-backend-6dvr.onrender.com";

const RestaurantDashboard = () => {
  const location = useLocation();
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      try {
        if (!token) throw new Error("No token found");

        /* ================= VERIFY USER ================= */
        const verifyRes = await axios.get(`${API_URL}/api/user/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = verifyRes.data.user || verifyRes.data;
        const userId = user._id || user.id;

        if (!userId) throw new Error("User ID missing");

        /* ================= GET RESTAURANT ================= */
        const restRes = await axios.get(
          `${API_URL}/api/restaurants/owner/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const restaurantData = restRes.data.restaurant;
        setRestaurant(restaurantData);

        /* ================= GET ORDERS (🔥 FIXED) ================= */
        try {
          const ordersRes = await axios.get(
            `${API_URL}/api/orders/restaurant`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
        } catch (orderErr) {
          console.error("❌ Orders fetch failed:", orderErr);
          setOrders([]); // ❗ do NOT clear restaurant
        }
      } catch (err) {
        console.error("❌ Dashboard Error:", err);
        setRestaurant(null);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token]);

  /* ================= UI STATES ================= */
  if (loading) return <div className="p-6 text-lg">Loading Dashboard...</div>;

  if (!restaurant)
    return (
      <div className="p-6 text-red-600 font-semibold">
        No restaurant found for this account.
      </div>
    );

  const navLinks = [
    { name: "Dashboard", href: "/restaurant/dashboard", icon: <FaStore /> },
    { name: "Menu Items", href: "/restaurant/menu", icon: <FaUtensils /> },
    { name: "Orders", href: "/restaurant/orders", icon: <FaShoppingBag /> },
    { name: "Profile", href: "/restaurant/profile", icon: <FaList /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-500 ${
          collapsed ? "w-20" : "w-72"
        }`}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
      >
        <div className="flex items-center gap-3 p-5 border-b border-gray-700">
          <GiChefToque className="text-3xl text-yellow-400" />
          {!collapsed && (
            <div>
              <h1 className="font-extrabold text-2xl">QuickBite</h1>
              <p className="text-gray-300 text-sm">Restaurant Panel</p>
            </div>
          )}
        </div>

        <nav className="flex flex-col mt-5 gap-2 px-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${
                location.pathname === link.href
                  ? "bg-green-600 font-semibold"
                  : "hover:bg-gray-700"
              }`}
            >
              <div className="text-lg">{link.icon}</div>
              {!collapsed && <span>{link.name}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <main
        className={`flex-1 p-8 transition-all duration-500 ${
          collapsed ? "ml-20" : "ml-72"
        }`}
      >
        <h1 className="text-3xl font-bold mb-6">Restaurant Dashboard</h1>

        <div className="bg-white shadow rounded-xl p-6 flex gap-6 mb-10">
          {restaurant.image?.startsWith("http") && (
            <img
              src={restaurant.image}
              className="w-40 h-40 rounded-xl object-cover"
            />
          )}

          <div>
            <h2 className="text-2xl font-bold">{restaurant.name}</h2>
            <p className="text-gray-600">{restaurant.cuisine}</p>
            <p className="mt-2">{restaurant.description}</p>
            <p className="mt-3 font-semibold">
              Status:{" "}
              <span className="text-green-600">{restaurant.status}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-green-600 text-white p-6 rounded-xl">
            <p>Total Menu Items</p>
            <h3 className="text-3xl font-bold">
              {restaurant.menu?.length || 0}
            </h3>
          </div>

          <div className="bg-blue-600 text-white p-6 rounded-xl">
            <p>Total Orders</p>
            <h3 className="text-3xl font-bold">{orders.length}</h3>
          </div>

          <div className="bg-purple-600 text-white p-6 rounded-xl">
            <p>Rating</p>
            <h3 className="text-3xl font-bold">
              {restaurant.rating ?? "N/A"}
            </h3>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RestaurantDashboard;
