// src/pages/admin/Navbar/Navbar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { GiChefToque, GiForkKnifeSpoon } from "react-icons/gi";
import { FiShoppingCart } from "react-icons/fi";
// src/pages/admin/Navbar/Navbar.jsx
import { navLinksNavbar } from "../../../assets/dummyAdmin";

 // import config only

const AdminNavbar = ({ totalItems, renderDesktopAuthButton, renderMobileAuthButton, showLoginModal, handleLoginSuccess, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  // return (
  //   // <nav className="bg-[#2D1B0E] border-b-8 border-amber-900/40 shadow-[0_25px_50px_-12px] shadow-amber-900/30 sticky top-0 z-50 font-vibes">
  //   //   {/* navbar JSX */}
  //   //   <div className="max-w-7xl mx-auto px-4 relative">
  //   //     {/* Logo Section */}
  //   //     <div className="flex justify-between items-center h-16 lg:h-20">
  //   //       <div className="flex-shrink-0 flex items-center space-x-2 group">
  //   //         <GiChefToque className="text-2xl md:text-3xl lg:text-4xl text-amber-500 transition-all group-hover:rotate-12" />
  //   //         <div className="flex flex-col ml-1 md:ml-2">
  //   //           {/* <NavLink
  //   //             to="/"
  //   //             className="text-lg md:text-xl lg:text-2xl xl:text-3xl bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent font-monsieur tracking-wider whitespace-nowrap"
  //   //           >
  //   //             QuickBite
  //   //           </NavLink> */}
  //   //         </div>
  //   //       </div>

  //   //       {/* Desktop Navigation */}
  //   //       {/* <div className="hidden lg:flex items-center space-x-4 flex-1 justify-end">
  //   //         {navLinksNavbar.map((link) => (
  //   //           <NavLink
  //   //             key={link.name}
  //   //             to={link.href}
  //   //             className={({ isActive }) =>
  //   //               `px-2 xl:px-4 py-2 flex items-center space-x-2 rounded-3xl border-2 transition-colors text-sm xl:text-base
  //   //                 ${isActive ? 'bg-amber-900/20 border-amber-600/50' : 'border-transparent hover:border-amber-600/50'}`
  //   //             }
  //   //           >
  //   //             <span className="text-amber-500">{link.icon}</span>
  //   //             <span className="text-amber-100">{link.name}</span>
  //   //           </NavLink>
  //   //         ))}
  //   //       </div> */}
  //   //     </div>
  //   //   </div>
  //   // </nav>
  // );
};

export default AdminNavbar;
