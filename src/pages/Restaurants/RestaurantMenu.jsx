import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { GiChefToque } from "react-icons/gi";
import {
  FaUtensils,
  FaList,
  FaShoppingBag,
  FaStore,
} from "react-icons/fa";

const API = "https://quickbite-backend-6dvr.onrender.com";

const MenuManagement = () => {
  const location = useLocation();
  const [menu, setMenu] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  const [image, setImage] = useState(null);

  const restaurantId = localStorage.getItem("restaurantId");
  const token = localStorage.getItem("authToken");

  /* ================= FETCH MENU ================= */
  useEffect(() => {
    if (!restaurantId) {
      alert("Restaurant ID missing. Please login again.");
      return;
    }
    fetchMenu();
  }, [restaurantId]);

  const fetchMenu = async () => {
    try {
      const res = await axios.get(`${API}/api/items/my-items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenu(res.data.items || []);
    } catch (err) {
      console.error("Fetch menu error:", err);
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    data.append("restaurantId", restaurantId);
    if (image) data.append("image", image);

    setLoading(true);

    try {
      if (editingId) {
        await axios.put(`${API}/api/items/${editingId}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API}/api/items`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      resetForm();
      fetchMenu();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      description: item.description || "",
      price: item.price,
      category: item.category || "",
    });
    setImage(null);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await axios.delete(`${API}/api/items/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchMenu();
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", description: "", price: "", category: "" });
    setImage(null);
  };

  const navLinks = [
    { name: "Dashboard", href: "/restaurant/dashboard", icon: <FaStore /> },
    { name: "Menu Items", href: "/restaurant/menu", icon: <FaUtensils /> },
    { name: "Orders", href: "/restaurant/orders", icon: <FaShoppingBag /> },
    { name: "Profile", href: "/restaurant/profile", icon: <FaList /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ========== SIDEBAR ========== */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-500 ${
          collapsed ? "w-20" : "w-72"
        }`}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
      >
        <div className="flex items-center gap-3 p-5 border-b border-gray-700">
          <GiChefToque className="text-3xl text-yellow-400" />
          {!collapsed && (
            <div>
              <h1 className="font-extrabold text-2xl">QuickBite</h1>
              <p className="text-gray-300 text-sm">Restaurant Panel</p>
            </div>
          )}
        </div>

        <nav className="flex flex-col mt-5 gap-2 px-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                location.pathname === link.href
                  ? "bg-green-600 font-semibold"
                  : "hover:bg-gray-700"
              }`}
            >
              {link.icon}
              {!collapsed && <span>{link.name}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <main
        className={`flex-1 p-8 transition-all duration-500 ${
          collapsed ? "ml-20" : "ml-72"
        }`}
      >
        <h1 className="text-3xl font-bold text-green-700 mb-8">
          Menu Management
        </h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 mb-10"
        >
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Item" : "Add New Item"}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Item Name"
              className="border px-4 py-2 rounded-lg"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <input
              type="number"
              placeholder="Price"
              className="border px-4 py-2 rounded-lg"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />

            <input
              placeholder="Category"
              className="border px-4 py-2 rounded-lg md:col-span-2"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />

            <textarea
              placeholder="Description"
              className="border px-4 py-2 rounded-lg md:col-span-2"
              rows="3"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <input
              type="file"
              accept="image/*"
              className="border px-4 py-2 rounded-lg md:col-span-2"
              onChange={(e) => setImage(e.target.files[0])}
              required={!editingId}
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg">
              {loading ? "Saving..." : editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* MENU LIST */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {menu.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow">
              <img
                src={`${API}/uploads/${item.imageUrl}`}
                className="h-40 w-full object-cover rounded-t-xl"
              />
              <div className="p-4">
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.category}</p>
                <p className="font-semibold text-green-700 mt-1">
                  ₹{item.price}
                </p>

                <div className="flex justify-between mt-3">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MenuManagement;
