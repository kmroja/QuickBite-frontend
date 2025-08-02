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
    axios.get('http://localhost:4000/api/items')
      .then(res => {
        const grouped = res.data.reduce((acc, item) => {
          acc[item.category] = acc[item.category] || [];
          acc[item.category].push(item);
          return acc;
        }, {});
        setMenuData(grouped);
      })
      .catch(console.error);
  }, []);

  // Find cart entry by product ID
  const getCartEntry = id => cartItems.find(ci => ci.item?._id === id);
  const getQuantity = id => getCartEntry(id)?.quantity ?? 0;
  const displayItems = (menuData[activeCategory] || []).slice(0, 4);

  return (
   <div className="bg-gradient-to-br from-[#E8F5E9] via-[#C8E6C9] to-[#A5D6A7] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#2E7D32] via-[#388E3C] to-[#2E7D32]">
      <span className="font-dancingscript block text-5xl sm:text-6xl md:text-7xl mb-2">
        Our Exquisite Menu
      </span>
      <span className="block text-xl sm:text-2xl md:text-3xl font-cinzel mt-4 text-[#1B5E20]/80">
        A Symphony of Flavors
      </span>
    </h2>

    {/* Category buttons */}
    <div className="flex flex-wrap justify-center gap-4 mb-16">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`px-4 sm:px-6 py-2 rounded-full border-2 transition-all duration-300 transform font-cinzel text-sm sm:text-lg tracking-widest backdrop-blur-sm ${
            activeCategory === cat
              ? 'bg-gradient-to-br from-[#66BB6A]/80 to-[#81C784]/80 border-[#388E3C] scale-105 shadow-xl shadow-[#2E7D32]/30'
              : 'bg-[#A5D6A7]/30 border-[#66BB6A]/30 text-[#1B5E20]/80 hover:bg-[#81C784]/40 hover:scale-95'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>

    {/* Menu grid */}
    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
      {displayItems.map((item, i) => {
        const qty = getQuantity(item._id);
        const cartEntry = getCartEntry(item._id);

        return (
          <div
            key={item._id}
            className="relative bg-[#A5D6A7]/20 rounded-2xl overflow-hidden border border-[#66BB6A]/30 backdrop-blur-sm flex flex-col transition-all duration-500"
            style={{ '--index': i }}
          >
            <div className="relative h-48 sm:h-56 md:h-60 flex items-center justify-center bg-black/10">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="max-h-full max-w-full object-contain transition-all duration-700"
              />
            </div>

            <div className="p-4 sm:p-6 flex flex-col flex-grow">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-[#66BB6A]/50 to-transparent opacity-50 transition-all duration-300" />
              <h3 className="text-xl sm:text-2xl mb-2 font-dancingscript text-[#1B5E20] transition-colors">
                {item.name}
              </h3>
              <p className="text-[#2E7D32]/80 text-xs sm:text-sm mb-4 font-cinzel leading-relaxed">
                {item.description}
              </p>

              {/* Price & Cart Controls */}
              <div className="mt-auto flex items-center gap-4 justify-between">
                <div className="bg-[#E8F5E9]/30 backdrop-blur-sm px-3 py-1 rounded-2xl shadow-lg">
                  <span className="text-xl font-bold text-[#2E7D32] font-dancingscript">
                    ₹{Number(item.price).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {qty > 0 ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          qty > 1
                            ? updateQuantity(cartEntry?._id, qty - 1)
                            : removeFromCart(cartEntry._id)
                        }
                        className="w-8 h-8 rounded-full bg-[#66BB6A]/40 flex items-center justify-center hover:bg-[#388E3C]/50 transition-colors"
                      >
                        <FaMinus className="text-white" />
                      </button>
                      <span className="w-8 text-center text-[#1B5E20]">
                        {qty}
                      </span>
                      <button
                        onClick={() => updateQuantity(cartEntry._id, qty + 1)}
                        className="w-8 h-8 rounded-full bg-[#66BB6A]/40 flex items-center justify-center hover:bg-[#388E3C]/50 transition-colors"
                      >
                        <FaPlus className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item, 1)}
                      className="bg-[#66BB6A]/40 px-4 py-1.5 rounded-full font-cinzel text-xs sm:text-sm uppercase tracking-widest transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#1B5E20]/20 relative overflow-hidden border border-[#388E3C]/50"
                    >
                      <span className="relative z-10 text-xs text-white">
                        Add to Cart
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {/* Full menu link */}
    <div className="flex justify-center mt-16">
      <Link
        to="/menu"
        className="bg-[#A5D6A7]/30 border-2 border-[#66BB6A]/30 text-[#1B5E20] px-8 sm:px-10 py-3 rounded-full font-cinzel uppercase tracking-widest transition-all duration-300 hover:bg-[#66BB6A]/40 hover:text-[#004D40] hover:scale-105 hover:shadow-lg hover:shadow-[#2E7D32]/20 backdrop-blur-sm"
      >
        Explore Full Menu
      </Link>
    </div>
  </div>
</div>

  );
};

export default OurMenuHome;