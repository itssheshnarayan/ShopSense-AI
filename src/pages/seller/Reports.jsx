import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  Layers, 
  Boxes, 
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../../data/products';
import { MOCK_ORDERS } from '../../data/orders';
import { filterOrdersByDateRange } from '../../utils/dateFilters';
import { calculatePortfolioFinancials } from '../../utils/profitCalculations';
import { formatCurrency } from '../../utils/formatCurrency';
import { exportToCSV } from '../../utils/csvExport';

export default function Reports({ dateRange = '30d' }) {
  const [reportType, setReportType] = useState('sales'); // sales | profit | inventory

  const filteredOrders = useMemo(() => {
    return filterOrdersByDateRange(MOCK_ORDERS, dateRange);
  }, [dateRange]);

  const orderItems = useMemo(() => {
    return filteredOrders.flatMap(o => (o.items || []).map(i => ({ ...i, orderId: o.orderId })));
  }, [filteredOrders]);

  const portfolio = useMemo(() => {
    return calculatePortfolioFinancials(PRODUCTS, orderItems);
  }, [orderItems]);

  // Handle Export based on reportType
  const handleExport = () => {
    if (reportType === 'sales') {
      const headers = [
        { key: 'orderId', label: 'Order ID' },
        { key: 'date', label: 'Order Date' },
        { key: 'customerName', label: 'Customer' },
        { key: 'customerCity', label: 'Destination City' },
        { key: 'status', label: 'Fulfillment Status' },
        { key: 'totalAmount', label: 'Total Amount (INR)' },
        { key: 'estimatedNetProfit', label: 'Est. Net Profit (INR)' },
        { key: 'paymentMethod', label: 'Payment Method' }
      ];
      exportToCSV(`shopsense-sales-report-${dateRange}.csv`, headers, filteredOrders);
    } else if (reportType === 'profit') {
      const headers = [
        { key: 'name', label: 'Product Name' },
        { key: 'category', label: 'Category' },
        { key: 'sellingPrice', label: 'Selling Price (INR)' },
        { key: 'unitCost', label: 'Unit Cost (INR)' },
        { key: 'unitsSold', label: 'Units Sold' },
        { key: 'grossRevenue', label: 'Gross Sales (INR)' },
        { key: 'cogs', label: 'COGS (INR)' },
        { key: 'platformFees', label: 'Platform Fees (INR)' },
        { key: 'shippingCost', label: 'Shipping (INR)' },
        { key: 'returnCost', label: 'Return Loss (INR)' },
        { key: 'netProfit', label: 'Net Profit (INR)' },
        { key: 'profitMarginPct', label: 'Margin (%)' }
      ];
      exportToCSV(`shopsense-profit-report-${dateRange}.csv`, headers, portfolio.productMetrics);
    } else if (reportType === 'inventory') {
      const headers = [
        { key: 'name', label: 'Product SKU' },
        { key: 'category', label: 'Category' },
        { key: 'stock', label: 'Available Stock' },
        { key: 'unitCost', label: 'Unit Cost (INR)' },
        { key: 'inventoryValue', label: 'Total Cost Valuation (INR)' },
        { key: 'warrantyMonths', label: 'Warranty (Months)' }
      ];
      const rows = PRODUCTS.map(p => ({
        name: p.name,
        category: p.category,
        stock: p.stock,
        unitCost: p.unitCost,
        inventoryValue: p.stock * p.unitCost,
        warrantyMonths: p.warrantyMonths
      }));
      exportToCSV(`shopsense-inventory-report.csv`, headers, rows);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Financial & Inventory Reports</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Export structured CSV ledgers for external audit, accounting, and spreadsheet analysis.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" /> Download Current CSV ({reportType.toUpperCase()})
        </button>
      </div>

      {/* Report Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setReportType('sales')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            reportType === 'sales' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Transactions Report ({filteredOrders.length} records)
        </button>
        <button
          onClick={() => setReportType('profit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            reportType === 'profit' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4" /> Unit Profit & Margin Ledger (32 SKUs)
        </button>
        <button
          onClick={() => setReportType('inventory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            reportType === 'inventory' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Boxes className="w-4 h-4" /> Warehouse Inventory Report
        </button>
      </div>

      {/* Tabular Preview */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {reportType === 'sales' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[750px]">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">City</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Est. Net Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredOrders.slice(0, 15).map(ord => (
                  <tr key={ord.orderId} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{ord.orderId}</td>
                    <td className="py-3 px-3 text-slate-500">
                      {new Date(ord.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3 px-3 text-slate-800 font-semibold">{ord.customerName}</td>
                    <td className="py-3 px-3 text-slate-500">{ord.customerCity}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-slate-900">{formatCurrency(ord.totalAmount)}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600">+{formatCurrency(ord.estimatedNetProfit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'profit' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[850px]">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-right">Selling Price</th>
                  <th className="py-3 px-3 text-right">Unit Cost</th>
                  <th className="py-3 px-3 text-right">Units Sold</th>
                  <th className="py-3 px-3 text-right">Gross Sales</th>
                  <th className="py-3 px-3 text-right">Net Profit</th>
                  <th className="py-3 px-4 text-right">Net Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {portfolio.productMetrics.slice(0, 15).map(prod => (
                  <tr key={prod.productId} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-bold text-slate-900 max-w-xs truncate">{prod.name}</td>
                    <td className="py-3 px-3 text-slate-500">{prod.category}</td>
                    <td className="py-3 px-3 text-right">{formatCurrency(prod.sellingPrice)}</td>
                    <td className="py-3 px-3 text-right text-slate-500">{formatCurrency(prod.unitCost)}</td>
                    <td className="py-3 px-3 text-right font-bold">{prod.unitsSold}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">{formatCurrency(prod.grossRevenue)}</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-600">+{formatCurrency(prod.netProfit)}</td>
                    <td className="py-3 px-4 text-right font-black text-slate-800">{prod.profitMarginPct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'inventory' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-right">Stock Available</th>
                  <th className="py-3 px-3 text-right">Unit Procurement Cost</th>
                  <th className="py-3 px-4 text-right">Total Valuation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {PRODUCTS.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-bold text-slate-900 max-w-xs truncate">{p.name}</td>
                    <td className="py-3 px-3 text-slate-500">{p.category}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-800">{p.stock} units</td>
                    <td className="py-3 px-3 text-right text-slate-500">{formatCurrency(p.unitCost)}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">{formatCurrency(p.stock * p.unitCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
