import React, { useState } from "react";
import axios from "axios";
import { FiUpload, FiHeart, FiStar } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import { GiChefToque } from "react-icons/gi";
import { navLinksSidebar, layoutClasses, styles } from "../../../assets/dummyAdmin.jsx";

const AddItems = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    rating: 0,
    hearts: 0,
    image: null,
    preview: "",
  });

  const [categories] = useState([
    "Breakfast", "Lunch", "Dinner", "Mexican", "Italian", "Desserts", "Drinks",
  ]);
  const [hoverRating, setHoverRating] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  const token = localStorage.getItem("authToken");
  const headers = { Authorization: `Bearer ${token}` };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file, preview: URL.createObjectURL(file) }));
    }
  };

  const handleRating = (rating) => setFormData((prev) => ({ ...prev, rating }));
  const handleHearts = () => setFormData((prev) => ({ ...prev, hearts: prev.hearts + 1 }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, val]) => key !== "preview" && payload.append(key, val));

      await axios.post(
        "https://quickbite-backend-6dvr.onrender.com/api/items",
        payload,
        { headers: { "Content-Type": "multipart/form-data", ...headers } }
      );

      setFormData({ name: "", description: "", category: "", price: "", rating: 0, hearts: 0, image: null, preview: "" });
      alert("Item added successfully!");
    } catch (err) {
      console.error(err.response || err.message);
      alert("Failed to add item.");
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#f0fdf4] to-[#c7e9c0] shadow-2xl rounded-2xl p-8">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-lime-500 mb-6">
              Add New Menu Item
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <label className="block border-4 border-green-400 rounded-lg cursor-pointer overflow-hidden hover:scale-105 transition-transform">
                {formData.preview ? (
                  <img src={formData.preview} alt="Preview" className="w-full h-64 object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-green-600">
                    <FiUpload size={40} />
                    <p className="mt-2">Click to upload product image</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" required />
              </label>

              {/* Form Fields */}
              <div className="space-y-4">
                <input
                  type="text" name="name" placeholder="Product Name"
                  value={formData.name} onChange={handleInputChange}
                  className="w-full p-3 rounded border focus:ring-2 focus:ring-green-300"
                  required
                />
                <textarea
                  name="description" placeholder="Description"
                  value={formData.description} onChange={handleInputChange}
                  className="w-full p-3 rounded border h-32 focus:ring-2 focus:ring-green-300"
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select
                    name="category" value={formData.category} onChange={handleInputChange}
                    className="p-3 rounded border focus:ring-2 focus:ring-green-300"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <div className="relative">
                    <FaRupeeSign className="absolute top-3 left-3 text-lime-700" />
                    <input
                      type="number" name="price" placeholder="Price" min="0" step="0.01"
                      value={formData.price} onChange={handleInputChange}
                      className="w-full pl-10 p-3 rounded border focus:ring-2 focus:ring-green-300"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-1">
                    <span className="mr-2 font-semibold">Rating:</span>
                    {[1,2,3,4,5].map((star) => (
                      <button key={star} type="button"
                        onClick={() => handleRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-2xl"
                      >
                        <FiStar className={star <= (hoverRating || formData.rating) ? "text-green-500" : "text-green-200"} />
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={handleHearts} className="text-2xl text-green-600 hover:text-green-800">
                      <FiHeart />
                    </button>
                    <input type="number" name="hearts" value={formData.hearts} onChange={handleInputChange} className="p-2 rounded border w-full" />
                  </div>
                </div>

                <button type="submit" className="w-full py-3 bg-gradient-to-r from-green-600 to-lime-500 text-white font-bold rounded-lg hover:scale-105 transition-transform">
                  Add to Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddItems;
