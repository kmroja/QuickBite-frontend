// UPDATED Navbar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiStar,
  FiPhone,
  FiShoppingCart,
  FiLogOut,
  FiKey,
  FiPackage
} from 'react-icons/fi';
import { GiChefToque, GiForkKnifeSpoon } from 'react-icons/gi';
import Login from '../Login/Login';
import { useCart } from '../../CartContext/CartContext';
import AdminToggle from '../AdminToggle/AdminToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem('loginData'))
  );
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    setShowLoginModal(location.pathname === '/login');
    setIsAuthenticated(Boolean(localStorage.getItem('loginData')));
  }, [location.pathname]);

  // ⭐ UPDATED NAV LINKS
  const navLinks = [
    { name: 'Home', href: '/', icon: <FiHome /> },
    { name: 'Restaurants', href: '/restaurants', icon: <GiForkKnifeSpoon /> },   // ✔️ UPDATED
    { name: 'Apply Restaurant', href: '/apply-restaurant', icon: <GiChefToque /> }, // ✔️ NEW
    { name: 'About', href: '/about', icon: <FiStar /> },
    { name: 'Contact', href: '/contact', icon: <FiPhone /> },
    ...(isAuthenticated ? [
      { name: 'My Orders', href: '/myorder', icon: <FiPackage /> }
    ] : [])
  ];

  const handleLoginSuccess = () => {
    localStorage.setItem('loginData', JSON.stringify({ loggedIn: true }));
    setIsAuthenticated(true);
    window.dispatchEvent(new Event("authChange"));
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('loginData');
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("authChange"));
  };

  const renderDesktopAuthButton = () => {
    return isAuthenticated ? (
      <button
        onClick={handleLogout}
        className="px-3 lg:px-4 py-1.5 lg:py-2 bg-gradient-to-br from-lime-500 to-emerald-700 text-[#1F2D20] 
          rounded-2xl font-bold hover:shadow-lg border-2 border-emerald-600/20 flex items-center space-x-2"
      >
        <FiLogOut />
        <span>Logout</span>
      </button>
    ) : (
      <button
        onClick={() => navigate('/login')}
        className="px-3 lg:px-4 py-1.5 lg:py-2 bg-gradient-to-br from-lime-400 to-emerald-600 text-[#1F2D20]
          rounded-2xl font-bold hover:shadow-lg border-2 border-emerald-500/20 flex items-center space-x-2"
      >
        <FiKey />
        <span>Login</span>
      </button>
    );
  };

  const renderMobileAuthButton = () => {
    return isAuthenticated ? (
      <button
        onClick={handleLogout}
        className="w-full px-4 py-3 bg-gradient-to-br from-lime-500 to-emerald-700 text-[#1F2D20] rounded-xl font-semibold flex items-center justify-center space-x-2"
      >
        <FiLogOut />
        <span>Logout</span>
      </button>
    ) : (
      <button
        onClick={() => {
          navigate('/login');
          setIsOpen(false);
        }}
        className="w-full px-4 py-3 bg-gradient-to-br from-lime-400 to-emerald-600 text-[#1F2D20] rounded-xl font-semibold flex items-center justify-center space-x-2"
      >
        <FiKey />
        <span>Login</span>
      </button>
    );
  };

  return (
    <nav className="bg-[#1F2D20] border-b-8 border-emerald-900/40 shadow-[0_25px_50px_-12px] shadow-emerald-900/30 sticky top-0 z-50 font-vibes">

      {/* Header UI untouched */}

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex justify-between items-center h-16 lg:h-20">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <GiChefToque className="text-4xl text-emerald-500" />
            <NavLink to="/" className="text-2xl bg-gradient-to-r from-lime-400 to-emerald-600 bg-clip-text text-transparent font-bold">QuickBite</NavLink>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) =>
                  `px-4 py-2 flex items-center space-x-2 rounded-3xl border-2 transition-colors text-base
                  ${isActive ? 'bg-emerald-900/20 border-emerald-600/50' : 'border-transparent hover:border-emerald-600/50'}`
                }
              >
                <span className="text-emerald-400">{link.icon}</span>
                <span className="text-emerald-100">{link.name}</span>
              </NavLink>
            ))}

            {/* Cart */}
            <NavLink to="/cart" className="relative text-emerald-100 hover:text-emerald-300">
              <FiShoppingCart className="text-xl" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </NavLink>

            {/* Auth Buttons */}
            {renderDesktopAuthButton()}

            {/* Admin Toggle */}
            <AdminToggle />
          </div>

          {/* Mobile Button */}
          <button
            className="lg:hidden text-emerald-400"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#1F2D20] border-t border-emerald-900/40 p-4 space-y-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 p-3 rounded-xl text-emerald-100 hover:bg-emerald-600/20"
            >
              <span className="text-emerald-400">{link.icon}</span>
              <span>{link.name}</span>
            </NavLink>
          ))}

          {/* Cart */}
          <NavLink to="/cart" className="flex items-center space-x-2 text-emerald-100">
            <FiShoppingCart />
            <span>Cart</span>
            {totalItems > 0 && <span className="bg-emerald-600 px-2 py-1 rounded-full text-xs">{totalItems}</span>}
          </NavLink>

          {renderMobileAuthButton()}

          {/* Admin Toggle */}
          <AdminToggle />
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1F2D20] p-8 rounded-xl">
            <Login onLoginSuccess={handleLoginSuccess} onClose={() => navigate('/')} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
