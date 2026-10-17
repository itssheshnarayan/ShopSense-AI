import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  X, 
  Plus, 
  Trash2, 
  Sparkles, 
  Star, 
  ShieldCheck, 
  ShoppingBag, 
  Check, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Cell 
} from 'recharts';
import { PRODUCTS } from '../data/products';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { useValueScore } from '../context/ValueScoreContext';
import { formatCurrency } from '../utils/formatCurrency';
import ValueScoreBadge from '../components/product/ValueScoreBadge';

export default function CompareProducts() {
  const { compareIds, removeFromCompare, clearCompare, addToCompare } = useCompare();
  const { addToCart } = useCart();
  const { getProductScore } = useValueScore();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState('');

  // Get compared products data
  const comparedProducts = PRODUCTS.filter(p => compareIds.includes(p.id));

  // Find highlights (e.g. lowest price, highest score)
  const lowestPrice = comparedProducts.length > 0 
    ? Math.min(...comparedProducts.map(p => p.sellingPrice))
    : 0;

  const highestScore = comparedProducts.length > 0
    ? Math.max(...comparedProducts.map(p => getProductScore(p)?.overallScore || 0))
    : 0;

  // Chart data
  const chartData = comparedProducts.map(p => {
    const scoreObj = getProductScore(p);
    return {
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      fullName: p.name,
      valueScore: scoreObj?.overallScore || 0,
      price: p.sellingPrice,
      ratingPct: Math.round((p.rating / 5) * 100),
      featureScore: p.featureScore || 80
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-semibold text-xs border border-amber-200 mb-2">
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            <span>Side-by-Side Matrix</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Product Comparison Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Compare specifications, pricing, customer satisfaction, and calculated ValueScores for up to 4 items.
          </p>
        </div>

        {comparedProducts.length > 0 && (
          <div className="flex items-center gap-3">
            {comparedProducts.length < 4 && (
              <button
                onClick={() => setAddModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            )}
            <button
              onClick={clearCompare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {comparedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Scale className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No products selected for comparison</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Add up to four products from the catalog or product pages to inspect side-by-side spec sheets and ValueScores.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20"
            >
              Browse Catalog to Compare
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* --- COMPARISON TABLE --- */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              
              {/* Product Header Row */}
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60">
                  <th className="p-4 sm:p-6 w-48 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Attributes
                  </th>
                  {comparedProducts.map(product => {
                    const score = getProductScore(product)?.overallScore || 75;
                    const isTopScore = score === highestScore && comparedProducts.length > 1;

                    return (
                      <th key={product.id} className="p-4 sm:p-6 w-64 align-top relative">
                        <button
                          onClick={() => removeFromCompare(product.id)}
                          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Remove product"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <div className="space-y-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-24 h-24 rounded-2xl object-cover bg-white border border-slate-200 mx-auto"
                          />
                          <div className="text-center">
                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                              {product.category}
                            </span>
                            <Link to={`/product/${product.id}`} className="block mt-1">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 hover:text-indigo-600 line-clamp-2">
                                {product.name}
                              </h4>
                            </Link>
                          </div>

                          <div className="flex justify-center">
                            <ValueScoreBadge score={score} size="sm" />
                          </div>

                          {isTopScore && (
                            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <Award className="w-3 h-3 text-emerald-600" /> Best Value in Set
                            </div>
                          )}

                          <button
                            onClick={() => addToCart(product, 1)}
                            className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                          </button>
                        </div>
                      </th>
                    );
                  })}

                  {/* Empty Slot if < 4 */}
                  {Array.from({ length: 4 - comparedProducts.length }).map((_, idx) => (
                    <th key={`empty-${idx}`} className="p-6 w-64 text-center align-middle border-l border-dashed border-slate-200">
                      <button
                        onClick={() => setAddModalOpen(true)}
                        className="w-full py-12 rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 gap-2 cursor-pointer"
                      >
                        <Plus className="w-6 h-6" />
                        <span className="text-xs font-semibold">Add Product</span>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Data Rows */}
              <tbody className="divide-y divide-slate-100 text-xs">
                
                {/* Selling Price */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 sm:p-5 font-bold text-slate-700 bg-slate-50/30">Price</td>
                  {comparedProducts.map(p => {
                    const isLowest = p.sellingPrice === lowestPrice && comparedProducts.length > 1;
                    return (
                      <td key={p.id} className="p-4 sm:p-5">
                        <div className="flex items-baseline gap-2">
                          <span className={`text-base font-extrabold ${isLowest ? 'text-emerald-700' : 'text-slate-900'}`}>
                            {formatCurrency(p.sellingPrice)}
                          </span>
                          {isLowest && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-bold">
                              Lowest
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 line-through">
                          {formatCurrency(p.originalPrice)} ({p.discount}% off)
                        </div>
                      </td>
                    );
                  })}
                  {Array.from({ length: 4 - comparedProducts.length }).map((_, i) => <td key={i} />)}
                </tr>

                {/* ValueScore Category */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 sm:p-5 font-bold text-slate-700 bg-slate-50/30">Value Band</td>
                  {comparedProducts.map(p => {
                    const scoreObj = getProductScore(p);
                    return (
                      <td key={p.id} className="p-4 sm:p-5 font-semibold text-slate-800">
                        {scoreObj?.band?.label || 'Good Value'}
                      </td>
                    );
                  })}
                  {Array.from({ length: 4 - comparedProducts.length }).map((_, i) => <td key={i} />)}
                </tr>

                {/* Rating & Reviews */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 sm:p-5 font-bold text-slate-700 bg-slate-50/30">Customer Rating</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} className="p-4 sm:p-5">
                      <div className="flex items-center gap-1 font-bold text-slate-900">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{p.rating} / 5</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {p.reviewCount?.toLocaleString('en-IN')} reviews
                      </div>
                    </td>
                  ))}
                  {Array.from({ length: 4 - comparedProducts.length }).map((_, i) => <td key={i} />)}
                </tr>

                {/* Feature Score Index */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 sm:p-5 font-bold text-slate-700 bg-slate-50/30">Feature Score</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} className="p-4 sm:p-5 font-bold text-slate-800">
                      {p.featureScore} / 100
                    </td>
                  ))}
                  {Array.from({ length: 4 - comparedProducts.length }).map((_, i) => <td key={i} />)}
                </tr>

                {/* Warranty */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 sm:p-5 font-bold text-slate-700 bg-slate-50/30">Warranty</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} className="p-4 sm:p-5 font-semibold text-slate-800">
                      {p.warrantyMonths} Months Coverage
                    </td>
                  ))}
                  {Array.from({ length: 4 - comparedProducts.length }).map((_, i) => <td key={i} />)}
                </tr>

                {/* Return Rate */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 sm:p-5 font-bold text-slate-700 bg-slate-50/30">Sample Return Rate</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} className="p-4 sm:p-5 text-slate-700">
                      {p.returnRate}%
                    </td>
                  ))}
                  {Array.from({ length: 4 - comparedProducts.length }).map((_, i) => <td key={i} />)}
                </tr>

                {/* Stock Status */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 sm:p-5 font-bold text-slate-700 bg-slate-50/30">Availability</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} className="p-4 sm:p-5 text-emerald-600 font-semibold">
                      In Stock ({p.stock} units)
                    </td>
                  ))}
                  {Array.from({ length: 4 - comparedProducts.length }).map((_, i) => <td key={i} />)}
                </tr>

              </tbody>
            </table>
          </div>

          {/* --- COMPARATIVE CHARTS --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Chart 1: ValueScore Comparison */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900">ValueScore Comparison</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip 
                      formatter={(val) => [`${val} / 100`, 'ValueScore']}
                      labelFormatter={(name, items) => items?.[0]?.payload?.fullName || name}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    />
                    <Bar dataKey="valueScore" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Price Comparison */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Selling Price Comparison</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip 
                      formatter={(val) => [formatCurrency(val), 'Selling Price']}
                      labelFormatter={(name, items) => items?.[0]?.payload?.fullName || name}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    />
                    <Bar dataKey="price" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </>
      )}

      {/* --- ADD PRODUCT MODAL --- */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Add Product to Comparison</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Search products to add..."
              value={modalSearch}
              onChange={(e) => setModalSearch(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {PRODUCTS
                .filter(p => !compareIds.includes(p.id))
                .filter(p => !modalSearch.trim() || p.name.toLowerCase().includes(modalSearch.toLowerCase()) || p.category.toLowerCase().includes(modalSearch.toLowerCase()))
                .slice(0, 10)
                .map(prod => (
                  <div key={prod.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 line-clamp-1">{prod.name}</div>
                        <div className="text-[11px] text-slate-500">{prod.category} • {formatCurrency(prod.sellingPrice)}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        addToCompare(prod.id);
                        if (compareIds.length + 1 >= 4) {
                          setAddModalOpen(false);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs"
                    >
                      + Add
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
