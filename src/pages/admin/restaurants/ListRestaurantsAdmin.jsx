// src/pages/admin/restaurants/ListRestaurantsAdmin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { navLinksSidebar } from "../../../assets/dummyAdmin.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const ListRestaurantsAdmin = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("authToken");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/restaurants`, { headers });
      setRestaurants(data);
    } catch (err) {
      console.error("Failed to fetch restaurants", err);
      alert("Failed to load restaurants");
    }
  };

  const openEdit = (r) => {
    setEditing(r);
    setForm({
      name: r.name || "",
      location: r.location || "",
      cuisineType: r.cuisineType || "",
      description: r.description || "",
      openingHours: r.openingHours || "",
    });
    setFile(null);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onFile = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const onSave = async () => {
    if (!editing) return;
    setLoading(true);
    try {
      // if file present, send multipart
      let res;
      if (file) {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        fd.append("image", file);
        res = await axios.put(`${API_URL}/api/restaurants/${editing._id}`, fd, {
          headers: { "Content-Type": "multipart/form-data", ...headers },
        });
      } else {
        res = await axios.put(`${API_URL}/api/restaurants/${editing._id}`, form, { headers });
      }

      // update local list (server returns updated restaurant)
      setRestaurants((prev) => prev.map((p) => (p._id === res.data._id ? res.data : p)));
      setEditing(null);
      setFile(null);
      alert("Saved");
    } catch (err) {
      console.error("Save error", err);
      alert("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this restaurant?")) return;
    try {
      await axios.delete(`${API_URL}/api/restaurants/${id}`, { headers });
      setRestaurants((p) => p.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-72 fixed left-0 top-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
        <div className="text-2xl font-bold mb-6">QuickBite Admin</div>
        <nav className="flex flex-col gap-2">
          {navLinksSidebar.map((link) => (
            <a key={link.name} href={link.href} className="px-3 py-2 rounded hover:bg-gray-700">
              <div className="flex items-center gap-3">{link.icon} {link.name}</div>
            </a>
          ))}
        </nav>
      </aside>

      <main className="ml-72 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Manage Restaurants</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((r) => (
              <div key={r._id} className="bg-white p-4 rounded shadow">
                <img src={r.imageUrl || "/default-restaurant.jpg"} alt={r.name} className="h-40 w-full object-cover rounded" />
                <h3 className="mt-3 font-bold">{r.name}</h3>
                <p className="text-sm text-gray-600">{r.cuisineType} • {r.location}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => openEdit(r)} className="px-3 py-1 bg-yellow-400 rounded">Edit</button>
                  <button onClick={() => onDelete(r._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-2xl rounded p-6">
            <h3 className="text-xl font-semibold mb-4">Edit Restaurant</h3>

            <div className="grid grid-cols-1 gap-3">
              <input name="name" value={form.name} onChange={onChange} className="p-2 border rounded" />
              <input name="location" value={form.location} onChange={onChange} className="p-2 border rounded" />
              <input name="cuisineType" value={form.cuisineType} onChange={onChange} className="p-2 border rounded" />
              <input name="openingHours" value={form.openingHours} onChange={onChange} className="p-2 border rounded" />
              <textarea name="description" value={form.description} onChange={onChange} className="p-2 border rounded" rows={4} />

              <div>
                <label className="block text-sm">Replace image (optional)</label>
                <input type="file" accept="image/*" onChange={onFile} />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button className="px-4 py-2 border rounded" onClick={() => setEditing(null)}>Cancel</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={onSave} disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListRestaurantsAdmin;
