// src/pages/admin/restaurants/AddRestaurant.jsx
import React, { useState } from "react";
import axios from "axios";
import { FiUpload } from "react-icons/fi";
import { navLinksSidebar, layoutClasses, styles } from "../../../assets/dummyAdmin.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const AddRestaurant = () => {
  const [form, setForm] = useState({
    name: "",
    location: "",
    cuisineType: "",
    description: "",
    openingHours: "",
    image: null,
    preview: "",
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("authToken");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((p) => ({ ...p, image: file, preview: URL.createObjectURL(file) }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("location", form.location);
      fd.append("cuisineType", form.cuisineType);
      fd.append("description", form.description);
      fd.append("openingHours", form.openingHours);
      if (form.image) fd.append("image", form.image);

      const { data } = await axios.post(`${API_URL}/api/restaurants`, fd, {
        headers: { "Content-Type": "multipart/form-data", ...headers },
      });

      alert("Restaurant created");
      setForm({
        name: "",
        location: "",
        cuisineType: "",
        description: "",
        openingHours: "",
        image: null,
        preview: "",
      });
      // optional: navigate to list page
      window.location.href = "/admin/restaurants/list";
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to create restaurant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* simple sidebar / nav (you already render one in other admin pages; this keeps page layout consistent) */}
      <aside className="w-72 fixed left-0 top-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
        <div className="text-2xl font-bold mb-6">QuickBite Admin</div>
        <nav className="flex flex-col gap-2">
          {navLinksSidebar.map((link) => (
            <a key={link.name} href={link.href} className="px-3 py-2 rounded hover:bg-gray-700">
              <div className="flex items-center gap-3">
                <div>{link.icon}</div>
                <div>{link.name}</div>
              </div>
            </a>
          ))}
        </nav>
      </aside>

      <main className="flex-1 ml-72 p-8">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-4">Add New Restaurant</h2>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input name="name" value={form.name} onChange={onChange} required
                className="w-full p-3 rounded border" />
            </div>

            <div>
              <label className="block text-sm font-medium">Location</label>
              <input name="location" value={form.location} onChange={onChange} required
                className="w-full p-3 rounded border" />
            </div>

            <div>
              <label className="block text-sm font-medium">Cuisine Type</label>
              <input name="cuisineType" value={form.cuisineType} onChange={onChange}
                className="w-full p-3 rounded border" />
            </div>

            <div>
              <label className="block text-sm font-medium">Opening Hours (text)</label>
              <input name="openingHours" value={form.openingHours} onChange={onChange}
                className="w-full p-3 rounded border" />
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea name="description" value={form.description} onChange={onChange}
                className="w-full p-3 rounded border" rows={4} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Image</label>
              <label className="w-full inline-block p-6 border-2 border-dashed rounded cursor-pointer text-center">
                {form.preview ? (
                  <img src={form.preview} alt="preview" className="mx-auto h-44 object-cover rounded" />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <FiUpload size={36} />
                    <div>Click to upload image</div>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={onFile} className="hidden" />
              </label>
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={loading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg">
                {loading ? "Creating..." : "Create Restaurant"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddRestaurant;
