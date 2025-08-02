import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiBook,
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

  const navLinks = [
    { name: 'Home', href: '/', icon: <FiHome /> },
    { name: 'Menu', href: '/menu', icon: <FiBook /> },
    { name: 'About', href: '/about', icon: <FiStar /> },
    { name: 'Contact', href: '/contact', icon: <FiPhone /> },
    ...(isAuthenticated ? [
      { name: 'My Orders', href: '/myorder', icon: <FiPackage /> }
    ] : [])
  ];

  const handleLoginSuccess = () => {
    localStorage.setItem('loginData', JSON.stringify({ loggedIn: true }));
    setIsAuthenticated(true);
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('loginData');
    setIsAuthenticated(false);
  };

  const renderDesktopAuthButton = () => {
    return isAuthenticated ? (
      <button
        onClick={handleLogout}
        className="px-3 lg:px-4 py-1.5 lg:py-2 bg-gradient-to-br from-lime-500 to-emerald-700 text-[#1F2D20] 
          rounded-2xl font-bold hover:shadow-lg hover:shadow-emerald-600/40 transition-all 
          border-2 border-emerald-600/20 flex items-center space-x-2 shadow-md shadow-emerald-900/20 text-sm"
      >
        <FiLogOut className="text-base lg:text-lg" />
        <span>Logout</span>
      </button>
    ) : (
      <button
        onClick={() => navigate('/login')}
        className="px-3 lg:px-4 py-1.5 lg:py-2 bg-gradient-to-br from-lime-400 to-emerald-600 text-[#1F2D20] 
          rounded-2xl font-bold hover:shadow-lg hover:shadow-emerald-500/40 transition-all 
          border-2 border-emerald-500/20 flex items-center space-x-2 shadow-md shadow-emerald-900/20 text-sm"
      >
        <FiKey className="text-base lg:text-lg" />
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
        <FiLogOut className="text-lg" />
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
        <FiKey className="text-lg" />
        <span>Login</span>
      </button>
    );
  };

  return (
    <nav className="bg-[#1F2D20] border-b-8 border-emerald-900/40 shadow-[0_25px_50px_-12px] shadow-emerald-900/30 sticky top-0 z-50 font-vibes">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4">
        <div className="h-[6px] bg-gradient-to-r from-transparent via-emerald-600/50 to-transparent shadow-[0_0_20px] shadow-emerald-500/30"></div>
        <div className="flex justify-between px-6">
          <GiForkKnifeSpoon className="text-emerald-500/40 -mt-4 -ml-2 rotate-45" size={32} />
          <GiForkKnifeSpoon className="text-emerald-500/40 -mt-4 -mr-2 -rotate-45" size={32} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex justify-between items-center h-16 lg:h-20">
          <div className="flex-shrink-0 flex items-center space-x-2 group">
            <GiChefToque className="text-2xl md:text-3xl lg:text-4xl text-emerald-500 transition-all group-hover:rotate-12" />
            <div className="flex flex-col ml-1 md:ml-2">
              <NavLink
                to="/"
                className="text-lg md:text-xl lg:text-2xl xl:text-3xl bg-gradient-to-r from-lime-400 to-emerald-600 bg-clip-text text-transparent font-monsieur tracking-wider whitespace-nowrap"
              >
                QuickBite
              </NavLink>
              <div className="h-[3px] bg-gradient-to-r from-emerald-600/30 via-lime-400/50 to-emerald-600/30 w-full mt-1" />
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4 flex-1 justify-end">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) =>
                  `px-2 xl:px-4 py-2 flex items-center space-x-2 rounded-3xl border-2 transition-colors text-sm xl:text-base
                  ${isActive ? 'bg-emerald-900/20 border-emerald-600/50' : 'border-transparent hover:border-emerald-600/50'}`
                }
              >
                <span className="text-emerald-400">{link.icon}</span>
                <span className="text-emerald-100">{link.name}</span>
              </NavLink>
            ))}
            <div className="flex items-center space-x-2 xl:space-x-4 ml-2 xl:ml-4">
              <NavLink
                to="/cart"
                className="p-2 relative text-emerald-100 hover:text-emerald-300 transition-colors"
              >
                <FiShoppingCart className="text-lg xl:text-xl" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </NavLink>
              {renderDesktopAuthButton()}
            </div>
          </div>

          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-emerald-500 hover:text-emerald-300 p-2 rounded-xl border-2 border-emerald-900/30 transition-colors"
            >
              <div className="space-y-2">
                <span className={`block w-6 h-0.5 bg-current transition-transform ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-6 h-0.5 bg-current ${isOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-6 h-0.5 bg-current transition-transform ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-[#1F2D20] border-t-4 border-emerald-900/40">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl ${
                    isActive ? 'bg-emerald-600/30 text-lime-200' : 'text-emerald-100 hover:bg-emerald-600/20'
                  }`
                }
              >
                <span className="text-emerald-400">{link.icon}</span>
                <span>{link.name}</span>
              </NavLink>
            ))}
            <div className="pt-4 border-t border-emerald-900/40 space-y-3">
              <NavLink
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center space-x-2 px-4 py-3 text-emerald-100 hover:bg-emerald-600/20 rounded-xl"
              >
                <FiShoppingCart />
                <span>Cart</span>
                {totalItems > 0 && (
                  <span className="bg-emerald-600 text-xs px-2 py-1 rounded-full">
                    {totalItems}
                  </span>
                )}
              </NavLink>
              {renderMobileAuthButton()}
            </div>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#1F2D20] to-[#324C39] rounded-xl p-8 w-full max-w-md relative border-4 border-emerald-700/30">
            <button
              onClick={() => navigate('/')}
              className="absolute top-4 right-4 text-emerald-500 hover:text-emerald-300 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-lime-400 to-emerald-600 bg-clip-text text-transparent mb-6 text-center">
              QuickBite
            </h2>
            <Login onLoginSuccess={handleLoginSuccess} onClose={() => navigate('/')} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
