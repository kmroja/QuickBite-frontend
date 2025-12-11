// src/pages/Restaurants/RestaurantMenu.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useCart } from "../../CartContext/CartContext";
import { FaSearch, FaStar, FaPlus, FaMinus } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "https://quickbite-backend-6dvr.onrender.com";

const Toast = ({ message, type = "success", onClose }) => (
  <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg text-white font-semibold ${type === "success" ? "bg-green-600" : "bg-red-500"}`}>
    {message}
    <button onClick={onClose} className="ml-3 font-bold">✕</button>
  </div>
);

const RestaurantMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems: rawCart, addToCart, updateQuantity, removeFromCart } = useCart();
  const cartItems = rawCart.filter(ci => ci.item);
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null); // logged-in user

  useEffect(() => {
    // read token -> verify user role (optional)
    const token = localStorage.getItem("authToken");
    if (token) {
      axios.get(`${API_URL}/api/user/verify`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setUser(res.data.user || res.data.user)) // supports different verify payload shapes
        .catch(() => setUser(null));
    }
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // 1) restaurant details (with menu populated if backend sends it)
        const r = await axios.get(`${API_URL}/api/restaurants/${id}`);
        const rest = r.data.restaurant || r.data; // handle both shapes
        setRestaurant(rest);

        // 2) menu — prefer populated menu, fallback to items endpoint
        if (rest?.menu && Array.isArray(rest.menu) && rest.menu.length > 0) {
          setMenuItems(rest.menu);
        } else {
          const itemsRes = await axios.get(`${API_URL}/api/items/restaurant/${id}`);
          setMenuItems(itemsRes.data.items || itemsRes.data);
        }
      } catch (err) {
        console.error("Failed to load restaurant/menu:", err.response?.data || err.message);
        setToast({ message: "Failed to load restaurant", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const categories = useMemo(() => {
    if (!menuItems || !menuItems.length) return ["All"];
    const cats = Array.from(new Set(menuItems.map(i => i.category || "Uncategorized")));
    return ["All", ...cats];
  }, [menuItems]);

  const filteredMenu = useMemo(() => {
    if (!menuItems) return [];
    return menuItems.filter(item => {
      const byCategory = activeCategory === "All" || (item.category || "Uncategorized") === activeCategory;
      const bySearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return byCategory && bySearch;
    });
  }, [menuItems, activeCategory, searchQuery]);

  const getCartEntry = (itemId) => cartItems.find(ci => ci.item?._id === itemId);
  const getQuantity = (itemId) => getCartEntry(itemId)?.quantity ?? 0;

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading menu…</div>;

  return (
    <>
      <Navbar />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="min-h-screen bg-gradient-to-br from-[#fefae0] via-[#e9edc9] to-[#fefae0] py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          {restaurant ? (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <img src={restaurant.image || "/default-restaurant.jpg"} alt={restaurant.name} className="w-full md:w-72 h-56 object-cover rounded-xl shadow" />
              <div className="md:col-span-2">
                <h1 className="text-3xl font-bold text-green-800">{restaurant.name}</h1>
                <p className="text-sm text-green-700 mt-2">{restaurant.description}</p>
                <div className="mt-4 flex flex-wrap gap-3 items-center">
                  <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                    <FaStar className="text-yellow-400" />
                    <span className="font-semibold">{restaurant.rating || "4.5"}</span>
                    <span className="text-xs text-gray-500">({restaurant.totalReviews || 0} reviews)</span>
                  </div>
                  <div className="text-sm text-gray-600">📍 {restaurant.address || restaurant.location || "Address not available"}</div>
                  <div className="ml-auto">
                    {/* If logged in as that restaurant owner show Manage link */}
                    {user && user.role === "restaurant" && String(user._id) === String(restaurant.owner?._id || restaurant.owner) && (
                      <Link to="/restaurant/dashboard" className="px-3 py-2 bg-green-600 text-white rounded-lg">Manage Menu</Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600">Restaurant not found</div>
          )}

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-3 w-full md:w-2/3">
              <label className="relative w-full">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search menu items..." className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-300" />
                <button onClick={() => { setSearchQuery(""); setActiveCategory("All"); }} type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500">Clear</button>
              </label>
            </form>

            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-2 rounded-full text-sm ${activeCategory === cat ? "bg-green-600 text-white" : "bg-green-100 text-green-800"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Grid */}
          {filteredMenu.length === 0 ? (
            <div className="text-center py-20 text-lg text-green-900">No menu items available.</div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMenu.map(item => {
                const cartEntry = getCartEntry(item._id);
                const quantity = getQuantity(item._1d); // fallback if typo
                const qty = getQuantity(item._id);

                return (
                  <div key={item._id} className="bg-white rounded-2xl shadow p-4 flex flex-col">
                    <div className="h-44 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden mb-3">
                      <img src={item.imageUrl || "/default-food.jpg"} alt={item.name} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-green-900">{item.name}</h3>
                      <p className="text-sm text-green-700 mt-1 line-clamp-3">{item.description}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-green-800">₹{Number(item.price).toFixed(2)}</div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                          <FaStar className="text-yellow-400" /> <span>{(item.rating || 0).toFixed(1)}</span>
                        </div>
                      </div>

                      {/* Cart control */}
                      <div>
                        {getQuantity(item._id) > 0 ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => {
                              const entry = getCartEntry(item._id);
                              if (!entry) return;
                              if (entry.quantity <= 1) removeFromCart(entry._id);
                              else updateQuantity(entry._id, entry.quantity - 1);
                            }} className="p-2 rounded-full bg-green-100">
                              <FaMinus />
                            </button>

                            <div className="min-w-[36px] text-center">{getQuantity(item._id)}</div>

                            <button onClick={() => {
                              const entry = getCartEntry(item._id);
                              if (!entry) return addToCart(item, 1);
                              updateQuantity(entry._id, entry.quantity + 1);
                            }} className="p-2 rounded-full bg-green-600 text-white">
                              <FaPlus />
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => addToCart(item, 1)} className="px-4 py-2 rounded-full bg-green-600 text-white">Add</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RestaurantMenu;
