import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000";

const RestaurantProfile = ({ restaurant }) => {
  const [form, setForm] = useState(restaurant);
  const token = localStorage.getItem("authToken");

  const updateProfile = async () => {
    await axios.put(
      `${API_URL}/api/restaurants/${restaurant._id}`,
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Profile updated");
  };

  return (
    <div className="p-6">
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border p-2 mb-2"
      />
      <textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="border p-2"
      />
      <button
        onClick={updateProfile}
        className="bg-blue-600 text-white px-4 py-2 mt-3 rounded"
      >
        Save
      </button>
    </div>
  );
};

export default RestaurantProfile;
