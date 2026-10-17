import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  Grid, 
  List, 
  Search, 
  X, 
  RotateCcw, 
  Sparkles, 
  SlidersHorizontal,
  Star,
  ChevronDown
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import ProductCard from '../components/product/ProductCard';
import { useValueScore } from '../context/ValueScoreContext';
import { formatCurrency } from '../utils/formatCurrency';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getProductScore } = useValueScore();

  // URL state synchronization
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState(initialCategory ? [initialCategory] : []);
  const [maxPrice, setMaxPrice] = useState(120000);
  const [minRating, setMinRating] = useState(0);
  const [minValueScore, setMinValueScore] = useState(0);
  const [minDiscount, setMinDiscount] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('valuescore-desc');
  const [layout, setLayout] = useState('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync if URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && !selectedCategories.includes(cat)) {
      setSelectedCategories([cat]);
    }
    const q = searchParams.get('search');
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const toggleCategory = (cat) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setMaxPrice(120000);
    setMinRating(0);
    setMinValueScore(0);
    setMinDiscount(0);
    setInStockOnly(false);
    setSortBy('valuescore-desc');
    setSearchParams({});
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesDesc) return false;
      }

      // Categories
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }

      // Price
      if (product.sellingPrice > maxPrice) {
        return false;
      }

      // Rating
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }

      // Discount
      if (minDiscount > 0 && product.discount < minDiscount) {
        return false;
      }

      // Stock
      if (inStockOnly && product.stock <= 0) {
        return false;
      }

      // ValueScore
      if (minValueScore > 0) {
        const score = getProductScore(product)?.overallScore || 0;
        if (score < minValueScore) return false;
      }

      return true;
    }).sort((a, b) => {
      const scoreA = getProductScore(a)?.overallScore || 0;
      const scoreB = getProductScore(b)?.overallScore || 0;

      if (sortBy === 'valuescore-desc') return scoreB - scoreA;
      if (sortBy === 'valuescore-asc') return scoreA - scoreB;
      if (sortBy === 'price-asc') return a.sellingPrice - b.sellingPrice;
      if (sortBy === 'price-desc') return b.sellingPrice - a.sellingPrice;
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [searchQuery, selectedCategories, maxPrice, minRating, minValueScore, minDiscount, inStockOnly, sortBy, getProductScore]);

  const activeFilterCount = 
    (searchQuery ? 1 : 0) +
    selectedCategories.length +
    (maxPrice < 120000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (minValueScore > 0 ? 1 : 0) +
    (minDiscount > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Shop Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Compare specs and shop products ranked by our multi-attribute ValueScore algorithm.
          </p>
        </div>

        {/* View Controls & Sort */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs"
          >
            <Filter className="w-4 h-4 text-indigo-600" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 cursor-pointer shadow-xs"
            >
              <option value="valuescore-desc">ValueScore: Highest First</option>
              <option value="valuescore-asc">ValueScore: Lowest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Customer Rating</option>
              <option value="name-asc">Product Name (A-Z)</option>
            </select>
          </div>

          {/* Layout Toggle */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setLayout('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                layout === 'grid' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayout('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                layout === 'list' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Product Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* --- DESKTOP FILTER SIDEBAR --- */}
        <aside className="hidden lg:block bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-900">Filters</h3>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Search within catalog */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Keywords, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-hidden"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Categories</label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {CATEGORIES.map(cat => (
                <label key={cat} className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                  <span className="flex-1 truncate">{cat}</span>
                  <span className="text-[10px] text-slate-400">
                    {PRODUCTS.filter(p => p.category === cat).length}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* ValueScore Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1 uppercase tracking-wider text-slate-600">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Min ValueScore
              </span>
              <span className="text-indigo-600 font-bold">{minValueScore > 0 ? `${minValueScore}+` : 'Any'}</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={minValueScore}
              onChange={(e) => setMinValueScore(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>All</span>
              <span>70 (Good)</span>
              <span>85 (Excellent)</span>
            </div>
          </div>

          {/* Max Price Range Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="uppercase tracking-wider text-slate-600">Max Price</span>
              <span className="text-slate-900 font-extrabold">{formatCurrency(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="120000"
              step="2000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹1,000</span>
              <span>₹60,000</span>
              <span>₹1.2L</span>
            </div>
          </div>

          {/* Min Customer Rating */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Customer Rating</label>
            <div className="grid grid-cols-4 gap-1">
              {[0, 4.0, 4.3, 4.6].map(rating => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setMinRating(rating)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors ${
                    minRating === rating
                      ? 'bg-amber-500 text-white border-amber-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {rating === 0 ? 'All' : `${rating}★`}
                </button>
              ))}
            </div>
          </div>

          {/* Discount Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Min Discount</label>
            <div className="grid grid-cols-4 gap-1">
              {[0, 20, 30, 40].map(disc => (
                <button
                  key={disc}
                  type="button"
                  onClick={() => setMinDiscount(disc)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors ${
                    minDiscount === disc
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {disc === 0 ? 'Any' : `${disc}%+`}
                </button>
              ))}
            </div>
          </div>

          {/* In Stock Only */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span>In-Stock Products Only</span>
            </label>
          </div>

        </aside>

        {/* --- PRODUCTS LISTING MAIN --- */}
        <main className="lg:col-span-3 space-y-5">
          
          {/* Active Filter Chips & Results Count */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Showing <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> of {PRODUCTS.length} products
            </div>

            {/* Chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedCategories.map(cat => (
                  <span key={cat} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium border border-indigo-200 text-xs">
                    {cat}
                    <button onClick={() => toggleCategory(cat)}><X className="w-3 h-3 hover:text-indigo-900" /></button>
                  </span>
                ))}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200 text-xs">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {minValueScore > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-medium border border-amber-200 text-xs">
                    VS ≥ {minValueScore}
                    <button onClick={() => setMinValueScore(0)}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {maxPrice < 120000 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200 text-xs">
                    Under {formatCurrency(maxPrice)}
                    <button onClick={() => setMaxPrice(120000)}><X className="w-3 h-3" /></button>
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="text-xs text-rose-600 hover:underline font-semibold ml-1"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Products Grid or Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No products match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try widening your price range, clearing selected categories, or lowering the minimum ValueScore threshold.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-xs hover:bg-indigo-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : layout === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} layout="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} layout="list" />
              ))}
            </div>
          )}

        </main>
      </div>

      {/* --- MOBILE FILTER MODAL DRAWER --- */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Filter Products</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Categories</label>
              <div className="space-y-1.5">
                {CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center gap-2 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="rounded text-indigo-600"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Max Price:</span>
                <span>{formatCurrency(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="120000"
                step="2000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* ValueScore Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Min ValueScore:</span>
                <span>{minValueScore > 0 ? `${minValueScore}+` : 'Any'}</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={minValueScore}
                onChange={(e) => setMinValueScore(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-xs"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
