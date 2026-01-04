// assets/dummyAdmin.jsx
// assets/dummyAdmin.jsx
import React from "react";
import {
  FaUtensils,
  FaUsers,
  FaClipboardList,
  FaTachometerAlt,
  FaRegListAlt,
  FaFileAlt, // ✅ NEW ICON FOR APPLICATIONS
} from "react-icons/fa";

/* ---------------- Sidebar navigation links (Admin) ---------------- */
export const navLinksSidebar = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: <FaTachometerAlt />,
  },

  {
    name: "Applications", // ✅ FIXED
    href: "/admin/applications", // ✅ REQUIRED URL
    icon: <FaFileAlt />,
  },

  {
    name: "Orders",
    href: "/admin/orders",
    icon: <FaClipboardList />,
  },

  {
    name: "Users",
    href: "/admin/users",
    icon: <FaUsers />,
  },

  {
    name: "Restaurants",
    href: "/admin/restaurants/list",
    icon: <FaRegListAlt />,
  },
];

/* ---------------- Navbar navigation links (Top Navbar) ---------------- */
export const navLinksNavbar = [
  { name: "Dashboard", href: "/admin", icon: <FaTachometerAlt /> },
  { name: "Home", href: "/", icon: <FaUtensils /> },
  { name: "Applications", href: "/admin/applications", icon: <FaFileAlt /> },
  { name: "Orders", href: "/admin/orders", icon: <FaClipboardList /> },
];


/* ---------------- General page styles -------------------------------------- */
export const styles = {
  pageWrapper:
    "min-h-screen bg-gradient-to-br from-[#dfece2] via-[#b9c8ac] to-[#7b8b6f] py-12 px-4 sm:px-6 lg:px-8",
  cardContainer:
    "bg-[#eef3eb]/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-green-700/20",
  title:
    "text-3xl font-bold mb-8 bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent text-center",
  formWrapper: "min-h-screen py-10 px-4 sm:px-6 lg:px-8",
  formCard:
    "bg-[#eef3eb]/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-green-700/20",
  formTitle:
    "text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-green-600 to-green-900 bg-clip-text text-transparent text-center",
  uploadWrapper: "flex justify-center",
  uploadLabel:
    "w-full max-w-xs sm:w-72 h-56 sm:h-72 bg-[#cbdac6]/50 border-2 border-dashed border-green-600/30 rounded-2xl cursor-pointer flex items-center justify-center overflow-hidden hover:border-green-500 transition-all",
  uploadIcon: "text-3xl sm:text-4xl text-green-700 mb-2 mx-auto animate-pulse",
  uploadText: "text-green-700 text-sm",
  previewImage: "w-full h-full object-cover",
  inputField:
    "w-full bg-[#cbdac6]/50 border border-green-700/20 rounded-xl px-4 py-3 sm:px-5 sm:py-4 focus:outline-none focus:border-green-500 text-green-900",
  gridTwoCols: "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6",
  relativeInput: "relative",
  rupeeIcon:
    "absolute left-4 top-1/2 -translate-y-1/2 text-green-700 text-lg sm:text-xl",
  actionBtn:
    "w-full bg-gradient-to-r from-green-700 to-green-900 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg transition-all hover:shadow-2xl hover:shadow-green-500/30 hover:scale-[1.02] active:scale-95 mt-6",
};

/* ---------------- Table styles -------------------------------------------- */
export const tableClasses = {
  wrapper: "overflow-x-auto",
  table: "w-full",
  headerRow: "bg-[#cbdac6]/60",
  headerCell: "p-4 text-left text-green-800",
  row: "border-b border-green-800/20 hover:bg-[#a8bfa0]/30 transition-colors",
  cellBase: "p-4",
};

/* ---------------- Layout classes ------------------------------------------ */
export const layoutClasses = {
  page:
    "min-h-screen bg-gradient-to-br from-[#dfece2] via-[#b9c8ac] to-[#7b8b6f] py-12 px-4 sm:px-6 lg:px-8",
  card:
    "bg-[#4f514e]/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-green-700/20",
  heading:
    "text-3xl font-bold mb-8 bg-gradient-to-r from-green-900 to-green-900 bg-clip-text text-transparent text-center",
};

/* ---------------- Order status styling ------------------------------------ */
export const statusStyles = {
  processing:   { color: "text-red-700", bg: "bg-green-900/10",  icon: "FiClock",      label: "Processing" },
  outForDelivery:{color: "text-yellow-600",  bg: "bg-lime-900/10",   icon: "FiTruck",      label: "Out for Delivery" },
  delivered:    { color: "text-green-600", bg: "bg-emerald-900/10", icon: "FiCheckCircle", label: "Delivered" },
  succeeded:    { color: "text-emerald-600", bg: "bg-emerald-900/10", icon: "FiCheckCircle", label: "Completed" },
};

/* ---------------- Payment method styles ----------------------------------- */
export const paymentMethodDetails = {
  cod:      { label: "COD",               class: "bg-green-700/30 text-green-200 border-green-500/50" },
  card:     { label: "Credit/Debit Card", class: "bg-lime-700/30 text-lime-200 border-lime-500/50" },
  upi:      { label: "UPI Payment",       class: "bg-emerald-700/30 text-emerald-200 border-emerald-500/50" },
  default:  { label: "Online",            class: "bg-teal-700/30 text-teal-200 border-teal-500/50" },
};
