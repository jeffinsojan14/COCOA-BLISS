import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  User as UserIcon,
  ShoppingBag,
  Heart,
  Menu,
  X,
  ChevronDown,
  Bell,
  LogOut,
  Package,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNotifications } from '../../context/NotificationContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { unreadCount, notifications, markAsRead } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const accountRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#ebdccd] shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo matching the reference image */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Cocoa Pod SVG Logo */}
            <div className="w-10 h-10 rounded-full bg-cocoa-950 flex items-center justify-center text-caramel-400 shadow-xs group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C8.5 2 5.2 3.8 3.5 6.8C1.8 9.8 1.9 13.5 3.8 16.3C5.7 19.1 8.8 20.8 12 20.8C15.2 20.8 18.3 19.1 20.2 16.3C22.1 13.5 22.2 9.8 20.5 6.8C18.8 3.8 15.5 2 12 2ZM12 4.2C14.7 4.2 17.2 5.7 18.5 8C19.8 10.3 19.7 13.2 18.2 15.4C16.7 17.6 14.2 19 12 19C9.8 19 7.3 17.6 5.8 15.4C4.3 13.2 4.2 10.3 5.5 8C6.8 5.7 9.3 4.2 12 4.2ZM12 6C11.4 6 11 6.4 11 7V17C11 17.6 11.4 18 12 18C12.6 18 13 17.6 13 17V7C13 6.4 12.6 6 12 6ZM8.5 7.5C8.1 7.1 7.5 7.1 7.1 7.5C6.7 7.9 6.7 8.5 7.1 8.9L10.1 11.9C10.5 12.3 11.1 12.3 11.5 11.9C11.9 11.5 11.9 10.9 11.5 10.5L8.5 7.5ZM15.5 7.5L12.5 10.5C12.1 10.9 12.1 11.5 12.5 11.9C12.9 12.3 13.5 12.3 13.9 11.9L16.9 8.9C17.3 8.5 17.3 7.9 16.9 7.5C16.5 7.1 15.9 7.1 15.5 7.5ZM7.1 15.1C6.7 15.5 6.7 16.1 7.1 16.5C7.5 16.9 8.1 16.9 8.5 16.5L11.5 13.5C11.9 13.1 11.9 12.5 11.5 12.1C11.1 11.7 10.5 11.7 10.1 12.1L7.1 15.1ZM16.9 15.1L13.9 12.1C13.5 11.7 12.9 11.7 12.5 12.1C12.1 12.5 12.1 13.1 12.5 13.5L15.5 16.5C15.9 16.9 16.5 16.9 16.9 16.5C17.3 16.1 17.3 15.5 16.9 15.1Z" />
              </svg>
            </div>
            <div>
              <span className="font-serif text-2xl tracking-tight font-bold text-cocoa-950 block leading-none">
                Cocoa Bliss
              </span>
              <span className="text-[10px] tracking-[0.25em] font-medium text-cocoa-600 uppercase block mt-1">
                Homemade Chocolates
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links matching the reference */}
          <nav className="hidden lg:flex items-center space-x-7">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors relative py-1 ${
                isActive('/') && location.pathname === '/'
                  ? 'text-cocoa-950 font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-caramel-500'
                  : 'text-cocoa-800 hover:text-caramel-600'
              }`}
            >
              Home
            </Link>

            {/* Shop Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShopDropdownOpen(true)}
              onMouseLeave={() => setShopDropdownOpen(false)}
            >
              <Link
                to="/shop"
                className={`text-sm font-medium transition-colors flex items-center gap-1 py-1 ${
                  isActive('/shop')
                    ? 'text-cocoa-950 font-semibold'
                    : 'text-cocoa-800 hover:text-caramel-600'
                }`}
              >
                <span>Shop</span>
                <ChevronDown size={14} className="text-cocoa-500" />
              </Link>
              {shopDropdownOpen && (
                <div className="absolute top-full left-0 w-48 bg-white rounded-xl shadow-xl border border-cocoa-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link
                    to="/shop"
                    className="block px-4 py-2 text-sm text-cocoa-800 hover:bg-cocoa-50 hover:text-caramel-700"
                  >
                    All Chocolates
                  </Link>
                  <Link
                    to="/shop?bestseller=true"
                    className="block px-4 py-2 text-sm text-cocoa-800 hover:bg-cocoa-50 hover:text-caramel-700"
                  >
                    Best Sellers 🤎
                  </Link>
                  <Link
                    to="/shop?sort=newest"
                    className="block px-4 py-2 text-sm text-cocoa-800 hover:bg-cocoa-50 hover:text-caramel-700"
                  >
                    New Creations
                  </Link>
                </div>
              )}
            </div>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
              onMouseLeave={() => setCategoriesDropdownOpen(false)}
            >
              <Link
                to="/categories"
                className={`text-sm font-medium transition-colors flex items-center gap-1 py-1 ${
                  isActive('/categories')
                    ? 'text-cocoa-950 font-semibold'
                    : 'text-cocoa-800 hover:text-caramel-600'
                }`}
              >
                <span>Categories</span>
                <ChevronDown size={14} className="text-cocoa-500" />
              </Link>
              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 w-52 bg-white rounded-xl shadow-xl border border-cocoa-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link
                    to="/shop?category=milk-chocolate"
                    className="block px-4 py-2 text-sm text-cocoa-800 hover:bg-cocoa-50 hover:text-caramel-700"
                  >
                    Milk Chocolate
                  </Link>
                  <Link
                    to="/shop?category=dark-chocolate"
                    className="block px-4 py-2 text-sm text-cocoa-800 hover:bg-cocoa-50 hover:text-caramel-700"
                  >
                    Dark Chocolate
                  </Link>
                  <Link
                    to="/shop?category=white-chocolate"
                    className="block px-4 py-2 text-sm text-cocoa-800 hover:bg-cocoa-50 hover:text-caramel-700"
                  >
                    White Chocolate
                  </Link>
                  <Link
                    to="/shop?category=nut-chocolates"
                    className="block px-4 py-2 text-sm text-cocoa-800 hover:bg-cocoa-50 hover:text-caramel-700"
                  >
                    Nut Chocolates
                  </Link>
                  <Link
                    to="/shop?category=truffle-chocolates"
                    className="block px-4 py-2 text-sm text-cocoa-800 hover:bg-cocoa-50 hover:text-caramel-700"
                  >
                    Truffles
                  </Link>
                  <div className="border-t border-cocoa-100 my-1"></div>
                  <Link
                    to="/categories"
                    className="block px-4 py-2 text-xs font-semibold text-caramel-600 hover:underline"
                  >
                    View All Categories →
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/shop?category=gift-boxes"
              className={`text-sm font-medium transition-colors py-1 ${
                location.search.includes('gift-boxes')
                  ? 'text-cocoa-950 font-semibold'
                  : 'text-cocoa-800 hover:text-caramel-600'
              }`}
            >
              Gift Boxes
            </Link>

            <Link
              to="/about"
              className={`text-sm font-medium transition-colors py-1 ${
                isActive('/about')
                  ? 'text-cocoa-950 font-semibold'
                  : 'text-cocoa-800 hover:text-caramel-600'
              }`}
            >
              About Us
            </Link>

            <Link
              to="/contact"
              className={`text-sm font-medium transition-colors py-1 ${
                isActive('/contact')
                  ? 'text-cocoa-950 font-semibold'
                  : 'text-cocoa-800 hover:text-caramel-600'
              }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Right Action Icons matching reference image */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-cocoa-800 hover:text-caramel-600 hover:bg-cocoa-50 rounded-full transition-colors"
              title="Search Chocolates"
            >
              <Search size={20} />
            </button>

            {/* Wishlist Button with Badge */}
            <Link
              to="/wishlist"
              className="p-2 text-cocoa-800 hover:text-caramel-600 hover:bg-cocoa-50 rounded-full transition-colors relative"
              title="My Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute 0 top-1 right-1 w-4 h-4 bg-caramel-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Notifications Button if authenticated */}
            {isAuthenticated && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="p-2 text-cocoa-800 hover:text-caramel-600 hover:bg-cocoa-50 rounded-full transition-colors relative"
                  title="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-cocoa-100 py-3 z-50">
                    <div className="px-4 py-2 border-b border-cocoa-100 flex items-center justify-between">
                      <span className="font-semibold text-sm text-cocoa-950">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-xs text-caramel-600 bg-caramel-50 px-2 py-0.5 rounded-full font-medium">
                          {unreadCount} unread
                        </span>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-cocoa-50">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-cocoa-500">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              markAsRead(notif.id);
                              if (notif.link) navigate(notif.link);
                              setNotifDropdownOpen(false);
                            }}
                            className={`p-3.5 hover:bg-cocoa-50/70 transition-colors cursor-pointer text-left ${
                              !notif.is_read ? 'bg-amber-50/40' : ''
                            }`}
                          >
                            <p className="text-xs font-semibold text-cocoa-950">{notif.title}</p>
                            <p className="text-xs text-cocoa-700 mt-1">{notif.message}</p>
                            <span className="text-[10px] text-cocoa-400 mt-1.5 block">
                              {new Date(notif.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Account Dropdown */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="p-2 text-cocoa-800 hover:text-caramel-600 hover:bg-cocoa-50 rounded-full transition-colors flex items-center gap-1.5"
                title="Account"
              >
                <UserIcon size={20} />
                {isAuthenticated && (
                  <span className="hidden md:inline text-xs font-semibold text-cocoa-950 max-w-[80px] truncate">
                    {user?.full_name?.split(' ')[0] || user?.username}
                  </span>
                )}
              </button>

              {accountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-cocoa-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-cocoa-100">
                        <p className="text-xs font-medium text-cocoa-500">Signed in as</p>
                        <p className="text-sm font-bold text-cocoa-950 truncate">{user?.full_name || user?.email}</p>
                        <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-caramel-100 text-caramel-800">
                          {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                        </span>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-cocoa-900 hover:bg-amber-50 hover:text-caramel-700"
                        >
                          <ShieldAlert size={16} className="text-caramel-600" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-cocoa-800 hover:bg-cocoa-50 hover:text-caramel-700"
                      >
                        <UserCheck size={16} className="text-cocoa-500" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-cocoa-800 hover:bg-cocoa-50 hover:text-caramel-700"
                      >
                        <Package size={16} className="text-cocoa-500" />
                        <span>Order History</span>
                      </Link>

                      <div className="border-t border-cocoa-100 my-1"></div>

                      <button
                        onClick={() => {
                          logout();
                          setAccountDropdownOpen(false);
                          navigate('/login');
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="p-3 text-center border-b border-cocoa-100">
                        <p className="text-xs text-cocoa-600">Welcome to Cocoa Bliss</p>
                      </div>
                      <Link
                        to="/login"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="block px-4 py-2 text-sm font-semibold text-cocoa-900 hover:bg-cocoa-50 hover:text-caramel-700"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="block px-4 py-2 text-sm font-medium text-cocoa-700 hover:bg-cocoa-50 hover:text-caramel-700"
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart Icon with Circular Badge - Exactly as shown in Reference Image */}
            <Link
              to="/cart"
              className="flex items-center p-2 text-cocoa-900 hover:text-caramel-600 hover:bg-cocoa-50 rounded-full transition-colors relative"
              title="Shopping Cart"
            >
              <ShoppingBag size={22} />
              {/* Badge showing total items count (default 0 or cart count) */}
              <span className="absolute -top-0.5 -right-0.5 min-w-[19px] h-[19px] px-1 bg-[#1e0d06] text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {cartCount}
              </span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-cocoa-800 hover:text-caramel-600 rounded-lg lg:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Expandable Search Input Bar */}
        {searchOpen && (
          <div className="py-3 border-t border-cocoa-100 animate-in fade-in duration-200">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-4 text-cocoa-400" size={18} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search homemade truffles, dark chocolates, gift boxes..."
                className="w-full pl-11 pr-24 py-2.5 bg-cocoa-50/80 border border-cocoa-200 rounded-full text-sm text-cocoa-950 placeholder-cocoa-400 focus:outline-none focus:ring-2 focus:ring-caramel-500/50 focus:border-caramel-500"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-1.5 bg-cocoa-950 text-white rounded-full text-xs font-semibold hover:bg-caramel-600 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-cocoa-100 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <Link
            to="/"
            className="block py-2 text-base font-semibold text-cocoa-900 border-b border-cocoa-50"
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="block py-2 text-base font-medium text-cocoa-800 border-b border-cocoa-50"
          >
            Shop All Chocolates
          </Link>
          <Link
            to="/categories"
            className="block py-2 text-base font-medium text-cocoa-800 border-b border-cocoa-50"
          >
            Chocolate Categories
          </Link>
          <Link
            to="/shop?category=gift-boxes"
            className="block py-2 text-base font-medium text-cocoa-800 border-b border-cocoa-50"
          >
            Gift Boxes & Hampers
          </Link>
          <Link
            to="/about"
            className="block py-2 text-base font-medium text-cocoa-800 border-b border-cocoa-50"
          >
            About Cocoa Bliss
          </Link>
          <Link
            to="/contact"
            className="block py-2 text-base font-medium text-cocoa-800 border-b border-cocoa-50"
          >
            Contact Us
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="block py-2 text-base font-bold text-caramel-700 bg-caramel-50 px-3 rounded-lg"
            >
              ★ Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
