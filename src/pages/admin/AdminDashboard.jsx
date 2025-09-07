// src/pages/admin/AdminDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { navLinksSidebar, styles, layoutClasses, statusStyles } from "../../assets/dummyAdmin.jsx";


const AdminDashboard = () => {
  // Example stats (replace with API fetch later)
  const stats = {
    totalUsers: 120,
    totalOrders: 85,
    totalRestaurants: 15,
    pendingOrders: 7,
  };

  // Example recent orders
  const recentOrders = [
    { id: 123, status: "processing" },
    { id: 122, status: "succeeded" },
    { id: 121, status: "delivered" },
  ];

  // Example recent users
  const recentUsers = [
    { name: "John Doe", role: "user" },
    { name: "Jane Smith", role: "admin" },
    { name: "Mike Johnson", role: "user" },
  ];

  return (
    <div className={styles.pageWrapper}>
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="p-6 text-xl font-bold border-b border-green-700/30">QuickBite Admin</div>
        <nav className="p-6 flex flex-col gap-3">
          {navLinksSidebar.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
            >
              {link.icon} {link.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className={`${layoutClasses.page} flex-1`}>
        <h1 className={layoutClasses.heading}>Admin Dashboard</h1>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-gray-500">Total Users</h2>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-gray-500">Total Orders</h2>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-gray-500">Total Restaurants</h2>
            <p className="text-2xl font-bold">{stats.totalRestaurants}</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-gray-500">Pending Orders</h2>
            <p className="text-2xl font-bold">{stats.pendingOrders}</p>
          </div>
        </div>

        {/* Recent Orders / Users Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
            <ul className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <li key={order.id} className="py-2 flex justify-between">
                  <span>Order #{order.id}</span>
                  <span className={`${statusStyles[order.status].color}`}>
                    {statusStyles[order.status].label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Users */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
            <ul className="divide-y divide-gray-200">
              {recentUsers.map((user, index) => (
                <li key={index} className="py-2 flex justify-between">
                  <span>{user.name}</span>
                  <span className="text-gray-500">{user.role}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
