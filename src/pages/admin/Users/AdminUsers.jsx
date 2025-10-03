// src/pages/admin/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { navLinksSidebar, styles, layoutClasses } from "../../assets/dummyAdmin.jsx";
import AdminNavbar from "./Navbar/Navbar.jsx";

const API_URL = "https://quickbite-backend-6dvr.onrender.com";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("authToken");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/admin/users`, { headers });
        setUsers(data);
      } catch (err) {
        console.error("Fetch users error:", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <AdminNavbar />

      <div className="flex flex-1 bg-gray-100">
        {/* Sidebar */}
        <aside className={layoutClasses.sidebar || "w-64 bg-white shadow-lg rounded-xl overflow-hidden"}>
          <div className="p-6 text-xl font-bold border-b border-gray-200">QuickBite Admin</div>
          <nav className="p-6 flex flex-col gap-3">
            {navLinksSidebar.map((link) => (
              <Link
                key={link.name}
                to={link.path || link.href}
                className={styles.sidebarLink || "flex items-center gap-2 p-2 rounded hover:bg-gray-200"}
              >
                {link.icon} {link.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className={layoutClasses.mainContent || "flex-1 p-6"}>
          <h1 className="text-2xl font-bold mb-6">All Users</h1>

          <div className="bg-white p-6 rounded shadow">
            <table className="w-full table-auto border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-4 py-2 text-left">Name</th>
                  <th className="border px-4 py-2 text-left">Email</th>
                  <th className="border px-4 py-2 text-left">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{user.name || user.username}</td>
                      <td className="border px-4 py-2">{user.email}</td>
                      <td className="border px-4 py-2 capitalize">{user.role}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;
