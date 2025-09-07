import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ADMIN_PANEL_URL = "https://quickbite-adminapp.netlify.app/";

const AdminToggle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFrontend, setIsFrontend] = useState(true);

  const checkAdmin = () => {
    const loginData = JSON.parse(localStorage.getItem("loginData"));
    setIsAdmin(loginData?.role === "admin");
  };

  useEffect(() => {
    checkAdmin();
    const handleStorageChange = () => checkAdmin();
    window.addEventListener("storage", handleStorageChange);

    const handleAuthChange = () => checkAdmin();
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    setIsFrontend(!location.pathname.startsWith("/admin"));
  }, [location.pathname]);

  if (!isAdmin) return null;

  const handleToggle = () => {
    if (isFrontend) {
      window.open(ADMIN_PANEL_URL, "_blank");
    } else {
      navigate("/");
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-6 right-6 bg-gradient-to-br from-lime-400 to-emerald-600 text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 hover:shadow-emerald-500/60 transition-transform font-semibold"
    >
      {isFrontend ? "Switch to Admin Panel" : "Switch to Frontend"}
    </button>
  );
};

export default AdminToggle;
