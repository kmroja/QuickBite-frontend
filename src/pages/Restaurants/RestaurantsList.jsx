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
        setRestaurants(res.data.restaurants || []);
      } catch (err) {
        console.error("Failed to fetch restaurants", err);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-14 px-6 md:px-16">
        {/* Page Heading */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            Find Your Next Meal 🍽️
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Order delicious food from top-rated restaurants near you
          </p>
        </div>

        {/* Restaurants Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {restaurants.length > 0 ? (
            restaurants.map((rest) => (
              <div
                key={rest._id}
                className="group bg-white/80 backdrop-blur-lg rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={rest.imageUrl || "/default-restaurant.jpg"}
                    alt={rest.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Cuisine Badge */}
                  <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    {rest.cuisineType || "Multi-Cuisine"}
                  </span>

                 
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1 group-hover:text-orange-600 transition">
                    {rest.name}
                  </h2>

                  <p className="text-gray-500 text-sm line-clamp-2">
                    {rest.description ||
                      "Serving delicious food made with love and premium ingredients."}
                  </p>

                  {/* Location */}
                  <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                    📍
                    <span>
                      {rest.location || "Location not provided"}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="my-4 border-t border-dashed" />

                  {/* CTA */}
                  <Link
                    to={`/restaurants/${rest._id}`}
                    className="mt-auto inline-block text-center bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2.5 rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-300"
                  >
                    View Menu
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full text-lg">
              No restaurants available yet 🍔
            </p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RestaurantsList;
