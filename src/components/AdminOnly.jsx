// src/components/AdminOnly.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const AdminOnly = ({ children }) => {
  const token = localStorage.getItem("authToken");  // ✅ FIXED
  const loginData = (() => {
    try {
      return JSON.parse(localStorage.getItem("loginData") || "{}");
    } catch {
      return {};
    }
  })();

  if (!token || loginData?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminOnly;
