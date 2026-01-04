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

  // ✅ FIX: support both token keys
  const token =
    localStorage.getItem("authToken") ||
    localStorage.getItem("token");

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  /* ================= FETCH ALL ================= */
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/restaurants`, { headers });

      // ✅ SAFE NORMALIZATION
      const list =
        res.data?.restaurants ||
        res.data?.data ||
        res.data ||
        [];

      setRestaurants(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("❌ Failed to fetch restaurants:", err);
      setRestaurants([]); // prevent crash
    }
  };

  /* ================= EDIT ================= */
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

  /* ================= SAVE ================= */
  const onSave = async () => {
    if (!editing) return;
    setLoading(true);

    try {
      let res;

      if (file) {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        fd.append("image", file);

        res = await axios.put(
          `${API_URL}/api/restaurants/${editing._id}`,
          fd,
          { headers: { ...headers, "Content-Type": "multipart/form-data" } }
        );
      } else {
        res = await axios.put(
          `${API_URL}/api/restaurants/${editing._id}`,
          form,
          { headers }
        );
      }

      const updated = res.data?.restaurant || res.data;

      setRestaurants((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r))
      );

      setEditing(null);
      setFile(null);
    } catch (err) {
      console.error("❌ Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const onDelete = async (id) => {
    if (!window.confirm("Delete this restaurant?")) return;

    try {
      await axios.delete(`${API_URL}/api/restaurants/${id}`, { headers });
      setRestaurants((p) => p.filter((r) => r._id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ========== SIDEBAR ========== */}
      <aside className="w-72 fixed left-0 top-0 h-full bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">QuickBite Admin</h2>

        <nav className="flex flex-col gap-2">
          {(Array.isArray(navLinksSidebar) ? navLinksSidebar : []).map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-3 py-2 rounded hover:bg-gray-700 flex items-center gap-3"
            >
              {link.icon}
              {link.name}
            </a>
          ))}
        </nav>
      </aside>

      {/* ========== MAIN ========== */}
      <main className="ml-72 flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Manage Restaurants</h2>

        {restaurants.length === 0 ? (
          <p className="text-gray-500">No restaurants found</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((r) => (
              <div key={r._id} className="bg-white p-4 rounded shadow">
                <img
                  src={r.image || r.imageUrl || "/default-restaurant.jpg"}
                  alt={r.name}
                  className="h-40 w-full object-cover rounded"
                />
                <h3 className="mt-3 font-bold">{r.name}</h3>
                <p className="text-sm text-gray-600">
                  {r.cuisineType} • {r.location}
                </p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => openEdit(r)}
                    className="px-3 py-1 bg-yellow-400 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(r._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ListRestaurantsAdmin;
