// src/pages/Restaurants/RestaurantsList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const API_URL =
  import.meta.env.VITE_API_URL || "https://quickbite-backend-6dvr.onrender.com";

const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/restaurants`);
        setRestaurants(res.data);
      } catch (err) {
        console.error("Failed to fetch restaurants", err);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-14 px-6 md:px-16">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-3 tracking-tight">
            Discover Top Restaurants 🍴
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore mouthwatering dishes from your favorite local and premium restaurants.
          </p>
        </div>

        {/* Restaurant Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {restaurants.length > 0 ? (
            restaurants.map((rest) => (
              <div
                key={rest._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 flex flex-col"
              >
                {/* Restaurant Image */}
                <div className="relative">
                  <img
                    src={rest.imageUrl || "/default-restaurant.jpg"}
                    alt={rest.name}
                    className="h-56 w-full object-cover rounded-t-2xl hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-3 left-3 bg-orange-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    {rest.cuisineType || "Various"}
                  </div>
                </div>

                {/* Restaurant Info */}
                <div className="p-5 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold text-gray-800 hover:text-orange-600 transition-colors">
                    {rest.name}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {rest.description || "Delicious meals and cozy dining atmosphere."}
                  </p>

                  {/* Details */}
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      ⭐ <span>{rest.rating || "4.5"}</span>
                    </div>
                    <span>₹₹ • {rest.cuisineType || "Multi-cuisine"}</span>
                  </div>

                  <p className="text-gray-400 text-sm mt-2 flex items-center gap-1">
                    📍 {rest.location || "Location unavailable"}
                  </p>

                  {/* View Menu Button */}
                  <Link
                    to={`/restaurants/${rest._id}`}
                    className="mt-5 inline-block bg-orange-500 text-white text-center w-full py-2.5 rounded-xl font-medium hover:bg-orange-600 transition-all duration-300"
                  >
                    View Menu
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full text-lg">
              No restaurants available yet.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RestaurantsList;
