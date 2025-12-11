// OurRestaurants.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Om.css";

// ⭐ Toast Notification Component
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

const OurRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  // Fetch restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get(
          "https://quickbite-backend-6dvr.onrender.com/api/restaurants"
        );

        console.log("API Response:", res.data);

        // ⭐ FIX: Use res.data.restaurants (not res.data)
        const list = res.data.restaurants || [];

        setRestaurants(list);
        setAllRestaurants(list);
      } catch (err) {
        console.error("Failed to load restaurants:", err.response?.data || err.message);
        setToast({ message: "Failed to load restaurants", type: "error" });
      }
    };
    fetchRestaurants();
  }, []);

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setRestaurants(allRestaurants);
      return;
    }

    const filtered = allRestaurants.filter((r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filtered.length > 0) {
      setRestaurants(filtered);
    } else {
      setToast({ message: "No restaurants found!", type: "error" });
      setRestaurants([]);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#fefae0] via-[#e9edc9] to-[#fefae0] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}

        {/* Search */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-10 group">
          <div className="flex items-center bg-green-900/30 rounded-xl border-2 border-lime-500/30 shadow-lg hover:border-lime-400/50 transition-all duration-300">
            <div className="pl-6 pr-3 py-4">
              <FaSearch className="text-xl text-lime-300/80" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search restaurants"
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

        {/* Restaurant Cards */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <Link
                to={`/restaurants/${restaurant._id}`}
                key={restaurant._id}
                className="relative bg-green-100/30 rounded-2xl overflow-hidden border border-green-800/20 backdrop-blur-sm flex flex-col transition-all duration-500 hover:scale-105 hover:shadow-xl"
              >
                <div className="relative h-48 sm:h-56 md:h-60 flex items-center justify-center bg-black/5">
                  <img
                    loading="lazy"
                    src={restaurant.imageUrl || restaurant.image}
                    alt={restaurant.name}
                    className="max-h-full max-w-full object-contain transition-all duration-700"
                  />
                </div>

                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                  <h3 className="text-xl sm:text-2xl font-bold text-green-900">
                    {restaurant.name}
                  </h3>
                  <p className="text-sm text-green-700 mt-2">
                    {restaurant.description?.slice(0, 60)}...
                  </p>

                  <div className="mt-4">
                    <span className="inline-block py-1 px-3 text-sm rounded-lg bg-lime-200 text-green-900 font-semibold">
                      {restaurant.cuisineType || restaurant.cuisine || "Cuisine"}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center text-xl text-green-900 col-span-full">
              No restaurants available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OurRestaurants;
