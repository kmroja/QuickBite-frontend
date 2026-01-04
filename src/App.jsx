import React from "react";
import { Routes, Route } from "react-router-dom";

/* ================= PUBLIC ================= */
import Home from "./pages/Home/Home";
import SignUp from "./components/SignUp/SignUp";
import Login from "./components/Login/Login";
import ContactPage from "./pages/ContactPage/ContactPage";
import AboutPage from "./pages/AboutPage/AboutPage";

/* ================= USER ================= */
import Cart from "./pages/Cart/Cart";
import CheckoutPage from "./pages/Checkout/Checkout";
import MyOrders from "./pages/MyOrders/MyOrders";
import VerifyPaymentPage from "./pages/VerifyPaymentPage/VerifyPaymentPage";
import UserRestaurantMenu from "./components/OurMenu/UserRestaurantMenu";


/* ================= ADMIN ================= */
import AdminDashboard from "./pages/admin/AdminDashboard";

import AddRestaurant from "./pages/admin/restaurants/AddRestaurant";
import ListRestaurants from "./pages/admin/restaurants/ListRestaurantsAdmin";
import ListItems from "./pages/admin/ListItems/ListItems";
import AdminUsers from "./pages/admin/Users/AdminUsers";
import AdminApplications from "./pages/AdminApplications";

/* ================= RESTAURANT ================= */
import RestaurantsList from "./pages/Restaurants/RestaurantsList";
import RestaurantLogin from "./pages/Restaurants/RestaurantLogin";
import RestaurantDashboard from "./pages/Restaurants/RestaurantDashboard";
import RestaurantOrders from "./pages/Restaurants/RestaurantOrders";
import MenuManagement from "./pages/Restaurants/RestaurantMenu";


import RestaurantProfile from "./pages/Restaurants/RestaurantProfile";
import OrderDetails from "./pages/Restaurants/OrderDetails";

/* ================= COMMON ================= */
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import AdminToggle from "./components/AdminToggle/AdminToggle";
import ApplyRestaurant from "./pages/ApplyRestaurant";

function App() {
  return (
    <>
      <Routes>
        {/* 🌍 PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* 🍴 USER SIDE */}
        <Route path="/restaurants" element={<RestaurantsList />} />
        <Route path="/restaurants/:id" element={<UserRestaurantMenu />} />

        <Route path="/apply-restaurant" element={<ApplyRestaurant />} />
        <Route path="/restaurant/login" element={<RestaurantLogin />} />

        {/* 👤 USER (PROTECTED) */}
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
        <Route path="/myorder/verify" element={<VerifyPaymentPage />} />

        {/* 🧑‍🍳 RESTAURANT PANEL */}
        <Route
          path="/restaurant/dashboard"
          element={
            <PrivateRoute role="restaurant">
              <RestaurantDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/restaurant/orders"
          element={
            <PrivateRoute role="restaurant">
              <RestaurantOrders />
            </PrivateRoute>
          }
        />

        <Route
          path="/restaurant/orders/:orderId"
          element={
            <PrivateRoute role="restaurant">
              <OrderDetails />
            </PrivateRoute>
          }
        />

   <Route
  path="/restaurant/menu"
  element={
    <PrivateRoute role="restaurant">
      <MenuManagement />
    </PrivateRoute>
  }
/>



        <Route
          path="/restaurant/profile"
          element={
            <PrivateRoute role="restaurant">
              <RestaurantProfile />
            </PrivateRoute>
          }
        />

        {/* 🛠️ ADMIN */}
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
          path="/admin/list"
          element={
            <PrivateRoute role="admin">
              <ListItems />
            </PrivateRoute>
          }
        />

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
          path="/admin/applications"
          element={
            <PrivateRoute role="admin">
              <AdminApplications />
            </PrivateRoute>
          }
        />
      </Routes>

      <AdminToggle />
    </>
  );
}

export default App;
