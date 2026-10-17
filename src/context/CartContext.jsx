import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('shopsense_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('shopsense_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) return;
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = Math.min(product.stock || 99, next[existingIndex].quantity + quantity);
        next[existingIndex] = { ...next[existingIndex], quantity: newQty };
        return next;
      }
      return [...prev, { product, quantity: Math.min(product.stock || 99, quantity) }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.product.id === productId) {
        const maxStock = item.product.stock || 99;
        return { ...item, quantity: Math.min(maxStock, quantity) };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
  };

  const applyCoupon = (code) => {
    setCouponError('');
    if (!code) {
      setCoupon(null);
      return;
    }
    const clean = code.trim().toUpperCase();
    if (clean === 'SHOPSENSE10') {
      setCoupon({ code: 'SHOPSENSE10', discountPct: 10, maxDiscount: 1500 });
      return true;
    } else if (clean === 'VALUE20') {
      setCoupon({ code: 'VALUE20', discountPct: 20, maxDiscount: 2500 });
      return true;
    } else {
      setCouponError('Invalid coupon code. Try SHOPSENSE10 or VALUE20');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError('');
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.sellingPrice * item.quantity), 0);
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  // Free delivery for orders above ₹999
  const shippingFee = subtotal === 0 ? 0 : (subtotal >= 1000 ? 0 : 99);

  let discountAmount = 0;
  if (coupon && subtotal > 0) {
    const rawDiscount = (subtotal * coupon.discountPct) / 100;
    discountAmount = Math.min(rawDiscount, coupon.maxDiscount);
  }

  const finalTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      shippingFee,
      discountAmount,
      coupon,
      couponError,
      applyCoupon,
      removeCoupon,
      finalTotal,
      totalItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
