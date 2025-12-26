import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../CartContext/CartContext";
import { FaPlus, FaCheck } from "react-icons/fa";

// ✅ USE ENV VARIABLE (IMPORTANT)
const API = import.meta.env.VITE_API_URL;

const UserRestaurantMenu = () => {
  const { id } = useParams();
  const { addToCart, cartItems } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await axios.get(`${API}/api/restaurants/${id}`);
        setRestaurant(res.data.restaurant);
      } catch (err) {
        console.error("User menu fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  const buildImageUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http")
      ? path
      : `${API}/uploads/${path.replace(/^\/uploads\//, "")}`;
  };

  const isInCart = (itemId) =>
    cartItems.some((ci) => ci.item?._id === itemId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-green-700">
        Loading menu...
      </div>
    );
  }

  if (!restaurant) {
    return <p className="text-center mt-10">Restaurant not found</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f8e9] to-[#ffffff] px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800">
            {restaurant.name}
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            {restaurant.description}
          </p>
        </div>

        {/* MENU GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {restaurant.menu?.map((item) => {
            const added = isInCart(item._id);

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden flex flex-col group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={buildImageUrl(item.imageUrl)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {item.description || "Delicious and freshly prepared"}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-4">
                    <p className="text-lg font-bold text-green-700">
                      ₹{item.price}
                    </p>

                    <button
                      onClick={() => addToCart(item, 1)}
                      disabled={added}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${
                        added
                          ? "bg-green-200 text-green-800 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700 active:scale-95"
                      }`}
                    >
                      {added ? (
                        <>
                          <FaCheck /> Added
                        </>
                      ) : (
                        <>
                          <FaPlus /> Add
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {restaurant.menu?.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No menu items available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRestaurantMenu;
