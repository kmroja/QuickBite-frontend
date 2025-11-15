import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
} from "react";
import axios from "axios";

// Create context
const CartContext = createContext();

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case "HYDRATE_CART":
      return action.payload;

    case "ADD_ITEM": {
      const { _id, item, quantity } = action.payload;
      const exists = state.find((ci) => ci._id === _id);
      if (exists) {
        return state.map((ci) =>
          ci._id === _id ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
      }
      return [...state, { _id, item, quantity }];
    }

    case "UPDATE_ITEM":
      return state.map((ci) =>
        ci._id === action.payload._id
          ? { ...ci, quantity: action.payload.quantity }
          : ci
      );

    case "REMOVE_ITEM":
      return state.filter((ci) => ci._id !== action.payload);

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
};

const API_URL =
  import.meta.env.VITE_API_URL || "https://quickbite-backend-6dvr.onrender.com";

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, []);
  const [toast, setToast] = useState(null);
  const [userId, setUserId] = useState(null);

  // Get current user ID from localStorage
  const getUserFromToken = () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      return userData?._id || null;
    } catch {
      return null;
    }
  };

  // Fetch cart for logged-in user
  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    const currentUser = getUserFromToken();

    if (!token || !currentUser) {
      dispatch({ type: "CLEAR_CART" });
      localStorage.removeItem("cart");
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch({ type: "HYDRATE_CART", payload: res.data });
      localStorage.setItem("cart", JSON.stringify(res.data));
      setUserId(currentUser);
    } catch (err) {
      console.error("Fetch cart failed:", err.response?.data || err.message);
      setToast({ message: "Failed to load cart", type: "error" });
    }
  }, []);

  // Load cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Detect user switch (logout or new login)
  useEffect(() => {
    const handleStorageChange = () => {
      const newUser = getUserFromToken();
      if (newUser !== userId) {
        dispatch({ type: "CLEAR_CART" });
        localStorage.removeItem("cart");
        setUserId(newUser);
        if (newUser) fetchCart();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [userId, fetchCart]);

  // Persist locally
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ----- Actions -----
  const addToCart = useCallback(async (item, qty = 1) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setToast({ message: "Login to add items", type: "error" });
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/cart`,
        { itemId: item._id, quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: "ADD_ITEM", payload: res.data });
      setToast({ message: "Added to cart", type: "success" });
    } catch (err) {
      console.error("Add to cart failed:", err);
      setToast({ message: "Failed to add item", type: "error" });
    }
  }, []);

  const updateQuantity = useCallback(async (_id, qty) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const res = await axios.put(
        `${API_URL}/api/cart/${_id}`,
        { quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: "UPDATE_ITEM", payload: res.data });
    } catch (err) {
      console.error("Update failed:", err);
    }
  }, []);

  const removeFromCart = useCallback(async (_id) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      await axios.delete(`${API_URL}/api/cart/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch({ type: "REMOVE_ITEM", payload: _id });
      setToast({ message: "Removed from cart", type: "success" });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }, []);

  const clearCart = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      await axios.post(
        `${API_URL}/api/cart/clear`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: "CLEAR_CART" });
      localStorage.removeItem("cart");
      setToast({ message: "Cart cleared", type: "success" });
    } catch (err) {
      console.error("Clear cart failed:", err);
    }
  }, []);

  // Derived totals
  const totalItems = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);
  const totalAmount = cartItems.reduce(
    (sum, ci) => sum + (ci.item?.price || 0) * ci.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalAmount,
        toast,
        setToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook
export const useCart = () => useContext(CartContext);
