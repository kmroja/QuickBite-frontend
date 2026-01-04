import React, { useEffect, useRef, useState } from "react";
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

const API_URL = "https://quickbite-backend-6dvr.onrender.com";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-700 border-blue-300",
  delivered: "bg-green-100 text-green-700 border-green-300",
  cancelled: "bg-red-100 text-red-700 border-red-300",
};

const filterButtons = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
];

const RestaurantOrders = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // 🔥 FIX: sidebar visible by default
  const [collapsed, setCollapsed] = useState(false);

  const token = localStorage.getItem("authToken");
  const prevOrderCount = useRef(0);
  const audioRef = useRef(null);

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async (playSound = false) => {
    try {
      const res = await axios.get(`${API_URL}/api/orders/restaurant`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newOrders = res.data.orders || [];

      if (playSound && newOrders.length > prevOrderCount.current) {
        audioRef.current?.play();
      }

      prevOrderCount.current = newOrders.length;
      setOrders(newOrders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => fetchOrders(true), 10000);
    return () => clearInterval(interval);
  }, []);

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (orderId, status) => {
    await axios.put(
      `${API_URL}/api/orders/${orderId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchOrders();
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => o.status === filter);

  const pendingCount = orders.filter(o => o.status === "pending").length;
  const confirmedCount = orders.filter(o => o.status === "confirmed").length;

  const navLinks = [
    { name: "Dashboard", href: "/restaurant/dashboard", icon: <FaStore /> },
    { name: "Menu Items", href: "/restaurant/menu", icon: <FaUtensils /> },
    { name: "Orders", href: "/restaurant/orders", icon: <FaShoppingBag /> },
    { name: "Profile", href: "/restaurant/profile", icon: <FaList /> },
  ];

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ========== SIDEBAR ========== */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white z-50
        transition-all duration-300
        ${collapsed ? "w-20" : "w-72"}`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <GiChefToque className="text-3xl text-yellow-400" />
            {!collapsed && (
              <div>
                <h1 className="font-extrabold text-2xl">QuickBite</h1>
                <p className="text-gray-300 text-sm">Restaurant Panel</p>
              </div>
            )}
          </div>

          {/* TOGGLE BUTTON */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-300 hover:text-white"
          >
            <FaBars />
          </button>
        </div>

        {/* NAV */}
        <nav className="mt-6 flex flex-col gap-2 px-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg
              transition
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

      {/* ========== MAIN CONTENT ========== */}
      <main
        className={`flex-1 p-8 transition-all duration-300
        ${collapsed ? "ml-20" : "ml-72"}`}
      >
        <audio
          ref={audioRef}
          src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
          preload="auto"
        />

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">📦 Restaurant Orders</h1>

          <div className="flex gap-2">
            {filterButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold
                ${
                  filter === btn.value
                    ? "bg-black text-white"
                    : "bg-white border hover:bg-gray-100"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* STATS */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <StatCard title="Total Orders" value={orders.length} />
          <StatCard title="Pending" value={pendingCount} color="yellow" />
          <StatCard title="Confirmed" value={confirmedCount} color="blue" />
        </div>

        {/* ORDERS */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow border">
              <div className="flex justify-between px-6 py-4 bg-gray-50 border-b">
                <div>
                  <p className="font-semibold">
                    Order #{order._id.slice(-6)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(order._id, e.target.value)
                  }
                  className={`px-3 py-1 rounded-full border text-sm
                  ${statusStyles[order.status]}`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="px-6 py-4 text-sm">
                <p className="font-semibold">Customer</p>
                <p>{order.firstName} {order.lastName}</p>
                <p>{order.phone}</p>
                <p className="text-gray-500">{order.email}</p>
              </div>

              <div className="px-6 py-4 border-t">
                {order.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{i.item.name} × {i.quantity}</span>
                    <span>₹{i.item.price * i.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 border-t bg-gray-50 font-bold flex justify-between">
                <span>Total</span>
                <span className="text-green-700">₹{order.total}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

/* ========== SMALL STAT CARD COMPONENT ========== */
const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-xl shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default RestaurantOrders;
