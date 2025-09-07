// src/components/AddItems.jsx
import React, { useState } from "react";
import axios from "axios";
import { FiUpload, FiHeart, FiStar } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import AdminNavbar from "../Navbar/Navbar";
import { styles } from "../../../assets/dummyAdmin";

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
    "Breakfast",
    "Lunch",
    "Dinner",
    "Mexican",
    "Italian",
    "Desserts",
    "Drinks",
  ]);

  const [hoverRating, setHoverRating] = useState(0);

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
  const handleHearts = () =>
    setFormData((prev) => ({ ...prev, hearts: prev.hearts + 1 }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (key !== "preview") payload.append(key, val);
      });

      const res = await axios.post(
        "https://quickbite-backend-6dvr.onrender.com/api/items",
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Created Item:", res.data);

      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        price: "",
        rating: 0,
        hearts: 0,
        image: null,
        preview: "",
      });
    } catch (err) {
      console.error("Error uploading item:", err.response || err.message);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className={styles.formWrapper}>
        <div className="max-w-4xl mx-auto">
          <div
            className={
              styles.formCard +
              " bg-gradient-to-br from-[#f0fdf4] to-[#c7e9c0] shadow-2xl"
            }
          >
            <h2
              className={
                styles.formTitle +
                " text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-lime-400"
              }
            >
              Add New Menu Item
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Image Upload */}
              <div className={styles.uploadWrapper}>
                <label className={styles.uploadLabel + " border-4 border-green-400"}>
                  {formData.preview ? (
                    <img
                      src={formData.preview}
                      alt="Preview"
                      className={styles.previewImage}
                    />
                  ) : (
                    <div className="text-center p-4">
                      <FiUpload className={styles.uploadIcon + " text-green-600"} />
                      <p className={styles.uploadText + " text-lime-700"}>
                        Click to upload product image
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    required
                  />
                </label>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block mb-2 text-base sm:text-lg text-green-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={
                      styles.inputField + " bg-[#e6f4ea] text-[#2E4600] placeholder:text-green-600"
                    }
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-base sm:text-lg text-green-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={
                      styles.inputField +
                      " h-32 sm:h-40 bg-[#e6f4ea] text-[#2E4600] placeholder:text-green-600"
                    }
                    placeholder="Enter product description"
                    required
                  />
                </div>

                <div className={styles.gridTwoCols}>
                  <div>
                    <label className="block mb-2 text-base sm:text-lg text-green-700">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={styles.inputField + " bg-[#e6f4ea] text-[#2E4600]"}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c} value={c} className="bg-[#d9f0d0] text-[#2E4600]">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-base sm:text-lg text-green-700">
                      Price (₹)
                    </label>
                    <div className={styles.relativeInput}>
                      <FaRupeeSign className={styles.rupeeIcon + " text-lime-700"} />
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={
                          styles.inputField +
                          " pl-10 sm:pl-12 bg-[#e6f4ea] text-[#2E4600] placeholder:text-green-600"
                        }
                        placeholder="Enter price"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Rating & Hearts */}
                <div className={styles.gridTwoCols}>
                  <div>
                    <label className="block mb-2 text-base sm:text-lg text-green-700">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="text-2xl sm:text-3xl transition-transform hover:scale-110"
                        >
                          <FiStar
                            className={
                              star <= (hoverRating || formData.rating)
                                ? "text-green-500 fill-current"
                                : "text-green-200"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-base sm:text-lg text-green-700">
                      Popularity
                    </label>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <button
                        type="button"
                        onClick={handleHearts}
                        className="text-2xl sm:text-3xl text-green-600 hover:text-green-800 transition-colors animate-pulse"
                      >
                        <FiHeart />
                      </button>
                      <input
                        type="number"
                        name="hearts"
                        value={formData.hearts}
                        onChange={handleInputChange}
                        className={
                          styles.inputField +
                          " pl-10 sm:pl-12 bg-[#e6f4ea] text-[#2E4600] placeholder:text-green-600"
                        }
                        placeholder="Enter Likes"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className={
                    styles.actionBtn +
                    " bg-gradient-to-r from-[#6B8E23] to-[#9ACD32] text-white hover:scale-105"
                  }
                >
                  Add to Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddItems;
