import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  MapPin, 
  User, 
  ArrowLeft, 
  Lock, 
  AlertCircle,
  Smartphone,
  Banknote,
  Building,
  CheckCircle2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';

export default function Checkout() {
  const { cartItems, subtotal, shippingFee, discountAmount, finalTotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    fullName: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '9876543210',
    address: 'Flat 402, Green Glen Layout, Bellandur',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560103',
    deliveryMethod: 'standard', // standard | express
    paymentMethod: 'upi', // upi | card | netbanking | cod
    upiId: 'priyasharma@okhdfcbank',
    cardNumber: '•••• •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvv: '•••'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Your cart is empty</h2>
        <p className="text-xs text-slate-500">Please add products to your cart before proceeding to checkout.</p>
        <Link to="/products" className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
          Browse Catalog
        </Link>
      </div>
    );
  }

  const expressDeliveryFee = formData.deliveryMethod === 'express' ? 149 : 0;
  const calculatedGrandTotal = finalTotal + expressDeliveryFee;

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid Email is required';
    if (!formData.phone.trim() || formData.phone.length < 10) errs.phone = '10-digit Phone number is required';
    if (!formData.address.trim()) errs.address = 'Street Address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.pinCode.trim() || formData.pinCode.length < 6) errs.pinCode = 'Valid 6-digit PIN Code is required';

    if (formData.paymentMethod === 'upi' && !formData.upiId.trim()) {
      errs.upiId = 'UPI ID is required for UPI payments';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate order placement
    setTimeout(() => {
      const orderId = `SS-2024-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderRecord = {
        orderId,
        date: new Date().toISOString(),
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pinCode}`
        },
        items: cartItems.map(it => ({
          id: it.product.id,
          name: it.product.name,
          category: it.product.category,
          price: it.product.sellingPrice,
          quantity: it.quantity,
          image: it.product.image
        })),
        pricing: {
          subtotal,
          shippingFee: shippingFee + expressDeliveryFee,
          discountAmount,
          grandTotal: calculatedGrandTotal
        },
        paymentMethod: formData.paymentMethod.toUpperCase(),
        deliveryMethod: formData.deliveryMethod,
        status: 'Confirmed'
      };

      // Save order to history in localStorage
      try {
        const history = JSON.parse(localStorage.getItem('shopsense_orders') || '[]');
        localStorage.setItem('shopsense_orders', JSON.stringify([orderRecord, ...history]));
        localStorage.setItem('shopsense_last_order', JSON.stringify(orderRecord));
      } catch (err) {
        console.error('Error saving order', err);
      }

      clearCart();
      setIsSubmitting(false);
      navigate('/order-success');
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb / Back */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800">
          <ArrowLeft className="w-4 h-4" /> Return to Cart
        </Link>
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
          <Lock className="w-3.5 h-3.5 text-emerald-600" /> Demo Encrypted Checkout
        </span>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Contact, Shipping, Payment (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Contact Information */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <User className="w-4 h-4 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">1. Customer Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
                />
                {errors.fullName && <p className="text-[11px] text-rose-600 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
                />
                {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Phone Number (SMS updates) *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
                />
                {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">2. Shipping Address</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Street Address & Landmark *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
                />
                {errors.address && <p className="text-[11px] text-rose-600 mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                  {errors.city && <p className="text-[11px] text-rose-600 mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">PIN Code *</label>
                  <input
                    type="text"
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                    className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                  {errors.pinCode && <p className="text-[11px] text-rose-600 mt-1">{errors.pinCode}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Delivery Method */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Truck className="w-4 h-4 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">3. Delivery Speed</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                formData.deliveryMethod === 'standard' ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Standard Delivery (2-3 Days)</span>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="standard"
                    checked={formData.deliveryMethod === 'standard'}
                    onChange={() => setFormData({ ...formData, deliveryMethod: 'standard' })}
                    className="text-indigo-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Free express for orders above ₹1,000</p>
                <div className="text-xs font-bold text-emerald-600 mt-2">FREE</div>
              </label>

              <label className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                formData.deliveryMethod === 'express' ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500' : 'border-slate-200 hover:bg-slate-50'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Priority Next-Day Delivery</span>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="express"
                    checked={formData.deliveryMethod === 'express'}
                    onChange={() => setFormData({ ...formData, deliveryMethod: 'express' })}
                    className="text-indigo-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Guaranteed next-morning dispatch</p>
                <div className="text-xs font-bold text-indigo-600 mt-2">+₹149</div>
              </label>
            </div>
          </div>

          {/* 4. Payment Method Selection (Mock Only) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">4. Payment Method (Demo)</h2>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                No Real Charges
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'upi', label: 'UPI / QR', icon: Smartphone },
                { id: 'card', label: 'Cards', icon: CreditCard },
                { id: 'netbanking', label: 'NetBanking', icon: Building },
                { id: 'cod', label: 'Cash on Delivery', icon: Banknote }
              ].map(method => {
                const Icon = method.icon;
                const isSelected = formData.paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 font-bold ring-1 ring-indigo-500' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600 font-medium'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs">{method.label}</span>
                  </button>
                );
              })}
            </div>

            {/* UPI Details Mock */}
            {formData.paymentMethod === 'upi' && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <label className="font-semibold text-slate-700">Enter Demo Virtual Payment Address (VPA)</label>
                <input
                  type="text"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  placeholder="username@bank"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-hidden text-xs"
                />
                <p className="text-[11px] text-slate-500">
                  Instant authorization simulated upon clicking Place Demo Order.
                </p>
              </div>
            )}

            {/* Card Details Mock */}
            {formData.paymentMethod === 'card' && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">Card Number (Simulated)</label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    readOnly
                    className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700">Expiry</label>
                    <input
                      type="text"
                      value={formData.cardExpiry}
                      readOnly
                      className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">CVV</label>
                    <input
                      type="text"
                      value={formData.cardCvv}
                      readOnly
                      className="w-full mt-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Order Summary & Place Order CTA (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-6 sticky top-24">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Order Review ({cartItems.length} items)
          </h2>

          {/* Mini items list */}
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {cartItems.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center gap-3 text-xs">
                <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-slate-50" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 truncate">{product.name}</div>
                  <div className="text-slate-400">Qty: {quantity} × {formatCurrency(product.sellingPrice)}</div>
                </div>
                <div className="font-bold text-slate-900">
                  {formatCurrency(product.sellingPrice * quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Calculation Ledger */}
          <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="font-bold text-slate-800">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span>
                {shippingFee === 0 ? <strong className="text-emerald-600 font-bold">FREE</strong> : formatCurrency(shippingFee)}
              </span>
            </div>
            {expressDeliveryFee > 0 && (
              <div className="flex justify-between text-indigo-600">
                <span>Express Speed Addon</span>
                <span>+{formatCurrency(expressDeliveryFee)}</span>
              </div>
            )}
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Coupon Savings</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Amount Due</span>
              <span className="text-2xl font-black text-slate-900">
                {formatCurrency(calculatedGrandTotal)}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Authorizing Demo Order...
              </span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> Place Demo Order • {formatCurrency(calculatedGrandTotal)}
              </>
            )}
          </button>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <div className="font-bold text-slate-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Demo Simulator Guarantee
            </div>
            <p>
              This is a frontend demonstration for evaluation purposes. No real bank accounts or credit cards are debited.
            </p>
          </div>

        </div>

      </form>

    </div>
  );
}
