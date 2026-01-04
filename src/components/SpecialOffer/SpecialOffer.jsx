import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaFire } from 'react-icons/fa';
import { HiMinus, HiPlus } from 'react-icons/hi';
import { useCart } from '../../CartContext/CartContext';

const SpecialOffer = () => {
  const [showAll, setShowAll] = useState(false);
  const [items, setItems] = useState([]);
  const { addToCart, updateQuantity, removeFromCart, cartItems: rawCart } = useCart();

  const cartItems = rawCart.filter(ci => ci.item);

  useEffect(() => {
    axios
      .get('https://quickbite-backend-6dvr.onrender.com/api/items')
      .then(res => setItems(res.data.items ?? res.data))
      .catch(console.error);
  }, []);

  const displayList = items.slice(0, showAll ? 8 : 4);

  return (
    <section className="bg-gradient-to-b from-[#f0fdf4] to-[#d1fae5] py-20 px-4 font-['Poppins']">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-green-600 to-lime-500 bg-clip-text text-transparent italic">
            Chef’s Specials 🍽️
          </h1>
          <p className="text-green-700 text-lg max-w-2xl mx-auto">
            Hand-picked dishes from our top restaurants — freshly prepared & irresistibly delicious
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {displayList.map(item => {
            const cartItem = cartItems.find(ci => ci.item?._id === item._id);
            const qty = cartItem?.quantity ?? 0;
            const cartId = cartItem?._id;

            return (
              <div
                key={item._id}
                className="group relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden hover:-translate-y-3 transition-all duration-500 border border-green-200"
              >
                {/* IMAGE */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent" />

                  {/* TAG */}
                  {item.isSpecial && (
                    <span className="absolute top-4 left-4 bg-lime-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Chef’s Special
                    </span>
                  )}

                  {/* VEG / NON-VEG */}
                  <span
                    className={`absolute top-4 right-4 w-4 h-4 rounded-full border-2 ${
                      item.isVeg ? 'bg-green-500 border-green-700' : 'bg-red-500 border-red-700'
                    }`}
                  />
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <p className="text-xs text-green-600 mb-1">
                    {item.restaurantName || 'Featured Restaurant'}
                  </p>

                  <h3 className="text-xl font-bold text-green-900 mb-2">
                    {item.name}
                  </h3>

                  <p className="text-sm text-green-700 mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-green-700">
                      ₹{item.price}
                    </span>

                    {qty > 0 ? (
                      <div className="flex items-center gap-3 bg-green-100 px-3 py-1.5 rounded-full">
                        <button
                          onClick={() =>
                            qty > 1
                              ? updateQuantity(cartId, qty - 1)
                              : removeFromCart(cartId)
                          }
                        >
                          <HiMinus className="text-green-700" />
                        </button>
                        <span className="font-bold">{qty}</span>
                        <button onClick={() => updateQuantity(cartId, qty + 1)}>
                          <HiPlus className="text-green-700" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item, 1)}
                        className="bg-gradient-to-r from-green-600 to-lime-500 text-white px-5 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition"
                      >
                        <FaPlus /> Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SHOW MORE */}
        <div className="mt-14 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-gradient-to-r from-emerald-600 to-lime-600 text-white px-10 py-4 rounded-full font-bold flex items-center gap-3 shadow-xl"
          >
            <FaFire className="animate-pulse" />
            {showAll ? 'Show Less' : 'Explore More'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffer;
