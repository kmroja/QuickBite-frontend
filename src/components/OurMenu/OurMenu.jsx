import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useCart } from "../../CartContext/CartContext";
import { FaMinus, FaPlus, FaSearch } from "react-icons/fa";
import "./Om.css";

// ⭐ Toast notification component
const Toast = ({ message, type = "success", onClose }) => (
  <div
    className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 ${
      type === "success" ? "bg-green-600" : "bg-red-500"
    }`}
  >
    {message}
    <button
      onClick={onClose}
      className="ml-2 font-bold hover:text-gray-200"
    >
      ✕
    </button>
  </div>
);

// ⭐ Modern reusable StarRating component
const StarRating = ({ rating, onRatingChange, readOnly }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        disabled={readOnly}
        onClick={() => onRatingChange && onRatingChange(star)}
        className={`text-2xl transition-all duration-300 ${
          star <= rating
            ? "text-yellow-400 drop-shadow-md scale-110"
            : "text-gray-300 hover:text-yellow-300 hover:scale-105"
        }`}
      >
        ★
      </button>
    ))}
  </div>
);

// ⭐ Average rating component
const AverageRatingDisplay = ({ reviews = [] }) => {
  const average = useMemo(() => {
    if (!reviews.length) return 0;
    return (
      reviews.reduce((a, r) => a + (r.rating || 0), 0) / reviews.length
    ).toFixed(1);
  }, [reviews]);

  return (
    <div className="flex items-center gap-2">
      <StarRating rating={Number(average)} readOnly />
      <span className="text-green-900/70 text-xs">
        {average} ⭐ ({reviews.length})
      </span>
    </div>
  );
};

// ⭐ Cart control component
const CartControl = ({ item, quantity, cartEntry, addToCart, updateQuantity, removeFromCart }) => (
  <div className="flex items-center gap-2">
    {quantity > 0 ? (
      <>
        <button
          onClick={() =>
            quantity > 1
              ? updateQuantity(cartEntry?._id, quantity - 1)
              : removeFromCart(cartEntry._id)
          }
          className="w-8 h-8 rounded-full bg-green-200/60 flex items-center justify-center hover:bg-green-300 transition-colors"
        >
          <FaMinus className="text-green-800" />
        </button>
        <span className="w-8 text-center text-green-900">{quantity}</span>
        <button
          onClick={() => updateQuantity(cartEntry._id, quantity + 1)}
          className="w-8 h-8 rounded-full bg-green-200/60 flex items-center justify-center hover:bg-green-300 transition-colors"
        >
          <FaPlus className="text-green-800" />
        </button>
      </>
    ) : (
      <button
        onClick={() => addToCart(item, 1)}
        className="bg-green-200/60 px-4 py-1.5 rounded-full font-cinzel text-xs sm:text-sm uppercase tracking-widest transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:shadow-green-400/20 overflow-hidden border border-green-700/30"
      >
        Add to Cart
      </button>
    )}
  </div>
);

const categories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Mexican",
  "Italian",
  "Desserts",
  "Drinks",
];

const OurMenu = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [menuData, setMenuData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [newReview, setNewReview] = useState({});
  const [toast, setToast] = useState(null);

  const { cartItems: rawCart, addToCart, updateQuantity, removeFromCart } =
    useCart();
  const cartItems = rawCart.filter((ci) => ci.item);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(
          "https://quickbite-backend-6dvr.onrender.com/api/items"
        );
        const byCategory = res.data.reduce((acc, item) => {
          const cat = item.category || "Uncategorized";
          acc[cat] = acc[cat] || [];
          acc[cat].push(item);
          return acc;
        }, {});
        setMenuData(byCategory);
      } catch (err) {
        console.error("Menu load failed:", err);
        setToast({ message: "Failed to load menu", type: "error" });
      }
    };
    fetchMenu();
  }, []);

  const getCartEntry = (id) => cartItems.find((ci) => ci.item?._id === id);
  const getQuantity = (id) => getCartEntry(id)?.quantity ?? 0;

  const handleSearch = (e) => {
    e.preventDefault();
    const matchedCategory = categories.find((cat) =>
      cat.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (matchedCategory) setActiveCategory(matchedCategory);
  };

  // ✅ Fixed Review Submission
  const handleSubmitReview = async (itemId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setToast({ message: "Login to submit a review", type: "error" });
        return;
      }

      const reviewData = newReview[itemId] || {};
      const rating = Number(reviewData.rating) || 0;
      const comment = (reviewData.comment || "").trim();

      if (!rating || !comment) {
        setToast({ message: "Rating & comment required", type: "error" });
        return;
      }

      const res = await axios.post(
        `https://quickbite-backend-6dvr.onrender.com/api/food-review/${itemId}/review`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update local menuData with new review
      setMenuData((prev) => {
        const updated = { ...prev };
        for (let cat in updated) {
          updated[cat] = updated[cat].map((item) =>
            item._id === itemId
              ? { ...item, reviews: [...(item.reviews || []), res.data.review] }
              : item
          );
        }
        return updated;
      });

      setNewReview((prev) => ({
        ...prev,
        [itemId]: { rating: 0, comment: "" },
      }));

      setToast({ message: "Review submitted successfully!", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({
        message: err.response?.data?.message || "Failed to submit review",
        type: "error",
      });
    }
  };

  const displayItems = (menuData[activeCategory] ?? []).slice(0, 12);

  return (
    <div className="bg-gradient-to-br from-[#fefae0] via-[#e9edc9] to-[#fefae0] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}

        <form
          onSubmit={handleSearch}
          className="relative max-w-2xl mx-auto mb-8 group"
        >
          <div className="flex items-center bg-green-900/30 rounded-xl border-2 border-lime-500/30 shadow-lg hover:border-lime-400/50 transition-all duration-300">
            <div className="pl-6 pr-3 py-4">
              <FaSearch className="text-xl text-lime-300/80" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by category"
              className="w-full py-4 pr-6 bg-transparent outline-none placeholder-lime-200/70 text-lg font-medium tracking-wide"
            />
            <button
              type="submit"
              className="mr-4 px-6 py-3 bg-gradient-to-r from-lime-300 to-lime-200 rounded-lg font-semibold text-green-900 hover:from-lime-200 hover:to-lime-100 transition-all duration-300 shadow-lg"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 sm:px-6 py-2 rounded-full border-2 transition-all duration-300 transform font-cinzel text-sm sm:text-lg tracking-widest backdrop-blur-sm ${
                activeCategory === cat
                  ? "bg-gradient-to-br from-green-600/80 to-green-500/80 border-green-700 scale-105 shadow-xl shadow-green-700/30"
                  : "bg-green-100/40 border-green-700/30 text-green-900/80 hover:bg-green-200/40 hover:scale-95"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          {displayItems.map((item) => {
            const cartEntry = getCartEntry(item._id);
            const quantity = cartEntry?.quantity || 0;

            return (
              <div
                key={item._id}
                className="relative bg-green-100/30 rounded-2xl overflow-hidden border border-green-800/20 backdrop-blur-sm flex flex-col transition-all duration-500 hover:scale-105 hover:shadow-lg"
              >
                <div className="relative h-48 sm:h-56 md:h-60 flex items-center justify-center bg-black/5">
                  <img
                    loading="lazy"
                    src={item.imageUrl || item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain transition-all duration-700"
                  />
                </div>

                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                  <h3 className="text-xl sm:text-2xl mb-2 font-dancingscript text-green-800">
                    {item.name}
                  </h3>
                  <p className="text-green-900/80 text-xs sm:text-sm mb-2 font-cinzel leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-auto flex items-center gap-4 justify-between mb-2">
                    <div className="bg-green-50/60 backdrop-blur-sm px-3 py-1 rounded-2xl shadow-lg">
                      <span className="text-xl font-bold text-green-700 font-dancingscript">
                        ₹{Number(item.price).toFixed(2)}
                      </span>
                    </div>
                    <CartControl
                      item={item}
                      quantity={quantity}
                      cartEntry={cartEntry}
                      addToCart={addToCart}
                      updateQuantity={updateQuantity}
                      removeFromCart={removeFromCart}
                    />
                  </div>

                  <div className="mt-4 border-t border-green-200 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-green-800 text-sm">
                        Average Rating
                      </span>
                      <AverageRatingDisplay reviews={item.reviews || []} />
                    </div>
                  </div>

                  <div className="mt-2 bg-white/60 p-3 rounded-xl shadow-sm backdrop-blur-sm">
                    <StarRating
                      rating={newReview[item._id]?.rating || 0}
                      onRatingChange={(r) =>
                        setNewReview((prev) => ({
                          ...prev,
                          [item._id]: { ...prev[item._id], rating: r },
                        }))
                      }
                    />
                    <textarea
                      className="w-full p-3 mt-2 border border-green-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400 outline-none resize-none"
                      placeholder="Write your review..."
                      rows={3}
                      value={newReview[item._id]?.comment || ""}
                      onChange={(e) =>
                        setNewReview((prev) => ({
                          ...prev,
                          [item._id]: { ...prev[item._id], comment: e.target.value },
                        }))
                      }
                    />
                    <button
                      onClick={() => handleSubmitReview(item._id)}
                      className="mt-2 w-full bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-500 hover:to-green-400 transition-all shadow-md"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OurMenu;
