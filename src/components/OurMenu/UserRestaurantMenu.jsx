import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../CartContext/CartContext";
import { FaPlus, FaCheck, FaShoppingBag } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL;

const UserRestaurantMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await axios.get(`${API}/api/restaurants/${id}`);
        setRestaurant(res.data.restaurant);
      } catch (err) {
        console.error("Menu fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  const isInCart = (itemId) =>
    cartItems.some((ci) => ci.item?._id === itemId);

  const totalItems = cartItems.reduce((s, c) => s + c.quantity, 0);
  const totalPrice = cartItems.reduce(
    (s, c) => s + c.quantity * c.item.price,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-medium text-green-700">
        Loading menu…
      </div>
    );
  }

  if (!restaurant) {
    return <p className="text-center mt-10">Restaurant not found</p>;
  }

  return (
    <div className="min-h-screen bg-[#f7f9f8] pb-32">
      {/* HERO */}
      <div className="relative h-[280px]">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-6 left-6 max-w-4xl text-white">
          <h1 className="text-4xl font-semibold">{restaurant.name}</h1>
          <p className="mt-2 text-sm text-gray-200">
            {restaurant.description}
          </p>
        </div>
      </div>

      {/* MENU */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-semibold mb-10">Menu</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {restaurant.menu?.map((item) => {
            const added = isInCart(item._id);

            return (
              <div key={item._id} className="bg-white rounded-2xl shadow flex flex-col">
                <div className="relative h-48">
                  <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                  <span className="absolute bottom-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold text-green-700">
                    ₹{item.price}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {item.description || "Freshly prepared"}
                  </p>

                  <div className="mt-auto pt-5">
                    <button
                      onClick={() =>
                        addToCart(
                          {
                            ...item,
                            restaurantId: restaurant._id, // ✅ CRITICAL
                          },
                          1
                        )
                      }
                      disabled={added}
                      className={`w-full py-2.5 rounded-xl font-semibold ${
                        added
                          ? "bg-green-50 text-green-700"
                          : "bg-green-600 text-white"
                      }`}
                    >
                      {added ? <FaCheck /> : <FaPlus />} {added ? "Added" : "Add to cart"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FLOATING CART */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-700 text-white rounded-xl px-6 py-4 flex justify-between">
          <div>
            <p>{totalItems} items</p>
            <p className="font-semibold">₹{totalPrice}</p>
          </div>
          <button onClick={() => navigate("/cart")} className="bg-white text-green-700 px-5 py-2 rounded-xl">
            <FaShoppingBag /> View Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default UserRestaurantMenu;
