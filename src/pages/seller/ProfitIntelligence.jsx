import React, { useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  PieChart as PieIcon, 
  Layers, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Cell, 
  CartesianGrid 
} from 'recharts';
import { PRODUCTS } from '../../data/products';
import { MOCK_ORDERS } from '../../data/orders';
import { filterOrdersByDateRange } from '../../utils/dateFilters';
import { calculatePortfolioFinancials } from '../../utils/profitCalculations';
import { formatCurrency } from '../../utils/formatCurrency';

export default function ProfitIntelligence({ dateRange = '30d' }) {
  const filteredOrders = useMemo(() => {
    return filterOrdersByDateRange(MOCK_ORDERS, dateRange);
  }, [dateRange]);

  const orderItems = useMemo(() => {
    return filteredOrders.flatMap(o => (o.items || []).map(i => ({ ...i, orderId: o.orderId })));
  }, [filteredOrders]);

  const portfolio = useMemo(() => {
    return calculatePortfolioFinancials(PRODUCTS, orderItems);
  }, [orderItems]);

  // Expense breakdown composition for stacked chart
  const expenseBreakdownData = [
    { name: 'Cost of Goods (COGS)', amount: portfolio.cogs, color: '#f59e0b' },
    { name: 'Platform Marketplace Fees', amount: portfolio.platformFees, color: '#6366f1' },
    { name: 'Shipping & Fulfillment', amount: portfolio.shippingCost, color: '#06b6d4' },
    { name: 'Return & Refund Losses', amount: portfolio.returnCost, color: '#f43f5e' },
    { name: 'Estimated Net Profit', amount: Math.max(0, portfolio.netProfit), color: '#10b981' }
  ];

  // High revenue with compressed margin (< 12%)
  const marginCompressionItems = portfolio.productMetrics
    .filter(p => p.grossRevenue > 50000 && p.profitMarginPct < 15)
    .sort((a, b) => b.grossRevenue - a.grossRevenue);

  // Negative profit items
  const negativeProfitItems = portfolio.productMetrics
    .filter(p => p.netProfit < 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Profit Intelligence & Cost Diagnostics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Detailed cost accounting decompositions and margin compression vulnerabilities.
        </p>
      </div>

      {/* --- REVENUE TO PROFIT WATERFALL COMPOSITION --- */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">Capital Flow & Expense Deductions</h2>
          <p className="text-xs text-slate-500">
            Deconstruction of ₹{portfolio.grossRevenue.toLocaleString('en-IN')} Gross Revenue into cost drivers.
          </p>
        </div>

        {/* Stacked Progress Visual */}
        <div className="space-y-2">
          <div className="w-full h-8 bg-slate-100 rounded-2xl overflow-hidden flex shadow-inner">
            {expenseBreakdownData.map((item, idx) => {
              const pct = portfolio.grossRevenue > 0 ? (item.amount / portfolio.grossRevenue) * 100 : 0;
              return (
                <div
                  key={idx}
                  className="h-full transition-all duration-700 relative group cursor-pointer"
                  style={{ width: `${pct}%`, backgroundColor: item.color }}
                  title={`${item.name}: ${pct.toFixed(1)}%`}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3">
            {expenseBreakdownData.map((item, idx) => {
              const pct = portfolio.grossRevenue > 0 ? ((item.amount / portfolio.grossRevenue) * 100).toFixed(1) : 0;
              return (
                <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">{formatCurrency(item.amount)}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{pct}% of Gross</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- WARNINGS & COMPRESSION MATRIX --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Margin Compression List */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900">High Sales with Low Margins</h3>
            </div>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
              Margin &lt; 15%
            </span>
          </div>

          <div className="space-y-3">
            {marginCompressionItems.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No margin compression alerts detected.</p>
            ) : (
              marginCompressionItems.slice(0, 4).map(item => (
                <div key={item.productId} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="max-w-[200px]">
                    <div className="font-bold text-slate-900 truncate">{item.name}</div>
                    <div className="text-slate-500 text-[11px]">{formatCurrency(item.grossRevenue)} Sales</div>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-700 font-black">{item.profitMarginPct}% Margin</div>
                    <div className="text-slate-400 text-[10px]">{formatCurrency(item.netProfit)} Profit</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Negative Net Margin SKUs */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <h3 className="font-bold text-sm text-slate-900">Negative Margin / Loss Drivers</h3>
            </div>
            <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full">
              Action Required
            </span>
          </div>

          <div className="space-y-3">
            {negativeProfitItems.length === 0 ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Zero loss-making products! Entire active portfolio is generating positive net margins.</span>
              </div>
            ) : (
              negativeProfitItems.map(item => (
                <div key={item.productId} className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-rose-700 font-semibold">{item.profitMarginPct}% Margin (Loss)</div>
                  </div>
                  <div className="text-right font-black text-rose-600">
                    -{formatCurrency(Math.abs(item.netProfit))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>

    </div>
  );
}
