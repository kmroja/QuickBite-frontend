import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { GiChefToque } from "react-icons/gi";
import {
  FaUtensils,
  FaList,
  FaShoppingBag,
  FaStore,
  FaBars,
} from "react-icons/fa";
import {
  BuildingStorefrontIcon,
  MapPinIcon,
  PhotoIcon,
  PencilSquareIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

// const API_URL = "http://localhost:4000";
const API_URL = "https://quickbite-backend-6dvr.onrender.com";
const RestaurantProfile = () => {
  const location = useLocation();
  const token = localStorage.getItem("authToken");

  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [restaurantId, setRestaurantId] = useState(null);

  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [form, setForm] = useState({
    name: "",
    description: "",
    cuisine: "",
    address: "",
    image: "",
    status: "",
  });

  const navLinks = [
    { name: "Dashboard", href: "/restaurant/dashboard", icon: <FaStore /> },
    { name: "Menu Items", href: "/restaurant/menu", icon: <FaUtensils /> },
    { name: "Orders", href: "/restaurant/orders", icon: <FaShoppingBag /> },
    { name: "Profile", href: "/restaurant/profile", icon: <FaList /> },
  ];

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const profileRes = await axios.get(
          `${API_URL}/api/restaurants/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const r = profileRes.data.restaurant;
        setRestaurantId(r._id);
        setForm({
          name: r.name || "",
          description: r.description || "",
          cuisine: r.cuisine || "",
          address: r.address || "",
          image: r.image || "",
          status: r.status || "PENDING",
        });

        /* 🔥 FETCH ORDERS FOR STATS */
        const orderRes = await axios.get(
          `${API_URL}/api/orders/restaurant`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const orderList = orderRes.data.orders || [];
        setOrders(orderList);

        const revenue = orderList.reduce(
          (sum, o) => sum + (o.total || 0),
          0
        );
        setTotalRevenue(revenue);
      } catch (err) {
        console.error(err);
        setError("Failed to load restaurant profile");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  /* ================= UPDATE ================= */
  const updateProfile = async () => {
    try {
      await axios.put(
        `${API_URL}/api/restaurants/${restaurantId}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Profile updated successfully");
    } catch (err) {
      alert("❌ Update failed");
    }
  };

  if (loading) {
    return <div className="p-6 text-lg">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`bg-gray-900 text-white h-screen sticky top-0
        transition-all duration-300
        ${collapsed ? "w-20" : "w-72"}`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <GiChefToque className="text-3xl text-yellow-400" />
            {!collapsed && (
              <div>
                <h1 className="font-extrabold text-2xl">QuickBite</h1>
                <p className="text-gray-400 text-sm">Restaurant Panel</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-300 hover:text-white"
          >
            <FaBars />
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-2 px-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition
              ${
                location.pathname === link.href
                  ? "bg-green-600 font-semibold"
                  : "hover:bg-gray-700"
              }`}
            >
              {link.icon}
              {!collapsed && <span>{link.name}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-8 overflow-hidden">
        {/* HEADER */}
        <div className="bg-white rounded-xl shadow p-6 mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <BuildingStorefrontIcon className="h-10 w-10 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold">{form.name}</h1>
              <p className="text-gray-500">{form.cuisine}</p>
            </div>
          </div>

          <span className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold">
            <CheckBadgeIcon className="h-5 w-5" />
            {form.status}
          </span>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* LEFT */}
          <div className="col-span-2 bg-white rounded-xl shadow p-6 flex flex-col justify-between">
            <div>
              <h2 className="font-semibold flex items-center gap-2 mb-4">
                <PencilSquareIcon className="h-5 w-5 text-green-600" />
                Edit Restaurant Details
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <input
                  className="input"
                  placeholder="Restaurant Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />

                <input
                  className="input"
                  placeholder="Cuisine"
                  value={form.cuisine}
                  onChange={(e) =>
                    setForm({ ...form, cuisine: e.target.value })
                  }
                />

                <textarea
                  rows="4"
                  className="input col-span-2"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />

                <div className="col-span-2 flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 text-gray-500" />
                  <input
                    className="input"
                    placeholder="Address"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <button
              onClick={updateProfile}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
            >
              💾 Save Changes
            </button>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
            <div>
              <h2 className="font-semibold flex items-center gap-2 mb-4">
                <PhotoIcon className="h-5 w-5 text-green-600" />
                Restaurant Preview
              </h2>

              {form.image ? (
                <img
                  src={form.image}
                  alt="restaurant"
                  className="h-48 w-full object-cover rounded-xl"
                />
              ) : (
                <div className="h-48 grid place-items-center bg-gray-100 rounded-xl text-gray-400">
                  No Image
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <Stat title="Orders" value={orders.length} />
              <Stat title="Revenue" value={`₹${totalRevenue}`} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* ================= SMALL STAT ================= */
const Stat = ({ title, value }) => (
  <div className="bg-gray-50 rounded-xl p-4 text-center">
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-2xl font-bold text-green-600">{value}</h3>
  </div>
);

export default RestaurantProfile;
