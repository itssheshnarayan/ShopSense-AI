import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  MapPin, 
  Printer, 
  ArrowRight, 
  ShoppingBag, 
  Sparkles,
  ShieldCheck,
  Calendar,
  Clock
} from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

export default function OrderSuccess() {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const last = localStorage.getItem('shopsense_last_order');
      if (last) {
        setOrder(JSON.parse(last));
      } else {
        // Fallback default sample order
        setOrder({
          orderId: `SS-2024-819230`,
          date: new Date().toISOString(),
          customer: {
            name: 'Priya Sharma',
            address: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru, Karnataka - 560103'
          },
          items: [
            {
              id: 'prod-1',
              name: 'AuraPhone Pro 5G (256GB, Cosmic Blue)',
              price: 42999,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80'
            }
          ],
          pricing: {
            subtotal: 42999,
            shippingFee: 0,
            discountAmount: 0,
            grandTotal: 42999
          },
          paymentMethod: 'UPI',
          deliveryMethod: 'standard'
        });
      }
    } catch {
      // ignore
    }
  }, []);

  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Confirmation Hero Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-lg space-y-5">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50/60">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Order Placed Successfully
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Thank you, {order.customer?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Your demo order has been confirmed. A simulated invoice notification has been logged in browser memory.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl text-xs font-mono text-slate-800">
          <span>Order ID:</span>
          <strong className="text-indigo-600 text-sm">{order.orderId}</strong>
        </div>

        {/* Demo Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-800 max-w-lg mx-auto flex items-center gap-2.5 text-left">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-[11px]">
            <strong>Academic Simulation:</strong> No payment has been processed and no physical goods will be dispatched. This order record is persisted in your browser's demo account.
          </p>
        </div>
      </div>

      {/* Simulated Tracking Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Truck className="w-4 h-4 text-indigo-600" />
          Live Fulfillment Tracker
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          {[
            { step: 'Order Placed', time: 'Just now', done: true, current: false },
            { step: 'Quality Verification', time: 'In Progress', done: true, current: true },
            { step: 'Warehouse Dispatch', time: 'Estimated Tomorrow', done: false, current: false },
            { step: 'Delivered to Doorstep', time: 'Estimated in 2-3 Days', done: false, current: false }
          ].map((item, idx) => (
            <div key={item.step} className="flex flex-col items-start space-y-2 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  item.done 
                    ? item.current ? 'bg-indigo-600 text-white animate-pulse' : 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {idx + 1}
                </span>
                <span className="text-xs font-bold text-slate-800">{item.step}</span>
              </div>
              <span className="text-[11px] text-slate-400 pl-8">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Order Items & Summary</h2>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print Invoice
          </button>
        </div>

        {/* Ordered items */}
        <div className="space-y-4">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-b-0 text-xs">
              <div className="flex items-center gap-3">
                <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover bg-slate-50" />
                <div>
                  <h4 className="font-bold text-slate-900">{item.name}</h4>
                  <span className="text-slate-400">Quantity: {item.quantity}</span>
                </div>
              </div>
              <div className="font-extrabold text-slate-900 text-sm">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Pricing breakdown */}
        <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600 max-w-sm ml-auto">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-bold text-slate-800">{formatCurrency(order.pricing?.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>{order.pricing?.shippingFee === 0 ? 'FREE' : formatCurrency(order.pricing?.shippingFee)}</span>
          </div>
          {order.pricing?.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Savings:</span>
              <span>-{formatCurrency(order.pricing?.discountAmount)}</span>
            </div>
          )}
          <div className="pt-2 border-t border-slate-100 flex justify-between font-extrabold text-slate-900 text-sm">
            <span>Total Paid (Demo):</span>
            <span className="text-indigo-600">{formatCurrency(order.pricing?.grandTotal)}</span>
          </div>
        </div>

        {/* Shipping Destination */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
          <div className="font-bold text-slate-700 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Shipping Destination:
          </div>
          <p className="text-slate-600">{order.customer?.address}</p>
        </div>

      </div>

      {/* Next Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link
          to="/account"
          className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-2"
        >
          View in Order History
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/products"
          className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

    </div>
  );
}
