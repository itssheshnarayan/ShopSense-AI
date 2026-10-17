import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Scale, Check, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import ValueScoreBadge from './ValueScoreBadge';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { useValueScore } from '../../context/ValueScoreContext';

export default function ProductCard({ product, layout = 'grid' }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();
  const { getProductScore } = useValueScore();

  const [addedAnimation, setAddedAnimation] = useState(false);
  const [imgError, setImgError] = useState(false);

  const scoreData = getProductScore(product);
  const score = scoreData?.overallScore || 75;
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleToggleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(product.id);
  };

  const fallbackImage = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="%23f1f5f9"><rect width="400" height="400" fill="%23f8fafc"/><text x="50%" y="48%" font-family="sans-serif" font-size="20" font-weight="600" fill="%2394a3b8" dominant-baseline="middle" text-anchor="middle">${encodeURIComponent(product.category)}</text><text x="50%" y="58%" font-family="sans-serif" font-size="14" fill="%23cbd5e1" dominant-baseline="middle" text-anchor="middle">ShopSense AI</text></svg>`;

  // List View Mode
  if (layout === 'list') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-center gap-5 group">
        {/* Thumbnail */}
        <div className="relative w-full sm:w-48 h-48 shrink-0 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
          <Link to={`/product/${product.id}`} className="w-full h-full block">
            <img
              src={imgError ? fallbackImage : product.image}
              alt={product.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </Link>
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md shadow-xs transition-colors ${
              inWishlist ? 'bg-rose-50 text-rose-600' : 'bg-white/80 text-slate-400 hover:text-rose-500'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              {product.category}
            </span>
            <ValueScoreBadge score={score} size="sm" />
          </div>

          <Link to={`/product/${product.id}`}>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-xs font-bold border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
            <span className="text-xs text-slate-400">
              ({product.reviewCount?.toLocaleString('en-IN')} verified ratings)
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-emerald-600 font-medium">
              {product.warrantyMonths}M Warranty
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-slate-900">
                {formatCurrency(product.sellingPrice)}
              </span>
              {product.originalPrice > product.sellingPrice && (
                <>
                  <span className="text-xs text-slate-400 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">
                    {product.discount}% off
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleCompare}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  inCompare
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                {inCompare ? 'Comparing' : 'Compare'}
              </button>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white'
                    : product.stock <= 0
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 hover:shadow-md'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" /> Added
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View Mode (Default)
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group relative">
      
      {/* Top Media Container */}
      <div className="relative aspect-4/3 w-full bg-slate-50 border-b border-slate-100 overflow-hidden">
        <Link to={`/product/${product.id}`} className="w-full h-full block">
          <img
            src={imgError ? fallbackImage : product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Floating Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start pointer-events-none">
          <ValueScoreBadge score={score} size="sm" />
          {product.discount >= 25 && (
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md shadow-xs transition-colors ${
            inWishlist 
              ? 'bg-rose-50 text-rose-600 ring-2 ring-rose-200' 
              : 'bg-white/85 text-slate-400 hover:text-rose-500 hover:bg-white'
          }`}
          title={inWishlist ? "Remove from Wishlist" : "Save to Wishlist"}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-indigo-600">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-slate-700 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 text-[11px] font-normal">
                ({product.reviewCount > 999 ? `${(product.reviewCount/1000).toFixed(1)}k` : product.reviewCount})
              </span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/product/${product.id}`} className="block group-hover:text-indigo-600 transition-colors">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Pricing & Footer Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg sm:text-xl font-extrabold text-slate-900">
              {formatCurrency(product.sellingPrice)}
            </span>
            {product.originalPrice > product.sellingPrice && (
              <span className="text-xs text-slate-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleCompare}
              className={`p-2 rounded-xl border transition-colors ${
                inCompare 
                  ? 'bg-amber-50 text-amber-700 border-amber-300' 
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
              }`}
              title={inCompare ? "Remove from compare" : "Add to compare"}
            >
              <Scale className="w-4 h-4" />
            </button>

            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold shadow-xs transition-all ${
                addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : product.stock <= 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 hover:shadow-md'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" /> Added
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
