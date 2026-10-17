import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  Scale, 
  Search, 
  Menu, 
  X, 
  BarChart3, 
  Sparkles, 
  User,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { PRODUCTS } from '../../data/products';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const { totalItemCount } = useCart();
  const { totalWishlistCount } = useWishlist();
  const { compareCount } = useCompare();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const filteredQuickProducts = searchQuery.trim().length > 1
    ? PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const navLinkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors px-2.5 py-1.5 rounded-lg ${
      isActive 
        ? 'text-indigo-600 bg-indigo-50 font-semibold' 
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  ShopSense<span className="text-indigo-600">.AI</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block tracking-wide uppercase font-medium">
                Value & Profit Intelligence
              </p>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="relative flex-1 max-w-lg hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products, brands, or categories..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white text-sm rounded-full border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-hidden"
              />
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            </form>

            {/* Quick search dropdown */}
            {showSearchDropdown && filteredQuickProducts.length > 0 && (
              <div 
                className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden"
                onMouseLeave={() => setShowSearchDropdown(false)}
              >
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Suggested Products
                </div>
                {filteredQuickProducts.map(p => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    onClick={() => setShowSearchDropdown(false)}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 transition-colors"
                  >
                    <img src={p.image} alt={p.name} className="w-8 h-8 rounded-md object-cover bg-slate-100" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-slate-800 truncate">{p.name}</div>
                      <div className="text-[11px] text-slate-500">{p.category} • ₹{p.sellingPrice.toLocaleString('en-IN')}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/" className={navLinkClasses}>Home</NavLink>
            <NavLink to="/products" className={navLinkClasses}>Shop Products</NavLink>
            <NavLink to="/valuescore" className={navLinkClasses}>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                ValueScore
              </span>
            </NavLink>
            <NavLink to="/compare" className={navLinkClasses}>
              <span className="flex items-center gap-1">
                <Scale className="w-3.5 h-3.5" />
                Compare
              </span>
            </NavLink>
            <NavLink to="/seller" className={({ isActive }) => 
              `text-sm font-semibold transition-all px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                isActive 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`
            }>
              <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
              Seller Analytics
            </NavLink>
            <NavLink to="/about" className={navLinkClasses}>About</NavLink>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Compare */}
            <Link
              to="/compare"
              className="relative p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
              title="Compare Products"
            >
              <Scale className="w-5 h-5" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-white">
                  {compareCount}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-slate-100 transition-colors"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {totalWishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-white">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-white">
                  {totalItemCount}
                </span>
              )}
            </Link>

            {/* Account Profile */}
            <Link
              to="/account"
              className="hidden sm:flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 transition-colors text-xs font-medium text-slate-700 ml-1"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                PS
              </div>
              <span className="hidden xl:inline">Priya Sharma</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          {/* Mobile search */}
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 text-sm rounded-lg border border-slate-200 outline-hidden"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          </form>

          <div className="flex flex-col space-y-1">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100"
            >
              Shop All Products
            </Link>
            <Link 
              to="/valuescore" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-indigo-700 bg-indigo-50 font-medium flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              ValueScore Engine
            </Link>
            <Link 
              to="/compare" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Scale className="w-4 h-4" />
                Compare Products
              </span>
              {compareCount > 0 && (
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                  {compareCount}
                </span>
              )}
            </Link>
            <Link 
              to="/seller" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-900 bg-slate-100 font-semibold flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              Seller Profit Intelligence
            </Link>
            <Link 
              to="/account" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              My Account & Orders
            </Link>
            <Link 
              to="/about" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100"
            >
              About & Methodology
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
