// CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect, useCallback, useState } from "react";
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
      const exists = state.find(ci => ci._id === _id);
      if (exists) {
        return state.map(ci =>
          ci._id === _id ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
      }
      return [...state, { _id, item, quantity }];
    }

    case "UPDATE_ITEM": {
      const { _id, quantity } = action.payload;
      return state.map(ci => (ci._id === _id ? { ...ci, quantity } : ci));
    }

    case "REMOVE_ITEM":
      return state.filter(ci => ci._id !== action.payload);

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
};

// Initializer for localStorage
const initializer = () => {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, [], initializer);
  const [toast, setToast] = useState(null);

  // Persist locally
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Hydrate from server
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return; // user not logged in

      try {
        const res = await axios.get("https://quickbite-backend-6dvr.onrender.com/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch({ type: "HYDRATE_CART", payload: res.data });
      } catch (err) {
        console.error("Fetch cart failed:", err.response?.data || err.message);
        setToast({ message: "Failed to load cart", type: "error" });
      }
    };
    fetchCart();
  }, []);

  // ----- Cart actions -----
  const addToCart = useCallback(async (item, qty) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setToast({ message: "Login to add items to cart", type: "error" });
      return;
    }

    try {
      const res = await axios.post(
        "https://quickbite-backend-6dvr.onrender.com/api/cart",
        { itemId: item._id, quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: "ADD_ITEM", payload: res.data });
      setToast({ message: "Added to cart", type: "success" });
    } catch (err) {
      console.error("Add to cart failed:", err.response?.data || err.message);
      setToast({ message: err.response?.data?.message || "Failed to add to cart", type: "error" });
    }
  }, []);

  const updateQuantity = useCallback(async (_id, qty) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setToast({ message: "Login to update cart", type: "error" });
      return;
    }

    try {
      const res = await axios.put(
        `https://quickbite-backend-6dvr.onrender.com/api/cart/${_id}`,
        { quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: "UPDATE_ITEM", payload: res.data });
    } catch (err) {
      console.error("Update cart failed:", err.response?.data || err.message);
      setToast({ message: "Failed to update cart", type: "error" });
    }
  }, []);

  const removeFromCart = useCallback(async (_id) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setToast({ message: "Login to remove items from cart", type: "error" });
      return;
    }

    try {
      await axios.delete(
        `https://quickbite-backend-6dvr.onrender.com/api/cart/${_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: "REMOVE_ITEM", payload: _id });
      setToast({ message: "Removed from cart", type: "success" });
    } catch (err) {
      console.error("Remove from cart failed:", err.response?.data || err.message);
      setToast({ message: "Failed to remove item", type: "error" });
    }
  }, []);

  const clearCart = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setToast({ message: "Login to clear cart", type: "error" });
      return;
    }

    try {
      await axios.post(
        "https://quickbite-backend-6dvr.onrender.com/api/cart/clear",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({ type: "CLEAR_CART" });
      setToast({ message: "Cart cleared", type: "success" });
    } catch (err) {
      console.error("Clear cart failed:", err.response?.data || err.message);
      setToast({ message: "Failed to clear cart", type: "error" });
    }
  }, []);

  // Derived values
  const totalItems = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);
  const totalAmount = cartItems.reduce((sum, ci) => sum + (ci.item?.price || 0) * ci.quantity, 0);

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

export const useCart = () => useContext(CartContext);
