import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUpload, FiHeart, FiStar } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import AdminNavbar from "../Navbar/Navbar.jsx";
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
    restaurant: "",
  });
  const [categories] = useState([
    "Breakfast", "Lunch", "Dinner", "Mexican", "Italian", "Desserts", "Drinks",
  ]);
  const [restaurants, setRestaurants] = useState([]);
  const [hoverRating, setHoverRating] = useState(0);

  const token = localStorage.getItem("authToken");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get(
          "https://quickbite-backend-6dvr.onrender.com/api/restaurants",
          { headers }
        );
        setRestaurants(res.data || []);
      } catch (err) {
        console.error("Failed to fetch restaurants", err);
      }
    };
    fetchRestaurants();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        preview: URL.createObjectURL(file),
      }));
    }
  };

  const handleRating = (rating) => setFormData((prev) => ({ ...prev, rating }));
  const handleHearts = () => setFormData((prev) => ({ ...prev, hearts: prev.hearts + 1 }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (key !== "preview" && val !== undefined && val !== null && val !== "") {
          payload.append(key, val);
        }
      });

      await axios.post(
        "https://quickbite-backend-6dvr.onrender.com/api/items",
        payload,
        {
          headers: { "Content-Type": "multipart/form-data", ...headers },
        }
      );

      setFormData({
        name: "",
        description: "",
        category: "",
        price: "",
        rating: 0,
        hearts: 0,
        image: null,
        preview: "",
        restaurant: "",
      });
      alert("Item added successfully!");
    } catch (err) {
      console.error(err.response || err.message);
      alert("Failed to add item.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminNavbar navLinks={navLinksSidebar} />
      <aside className={layoutClasses.sidebar}>
        <div className="p-6 text-xl font-bold border-b border-gray-200">QuickBite Admin</div>
        <nav className="p-6 flex flex-col gap-3">
          {navLinksSidebar.map((link) => (
            <a key={link.name} href={link.href} className={styles.sidebarLink}>
              {link.icon}
              <span className="ml-2">{link.name}</span>
            </a>
          ))}
        </nav>
      </aside>

      <main className={layoutClasses.mainContent}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#f0fdf4] to-[#c7e9c0] shadow-2xl rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-6">Add New Menu Item</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <label className="block border-4 border-green-400 rounded-lg cursor-pointer overflow-hidden">
                {formData.preview ? (
                  <img src={formData.preview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-green-600">
                    <FiUpload size={40} />
                    <p className="mt-2">Click to upload product image</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {/* Inputs */}
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded border focus:ring-2 focus:ring-green-300"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded border h-32 focus:ring-2 focus:ring-green-300"
                  required
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="p-3 rounded border focus:ring-2 focus:ring-green-300"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="relative">
                    <FaRupeeSign className="absolute top-3 left-3 text-lime-700" />
                    <input
                      type="number"
                      name="price"
                      placeholder="Price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full pl-10 p-3 rounded border focus:ring-2 focus:ring-green-300"
                      min="0"
                      required
                    />
                  </div>
                </div>

                {/* Restaurant Dropdown */}
                <select
                  name="restaurant"
                  value={formData.restaurant}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded border focus:ring-2 focus:ring-green-300"
                >
                  <option value="">-- Select Restaurant (optional) --</option>
                  {restaurants.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name}
                    </option>
                  ))}
                </select>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-1">
                    <span className="mr-2 font-semibold">Rating:</span>
                    {[1,2,3,4,5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-2xl"
                      >
                        <FiStar
                          className={
                            star <= (hoverRating || formData.rating)
                              ? "text-green-500"
                              : "text-green-200"
                          }
                        />
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleHearts}
                      className="text-2xl text-green-600 hover:text-green-800"
                    >
                      <FiHeart />
                    </button>
                    <input
                      type="number"
                      name="hearts"
                      value={formData.hearts}
                      onChange={handleInputChange}
                      className="p-2 rounded border w-full"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-lime-500 text-white font-bold rounded-lg hover:scale-105 transition-transform"
                >
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
