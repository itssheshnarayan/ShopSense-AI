import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  ArrowUpDown, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp,
  Download,
  CheckCircle2
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../../data/products';
import { MOCK_ORDERS } from '../../data/orders';
import { filterOrdersByDateRange } from '../../utils/dateFilters';
import { calculateProductFinancials, getMarginCategory } from '../../utils/profitCalculations';
import { formatCurrency } from '../../utils/formatCurrency';
import { exportToCSV } from '../../utils/csvExport';

export default function SellerProducts({ dateRange = '30d' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All'); // All | profitable | low_margin | loss_making
  const [sortField, setSortField] = useState('netProfit');
  const [sortDirection, setSortDirection] = useState('desc');

  // Filter orders by date range
  const filteredOrders = useMemo(() => {
    return filterOrdersByDateRange(MOCK_ORDERS, dateRange);
  }, [dateRange]);

  // Aggregate units sold per product
  const unitsMap = useMemo(() => {
    const map = {};
    filteredOrders.forEach(ord => {
      ord.items?.forEach(it => {
        map[it.productId] = (map[it.productId] || 0) + (it.quantity || 1);
      });
    });
    return map;
  }, [filteredOrders]);

  // Calculate full financials for all products
  const productFinancials = useMemo(() => {
    return PRODUCTS.map(prod => {
      const units = unitsMap[prod.id] !== undefined ? unitsMap[prod.id] : (prod.demoUnitsSold || 10);
      return calculateProductFinancials(prod, units);
    });
  }, [unitsMap]);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    return productFinancials.filter(item => {
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        if (!item.name.toLowerCase().includes(q) && !item.category.toLowerCase().includes(q)) {
          return false;
        }
      }

      // Category
      if (categoryFilter !== 'All' && item.category !== categoryFilter) {
        return false;
      }

      // Profit status
      if (statusFilter === 'profitable' && item.profitMarginPct < 12) return false;
      if (statusFilter === 'low_margin' && (item.profitMarginPct < 0 || item.profitMarginPct >= 12)) return false;
      if (statusFilter === 'loss_making' && item.profitMarginPct >= 0) return false;

      return true;
    }).sort((a, b) => {
      const dir = sortDirection === 'asc' ? 1 : -1;
      return (a[sortField] > b[sortField] ? 1 : -1) * dir;
    });
  }, [productFinancials, searchTerm, categoryFilter, statusFilter, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExportCSV = () => {
    const headers = [
      { key: 'name', label: 'Product Name' },
      { key: 'category', label: 'Category' },
      { key: 'sellingPrice', label: 'Selling Price (INR)' },
      { key: 'unitCost', label: 'Cost Price (INR)' },
      { key: 'unitsSold', label: 'Units Sold' },
      { key: 'grossRevenue', label: 'Gross Revenue (INR)' },
      { key: 'cogs', label: 'COGS (INR)' },
      { key: 'platformFees', label: 'Platform Fees (INR)' },
      { key: 'shippingCost', label: 'Shipping Costs (INR)' },
      { key: 'returnCost', label: 'Return Losses (INR)' },
      { key: 'netProfit', label: 'Net Profit (INR)' },
      { key: 'profitMarginPct', label: 'Net Margin (%)' }
    ];
    exportToCSV(`shopsense-product-profit-ledger-${dateRange}.csv`, headers, filteredProducts);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Product Profit Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Unit economics, revenue, COGS, platform fee deductions, and estimated net profit per product.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-indigo-600" /> Export CSV
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <input
            type="text"
            placeholder="Search by product title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-hidden cursor-pointer"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Profit status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-hidden cursor-pointer"
          >
            <option value="All">All Profit Statuses</option>
            <option value="profitable">High Margin (≥ 12%)</option>
            <option value="low_margin">Low Margin (0% - 12%)</option>
            <option value="loss_making">Loss Making (&lt; 0%)</option>
          </select>
        </div>

      </div>

      {/* --- MASTER PRODUCT PROFIT TABLE --- */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[950px]">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-3">Price / Cost</th>
                <th 
                  className="py-3 px-3 text-right cursor-pointer hover:text-slate-800"
                  onClick={() => handleSort('unitsSold')}
                >
                  Units
                </th>
                <th 
                  className="py-3 px-3 text-right cursor-pointer hover:text-slate-800"
                  onClick={() => handleSort('grossRevenue')}
                >
                  Gross Revenue
                </th>
                <th className="py-3 px-3 text-right">COGS</th>
                <th className="py-3 px-3 text-right">Fees & Shipping</th>
                <th className="py-3 px-3 text-right">Returns</th>
                <th 
                  className="py-3 px-3 text-right cursor-pointer hover:text-slate-800"
                  onClick={() => handleSort('netProfit')}
                >
                  Net Profit
                </th>
                <th 
                  className="py-3 px-4 text-right cursor-pointer hover:text-slate-800"
                  onClick={() => handleSort('profitMarginPct')}
                >
                  Margin (%)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProducts.map(prod => {
                const isLoss = prod.netProfit < 0;

                return (
                  <tr key={prod.productId} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* Name */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 truncate">{prod.name}</div>
                      <div className="text-[10px] text-slate-400">{prod.category}</div>
                    </td>

                    {/* Price / Cost */}
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-800">{formatCurrency(prod.sellingPrice)}</div>
                      <div className="text-[10px] text-slate-400">Cost: {formatCurrency(prod.unitCost)}</div>
                    </td>

                    {/* Units Sold */}
                    <td className="py-3.5 px-3 text-right font-bold text-slate-700">
                      {prod.unitsSold}
                    </td>

                    {/* Gross Revenue */}
                    <td className="py-3.5 px-3 text-right font-extrabold text-slate-900">
                      {formatCurrency(prod.grossRevenue)}
                    </td>

                    {/* COGS */}
                    <td className="py-3.5 px-3 text-right text-slate-600">
                      {formatCurrency(prod.cogs)}
                    </td>

                    {/* Fees + Shipping */}
                    <td className="py-3.5 px-3 text-right text-slate-600">
                      {formatCurrency(prod.platformFees + prod.shippingCost)}
                    </td>

                    {/* Return Costs */}
                    <td className="py-3.5 px-3 text-right text-amber-700 font-medium">
                      {formatCurrency(prod.returnCost)}
                    </td>

                    {/* Estimated Net Profit */}
                    <td className={`py-3.5 px-3 text-right font-black ${
                      isLoss ? 'text-rose-600' : 'text-emerald-600'
                    }`}>
                      {isLoss ? '-' : '+'}{formatCurrency(Math.abs(prod.netProfit))}
                    </td>

                    {/* Margin Badge */}
                    <td className="py-3.5 px-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                        isLoss
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : prod.profitMarginPct < 10
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {prod.profitMarginPct}%
                      </span>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
