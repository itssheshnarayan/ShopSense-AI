import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, BarChart3, Scale, ShieldCheck, Heart, Github, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                ShopSense<span className="text-indigo-400">.AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              An intelligent next-generation e-commerce platform bridging consumer decision-making with merchant profitability. Powered by transparent multi-factor <strong>ValueScore</strong> calculations and real-time <strong>Seller Profit Intelligence</strong>.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
                <Award className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>MBA Final-Year Project • IT & Business Analytics</span>
              </div>
            </div>
          </div>

          {/* Customer Shopping */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Customer Hub</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/valuescore" className="hover:text-white transition-colors flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> ValueScore Studio
              </Link></li>
              <li><Link to="/compare" className="hover:text-white transition-colors flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-400" /> Product Comparison
              </Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Saved Wishlist</Link></li>
              <li><Link to="/account" className="hover:text-white transition-colors">Order Tracking</Link></li>
            </ul>
          </div>

          {/* Seller Tools */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Seller Intelligence</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/seller" className="hover:text-white transition-colors flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-indigo-400" /> Executive Overview
              </Link></li>
              <li><Link to="/seller/products" className="hover:text-white transition-colors">Product Profit Ledger</Link></li>
              <li><Link to="/seller/analytics" className="hover:text-white transition-colors">Sales & Volume Trends</Link></li>
              <li><Link to="/seller/profit" className="hover:text-white transition-colors">Cost Breakdown</Link></li>
              <li><Link to="/seller/pricing" className="hover:text-white transition-colors">Pricing Simulator</Link></li>
              <li><Link to="/seller/inventory" className="hover:text-white transition-colors">Stock Velocity & Alerts</Link></li>
              <li><Link to="/seller/reports" className="hover:text-white transition-colors">CSV Data Reports</Link></li>
            </ul>
          </div>

          {/* Project & Methodology */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Methodology & Info</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About ShopSense AI</Link></li>
              <li><Link to="/methodology" className="hover:text-white transition-colors">ValueScore Formulas</Link></li>
              <li><Link to="/methodology#profit-math" className="hover:text-white transition-colors">Accounting Model</Link></li>
              <li><Link to="/methodology#limitations" className="hover:text-white transition-colors">Limitations of Mock Data</Link></li>
              <li><Link to="/about#future-scope" className="hover:text-white transition-colors">Future Architecture</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ShopSense AI. Built for academic and evaluation purposes. All metrics and scoring calculations run client-side.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-400 transition-colors">Privacy Notice (Demo)</Link>
            <Link to="/about" className="hover:text-slate-400 transition-colors">Terms of Use (Demo)</Link>
            <Link to="/methodology" className="hover:text-slate-400 transition-colors">Data Transparency</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
