import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Package, 
  MapPin, 
  Settings, 
  RotateCcw, 
  ShieldCheck, 
  ExternalLink,
  Clock,
  Sparkles,
  ShoppingBag,
  Heart
} from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function Account() {
  const [activeTab, setActiveTab] = useState('orders'); // orders | addresses | preferences
  const [orders, setOrders] = useState([]);
  const { totalWishlistCount } = useWishlist();
  const { totalItemCount } = useCart();

  useEffect(() => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem('shopsense_orders') || '[]');
      if (savedOrders.length > 0) {
        setOrders(savedOrders);
      } else {
        // Fallback default sample orders
        setOrders([
          {
            orderId: 'SS-2024-819230',
            date: new Date(Date.now() - 3600000 * 48).toISOString(),
            status: 'Delivered',
            pricing: { grandTotal: 42999 },
            items: [
              {
                id: 'prod-1',
                name: 'AuraPhone Pro 5G (256GB, Cosmic Blue)',
                price: 42999,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=300&q=80'
              }
            ]
          },
          {
            orderId: 'SS-2024-748102',
            date: new Date(Date.now() - 3600000 * 240).toISOString(),
            status: 'Delivered',
            pricing: { grandTotal: 2499 },
            items: [
              {
                id: 'prod-6',
                name: 'ErgoLift Aluminum Laptop Riser & USB-C Hub',
                price: 2499,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=300&q=80'
              }
            ]
          }
        ]);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleResetDemoData = () => {
    if (window.confirm('Reset all demo data (Cart, Wishlist, Compare tray, custom ValueScore weights, and Order History)?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
            PS
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Priya Sharma</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Demo Account
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">priya.sharma@example.com • +91 98765 43210</p>
            <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 mt-3">
              <span>Bengaluru, India</span>
              <span>•</span>
              <span className="text-indigo-600 font-medium">ShopSense AI Platinum Member</span>
            </div>
          </div>
        </div>

        {/* Quick stat counters */}
        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <Link to="/cart" className="text-center px-3 py-1 hover:text-indigo-600 transition-colors">
            <div className="text-lg font-black text-slate-900">{totalItemCount}</div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Cart</div>
          </Link>
          <div className="w-px h-8 bg-slate-200" />
          <Link to="/wishlist" className="text-center px-3 py-1 hover:text-rose-600 transition-colors">
            <div className="text-lg font-black text-slate-900">{totalWishlistCount}</div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Wishlist</div>
          </Link>
          <div className="w-px h-8 bg-slate-200" />
          <div className="text-center px-3 py-1">
            <div className="text-lg font-black text-slate-900">{orders.length}</div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Orders</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" /> Past Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'addresses' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4" /> Addresses
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'preferences' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" /> Demo Preferences
        </button>
      </div>

      {/* Tab: Orders History */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.map((ord, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-slate-900">{ord.orderId}</span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(ord.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    ord.status === 'Delivered' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                    {ord.status || 'Confirmed'}
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">
                    {formatCurrency(ord.pricing?.grandTotal || ord.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {ord.items?.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-50 border border-slate-100" />
                      )}
                      <div>
                        <div className="font-semibold text-slate-800">{item.name || item.productName}</div>
                        <div className="text-slate-400">Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="font-bold text-slate-800">
                      {formatCurrency(item.price ? item.price * item.quantity : (item.unitPrice * item.quantity))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Addresses */}
      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2 relative">
            <span className="absolute top-4 right-4 bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Default
            </span>
            <div className="font-bold text-sm text-slate-900">Home Address</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Flat 402, Green Glen Layout, Outer Ring Road, Bellandur<br />
              Bengaluru, Karnataka - 560103<br />
              Phone: +91 98765 43210
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
            <div className="font-bold text-sm text-slate-900">Office Address</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Block C, EcoWorld Tech Park, Devarabisanahalli<br />
              Bengaluru, Karnataka - 560103<br />
              Phone: +91 98765 43210
            </p>
          </div>
        </div>
      )}

      {/* Tab: Preferences */}
      {activeTab === 'preferences' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 max-w-2xl">
          <h2 className="text-base font-bold text-slate-900">Client-Side Demo Storage</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            All shopping cart items, saved wishlist items, custom factor weights, and newly generated orders are saved in your browser's LocalStorage. You can reset everything to clean defaults here.
          </p>

          <div className="pt-2">
            <button
              onClick={handleResetDemoData}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Reset All Demo LocalStorage Data
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
