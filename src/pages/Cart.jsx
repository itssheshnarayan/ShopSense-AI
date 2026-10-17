import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Heart, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Tag, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency } from '../utils/formatCurrency';

export default function Cart() {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    subtotal, 
    shippingFee, 
    discountAmount, 
    coupon, 
    couponError, 
    applyCoupon, 
    removeCoupon, 
    finalTotal 
  } = useCart();

  const { toggleWishlist } = useWishlist();
  const [promoInput, setPromoInput] = useState('');
  const navigate = useNavigate();

  const handleSaveForLater = (product) => {
    toggleWishlist(product.id);
    removeFromCart(product.id);
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyCoupon(promoInput.trim());
      setPromoInput('');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-xs">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Your shopping cart is empty</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Explore our data-evaluated catalog and add high-value electronics, wearables, and accessories.
        </p>
        <div className="pt-2">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20"
          >
            Start Shopping Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart ({cartItems.length} items)
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review your items before proceeding to demo checkout.</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Empty Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center gap-5"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-24 h-24 rounded-xl object-cover bg-slate-50 border border-slate-100 shrink-0"
              />

              <div className="flex-1 min-w-0 w-full space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                      {product.category}
                    </span>
                    <Link to={`/product/${product.id}`} className="block">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                  </div>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-base font-extrabold text-slate-900">
                    {formatCurrency(product.sellingPrice)}
                  </span>
                  {product.originalPrice > product.sellingPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-xs text-emerald-600 font-semibold">
                    Total: {formatCurrency(product.sellingPrice * quantity)}
                  </span>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  {/* Stepper */}
                  <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="px-2.5 py-1 text-slate-500 hover:text-slate-800 text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="px-2.5 py-1 text-xs font-bold text-slate-800">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="px-2.5 py-1 text-slate-500 hover:text-slate-800 text-xs font-bold"
                      disabled={quantity >= (product.stock || 99)}
                    >
                      +
                    </button>
                  </div>

                  {/* Save for later */}
                  <button
                    onClick={() => handleSaveForLater(product)}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 font-medium"
                  >
                    <Heart className="w-3.5 h-3.5" /> Save for Later
                  </button>
                </div>

              </div>
            </div>
          ))}

          {/* Continue Shopping Link */}
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-6 sticky top-24">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Order Summary
          </h2>

          {/* Subtotal lines */}
          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-bold text-slate-800">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span>
                {shippingFee === 0 ? (
                  <strong className="text-emerald-600 font-bold">FREE</strong>
                ) : (
                  formatCurrency(shippingFee)
                )}
              </span>
            </div>

            {shippingFee > 0 && (
              <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg">
                Add {formatCurrency(1000 - subtotal)} more for free express shipping!
              </p>
            )}

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Coupon ({coupon.code})</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Estimated Total</span>
              <span className="text-2xl font-black text-slate-900">
                {formatCurrency(finalTotal)}
              </span>
            </div>
          </div>

          {/* Promo code input */}
          <div className="space-y-2 pt-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Apply Promo Code
            </label>
            {coupon ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                <div className="flex items-center gap-1.5 font-bold">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{coupon.code} Applied</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. SHOPSENSE10"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold"
                >
                  Apply
                </button>
              </form>
            )}

            {couponError && (
              <p className="text-[11px] text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {couponError}
              </p>
            )}

            <p className="text-[10px] text-slate-400">
              Tip: Use demo coupons <strong>SHOPSENSE10</strong> (10% off) or <strong>VALUE20</strong> (20% off).
            </p>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Secure 256-bit Demo Transaction</span>
          </div>

        </div>

      </div>

    </div>
  );
}
