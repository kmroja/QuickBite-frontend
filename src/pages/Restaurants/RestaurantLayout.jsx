import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { GiChefToque } from "react-icons/gi";
import { FaUtensils, FaList, FaShoppingBag, FaStore } from "react-icons/fa";

const navLinks = [
  { name: "Dashboard", href: "/restaurant/dashboard", icon: <FaStore /> },
  { name: "Menu Items", href: "/restaurant/menu", icon: <FaUtensils /> },
  { name: "Orders", href: "/restaurant/orders", icon: <FaShoppingBag /> },
  { name: "Profile", href: "/restaurant/profile", icon: <FaList /> },
];

const RestaurantLayout = ({ title, children }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-500 ${
          collapsed ? "w-20" : "w-72"
        }`}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
      >
        <div className="flex items-center gap-3 p-5 border-b border-gray-700">
          <GiChefToque className="text-3xl text-yellow-400" />
          {!collapsed && (
            <div>
              <h1 className="font-extrabold text-2xl">QuickBite</h1>
              <p className="text-gray-300 text-sm">Restaurant Panel</p>
            </div>
          )}
        </div>

        <nav className="flex flex-col mt-5 gap-2 px-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${
                location.pathname === link.href
                  ? "bg-green-600 font-semibold"
                  : "hover:bg-gray-700"
              }`}
            >
              <div className="text-lg">{link.icon}</div>
              {!collapsed && <span>{link.name}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <main
        className={`flex-1 transition-all duration-500 ${
          collapsed ? "ml-20" : "ml-72"
        }`}
      >
        {/* HEADER */}
        <div className="bg-white px-8 py-6 shadow-sm border-b">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        </div>

        {/* CONTENT */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default RestaurantLayout;
