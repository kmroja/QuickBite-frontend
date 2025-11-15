// src/pages/ApplyRestaurant.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL =
  import.meta.env.VITE_API_URL || "https://quickbite-backend-6dvr.onrender.com";

const ApplyRestaurant = () => {
  const [formData, setFormData] = useState({
    ownerName: "",
    restaurantName: "",
    email: "",
    phone: "",
    address: "",
    cuisine: "",
    description: "",
    password: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );

      const res = await axios.post(`${API_URL}/api/restaurant-applications/apply`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Application submitted successfully!");
        setFormData({
          ownerName: "",
          restaurantName: "",
          email: "",
          phone: "",
          address: "",
          cuisine: "",
          description: "",
          password: "",
          image: null,
        });
      } else {
        toast.error(res.data.message || "Failed to apply");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while submitting application");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-700">
          Apply to Register Your Restaurant 🍽️
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input type="text" name="ownerName" placeholder="Owner Name"
            value={formData.ownerName} onChange={handleChange} required className="p-2 border rounded" />
          <input type="text" name="restaurantName" placeholder="Restaurant Name"
            value={formData.restaurantName} onChange={handleChange} required className="p-2 border rounded" />
          <input type="email" name="email" placeholder="Email"
            value={formData.email} onChange={handleChange} required className="p-2 border rounded" />
          <input type="text" name="phone" placeholder="Phone"
            value={formData.phone} onChange={handleChange} required className="p-2 border rounded" />
          <input type="text" name="address" placeholder="Address"
            value={formData.address} onChange={handleChange} required className="p-2 border rounded col-span-2" />
          <input type="text" name="cuisine" placeholder="Cuisine (e.g., Indian, Chinese)"
            value={formData.cuisine} onChange={handleChange} required className="p-2 border rounded" />
          <input type="password" name="password" placeholder="Password"
            value={formData.password} onChange={handleChange} required className="p-2 border rounded" />
          <input type="file" name="image" accept="image/*" onChange={handleChange}
            className="p-2 border rounded col-span-2" />
          <textarea name="description" placeholder="Description"
            value={formData.description} onChange={handleChange}
            className="p-2 border rounded col-span-2" rows="3"></textarea>

          <button type="submit"
            className="col-span-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition">
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyRestaurant;
