import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  TrendingDown, 
  Percent, 
  Sparkles, 
  Layers, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Boxes,
  HelpCircle,
  Truck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { PRODUCTS } from '../../data/products';
import { MOCK_ORDERS } from '../../data/orders';
import { filterOrdersByDateRange, groupOrdersByTimeline } from '../../utils/dateFilters';
import { calculatePortfolioFinancials, generateSellerInsights } from '../../utils/profitCalculations';
import { formatCurrency, formatPercent } from '../../utils/formatCurrency';

export default function SellerDashboard({ dateRange = '30d' }) {
  // Filter orders by date range
  const filteredOrders = useMemo(() => {
    return filterOrdersByDateRange(MOCK_ORDERS, dateRange);
  }, [dateRange]);

  // Extract order items for portfolio calculation
  const orderItems = useMemo(() => {
    return filteredOrders.flatMap(o => (o.items || []).map(i => ({ ...i, orderId: o.orderId })));
  }, [filteredOrders]);

  // Calculate accounting financials
  const portfolio = useMemo(() => {
    return calculatePortfolioFinancials(PRODUCTS, orderItems);
  }, [orderItems]);

  // Generate deterministic AI insights
  const insights = useMemo(() => {
    return generateSellerInsights(portfolio, portfolio.productMetrics);
  }, [portfolio]);

  // Timeline data for charts
  const timelineData = useMemo(() => {
    return groupOrdersByTimeline(filteredOrders, dateRange);
  }, [filteredOrders, dateRange]);

  // Category revenue distribution
  const categoryData = useMemo(() => {
    const map = {};
    portfolio.productMetrics.forEach(p => {
      if (!map[p.category]) map[p.category] = 0;
      map[p.category] += p.grossRevenue;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).filter(c => c.value > 0);
  }, [portfolio]);

  const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6'];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Seller Executive Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time accounting ledger & unit profitability intelligence for TechNest Store.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/seller/reports"
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Download CSV Report
          </Link>
          <Link
            to="/seller/pricing"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-xs"
          >
            Launch Pricing Sandbox
          </Link>
        </div>
      </div>

      {/* --- KPI METRIC CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Gross Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Gross Sales (GMV)</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {formatCurrency(portfolio.grossRevenue)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12.4% vs previous period</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            Total Revenue before fee deductions
          </div>
        </div>

        {/* Card 2: Cost of Goods Sold */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Cost of Goods (COGS)</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {formatCurrency(portfolio.cogs)}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-semibold">
              {portfolio.grossRevenue > 0 ? `${((portfolio.cogs / portfolio.grossRevenue) * 100).toFixed(1)}% of Revenue` : '0%'}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            Direct inventory procurement costs
          </div>
        </div>

        {/* Card 3: Estimated Net Profit (Highlighted) */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-5 rounded-3xl shadow-md shadow-emerald-600/20 space-y-3">
          <div className="flex items-center justify-between text-xs text-emerald-100">
            <span className="font-bold uppercase tracking-wider text-[10px]">Estimated Net Profit</span>
            <div className="p-2 rounded-xl bg-white/20 text-white">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white">
              {formatCurrency(portfolio.netProfit)}
            </div>
            <div className="text-xs text-emerald-100 font-bold mt-1">
              Net Profit Margin: {portfolio.profitMarginPct}%
            </div>
          </div>
          <div className="text-[11px] text-emerald-100/80 pt-2 border-t border-white/20">
            Net cash generated after all expenses
          </div>
        </div>

        {/* Card 4: Orders & AOV */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Orders & Velocity</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {portfolio.totalOrders} Orders
            </div>
            <div className="text-xs text-slate-600 font-semibold mt-1">
              AOV: <strong className="text-slate-900">{formatCurrency(portfolio.averageOrderValue)}</strong> ({portfolio.unitsSold} units)
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            Average transaction basket size
          </div>
        </div>

      </div>

      {/* --- AI-INSPIRED DEMO INSIGHTS BANNER --- */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-indigo-900/50 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-extrabold tracking-wide uppercase">AI-Inspired Demo Insights</h2>
          </div>
          <span className="text-[10px] text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-400/20">
            Rule-Based Deterministic Engine
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {insights.slice(0, 4).map(ins => (
            <div key={ins.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 backdrop-blur-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {ins.title}
                </span>
                <span className="text-[11px] font-extrabold text-indigo-300 bg-white/10 px-2 py-0.5 rounded-md">
                  {ins.metric}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {ins.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- CHARTS ROW: REVENUE & PROFIT TIMELINE + CATEGORY PIE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Timeline Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-base text-slate-900">Revenue & Profit Over Time</h3>
              <p className="text-xs text-slate-500">Gross revenue plotted against calculated net margin.</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-indigo-600">
                <span className="w-3 h-3 rounded-full bg-indigo-600" /> Gross Revenue
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-3 h-3 rounded-full bg-emerald-500" /> Net Profit
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip
                  formatter={(val, name) => [formatCurrency(val), name === 'revenue' ? 'Gross Revenue' : 'Net Profit']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Mix Pie Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Revenue by Category</h3>
            <p className="text-xs text-slate-500">Portfolio sales distribution.</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 max-h-32 overflow-y-auto pr-1">
            {categoryData.slice(0, 5).map((cat, idx) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-600 truncate max-w-[130px]">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  {cat.name}
                </span>
                <span className="font-bold text-slate-800">{formatCurrency(cat.value)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* --- BEST-SELLING PRODUCTS TABLE --- */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-base text-slate-900">Top Performing Products by Net Profit</h3>
            <p className="text-xs text-slate-500">Products delivering the strongest unit margins and aggregate cash contribution.</p>
          </div>
          <Link
            to="/seller/products"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            Full Product Ledger <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px]">
                <th className="py-3 px-2">Product Name</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2 text-right">Units Sold</th>
                <th className="py-3 px-2 text-right">Gross Revenue</th>
                <th className="py-3 px-2 text-right">COGS</th>
                <th className="py-3 px-2 text-right">Net Profit</th>
                <th className="py-3 px-2 text-right">Net Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {[...portfolio.productMetrics]
                .sort((a, b) => b.netProfit - a.netProfit)
                .slice(0, 6)
                .map(prod => (
                  <tr key={prod.productId} className="hover:bg-slate-50/70">
                    <td className="py-3 px-2 font-bold text-slate-900 max-w-xs truncate">
                      {prod.name}
                    </td>
                    <td className="py-3 px-2 text-slate-500">{prod.category}</td>
                    <td className="py-3 px-2 text-right font-semibold text-slate-700">{prod.unitsSold}</td>
                    <td className="py-3 px-2 text-right font-semibold text-slate-900">{formatCurrency(prod.grossRevenue)}</td>
                    <td className="py-3 px-2 text-right text-slate-500">{formatCurrency(prod.cogs)}</td>
                    <td className="py-3 px-2 text-right font-bold text-emerald-600">
                      +{formatCurrency(prod.netProfit)}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {prod.profitMarginPct}%
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
