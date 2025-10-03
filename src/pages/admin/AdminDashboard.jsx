// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { navLinksSidebar, styles, layoutClasses, statusStyles } from "../../assets/dummyAdmin.jsx";

const API_URL = "https://quickbite-backend-6dvr.onrender.com";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalOrders: 0, totalRestaurants: 0, pendingOrders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats({
          totalUsers: data.users || 0,
          totalOrders: data.orders || 0,
          totalRestaurants: data.items || 0,
          pendingOrders: data.pendingOrders || 0,
        });
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    };

    const fetchRecentOrders = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentOrders(data.slice(0, 5)); // show only 5 latest
      } catch (err) {
        console.error("Failed to load orders", err);
      }
    };

    const fetchRecentUsers = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentUsers(data.slice(0, 5));
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };

    fetchStats();
    fetchRecentOrders();
    fetchRecentUsers();
  }, []);

  return (
    <div className={styles.pageWrapper}>
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="p-6 text-xl font-bold border-b border-green-700/30">QuickBite Admin</div>
        <nav className="p-6 flex flex-col gap-3">
          {navLinksSidebar.map((link) => (
            <Link key={link.name} to={link.href} className="flex items-center gap-2 p-2 rounded hover:bg-gray-200">
              {link.icon} {link.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className={`${layoutClasses.page} flex-1`}>
        <h1 className={layoutClasses.heading}>Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded shadow"><h2>Total Users</h2><p>{stats.totalUsers}</p></div>
          <div className="bg-white p-6 rounded shadow"><h2>Total Orders</h2><p>{stats.totalOrders}</p></div>
          <div className="bg-white p-6 rounded shadow"><h2>Total Restaurants</h2><p>{stats.totalRestaurants}</p></div>
          <div className="bg-white p-6 rounded shadow"><h2>Pending Orders</h2><p>{stats.pendingOrders}</p></div>
        </div>

        {/* Recent Orders / Users */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
            <ul className="divide-y divide-gray-200">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <li key={order._id} className="py-2 flex justify-between">
                    <span>Order #{order._id}</span>
                    <span className={`${statusStyles[order.status]?.color || "text-gray-500"}`}>
                      {statusStyles[order.status]?.label || order.status}
                    </span>
                  </li>
                ))
              ) : (
                <p>No recent orders</p>
              )}
            </ul>
          </div>

          {/* Recent Users */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
            <ul className="divide-y divide-gray-200">
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <li key={user._id} className="py-2 flex justify-between">
                    <span>{user.username || user.name}</span>
                    <span className="text-gray-500">{user.role}</span>
                  </li>
                ))
              ) : (
                <p>No recent users</p>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
