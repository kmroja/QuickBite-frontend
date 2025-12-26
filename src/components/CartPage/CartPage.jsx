import React, { useState } from 'react';
import { useCart } from '../../CartContext/CartContext';
import { Link } from 'react-router-dom';
import { FaMinus, FaPlus, FaTrash, FaTimes } from 'react-icons/fa';

const API_URL = 'https://quickbite-backend-6dvr.onrender.com';
// const API_URL = 'http://localhost:4000'

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, totalAmount } = useCart();
  const [selectedImage, setSelectedImage] = useState(null);

  const buildImageUrl = (path) => {
    if (!path) return '';
    return path.startsWith('http')
      ? path
      : `${API_URL}/uploads/${path.replace(/^\/uploads\//, '')}`;
  };

  return (
    <div className="min-h-screen overflow-x-hidden py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#e8f5e9] via-[#f1f8e9] to-[#f9fbe7]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-12">
          <span className="font-dancingscript block text-5xl sm:text-6xl md:text-7xl mb-2 bg-gradient-to-r from-green-600 to-lime-500 bg-clip-text text-transparent">
            Your Cart
          </span>
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-green-800 text-xl mb-4">Your cart is empty</p>
            <Link
              to="/menu"
              className="bg-green-200 px-6 py-2 rounded-full font-cinzel text-sm uppercase hover:bg-green-300 transition duration-300 text-green-900 inline-flex items-center gap-2"
            >
              Browse All Items
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cartItems
                .filter(ci => ci.item)
                .map(({ _id, item, quantity }) => (
                  <div
                    key={_id}
                    className="group bg-green-100 p-4 rounded-2xl border-4 border-dashed border-green-400 backdrop-blur-sm flex flex-col items-center gap-4 transition-all duration-300 hover:border-solid hover:shadow-xl hover:shadow-green-300 transform hover:-translate-y-1"
                  >
                    <div
                      className="w-24 h-24 flex-shrink-0 cursor-pointer relative overflow-hidden rounded-lg transition-transform duration-300"
                      onClick={() => setSelectedImage(buildImageUrl(item.imageUrl || item.image))}
                    >
                      <img
                        src={buildImageUrl(item?.imageUrl || item?.image)}
                        alt={item?.name || 'Item'}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="w-full text-center">
                      <h3 className="text-xl font-dancingscript text-green-900">
                        {item.name}
                      </h3>
                      <p className="text-green-800 font-cinzel mt-1">
                        ₹{Number(item.price).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(_id, Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center hover:bg-green-300 transition duration-200 active:scale-95"
                      >
                        <FaMinus className="w-4 h-4 text-green-800" />
                      </button>
                      <span className="w-8 text-center text-green-900 font-cinzel">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(_id, quantity + 1)}
                        className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center hover:bg-green-300 transition duration-200 active:scale-95"
                      >
                        <FaPlus className="w-4 h-4 text-green-800" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between w-full">
                      <button
                        onClick={() => removeFromCart(_id)}
                        className="bg-green-200 px-3 py-1 rounded-full font-cinzel text-xs uppercase transition duration-300 hover:bg-green-300 flex items-center gap-1 active:scale-95"
                      >
                        <FaTrash className="w-4 h-4 text-green-900" />
                        <span className="text-green-900">Remove</span>
                      </button>
                      <p className="text-sm font-dancingscript text-lime-700">
                        ₹{(Number(item.price) * quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-12 pt-8 border-t border-green-300">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
                <Link
                  to="/menu"
                  className="bg-green-200 px-8 py-3 rounded-full font-cinzel uppercase tracking-wider hover:bg-green-300 transition duration-300 text-green-900 inline-flex items-center gap-2 active:scale-95"
                >
                  Continue Shopping
                </Link>
                <div className="flex items-center gap-8">
                  <h2 className="text-3xl font-dancingscript text-green-900">
                    Total: ₹{totalAmount.toFixed(2)}
                  </h2>
                  <Link
                    to="/checkout"
                    className="bg-green-200 px-8 py-3 rounded-full font-cinzel uppercase tracking-wider hover:bg-green-300 transition duration-300 text-green-900 flex items-center gap-2 active:scale-95"
                  >
                    Checkout Now
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-green-200/60 backdrop-blur-sm p-4 overflow-auto"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={selectedImage}
              alt="Full view"
              className="max-w-[90vw] max-h-[90vh] rounded-lg object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-1 right-1 bg-green-400 rounded-full p-2 text-green-900 hover:bg-green-500 transition duration-200 active:scale-90"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
