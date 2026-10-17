import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import DemoDisclaimerBanner from './components/common/DemoDisclaimerBanner';
import CompareDrawer from './components/compare/CompareDrawer';

// Customer Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import CompareProducts from './pages/CompareProducts';
import ValueScore from './pages/ValueScore';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Wishlist from './pages/Wishlist';
import Account from './pages/Account';
import About from './pages/About';
import Methodology from './pages/Methodology';
import NotFound from './pages/NotFound';

// Seller Layout and Pages
import SellerLayout from './components/seller/SellerLayout';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import SalesAnalytics from './pages/seller/SalesAnalytics';
import ProfitIntelligence from './pages/seller/ProfitIntelligence';
import PricingInsights from './pages/seller/PricingInsights';
import InventoryInsights from './pages/seller/InventoryInsights';
import Reports from './pages/seller/Reports';

export default function App() {
  const [sellerDateRange, setSellerDateRange] = useState('30d');
  const location = useLocation();
  const isSellerRoute = location.pathname.startsWith('/seller');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Top Academic Disclaimer */}
      <DemoDisclaimerBanner />

      {/* Main Navbar (hidden on /seller routes so seller has its own focused header) */}
      {!isSellerRoute && <Navbar />}

      {/* Main Page Body */}
      <div className="flex-1">
        <Routes>
          {/* Customer Storefront Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/compare" element={<CompareProducts />} />
          <Route path="/valuescore" element={<ValueScore />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<Account />} />
          <Route path="/about" element={<About />} />
          <Route path="/methodology" element={<Methodology />} />

          {/* Seller Intelligence Dashboard Nested Routes */}
          <Route 
            path="/seller" 
            element={<SellerLayout dateRange={sellerDateRange} setDateRange={setSellerDateRange} />}
          >
            <Route index element={<SellerDashboard dateRange={sellerDateRange} />} />
            <Route path="products" element={<SellerProducts dateRange={sellerDateRange} />} />
            <Route path="analytics" element={<SalesAnalytics dateRange={sellerDateRange} />} />
            <Route path="profit" element={<ProfitIntelligence dateRange={sellerDateRange} />} />
            <Route path="pricing" element={<PricingInsights dateRange={sellerDateRange} />} />
            <Route path="inventory" element={<InventoryInsights dateRange={sellerDateRange} />} />
            <Route path="reports" element={<Reports dateRange={sellerDateRange} />} />
          </Route>

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* Floating Compare Tray for Storefront */}
      {!isSellerRoute && <CompareDrawer />}

      {/* Main Footer (hidden on /seller routes) */}
      {!isSellerRoute && <Footer />}

    </div>
  );
}
