// src/pages/Restaurants/RestaurantDetails.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useCart } from "../../CartContext/CartContext";
import { FaMinus, FaPlus, FaStar, FaSearch } from "react-icons/fa";
import "../../components/OurMenu/Om.css";

const API_URL =
  import.meta.env.VITE_API_URL || "https://quickbite-backend-6dvr.onrender.com";

// ⭐ Toast Notification
const Toast = ({ message, type = "success", onClose }) => (
  <div
    className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 ${
      type === "success" ? "bg-green-600" : "bg-red-500"
    }`}
  >
    {message}
    <button onClick={onClose} className="ml-2 font-bold hover:text-gray-200">
      ✕
    </button>
  </div>
);

// ⭐ StarRating Component
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

// ⭐ Average Rating Display
const AverageRatingDisplay = ({ reviews = [] }) => {
  const average = useMemo(() => {
    if (!reviews.length) return 0;
    return (
      reviews.reduce((a, r) => a + (Number(r.rating) || 0), 0) / reviews.length
    ).toFixed(1);
  }, [reviews]);

  return (
    <div className="flex items-center gap-2">
      <StarRating rating={Number(average)} readOnly />
      <span className="text-green-900/70 text-xs">{average} ⭐ ({reviews.length})</span>
    </div>
  );
};

// ⭐ CartControl
const CartControl = ({ item, quantity, cartEntry, addToCart, updateQuantity, removeFromCart }) => (
  <div className="flex items-center gap-2">
    {quantity > 0 ? (
      <>
        <button
          onClick={() =>
            quantity > 1
              ? updateQuantity(cartEntry._id, quantity - 1)
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
        className="bg-green-200/60 px-4 py-1.5 rounded-full font-cinzel text-xs sm:text-sm uppercase tracking-widest transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:shadow-green-400/20 border border-green-700/30"
      >
        Add to Cart
      </button>
    )}
  </div>
);

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [newReview, setNewReview] = useState({});

  const {
    cartItems: rawCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    toast,
    setToast,
  } = useCart();

  const cartItems = rawCart.filter((ci) => ci.item);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/restaurants/${id}`);
        setRestaurant(res.data);
      } catch (err) {
        console.error("Failed to fetch restaurant details", err);
        setToast({ message: "Failed to load restaurant", type: "error" });
      }
    };
    fetchRestaurant();
  }, [id, setToast]);

  const getCartEntry = (itemId) => cartItems.find((ci) => ci.item?._id === itemId);
  const getQuantity = (itemId) => getCartEntry(itemId)?.quantity ?? 0;

  // Filter categories dynamically
  const categories = useMemo(() => {
    if (!restaurant?.menu) return ["All"];
    const cats = Array.from(new Set(restaurant.menu.map((item) => item.category || "Uncategorized")));
    return ["All", ...cats];
  }, [restaurant]);

  const filteredMenu = useMemo(() => {
    if (!restaurant?.menu) return [];
    return restaurant.menu.filter((item) => {
      const matchCategory = activeCategory === "All" || item.category === activeCategory;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [restaurant, activeCategory, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveCategory("All"); // optional: reset category on search
  };

  const handleSubmitReview = async (itemId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return setToast({ message: "Login to submit review", type: "error" });

      const reviewData = newReview[itemId] || {};
      const rating = Number(reviewData.rating) || 0;
      const comment = (reviewData.comment || "").trim();
      if (!rating || !comment)
        return setToast({ message: "Rating & comment required", type: "error" });

      const res = await axios.post(
        `${API_URL}/api/food-review/${itemId}/review`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRestaurant((prev) => {
        const updatedMenu = prev.menu.map((item) =>
          item._id === itemId
            ? { ...item, reviews: [...(item.reviews || []), res.data.review || { rating, comment }] }
            : item
        );
        return { ...prev, menu: updatedMenu };
      });

      setNewReview((prev) => ({ ...prev, [itemId]: { rating: 0, comment: "" } }));
      setToast({ message: "Review submitted successfully!", type: "success" });
    } catch (err) {
      console.error("Review submit failed:", err.response?.data || err.message);
      setToast({ message: err.response?.data?.message || "Failed to submit review", type: "error" });
    }
  };

  if (!restaurant)
    return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <>
      <Navbar />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="min-h-screen bg-gradient-to-br from-[#fefae0] via-[#e9edc9] to-[#fefae0] py-10 px-6">
        {/* Restaurant Info */}
        <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-10 border border-green-900/20">
          <img
            src={restaurant.imageUrl || "/default-restaurant.jpg"}
            alt={restaurant.name}
            className="w-full h-72 object-cover rounded-xl mb-4"
          />
          <h1 className="text-3xl font-bold mb-2 text-green-800">{restaurant.name}</h1>
          <p className="text-green-700 text-lg">{restaurant.cuisineType}</p>
          <p className="text-green-700/80">{restaurant.location}</p>
          <p className="text-green-900/80 mt-3 leading-relaxed">{restaurant.description}</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8 flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu items..."
            className="flex-1 py-3 px-4 rounded-lg border border-green-700/50 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors">
            <FaSearch />
          </button>
        </form>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full border-2 font-cinzel text-sm transition-all ${
                activeCategory === cat
                  ? "bg-gradient-to-br from-green-600/80 to-green-500/80 border-green-700 scale-105 shadow-xl text-white"
                  : "bg-green-100/40 border-green-700/30 text-green-900/80 hover:bg-green-200/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item) => {
              const cartEntry = getCartEntry(item._id);
              const quantity = getQuantity(item._id);

              return (
                <div
                  key={item._id}
                  className="relative bg-green-100/30 rounded-2xl overflow-hidden border border-green-800/20 backdrop-blur-sm flex flex-col transition-all duration-500 hover:scale-105 hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="relative h-48 sm:h-56 flex items-center justify-center bg-black/5">
                    <img
                      src={item.imageUrl || "/default-food.jpg"}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain transition-all duration-700"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-4 sm:p-6 flex flex-col flex-grow">
                    <h3 className="text-xl sm:text-2xl mb-2 font-dancingscript text-green-800">
                      {item.name}
                    </h3>
                    <p className="text-green-900/80 text-xs sm:text-sm mb-3 font-cinzel leading-relaxed">
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

                    {/* Reviews */}
                    <div className="mt-3 border-t border-green-200 pt-3">
                      <span className="font-semibold text-green-800 text-sm">Average Rating</span>
                      <AverageRatingDisplay reviews={item.reviews || []} />
                    </div>

                    {/* Submit Review */}
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
            })
          ) : (
            <p className="text-gray-500 col-span-full text-center">No menu items available.</p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RestaurantDetails;
