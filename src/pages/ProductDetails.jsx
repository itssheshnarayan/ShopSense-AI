import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Scale, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  Check, 
  ChevronRight,
  Info,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { formatCurrency } from '../utils/formatCurrency';
import ValueScoreBadge from '../components/product/ValueScoreBadge';
import ProductCard from '../components/product/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { useValueScore } from '../context/ValueScoreContext';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();
  const { getProductScore } = useValueScore();

  const scoreData = getProductScore(product);
  const score = scoreData?.overallScore || 75;
  const band = scoreData?.band;
  const components = scoreData?.components || {};
  const explanation = scoreData?.explanation || {};

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const similarProducts = PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Circular gauge calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/products" className="hover:text-indigo-600 transition-colors">Products</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-indigo-600 transition-colors">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Gallery Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square w-full bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs overflow-hidden flex items-center justify-center">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          {/* Thumbnails */}
          {product.thumbnails && product.thumbnails.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.thumbnails.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(thumb)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === thumb ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={thumb} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Header & Badges */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                {product.category}
              </span>
              <ValueScoreBadge score={score} size="md" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1">Brand: <span className="font-semibold text-slate-700">{product.brand}</span></p>

            {/* Ratings & Social Proof */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg text-xs font-bold border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
              </div>
              <span className="text-xs text-slate-500">
                Based on <strong className="text-slate-800">{product.reviewCount?.toLocaleString('en-IN')}</strong> verified evaluations
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> {product.warrantyMonths} Months Warranty
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                {formatCurrency(product.sellingPrice)}
              </span>
              {product.originalPrice > product.sellingPrice && (
                <>
                  <span className="text-base text-slate-400 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Save {product.discount}%
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Inclusive of all taxes • Free express shipping on this item
            </p>
          </div>

          {/* Availability & Delivery Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-800">In Stock</span>
                <p className="text-[11px] text-slate-500">{product.stock} units in warehouse</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-800">Fast Delivery</span>
                <p className="text-[11px] text-slate-500">Est. delivery within {product.deliveryDays} business days</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Overview</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity and Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-2xs">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-3 py-2 text-slate-500 hover:text-slate-800 transition-colors"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-3 py-2 text-xs font-bold text-slate-800 min-w-8 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="px-3 py-2 text-slate-500 hover:text-slate-800 transition-colors"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" /> Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add to Cart • {formatCurrency(product.sellingPrice * quantity)}
                </>
              )}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-3 rounded-xl border transition-colors ${
                inWishlist
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title={inWishlist ? "Saved in Wishlist" : "Save to Wishlist"}
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
            </button>

            {/* Compare Button */}
            <button
              onClick={() => addToCompare(product.id)}
              className={`p-3 rounded-xl border transition-colors ${
                inCompare
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title={inCompare ? "Remove from Compare" : "Add to Compare"}
            >
              <Scale className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>


      {/* --- VALUESCORE DEEP ANALYTICS PANEL --- */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>ShopSense AI Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              ValueScore Analysis & Assessment
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Multi-criteria decision assessment calculated from deterministic metrics and category benchmarks.
            </p>
          </div>

          <Link
            to="/valuescore"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs transition-colors self-start md:self-auto"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            Customize Factor Weights
          </Link>
        </div>

        {/* Circular Gauge + 5 Component Breakdown Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Gauge Column (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50/70 rounded-3xl border border-slate-100 space-y-4">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="text-slate-200 stroke-current"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Progress Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="stroke-current transition-all duration-1000 ease-out"
                  style={{ stroke: band?.ringColor || '#4f46e5' }}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900">{score}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">out of 100</span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-base font-extrabold text-slate-900">{band?.label}</div>
              <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                {band?.summary}
              </p>
            </div>

            {/* Confidence metric */}
            <div className="w-full pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <span className="text-slate-500">Data Completeness:</span>
              <span className="font-bold text-slate-800">{components.confidenceScore || 85}% Confidence</span>
            </div>
          </div>

          {/* 5 Component Bars Column (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Component 1: Price Competitiveness */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Price Competitiveness (30% weight)</span>
                <span className="font-bold text-indigo-600">{components.priceCompetitiveness} / 100</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-700" 
                  style={{ width: `${components.priceCompetitiveness}%` }} 
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Evaluated against {product.category} average category price.
              </p>
            </div>

            {/* Component 2: Customer Rating */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Customer Rating & Social Proof (25% weight)</span>
                <span className="font-bold text-blue-600">{components.customerRating} / 100</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-700" 
                  style={{ width: `${components.customerRating}%` }} 
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Weighted by star rating ({product.rating}★) and review volume credibility.
              </p>
            </div>

            {/* Component 3: Feature-to-Price */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Feature-to-Price Assessment (20% weight)</span>
                <span className="font-bold text-emerald-600">{components.featureToPrice} / 100</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700" 
                  style={{ width: `${components.featureToPrice}%` }} 
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Hardware feature density provided per rupee spent.
              </p>
            </div>

            {/* Component 4: Quality & Low Return Rate */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Quality & Return Reliability (15% weight)</span>
                <span className="font-bold text-teal-600">{components.qualityReliability} / 100</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-500 rounded-full transition-all duration-700" 
                  style={{ width: `${components.qualityReliability}%` }} 
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Sample product return rate sits at low {product.returnRate}%.
              </p>
            </div>

            {/* Component 5: Warranty & Support */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Warranty & Support (10% weight)</span>
                <span className="font-bold text-purple-600">{components.warrantySupport} / 100</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all duration-700" 
                  style={{ width: `${components.warrantySupport}%` }} 
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {product.warrantyMonths} months of manufacturer service coverage.
              </p>
            </div>

          </div>

        </div>

        {/* "Why this score?" Deep Explanation Box */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Why this score?</h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {explanation.headline}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            
            {/* Strengths */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Identified Strengths</span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {explanation.strengths?.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Considerations / Weaknesses */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Considerations</span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {explanation.weaknesses?.map((weak, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Academic Transparency Note */}
          <div className="pt-3 border-t border-slate-200/70 text-[11px] text-slate-400">
            <strong>Transparency Notice:</strong> This score is a deterministic demo index calculated client-side using sample catalog attributes. Customer satisfaction or longevity has not been independently verified by external laboratories.
          </div>
        </div>

      </section>


      {/* --- SPECIFICATIONS TABLE --- */}
      {product.specs && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 pt-2">
            {Object.entries(product.specs).map(([key, val]) => (
              <div key={key} className="flex items-start justify-between py-2 border-b border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">{key}</span>
                <span className="text-slate-900 font-semibold text-right max-w-xs">{val}</span>
              </div>
            ))}
          </div>
        </section>
      )}


      {/* --- SIMILAR PRODUCTS IN CATEGORY --- */}
      {similarProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Similar {product.category} Alternatives
            </h2>
            <Link
              to={`/products?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View all in category →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
