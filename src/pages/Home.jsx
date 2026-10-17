import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  BarChart3, 
  Scale, 
  ShieldCheck, 
  TrendingUp, 
  Search, 
  Laptop, 
  Smartphone, 
  Headphones, 
  Watch, 
  Home as HomeIcon, 
  Shirt, 
  Briefcase, 
  Zap,
  CheckCircle2,
  DollarSign,
  Layers
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import ProductCard from '../components/product/ProductCard';
import ValueScoreBadge from '../components/product/ValueScoreBadge';
import { formatCurrency } from '../utils/formatCurrency';

const CATEGORY_ICONS = {
  "Electronics": Zap,
  "Laptops and Accessories": Laptop,
  "Smartphones": Smartphone,
  "Audio": Headphones,
  "Fitness and Wearables": Watch,
  "Home and Living": HomeIcon,
  "Fashion": Shirt,
  "Office Accessories": Briefcase
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const trendingProducts = PRODUCTS.filter(p => p.isTrending || p.rating >= 4.6).slice(0, 8);

  return (
    <div className="space-y-20 pb-20">

      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 pt-12 pb-20 border-b border-slate-200/60">
        
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-indigo-200/30 via-blue-200/20 to-purple-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-100 shadow-xs text-xs font-semibold text-indigo-700">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Next-Gen E-Commerce Intelligence</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-normal">MBA Project Prototype</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12]">
                Your Next Purchase, <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 bg-clip-text text-transparent">
                  Backed by Intelligence.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Discover products with smarter, transparent <strong>ValueScore</strong> comparisons and unlock powerful <strong>Seller Profit Intelligence</strong> with real-time financial margin analysis.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/products"
                  className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/25 hover:shadow-lg transition-all flex items-center gap-2"
                >
                  Explore Products
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/valuescore"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Explore ValueScore
                </Link>

                <Link
                  to="/seller"
                  className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-xs transition-all flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  Seller Dashboard
                </Link>
              </div>

              {/* Trust & Methodology Indicator */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Deterministic Calculations</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>Indian Rupee (₹) Accounting Model</span>
                </div>
              </div>

            </div>

            {/* Hero Right: Interactive Visual Composition */}
            <div className="lg:col-span-5 relative">
              
              {/* Outer Card */}
              <div className="relative bg-white rounded-3xl p-6 shadow-2xl border border-slate-100/80 backdrop-blur-xs space-y-5">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                      AI
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">ValueScore Live Simulation</div>
                      <div className="text-[10px] text-slate-400">Multi-Factor Mathematical Engine</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Live Demo
                  </span>
                </div>

                {/* Sample Showcase Product */}
                <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=300&q=80"
                    alt="AuraPhone Pro 5G"
                    className="w-16 h-16 rounded-xl object-cover bg-white shadow-2xs"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Smartphones</span>
                    <h4 className="text-sm font-bold text-slate-900 truncate">AuraPhone Pro 5G</h4>
                    <div className="text-xs text-slate-600 font-semibold">{formatCurrency(42999)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-600">92</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase">ValueScore</div>
                  </div>
                </div>

                {/* Normalized Component Bar Breakdown */}
                <div className="space-y-2.5 pt-1">
                  <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                    <span>Component Breakdown</span>
                    <span className="text-indigo-600 font-medium">Default Weights (100%)</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                        <span>Price vs Category Benchmark (30%)</span>
                        <span className="font-semibold text-slate-800">88 / 100</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '88%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                        <span>Customer Rating & Reviews (25%)</span>
                        <span className="font-semibold text-slate-800">94 / 100</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '94%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                        <span>Feature-to-Price Index (20%)</span>
                        <span className="font-semibold text-slate-800">92 / 100</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seller Profit Quick Pill */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-bold text-slate-900">Seller Profit Insight</div>
                      <div className="text-[10px] text-slate-500">Unit Net Margin: <strong className="text-emerald-700 font-bold">+18.4%</strong></div>
                    </div>
                  </div>
                  <Link
                    to="/seller"
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                  >
                    View Analytics →
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* --- SEARCH & DISCOVERY BAR --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200/80 -mt-10 relative z-20">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <input
                type="text"
                placeholder="Search by product name, brand (e.g., AuraTech, Zenith)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-hidden"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-4">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  if (e.target.value === 'All') {
                    navigate('/products');
                  } else {
                    navigate(`/products?category=${encodeURIComponent(e.target.value)}`);
                  }
                }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-hidden cursor-pointer"
              >
                <option value="All">All Categories (32+ Products)</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Search Submit */}
            <div className="md:col-span-3">
              <button
                type="submit"
                className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search Catalog
              </button>
            </div>

          </form>
        </div>
      </section>


      {/* --- FEATURED CATEGORIES --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Explore Catalog</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Featured Categories</h2>
          </div>
          <Link to="/products" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            Browse all categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {CATEGORIES.map(category => {
            const Icon = CATEGORY_ICONS[category] || Zap;
            const count = PRODUCTS.filter(p => p.category === category).length;
            return (
              <Link
                key={category}
                to={`/products?category=${encodeURIComponent(category)}`}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all text-center group flex flex-col items-center justify-between space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-indigo-50 text-slate-600 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {category}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {count} Products
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>


      {/* --- TRENDING PRODUCTS (WITH VALUESCORE) --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Top Rated & High Value</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Trending Intelligence Picks</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Ranked with live ValueScore evaluating price competitiveness, user reviews, quality, and warranty.
            </p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            View all 32+ products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>


      {/* --- HOW SHOPSENSE AI WORKS --- */}
      <section className="bg-slate-900 text-white py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 my-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Decision Science</span>
            <h2 className="text-3xl font-extrabold tracking-tight">How ShopSense AI Works</h2>
            <p className="text-sm text-slate-400">
              Unlike opaque black-box AI algorithms, ShopSense uses transparent, customizable multi-attribute utility theory (MAUT) to evaluate purchases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700/60 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-400/30">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Discover & Normalize</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                We collect product retail prices, star ratings, review volumes, build reliability, return rates, and warranties, normalizing all metrics against verified category benchmarks.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700/60 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg border border-amber-400/30">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Calculate ValueScore</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                The engine applies a weighted summation across 5 key dimensions: Price (30%), Ratings (25%), Feature ratio (20%), Quality (15%), and Warranty (10%). Users can adjust weights anytime.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700/60 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-400/30">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Compare & Decide Confidently</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Customers compare up to 4 items on side-by-side radar and bar charts, while sellers inspect profitability, fees, shipping, and break-even pricing in their dashboard.
              </p>
            </div>

          </div>

          <div className="text-center pt-2">
            <Link
              to="/methodology"
              className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
            >
              Read Full Mathematical Methodology & Score Breakdown →
            </Link>
          </div>
        </div>
      </section>


      {/* --- SELLER INTELLIGENCE PREVIEW BANNER --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl border border-indigo-900/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                <BarChart3 className="w-3.5 h-3.5" /> For Merchants & E-Commerce Sellers
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Seller Profit Intelligence Engine
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Go beyond raw top-line GMV. Inspect true net margins after subtracting Cost of Goods Sold (COGS), marketplace commission fees, shipping, return losses, and packaging overhead.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/seller"
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm text-white shadow-md transition-all flex items-center gap-2"
                >
                  Explore Seller Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/seller/pricing"
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-all"
                >
                  Test Pricing Simulator
                </Link>
              </div>
            </div>

            {/* Mini Metric Previews */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs">
                <div className="text-[11px] font-semibold text-slate-400">Sample Gross Sales</div>
                <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">₹48.6 Lakhs</div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +14.2% YoY
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs">
                <div className="text-[11px] font-semibold text-slate-400">Est. Net Profit</div>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-1">₹9.82 Lakhs</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-1">
                  ~20.2% Net Margin
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs">
                <div className="text-[11px] font-semibold text-slate-400">Total Tracked Orders</div>
                <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">130 Orders</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-1">
                  12-Month Historical
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs">
                <div className="text-[11px] font-semibold text-slate-400">Top Performing SKU</div>
                <div className="text-sm font-bold text-white mt-1 truncate">ErgoLift Stand</div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-1">
                  320 Units • 42% Margin
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
