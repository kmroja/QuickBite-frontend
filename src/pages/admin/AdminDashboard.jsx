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
    <div className="admin-dashboard flex">
      {/* Sidebar */}
      <aside className={layoutClasses.sidebar}>
        {navLinksSidebar.map((link) => (
          <Link key={link.name} to={link.path} className={styles.sidebarLink}>
            {link.icon} {link.name}
          </Link>
        ))}
      </aside>

      {/* Main content */}
      <main className={layoutClasses.mainContent}>
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

        {/* Stats cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className={styles.card}>Total Users: {stats.totalUsers}</div>
          <div className={styles.card}>Total Orders: {stats.totalOrders}</div>
          <div className={styles.card}>Total Restaurants: {stats.totalRestaurants}</div>
          <div className={styles.card}>Pending Orders: {stats.pendingOrders}</div>
        </div>

        {/* Recent Orders */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Recent Orders</h2>
          <table className="w-full border">
            <thead>
              <tr>
                <th className="border px-2">Order ID</th>
                <th className="border px-2">User</th>
                <th className="border px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id}>
                  <td className="border px-2">{order._id}</td>
                  <td className="border px-2">{order.user?.name || "N/A"}</td>
                  <td className={`border px-2 ${statusStyles[order.status] || ""}`}>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Recent Users */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Recent Users</h2>
          <ul>
            {recentUsers.map((user) => (
              <li key={user._id}>
                {user.name} - {user.email}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
