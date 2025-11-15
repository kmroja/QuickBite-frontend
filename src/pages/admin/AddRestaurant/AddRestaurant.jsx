import React, { useState } from "react";
import axios from "axios";
import { GiChefToque } from "react-icons/gi";
import { navLinksSidebar } from "../../../assets/dummyAdmin.jsx";

const AddRestaurant = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    cuisineType: "",
    description: "",
    openingHours: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const token = localStorage.getItem("authToken");
  const headers = { Authorization: `Bearer ${token}` };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (imageFile) data.append("image", imageFile);

      const response = await axios.post(
        "https://quickbite-backend-6dvr.onrender.com/api/restaurants",
        data,
        { headers }
      );

      alert("Restaurant added successfully!");
      setFormData({ name: "", location: "", cuisineType: "", description: "", openingHours: "" });
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to add restaurant.");
    } finally {
      setLoading(false);
    }
  };

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
        <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
          <h2 className="text-3xl font-extrabold text-green-700 mb-6">Add New Restaurant</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Restaurant Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-green-300"
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-green-300"
              required
            />
            <input
              type="text"
              name="cuisineType"
              placeholder="Cuisine Type"
              value={formData.cuisineType}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-green-300"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-green-300"
            />
            <input
              type="text"
              name="openingHours"
              placeholder="Opening Hours (e.g., 9AM-9PM)"
              value={formData.openingHours}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-green-300"
            />
            <input type="file" onChange={handleImageChange} className="w-full p-2 border rounded" />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              {loading ? "Adding..." : "Add Restaurant"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddRestaurant;
