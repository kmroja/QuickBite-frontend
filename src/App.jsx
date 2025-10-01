import React from "react";
import { Routes, Route } from "react-router-dom";

// Public pages
import Home from "./pages/Home/Home";
import SignUp from "./components/SignUp/SignUp";
import Login from "./components/Login/Login";
import ContactPage from "./pages/ContactPage/ContactPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import Menu from "./pages/Menu/Menu";

// Protected user pages
import Cart from "./pages/Cart/Cart";
import CheckoutPage from "./pages/Checkout/Checkout";
import MyOrders from "./pages/MyOrders/MyOrders";
import VerifyPaymentPage from "./pages/VerifyPaymentPage/VerifyPaymentPage";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddItems from './pages/admin/AddItems/AddItems';
import Orders from './pages/admin/Orders/Orders';
import ListItems from './pages/admin/ListItems/ListItems';

// Components
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import AdminToggle from "./components/AdminToggle/AdminToggle";
import FloatingIcons from "./components/FloatingParticle/FloatingParticle";

function App() {
  return (
    <>
      {/* Floating food icons everywhere */}
      <FloatingIcons />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/menu" element={<Menu />} />

        {/* Payment verification */}
        <Route path="/myorder/verify" element={<VerifyPaymentPage />} />

        {/* User Protected Routes */}
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

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/"
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
      </Routes>

      {/* Global floating button (only visible for Admins) */}
      <AdminToggle />
    </>
  );
}

export default App;

