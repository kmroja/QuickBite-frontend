import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://quickbite-backend-6dvr.onrender.com";

const MenuManagement = () => {
  const [menu, setMenu] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  const [image, setImage] = useState(null);

  const restaurantId = localStorage.getItem("restaurantId");
  const token = localStorage.getItem("authToken");

  /* -------------------------------- */
  /* Fetch Menu */
  /* -------------------------------- */
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setMenu(res.data.items || []);
  } catch (err) {
    console.error(
      "Fetch menu error:",
      err.response?.data || err
    );
  }
};


  /* -------------------------------- */
  /* Submit Add / Update */
  /* -------------------------------- */
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!restaurantId) {
    alert("Restaurant ID missing. Please login again.");
    return;
  }

  if (!form.category.trim()) {
    alert("Category is required");
    return;
  }

  const data = new FormData();
  data.append("name", form.name);
  data.append("description", form.description);
  data.append("price", form.price);
  data.append("category", form.category); // ✅ MUST EXIST
  data.append("restaurantId", restaurantId); // ✅ REQUIRED
  if (image) data.append("image", image);

  // 🔍 DEBUG ONCE
  for (let pair of data.entries()) {
    console.log(pair[0], pair[1]);
  }

  setLoading(true);

  try {
    if (editingId) {
      await axios.put(`${API}/api/items/${editingId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      await axios.post(`${API}/api/items`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    resetForm();
    fetchMenu();
  } catch (err) {
    console.error("Submit error:", err.response?.data || err);
    alert(err.response?.data?.message || "Failed to save menu item");
  } finally {
    setLoading(false);
  }
};


  /* -------------------------------- */
  /* Edit */
  /* -------------------------------- */
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

  /* -------------------------------- */
  /* Delete */
  /* -------------------------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await axios.delete(`${API}/api/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchMenu();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  /* -------------------------------- */
  /* Reset */
  /* -------------------------------- */
  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
    });
    setImage(null);
  };

  /* -------------------------------- */
  /* UI */
  /* -------------------------------- */
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-green-700 mb-8">
          Restaurant Menu Management
        </h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 mb-10"
        >
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Menu Item" : "Add New Menu Item"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Item Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="border rounded-lg px-4 py-2"
              required
            />

            <input
              placeholder="Price (₹)"
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              className="border rounded-lg px-4 py-2"
              required
            />

            <input
              placeholder="Category (Dessert / Pizza / Drinks)"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className="border rounded-lg px-4 py-2 md:col-span-2"
              required
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="border rounded-lg px-4 py-2 md:col-span-2"
              rows="3"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="border rounded-lg px-4 py-2 md:col-span-2"
              required={!editingId}
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Item"
                : "Add Item"}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {menu.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow"
            >
              <img
                src={`${API}/uploads/${item.imageUrl}`}
                alt={item.name}
                className="h-40 w-full object-cover rounded-t-xl"
              />

              <div className="p-4">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.category}</p>
                <p className="mt-2 font-semibold text-green-700">
                  ₹{item.price}
                </p>

                <div className="flex justify-between mt-4">
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

          {menu.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No menu items added yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
