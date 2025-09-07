import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaHeart, FaPlus, FaFire } from 'react-icons/fa';
import { HiMinus, HiPlus } from 'react-icons/hi';
import { useCart } from '../../CartContext/CartContext';


const SpecialOffer = () => {
  const [showAll, setShowAll] = useState(false);
  const [items, setItems] = useState([]);
  const { addToCart, updateQuantity, removeFromCart, cartItems: rawCart } = useCart();

  // only keep cart entries with a real `item`
  const cartItems = rawCart.filter(ci => ci.item);


  // Fetch menu items
  useEffect(() => {
    axios
      .get('https://quickbite-backend-6dvr.onrender.com/api/items')
      .then(res => setItems(res.data.items ?? res.data))
      .catch(err => console.error(err));
  }, []);

  const displayList = Array.isArray(items) ? items.slice(0, showAll ? 8 : 4) : [];

  return (
    <div className="bg-gradient-to-b from-[#f0fdf4] to-[#d1fae5] text-green-900 py-16 px-4 font-['Poppins']">
  <div className="max-w-7xl mx-auto">
    {/* Header */}
    <div className="text-center mb-14">
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-500 to-lime-500 bg-clip-text text-transparent italic">
        Today's <span className="text-stroke-lime">Special</span> Offers
      </h1>
      <p className="text-lg text-green-700 max-w-3xl mx-auto">
        Savor the extraordinary with our culinary masterpieces crafted to perfection
      </p>
    </div>

    {/* Offers Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {displayList.map(item => {
        const cartItem = cartItems.find(ci => ci.item?._id === item._id);
        const qty = cartItem?.quantity ?? 0;
        const cartId = cartItem?._id;

        return (
          <div
            key={item._id}
            className="relative group bg-[#ecfdf5] rounded-3xl overflow-hidden shadow-2xl hover:-translate-y-4 transition duration-500 hover:shadow-lime-500/40 border-2 border-transparent hover:border-green-400/30"
          >
            {/* Image & Stats */}
            <div className="relative h-72 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover brightness-90 group-hover:brightness-105 duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-900/80" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-green-900/30 backdrop-blur-sm px-4 py-2 rounded-full">
                {/* <span className="flex items-center gap-2 text-lime-400">
                  <FaStar /><b>{item.rating}</b>
                </span> */}
                {/* <span className="flex items-center gap-2 text-emerald-400">
                  <FaHeart /><b>{item.hearts}</b>
                </span> */}
              </div>
            </div>

            {/* Content & Cart Controls */}
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-lime-400 to-emerald-500 bg-clip-text text-transparent italic">
                {item.name}
              </h3>
              <p className="text-green-800 mb-5 text-sm">{item.description}</p>
              <div className="flex items-center justify-between gap-4">
                <span className="text-2xl font-bold text-green-600">
                  ₹{Number(item.price).toFixed(2)}
                </span>

                {qty > 0 ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        qty > 1
                          ? updateQuantity(cartId, qty - 1)
                          : removeFromCart(cartId)
                      }
                      className="w-8 h-8 rounded-full bg-green-700/20 flex items-center justify-center"
                    >
                      <HiMinus className="w-4 h-4 text-green-100" />
                    </button>
                    <span className="w-8 text-center text-green-900">{qty}</span>
                    <button
                      onClick={() => updateQuantity(cartId, qty + 1)}
                      className="w-8 h-8 rounded-full bg-green-700/20 flex items-center justify-center"
                    >
                      <HiPlus className="w-4 h-4 text-green-100" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(item, 1)}
                    className="flex items-center gap-2 bg-gradient-to-r from-lime-500 to-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold"
                  >
                    <FaPlus />
                    <span>Add</span>
                  </button>
                )}
              </div>
            </div>

           
          </div>
        );
      })}
    </div>

    {/* Show More / Show Less */}
    <div className="mt-12 flex justify-center">
      <button
        onClick={() => setShowAll(!showAll)}
        className="flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-lime-600 text-white px-8 py-4 rounded-2xl font-bold uppercase"
      >
        <FaFire className="animate-pulse" />
        <span>{showAll ? 'Show Less' : 'Show More'}</span>
      </button>
    </div>
  </div>
</div>

  );
};

export default SpecialOffer;
