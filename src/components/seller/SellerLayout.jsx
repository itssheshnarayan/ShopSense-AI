import React, { useState } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  BarChart3, 
  DollarSign, 
  Calculator, 
  Boxes, 
  FileSpreadsheet, 
  ArrowLeft, 
  Calendar,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  Store,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { DEMO_SELLER } from '../../data/sellers';
import { DATE_RANGE_OPTIONS } from '../../utils/dateFilters';

export default function SellerLayout({ dateRange, setDateRange }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/seller', label: 'Executive Overview', icon: LayoutDashboard, end: true },
    { to: '/seller/products', label: 'Product Profit Ledger', icon: Package },
    { to: '/seller/analytics', label: 'Sales & Volume Trends', icon: BarChart3 },
    { to: '/seller/profit', label: 'Profit Intelligence & Costs', icon: DollarSign },
    { to: '/seller/pricing', label: 'Pricing & Margin Simulator', icon: Calculator },
    { to: '/seller/inventory', label: 'Inventory & Velocity', icon: Boxes },
    { to: '/seller/reports', label: 'Data Reports & CSV', icon: FileSpreadsheet }
  ];

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col">
      
      {/* Top Seller Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
        <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Left: Store Name & Mobile Sidebar Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-black text-sm shadow-xs">
                TN
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-extrabold text-slate-900 truncate max-w-xs sm:max-w-md">
                    {DEMO_SELLER.businessName}
                  </h1>
                  <span className="hidden sm:inline px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {DEMO_SELLER.tier}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 hidden sm:flex items-center gap-2">
                  <span>GSTIN: {DEMO_SELLER.gstin}</span>
                  <span>•</span>
                  <span>Fulfillment: {DEMO_SELLER.fulfillmentType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Date Range Selector & Storefront Link */}
          <div className="flex items-center gap-2.5">
            {/* Date Range Picker */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1 hidden sm:block" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 outline-hidden py-1 px-2 cursor-pointer"
              >
                {DATE_RANGE_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>

            <Link
              to="/products"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </Link>
          </div>

        </div>
      </header>

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* --- DESKTOP SIDEBAR --- */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 p-4 space-y-6 shrink-0">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
              Intelligence Modules
            </span>
            <nav className="space-y-1 pt-1">
              {navLinks.map(link => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Quick Help & Accounting Pill */}
          <div className="mt-auto bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Net Profit Accounting</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Gross Revenue − COGS − Platform Fees − Shipping − Return Losses.
            </p>
            <Link to="/methodology#profit-math" className="text-[10px] font-bold text-indigo-600 hover:underline block">
              Read Accounting Formula →
            </Link>
          </div>
        </aside>

        {/* --- MOBILE DRAWER SIDEBAR --- */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex bg-slate-900/40 backdrop-blur-xs">
            <div className="w-64 bg-white h-full p-4 space-y-6 shadow-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-bold text-xs text-slate-900 uppercase">Seller Navigation</span>
                  <button onClick={() => setSidebarOpen(false)} className="text-slate-400 p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navLinks.map(link => {
                    const Icon = link.icon;
                    return (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-slate-900 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`
                        }
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{link.label}</span>
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              <Link
                to="/products"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Storefront
              </Link>
            </div>
          </div>
        )}

        {/* --- MAIN PAGE OUTLET --- */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
