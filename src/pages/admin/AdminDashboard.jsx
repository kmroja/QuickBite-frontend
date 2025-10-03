// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { navLinksSidebar, styles, layoutClasses, statusStyles } from "../../assets/dummyAdmin.jsx";

const API_URL = "https://quickbite-backend-6dvr.onrender.com";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRestaurants: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  const token = localStorage.getItem("authToken");
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/stats`, { headers });
      setStats({
        totalUsers: data.totalUsers || 0,
        totalOrders: data.totalOrders || 0,
        totalRestaurants: data.totalRestaurants || 0,
        pendingOrders: data.pendingOrders || 0,
      });
    } catch (err) {
      console.error("Fetch stats error:", err);
    }
  };

  // Fetch recent orders
  const fetchRecentOrders = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/orders`, { headers });
      setRecentOrders(data.slice(0, 5));
    } catch (err) {
      console.error("Fetch recent orders error:", err);
    }
  };

  // Fetch recent users
  const fetchRecentUsers = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/users`, { headers });
      setRecentUsers(data.slice(0, 5));
    } catch (err) {
      console.error("Fetch recent users error:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRecentOrders();
    fetchRecentUsers();
  }, []);

  return (
    <div className="admin-dashboard flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={layoutClasses.sidebar || "w-64 bg-white shadow-lg rounded-xl overflow-hidden"}>
        <div className="p-6 text-xl font-bold border-b border-gray-200">QuickBite Admin</div>
        <nav className="p-6 flex flex-col gap-3">
          {navLinksSidebar.map((link) => (
            <Link key={link.name} to={link.path || link.href} className={styles.sidebarLink || "flex items-center gap-2 p-2 rounded hover:bg-gray-200"}>
              {link.icon} {link.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className={layoutClasses.mainContent || "flex-1 p-6"}>
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={styles.card || "bg-white p-6 rounded shadow"}>
            <h2>Total Users</h2>
            <p className="text-xl font-semibold">{stats.totalUsers}</p>
          </div>
          <div className={styles.card || "bg-white p-6 rounded shadow"}>
            <h2>Total Orders</h2>
            <p className="text-xl font-semibold">{stats.totalOrders}</p>
          </div>
          <div className={styles.card || "bg-white p-6 rounded shadow"}>
            <h2>Total Restaurants</h2>
            <p className="text-xl font-semibold">{stats.totalRestaurants}</p>
          </div>
          <div className={styles.card || "bg-white p-6 rounded shadow"}>
            <h2>Pending Orders</h2>
            <p className="text-xl font-semibold">{stats.pendingOrders}</p>
          </div>
        </div>

        {/* Recent Orders */}
        <section className="mb-6 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Recent Orders</h2>
          <table className="w-full border border-gray-200">
            <thead>
              <tr>
                <th className="border px-2 py-1">Order ID</th>
                <th className="border px-2 py-1">User</th>
                <th className="border px-2 py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="border px-2 py-1">{order._id}</td>
                    <td className="border px-2 py-1">{order.user?.name || "N/A"}</td>
                    <td className={`border px-2 py-1 ${statusStyles[order.status]?.color || "text-gray-500"}`}>
                      {statusStyles[order.status]?.label || order.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-2 text-gray-500">No recent orders</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Recent Users */}
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Recent Users</h2>
          <ul className="divide-y divide-gray-200">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <li key={user._id} className="py-2 flex justify-between">
                  <span>{user.name || user.username}</span>
                  <span className="text-gray-500">{user.email}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No recent users</p>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
