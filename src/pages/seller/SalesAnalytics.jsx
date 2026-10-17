import React, { useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  RotateCcw,
  DollarSign
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { MOCK_ORDERS } from '../../data/orders';
import { filterOrdersByDateRange, groupOrdersByTimeline } from '../../utils/dateFilters';
import { formatCurrency } from '../../utils/formatCurrency';

export default function SalesAnalytics({ dateRange = '30d' }) {
  const filteredOrders = useMemo(() => {
    return filterOrdersByDateRange(MOCK_ORDERS, dateRange);
  }, [dateRange]);

  const timelineData = useMemo(() => {
    return groupOrdersByTimeline(filteredOrders, dateRange);
  }, [filteredOrders, dateRange]);

  // Status breakdown
  const statusCounts = useMemo(() => {
    const counts = { Delivered: 0, Shipped: 0, Returned: 0 };
    filteredOrders.forEach(o => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [filteredOrders]);

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalUnits = filteredOrders.reduce((sum, o) => sum + (o.items ? o.items.reduce((s, i) => s + i.quantity, 0) : 1), 0);
  const aov = filteredOrders.length > 0 ? Math.round(totalRevenue / filteredOrders.length) : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sales Analytics & Velocity</h1>
        <p className="text-xs text-slate-500 mt-0.5">Time-series trend analysis, order volume, and fulfillment efficiency.</p>
      </div>

      {/* Mini KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Sales Volume</span>
          <div className="text-2xl font-black text-slate-900">{formatCurrency(totalRevenue)}</div>
          <p className="text-[11px] text-slate-500">{filteredOrders.length} orders across period</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Order Value</span>
          <div className="text-2xl font-black text-indigo-600">{formatCurrency(aov)}</div>
          <p className="text-[11px] text-slate-500">~{totalUnits} units fulfilled</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Order Delivery Rate</span>
          <div className="text-2xl font-black text-emerald-600">
            {filteredOrders.length > 0 ? `${(((statusCounts.Delivered || 0) / filteredOrders.length) * 100).toFixed(1)}%` : '0%'}
          </div>
          <p className="text-[11px] text-slate-500">{statusCounts.Delivered} successful deliveries</p>
        </div>
      </div>

      {/* --- TIME SERIES CHARTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Revenue Over Time */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Revenue Progression</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} dot={{ r: 3, fill: '#4f46e5' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Order Volume Bar Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Order Frequency & Units Sold</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="orders" name="Total Orders" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="units" name="Units Sold" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Fulfillment Status Breakdown */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Fulfillment Status Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-800">Delivered Orders</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">{statusCounts.Delivered || 0}</div>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-500 opacity-60" />
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-indigo-800">In Transit / Shipped</div>
              <div className="text-2xl font-black text-indigo-700 mt-1">{statusCounts.Shipped || 0}</div>
            </div>
            <Clock className="w-8 h-8 text-indigo-500 opacity-60" />
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-rose-800">Returns & Cancellations</div>
              <div className="text-2xl font-black text-rose-700 mt-1">{statusCounts.Returned || 0}</div>
            </div>
            <RotateCcw className="w-8 h-8 text-rose-500 opacity-60" />
          </div>
        </div>
      </section>

    </div>
  );
}
