import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiTrash2, FiEdit2, FiStar } from "react-icons/fi";
import { GiChefToque } from "react-icons/gi";
import { navLinksSidebar } from "../../../assets/dummyAdmin.jsx";

const ListRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRest, setEditingRest] = useState(null);
  const [formData, setFormData] = useState({ name: "", location: "", cuisineType: "", description: "", openingHours: "" });
  const [collapsed, setCollapsed] = useState(false);

  const token = localStorage.getItem("authToken");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await axios.get("https://quickbite-backend-6dvr.onrender.com/api/restaurants", { headers });
        setRestaurants(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this restaurant?")) return;
    try {
      await axios.delete(`https://quickbite-backend-6dvr.onrender.com/api/restaurants/${id}`, { headers });
      setRestaurants((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (rest) => {
    setEditingRest(rest);
    setFormData({ name: rest.name, location: rest.location, cuisineType: rest.cuisineType, description: rest.description, openingHours: rest.openingHours });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = { ...formData };
      await axios.put(`https://quickbite-backend-6dvr.onrender.com/api/restaurants/${editingRest._id}`, updated, { headers });
      setRestaurants((prev) => prev.map((r) => (r._id === editingRest._id ? { ...r, ...updated } : r)));
      setEditingRest(null);
      alert("Restaurant updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update restaurant.");
    }
  };

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => <FiStar key={i} className={`text-xl ${i < rating ? "text-amber-400 fill-current" : "text-amber-100/30"}`} />);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl flex flex-col
          transition-all duration-500 ease-in-out ${collapsed ? "w-20" : "w-72"}`}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
      >
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
          <h2 className="text-3xl font-extrabold text-green-700 mb-6">Manage Restaurants</h2>
          {restaurants.length === 0 ? (
            <div className="text-center text-gray-500 py-20">No restaurants found</div>
          ) : (
            <div className="overflow-x-auto shadow-lg rounded-xl">
              <table className="min-w-full bg-white rounded-xl">
                <thead className="bg-green-100">
                  <tr>
                    <th className="p-3">Image</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Cuisine</th>
                    <th className="p-3">Opening Hours</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurants.map((rest) => (
                    <tr key={rest._id} className="hover:bg-green-50 transition">
                      <td className="p-3 w-28">
                        {rest.imageUrl ? <img src={rest.imageUrl} alt={rest.name} className="w-20 h-20 object-cover rounded" /> : "No Image"}
                      </td>
                      <td className="p-3">{rest.name}</td>
                      <td className="p-3">{rest.location}</td>
                      <td className="p-3">{rest.cuisineType}</td>
                      <td className="p-3">{rest.openingHours}</td>
                      <td className="p-3 text-center flex justify-center gap-2">
                        <button onClick={() => openEdit(rest)} className="text-blue-600 hover:text-blue-800">
                          <FiEdit2 className="text-lg" />
                        </button>
                        <button onClick={() => handleDelete(rest._id)} className="text-red-600 hover:text-red-800">
                          <FiTrash2 className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {editingRest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-green-600">Edit Restaurant</h3>
            <form className="space-y-4" onSubmit={handleEditSubmit}>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded focus:ring-2 focus:ring-green-300" required />
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full p-2 border rounded focus:ring-2 focus:ring-green-300" required />
              <input type="text" name="cuisineType" value={formData.cuisineType} onChange={handleChange} placeholder="Cuisine Type" className="w-full p-2 border rounded focus:ring-2 focus:ring-green-300" required />
              <input type="text" name="openingHours" value={formData.openingHours} onChange={handleChange} placeholder="Opening Hours" className="w-full p-2 border rounded focus:ring-2 focus:ring-green-300" />
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded focus:ring-2 focus:ring-green-300" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setEditingRest(null)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListRestaurants;
