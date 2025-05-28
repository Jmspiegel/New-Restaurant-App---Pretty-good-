import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiShoppingCart, FiUser, FiLogOut, FiHome, FiList, FiClock, FiSettings } from 'react-icons/fi';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Close menus when location changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-blue-600">FeedMe</span>
            <span className="text-xl font-bold text-gray-800">Now-Basic</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium ${
              location.pathname === '/' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
            }`}>
              Home
            </Link>
            <Link to="/menu" className={`px-3 py-2 rounded-md text-sm font-medium ${
              location.pathname === '/menu' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
            }`}>
              Menu
            </Link>
            {user && (
              <Link to="/orders" className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/orders' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}>
                Orders
              </Link>
            )}
            {user && (
              <Link to="/kitchen" className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/kitchen' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}>
                Kitchen
              </Link>
            )}
            {user && (
              <Link to="/admin/menu" className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/admin/menu' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}>
                Manage Menu
              </Link>
            )}
          </div>
          
          {/* Right side buttons */}
          <div className="flex items-center">
            {/* Cart button */}
            <Link to="/cart" className="p-2 ml-4 relative">
              <FiShoppingCart className="h-6 w-6 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {/* User menu */}
            {user ? (
              <div className="relative ml-4">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                </button>
                
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                    >
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.email}
                        </p>
                      </div>
                      
                      <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <FiList className="mr-2" />
                        My Orders
                      </Link>
                      
                      <Link to="/admin/menu" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <FiSettings className="mr-2" />
                        Manage Menu
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <FiLogOut className="mr-2" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                Login
              </Link>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="ml-4 md:hidden focus:outline-none"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6 text-gray-700" />
              ) : (
                <FiMenu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 flex items-center">
                <FiHome className="mr-2" />
                Home
              </Link>
              <Link to="/menu" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 flex items-center">
                <FiList className="mr-2" />
                Menu
              </Link>
              {user && (
                <Link to="/orders" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 flex items-center">
                  <FiClock className="mr-2" />
                  Orders
                </Link>
              )}
              {user && (
                <Link to="/kitchen" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 flex items-center">
                  <FiClock className="mr-2" />
                  Kitchen
                </Link>
              )}
              {user && (
                <Link to="/admin/menu" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 flex items-center">
                  <FiSettings className="mr-2" />
                  Manage Menu
                </Link>
              )}
              {!user && (
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 flex items-center">
                  <FiUser className="mr-2" />
                  Login
                </Link>
              )}
              {user && (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
