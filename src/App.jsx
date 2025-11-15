import React from "react";
import { Routes, Route } from "react-router-dom";

// 🏠 Public pages
import Home from "./pages/Home/Home";
import SignUp from "./components/SignUp/SignUp";
import Login from "./components/Login/Login";
import ContactPage from "./pages/ContactPage/ContactPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import Menu from "./pages/Menu/Menu";

// 🛒 User-protected pages
import Cart from "./pages/Cart/Cart";
import CheckoutPage from "./pages/Checkout/Checkout";
import MyOrders from "./pages/MyOrders/MyOrders";
import VerifyPaymentPage from "./pages/VerifyPaymentPage/VerifyPaymentPage";

// 🧑‍💼 Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddItems from "./pages/admin/AddItems/AddItems";
import Orders from "./pages/admin/Orders/Orders";
import ListItems from "./pages/admin/ListItems/ListItems";
import AdminUsers from "./pages/admin/Users/AdminUsers.jsx";

// 🍽️ Restaurants (Public + Admin)
import RestaurantsList from "./pages/Restaurants/RestaurantsList";
import RestaurantDetails from "./pages/Restaurants/RestaurantDetails";
import AddRestaurant from "./pages/admin/AddRestaurant/AddRestaurant";     // ✅ FIXED
import ListRestaurants from "./pages/admin/ListRestaurant/ListRestaurants"; // ✅ FIXED

// 🔐 Common components
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import AdminToggle from "./components/AdminToggle/AdminToggle";
// import FloatingIcons from "./components/FloatingParticle/FloatingParticle";

import ApplyRestaurant from "./pages/ApplyRestaurant";
import AdminApplications from "./pages/AdminApplications";


function App() {
  return (
    <>
      {/* <FloatingIcons /> */}

      <Routes>
        {/* 🌍 Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/menu" element={<Menu />} />

        {/* 💳 Payment */}
        <Route path="/myorder/verify" element={<VerifyPaymentPage />} />

        {/* 🍴 Restaurant Pages (Public) */}
        <Route path="/restaurants" element={<RestaurantsList />} />
        <Route path="/restaurants/:id" element={<RestaurantDetails />} />

        {/* 🧑‍🍳 Admin Restaurant Management */}
        <Route
          path="/admin/restaurants/add"
          element={
            <PrivateRoute role="admin">
              <AddRestaurant />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/restaurants/list"
          element={
            <PrivateRoute role="admin">
              <ListRestaurants />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/restaurants/:id/menu"
          element={
            <PrivateRoute role="admin">
              <div className="text-center text-gray-700 p-6">
                Manage Restaurant Menu Page (Coming Soon)
              </div>
            </PrivateRoute>
          }
        />

        {/* 👤 User Protected Routes */}
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/myorder"
          element={
            <PrivateRoute>
              <MyOrders />
            </PrivateRoute>
          }
        />

        {/* 🛠️ Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute role="admin">
              <AdminUsers />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/add"
          element={
            <PrivateRoute role="admin">
              <AddItems />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/list"
          element={
            <PrivateRoute role="admin">
              <ListItems />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <PrivateRoute role="admin">
              <Orders />
            </PrivateRoute>
          }
        />
        {/* 🌟 Public Restaurant Apply Page */}
<Route path="/apply-restaurant" element={<ApplyRestaurant />} />

{/* 🧑‍💼 Admin — Restaurant Applications */}
<Route
  path="/admin/applications"
  element={
    <PrivateRoute role="admin">
      <AdminApplications />
    </PrivateRoute>
  }
/>

      </Routes>

      {/* 🧭 Floating Admin/User Toggle */}
      <AdminToggle />
    </>
  );
}

export default App;
