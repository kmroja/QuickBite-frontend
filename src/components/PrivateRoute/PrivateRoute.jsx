import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  // Retrieve login data from localStorage
  const loginData = localStorage.getItem("loginData");
  const user = loginData ? JSON.parse(loginData) : null;

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role is required (ex: "admin") and does not match → redirect to home
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, allow access
  return children;
};

export default PrivateRoute;
