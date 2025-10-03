import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiUser, FiEdit2, FiTrash2, FiSearch, FiCalendar } from "react-icons/fi";
import { GiShoppingBag } from "react-icons/gi";
import { navLinksSidebar, layoutClasses, styles, statusStyles } from "../../../assets/dummyAdmin.jsx";

const API_URL = "https://quickbite-backend-6dvr.onrender.com";

const roleBadgeColors = {
  admin: "bg-green-700/30 text-green-100",
  user: "bg-blue-700/30 text-blue-100",
  moderator: "bg-amber-700/30 text-amber-100",
  default: "bg-gray-700/30 text-gray-100",
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });
  const [collapsed, setCollapsed] = useState(false);

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

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openEditUser = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name || user.username, email: user.email, role: user.role });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/admin/users/${editingUser._id}`, formData, { headers });
      setUsers((prev) =>
        prev.map((u) => (u._id === editingUser._id ? { ...u, ...formData } : u))
      );
      setEditingUser(null);
      alert("User updated successfully!");
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API_URL}/api/admin/users/${id}`, { headers });
      setUsers((prev) => prev.filter((u) => u._id !== id));
      alert("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  const openDetails = async (user) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/users/${user._id}`, { headers });
      setSelectedUser({ ...user, ...data });
    } catch (err) {
      console.error("Error fetching user details:", err);
      alert("Failed to fetch details");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl flex flex-col transition-all duration-500 ease-in-out
        ${collapsed ? "w-20" : "w-72"}`}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
      >
        <div className="flex items-center gap-3 p-6 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition">
          <GiShoppingBag className="text-3xl text-yellow-400 transform hover:scale-125 transition-transform" />
          {!collapsed && (
            <div>
              <h1 className="font-extrabold text-2xl tracking-wider">QuickBite</h1>
              <p className="text-gray-300 text-sm font-medium">Admin Dashboard</p>
            </div>
          )}
        </div>
        <nav className="flex flex-col mt-6 gap-2 px-2">
          {navLinksSidebar.map((link) => {
            const isActive = window.location.pathname === link.href;
            return (
              <a
                key={link.name}
                href={link.href || link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive ? "bg-gradient-to-r from-green-500 to-green-700 font-semibold shadow-md" : "hover:bg-gray-700 hover:shadow-sm"
                }`}
              >
                <div className="text-lg">{link.icon}</div>
                {!collapsed && <span className="font-medium">{link.name}</span>}
              </a>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-500 ease-in-out ${collapsed ? "ml-20" : "ml-72"} p-8`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-green-700 mb-6">Users</h2>

          {/* Search */}
          <div className="flex items-center mb-6 gap-2 bg-gray-100 px-4 py-2 rounded-lg shadow-inner max-w-md">
            <FiSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
            />
          </div>

          {/* Users Cards */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredUsers.length > 0 ? filteredUsers.map((user) => {
              const roleClass = roleBadgeColors[user.role?.toLowerCase()] || roleBadgeColors.default;
              return (
                <div
                  key={user._id}
                  className="bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FiUser className="text-green-600 text-xl" />
                    <h3 className="text-gray-800 font-semibold">{user.name || user.username}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                  <span className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${roleClass}`}>
                    {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                  </span>

                  <div className="mt-4 flex justify-between text-gray-700">
                    <FiEdit2 className="cursor-pointer text-blue-600 hover:text-blue-800" onClick={() => openEditUser(user)} />
                    <FiTrash2 className="cursor-pointer text-red-600 hover:text-red-800" onClick={() => handleDelete(user._id)} />
                    <FiCalendar className="cursor-pointer text-green-600 hover:text-green-800" onClick={() => openDetails(user)} />
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-full text-center py-6 text-gray-500 font-medium">No users found</div>
            )}
          </div>

          {/* Edit / Details Popup (glassmorphism inline) */}
          {(editingUser || selectedUser) && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 w-full max-w-md shadow-2xl border-2 border-green-700/20">
                {editingUser ? (
                  <>
                    <h3 className="text-xl font-bold mb-4">Edit User</h3>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={styles.inputField}
                        placeholder="Name"
                        required
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={styles.inputField}
                        placeholder="Email"
                        required
                      />
                      <select name="role" value={formData.role} onChange={handleInputChange} className={styles.inputField}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="moderator">Moderator</option>
                      </select>
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 rounded border hover:bg-gray-100">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
                      </div>
                    </form>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold mb-4">User Details</h3>
                    <p className="text-gray-800"><span className="font-semibold">Name:</span> {selectedUser.name || selectedUser.username}</p>
                    <p className="text-gray-800"><span className="font-semibold">Email:</span> {selectedUser.email}</p>
                    <p className="text-gray-800"><span className="font-semibold">Role:</span> {selectedUser.role}</p>
                    <p className="text-gray-800"><span className="font-semibold">Joined:</span> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                    <p className="text-gray-800"><span className="font-semibold">Total Orders:</span> {selectedUser.ordersCount || 0}</p>
                    <div className="flex justify-end mt-4">
                      <button onClick={() => setSelectedUser(null)} className="px-4 py-2 rounded border hover:bg-gray-100">Close</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
