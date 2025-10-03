import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiTrash2, FiStar, FiEdit2 } from "react-icons/fi";
import { GiChefToque } from "react-icons/gi";
import { navLinksSidebar, layoutClasses, styles } from "../../../assets/dummyAdmin.jsx";

const ListItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", category: "", price: "" });
  const [collapsed, setCollapsed] = useState(false);

  const token = localStorage.getItem("authToken");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await axios.get("https://quickbite-backend-6dvr.onrender.com/api/items", { headers });
        setItems(data);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`https://quickbite-backend-6dvr.onrender.com/api/items/${itemId}`, { headers });
      setItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedItem = { ...formData };
      await axios.put(
        `https://quickbite-backend-6dvr.onrender.com/api/items/${editingItem._id}`,
        updatedItem,
        { headers }
      );
      setItems((prev) => prev.map((it) => (it._id === editingItem._id ? { ...it, ...updatedItem } : it)));
      setEditingItem(null);
      alert("Item updated successfully!");
    } catch (err) {
      console.error("Error updating item:", err);
      alert("Failed to update item.");
    }
  };

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        className={`text-xl ${i < rating ? "text-amber-400 fill-current" : "text-amber-100/30"}`}
      />
    ));

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center text-amber-100 bg-gray-100">Loading menu…</div>
      </div>
    );
  }

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
          <div className="bg-white shadow-2xl rounded-2xl p-8">
            <h2 className="text-3xl font-extrabold text-green-700 mb-6">Manage Menu Items</h2>

            {items.length === 0 ? (
              <div className="text-center text-gray-500 py-20 text-lg">No items found in the menu</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left rounded-lg overflow-hidden shadow-sm">
                  <thead className="bg-green-100">
                    <tr>
                      <th className="p-3 border-b">Image</th>
                      <th className="p-3 border-b">Name</th>
                      <th className="p-3 border-b">Category</th>
                      <th className="p-3 border-b">Price (₹)</th>
                      <th className="p-3 border-b">Rating</th>
                      <th className="p-3 border-b text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item._id} className="hover:bg-green-50 transition-colors">
                        <td className="p-3 border-b w-24">
                          <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded" />
                        </td>
                        <td className="p-3 border-b">
                          <div className="space-y-1">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-gray-500 text-sm">{item.description}</p>
                          </div>
                        </td>
                        <td className="p-3 border-b">{item.category}</td>
                        <td className="p-3 border-b">₹{item.price}</td>
                        <td className="p-3 border-b">
                          <div className="flex gap-1">{renderStars(item.rating)}</div>
                        </td>
                        <td className="p-3 border-b text-center">
                          <div className="flex justify-center items-center gap-2">
                            <button
                              onClick={() => openEdit(item)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded"
                              title="Edit"
                            >
                              <FiEdit2 className="text-lg" />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded"
                              title="Delete"
                            >
                              <FiTrash2 className="text-lg" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-green-600">Edit Item</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-300"
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-300"
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-300"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-300"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListItems;
