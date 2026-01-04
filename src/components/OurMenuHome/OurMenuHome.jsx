import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCart } from '../../CartContext/CartContext';
import { FaMinus, FaPlus } from 'react-icons/fa';
import './Omh.css';

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Mexican', 'Italian', 'Desserts', 'Drinks'];

const OurMenuHome = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [menuData, setMenuData] = useState({});
  const { cartItems: rawCart, addToCart, updateQuantity, removeFromCart } = useCart();

  const cartItems = rawCart.filter(ci => ci.item);

  useEffect(() => {
    axios
      .get('https://quickbite-backend-6dvr.onrender.com/api/items')
      .then(res => {
        // ✅ FIX IS HERE
        const grouped = res.data.items.reduce((acc, item) => {
          acc[item.category] = acc[item.category] || [];
          acc[item.category].push(item);
          return acc;
        }, {});
        setMenuData(grouped);
      })
      .catch(err => console.error("Menu fetch error:", err));
  }, []);

  const getCartEntry = id => cartItems.find(ci => ci.item?._id === id);
  const getQuantity = id => getCartEntry(id)?.quantity ?? 0;
  const displayItems = (menuData[activeCategory] || []).slice(0, 4);

  return (
    <div className="bg-gradient-to-br from-[#E8F5E9] via-[#C8E6C9] to-[#A5D6A7] min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-14">
          <h2 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2E7D32] via-[#388E3C] to-[#2E7D32]">
            <span className="font-dancingscript block mb-2">Chef’s Special</span>
          </h2>
          <p className="mt-4 text-lg text-[#1B5E20]/80 font-cinzel">
            Handpicked favorites curated just for you
          </p>
        </div>

        {/* CATEGORY FILTER */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full border-2 transition-all duration-300 font-cinzel tracking-widest ${
                activeCategory === cat
                  ? 'bg-gradient-to-br from-[#66BB6A] to-[#81C784] border-[#388E3C] shadow-lg scale-105'
                  : 'bg-[#A5D6A7]/40 border-[#66BB6A]/40 text-[#1B5E20]/80 hover:bg-[#81C784]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* MENU GRID */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {displayItems.map(item => {
            const qty = getQuantity(item._id);
            const cartEntry = getCartEntry(item._id);

            return (
              <div
                key={item._id}
                className="relative bg-white/30 backdrop-blur-md rounded-2xl border border-[#66BB6A]/30 overflow-hidden flex flex-col"
              >
                <span className="absolute top-3 left-3 bg-[#388E3C] text-white text-xs px-3 py-1 rounded-full">
                  Chef’s Pick
                </span>

                <div className="h-56 flex items-center justify-center bg-black/10">
                  <img src={item.imageUrl} alt={item.name} className="max-h-full object-contain" />
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-2xl font-dancingscript text-[#1B5E20] mb-2">
                    {item.name}
                  </h3>

                  <p className="text-sm text-[#2E7D32]/80 font-cinzel mb-4">
                    {item.description}
                  </p>

                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-xl font-bold text-[#2E7D32]">
                      ₹{Number(item.price).toFixed(2)}
                    </span>

                    {qty > 0 ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            qty > 1
                              ? updateQuantity(cartEntry._id, qty - 1)
                              : removeFromCart(cartEntry._id)
                          }
                          className="w-8 h-8 rounded-full bg-[#66BB6A]"
                        >
                          <FaMinus className="text-white" />
                        </button>
                        <span>{qty}</span>
                        <button
                          onClick={() => updateQuantity(cartEntry._id, qty + 1)}
                          className="w-8 h-8 rounded-full bg-[#66BB6A]"
                        >
                          <FaPlus className="text-white" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item, 1)}
                        className="bg-[#66BB6A] text-white px-4 py-2 rounded-full text-xs"
                      >
                        ADD TO CART
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-20">
          <Link
            to="/restaurants"
            className="bg-[#66BB6A] text-white px-10 py-3 rounded-full font-cinzel tracking-widest"
          >
            Explore Restaurants
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OurMenuHome;
