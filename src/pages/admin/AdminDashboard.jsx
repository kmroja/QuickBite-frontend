import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { FaUsers, FaClipboardList, FaBoxOpen, FaHourglassHalf } from "react-icons/fa";
import { GiChefToque } from "react-icons/gi";
import { navLinksSidebar, statusStyles } from "../../assets/dummyAdmin.jsx";

const API_URL = "https://quickbite-backend-6dvr.onrender.com";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalOrders: 0, totalItems: 0, pendingOrders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const token = localStorage.getItem("authToken");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/admin/stats`, { headers });
        setStats({
          totalUsers: data.totalUsers || 0,
          totalOrders: data.totalOrders || 0,
          totalItems: data.totalItems || 0,
          pendingOrders: data.pendingOrders || 0,
        });
        setRecentOrders(data.recentOrders || []);
        setRecentUsers(data.recentUsers || []);
      } catch (err) {
        console.error("Fetch stats error:", err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <FaUsers size={24} className="text-white" />,
      bg: "from-green-400 to-green-600",
      trend: "+12%",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <FaClipboardList size={24} className="text-white" />,
      bg: "from-blue-400 to-blue-600",
      trend: "+8%",
    },
    {
      title: "Total Items",
      value: stats.totalItems,
      icon: <FaBoxOpen size={24} className="text-white" />,
      bg: "from-purple-400 to-purple-600",
      trend: "+5%",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: <FaHourglassHalf size={24} className="text-white" />,
      bg: "from-red-400 to-red-600",
      trend: "-3%",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl flex flex-col
          transition-all duration-500 ease-in-out ${collapsed ? "w-20" : "w-72"}`}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition">
          <GiChefToque className="text-3xl text-yellow-400 transform hover:scale-125 transition-transform" />
          {!collapsed && (
            <div>
              <h1 className="font-extrabold text-2xl tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
                QuickBite
              </h1>
              <p className="text-gray-300 text-sm font-medium">Admin Dashboard</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col mt-6 gap-2 px-2">
          {navLinksSidebar.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive ? "bg-gradient-to-r from-green-500 to-green-700 font-semibold shadow-md" : "hover:bg-gray-700 hover:shadow-sm"
                }`}
              >
                <div className="text-lg">{link.icon}</div>
                {!collapsed && <span className="font-medium">{link.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-500 ease-in-out ${collapsed ? "ml-20" : "ml-72"} p-8`}>
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900" style={{ fontFamily: "'Roboto Slab', serif" }}>
          Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, idx) => (
            <div
              key={idx}
              className={`relative bg-gradient-to-r ${card.bg} p-4 rounded-2xl shadow-lg flex flex-col items-start gap-2 transform hover:scale-105 hover:shadow-2xl transition-transform cursor-pointer`}
            >
              <div className="p-3 bg-white/20 rounded-full">{card.icon}</div>
              <div>
                <p className="text-white text-xl font-bold">{card.value}</p>
                <p className="text-white/90 text-sm">{card.title}</p>
              </div>
              {/* Trend Indicator */}
              <div className="mt-2 text-white/80 text-xs">{card.trend} this week</div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Recent Orders
          </h2>
          <div className="overflow-x-auto bg-white rounded-2xl shadow p-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wide">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wide">User</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-600 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {recentOrders.length > 0
                  ? recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 text-sm font-mono text-gray-800">#{order._id.slice(-6)}</td>
                        <td className="px-6 py-3 text-sm text-gray-700">{order.user?.username || order.user?.name || "N/A"}</td>
                        <td
                          className={`px-6 py-2 text-sm font-semibold ${statusStyles[order.status]?.color || "text-gray-500"} bg-gray-100 rounded-full text-center`}
                        >
                          {statusStyles[order.status]?.label || order.status}
                        </td>
                      </tr>
                    ))
                  : (
                      <tr>
                        <td colSpan={3} className="text-center py-4 text-gray-500">
                          No recent orders
                        </td>
                      </tr>
                    )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Users */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Recent Users
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentUsers.length > 0
              ? recentUsers.map((user) => (
                  <div key={user._id} className="bg-white p-3 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 transition-all flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold text-base">
                      {user.name?.[0] || user.username?.[0]}
                    </div>
                    <p className="mt-2 text-sm font-semibold text-gray-800 truncate">{user.name || user.username}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                ))
              : (
                  <p className="text-gray-500">No recent users</p>
                )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
