import React, { useState, useMemo } from 'react';
import { 
  Boxes, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Search, 
  Filter,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../../data/products';
import { formatCurrency } from '../../utils/formatCurrency';

export default function InventoryInsights() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // All | low_stock | fast_moving | healthy

  // Compute inventory metrics per product
  const inventoryItems = useMemo(() => {
    return PRODUCTS.map(prod => {
      const stock = prod.stock || 20;
      const unitCost = prod.unitCost || (prod.sellingPrice * 0.7);
      const inventoryValAtCost = stock * unitCost;

      // Daily velocity: units sold per 30 days / 30
      const monthlyVelocity = prod.demoUnitsSold || 15;
      const dailyVelocity = Math.max(0.2, monthlyVelocity / 30);
      const daysOfCoverage = Math.round(stock / dailyVelocity);

      const isLowStock = stock < 25 || daysOfCoverage < 15;
      const isFastMoving = monthlyVelocity >= 80;

      let status = 'healthy';
      if (isLowStock) status = 'low_stock';
      else if (isFastMoving) status = 'fast_moving';

      return {
        ...prod,
        inventoryValAtCost,
        dailyVelocity: dailyVelocity.toFixed(1),
        monthlyVelocity,
        daysOfCoverage,
        isLowStock,
        isFastMoving,
        status
      };
    });
  }, []);

  // Filtered
  const filteredItems = useMemo(() => {
    return inventoryItems.filter(item => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!item.name.toLowerCase().includes(q) && !item.category.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (statusFilter === 'low_stock' && !item.isLowStock) return false;
      if (statusFilter === 'fast_moving' && !item.isFastMoving) return false;
      if (statusFilter === 'healthy' && (item.isLowStock || item.isFastMoving)) return false;

      return true;
    });
  }, [inventoryItems, search, statusFilter]);

  // Aggregates
  const totalInventoryValue = inventoryItems.reduce((acc, i) => acc + i.inventoryValAtCost, 0);
  const totalStockUnits = inventoryItems.reduce((acc, i) => acc + (i.stock || 0), 0);
  const lowStockCount = inventoryItems.filter(i => i.isLowStock).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Inventory Velocity & Coverage</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time stock depletion velocity, reorder thresholds, and warehouse capital allocation.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Capital in Stock</span>
          <div className="text-2xl font-black text-slate-900">{formatCurrency(totalInventoryValue)}</div>
          <p className="text-[11px] text-slate-500">{totalStockUnits} total units across 32 SKUs</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Low Stock Reorder Alerts</span>
          <div className={`text-2xl font-black ${lowStockCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {lowStockCount} Products
          </div>
          <p className="text-[11px] text-slate-500">Coverage below 15-day safety threshold</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Portfolio Coverage</span>
          <div className="text-2xl font-black text-indigo-600">38 Days</div>
          <p className="text-[11px] text-slate-500">Healthy replenishment turnover rate</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <input
            type="text"
            placeholder="Search SKU or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-hidden cursor-pointer"
        >
          <option value="All">All Stock Statuses ({inventoryItems.length})</option>
          <option value="low_stock">Low Stock Alerts ({lowStockCount})</option>
          <option value="fast_moving">Fast Moving SKUs</option>
          <option value="healthy">Healthy Buffer</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-3">Current Stock</th>
                <th className="py-3 px-3">Sales Velocity</th>
                <th className="py-3 px-3">Days of Coverage</th>
                <th className="py-3 px-3 text-right">Value at Cost</th>
                <th className="py-3 px-4 text-right">Inventory Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-bold text-slate-900 truncate">{item.name}</div>
                    <div className="text-[10px] text-slate-400">{item.category}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-extrabold text-slate-800 text-sm">{item.stock}</span> units
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-800">{item.monthlyVelocity} / month</div>
                    <div className="text-[10px] text-slate-400">~{item.dailyVelocity} units/day</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`font-black ${item.daysOfCoverage < 15 ? 'text-amber-600' : 'text-slate-800'}`}>
                      {item.daysOfCoverage} Days
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right font-extrabold text-slate-900">
                    {formatCurrency(item.inventoryValAtCost)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {item.isLowStock ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <AlertTriangle className="w-3 h-3" /> Reorder Soon
                      </span>
                    ) : item.isFastMoving ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        <TrendingUp className="w-3 h-3" /> High Velocity
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Optimal Buffer
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
