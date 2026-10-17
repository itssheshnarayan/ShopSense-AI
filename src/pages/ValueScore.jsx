import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders, 
  Info, 
  Scale, 
  BarChart3, 
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import { PRODUCTS } from '../data/products';
import { useValueScore } from '../context/ValueScoreContext';
import { WEIGHT_LABELS, getScoreBand } from '../utils/valueScore';
import { formatCurrency } from '../utils/formatCurrency';
import ValueScoreBadge from '../components/product/ValueScoreBadge';

export default function ValueScore() {
  const { 
    weights, 
    updateWeight, 
    resetWeights, 
    validation, 
    getProductScore, 
    isDefault 
  } = useValueScore();

  // Multi-select for radar chart (2 to 4 products)
  const [selectedProductIds, setSelectedProductIds] = useState(['prod-1', 'prod-2', 'prod-4']);

  const toggleSelectProduct = (id) => {
    if (selectedProductIds.includes(id)) {
      if (selectedProductIds.length > 2) {
        setSelectedProductIds(prev => prev.filter(pId => pId !== id));
      }
    } else {
      if (selectedProductIds.length < 4) {
        setSelectedProductIds(prev => [...prev, id]);
      }
    }
  };

  // Selected products for radar chart
  const selectedProducts = PRODUCTS.filter(p => selectedProductIds.includes(p.id));

  // Prepare radar chart data
  const radarDimensions = [
    { key: 'priceCompetitiveness', label: 'Price' },
    { key: 'customerRating', label: 'Rating' },
    { key: 'featureToPrice', label: 'Feature Index' },
    { key: 'qualityReliability', label: 'Quality' },
    { key: 'warrantySupport', label: 'Warranty' }
  ];

  const radarData = radarDimensions.map(dim => {
    const entry = { dimension: dim.label };
    selectedProducts.forEach((p, idx) => {
      const scoreObj = getProductScore(p);
      entry[`prod_${p.id}`] = scoreObj?.components?.[dim.key] || 50;
      entry[`name_${p.id}`] = p.name.split(' ')[0] + ' ' + (p.name.split(' ')[1] || '');
    });
    return entry;
  });

  const radarColors = ['#4f46e5', '#06b6d4', '#f59e0b', '#ec4899'];

  // Top 10 Ranked products by ValueScore for bar chart
  const rankedProducts = [...PRODUCTS]
    .map(p => {
      const scoreObj = getProductScore(p);
      return {
        id: p.id,
        name: p.name.length > 18 ? p.name.substring(0, 18) + '...' : p.name,
        fullName: p.name,
        category: p.category,
        price: p.sellingPrice,
        score: scoreObj?.overallScore || 0,
        band: scoreObj?.band?.label || ''
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Proprietary Assessment Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            ValueScore Customization Studio
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mt-1 leading-relaxed">
            Customize factor weights to match your personal purchase preferences. The normalized scoring engine recalculates all scores deterministically across the entire catalog.
          </p>
        </div>

        {!isDefault && (
          <button
            onClick={resetWeights}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restore Default Weights
          </button>
        )}
      </div>

      {/* --- WEIGHTS CUSTOMIZER & VALIDATION ALERT --- */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Configure Factor Weights</h2>
          </div>

          {/* Validation Status Pill */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
            validation.isValid 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}>
            {validation.isValid ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Total Weights: 100% (Valid)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Total: {validation.total}% ({validation.difference > 0 ? `+${validation.difference}% needed` : `${Math.abs(validation.difference)}% excess`})</span>
              </>
            )}
          </div>
        </div>

        {/* Validation Warning Alert */}
        {!validation.isValid && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-800 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Invalid Weight Allocation:</strong> All 5 factors must sum up to exactly 100%. Please adjust the sliders below to restore valid scoring calculations.
            </div>
          </div>
        )}

        {/* 5 Weight Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {Object.entries(weights).map(([key, val]) => (
            <div key={key} className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-800 leading-snug">
                  {WEIGHT_LABELS[key]}
                </span>
                <span className="text-base font-black text-indigo-600">{val}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={val}
                onChange={(e) => updateWeight(key, e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0%</span>
                <span>30%</span>
                <span>60%</span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* --- RADAR CHART: MULTI-PRODUCT COMPARISON --- */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Multi-Dimensional Radar Comparison</h2>
            <p className="text-xs text-slate-500">
              Select 2 to 4 products to overlay their component metrics on a 5-axis radar chart.
            </p>
          </div>

          {/* Product selector buttons */}
          <div className="flex flex-wrap gap-1.5">
            {PRODUCTS.slice(0, 8).map(prod => {
              const isSelected = selectedProductIds.includes(prod.id);
              return (
                <button
                  key={prod.id}
                  onClick={() => toggleSelectProduct(prod.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {prod.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Radar Chart Display */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
              
              {selectedProducts.map((p, idx) => (
                <Radar
                  key={p.id}
                  name={p.name}
                  dataKey={`prod_${p.id}`}
                  stroke={radarColors[idx % radarColors.length]}
                  fill={radarColors[idx % radarColors.length]}
                  fillOpacity={0.25}
                />
              ))}
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* --- BAR CHART: TOP RANKED PRODUCTS BY VALUESCORE --- */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Catalog Rankings under Current Weights</h2>
          <p className="text-xs text-slate-500">
            Top 10 products sorted by overall calculated ValueScore using your active weight configuration.
          </p>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rankedProducts} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis dataKey="name" type="category" width={140} tick={{ fill: '#334155', fontSize: 11, fontWeight: 500 }} />
              <Tooltip
                formatter={(val, name, item) => [`${val} / 100 (${item.payload.band})`, 'ValueScore']}
                labelFormatter={(name, items) => items?.[0]?.payload?.fullName || name}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                {rankedProducts.map((entry, index) => {
                  let fillColor = '#059669'; // Excellent
                  if (entry.score < 50) fillColor = '#e11d48';
                  else if (entry.score < 70) fillColor = '#d97706';
                  else if (entry.score < 85) fillColor = '#2563eb';
                  return <Cell key={`cell-${index}`} fill={fillColor} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* --- SCORE BANDS & METHODOLOGY CARDS --- */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { range: '85 - 100', label: 'Excellent Value', color: 'emerald', bg: 'bg-emerald-50 border-emerald-200 text-emerald-800', desc: 'Superior price-to-feature performance with high customer rating & warranty.' },
          { range: '70 - 84', label: 'Good Value', color: 'blue', bg: 'bg-blue-50 border-blue-200 text-blue-800', desc: 'Solid all-around performer with competitive pricing relative to category standard.' },
          { range: '50 - 69', label: 'Average Value', color: 'amber', bg: 'bg-amber-50 border-amber-200 text-amber-800', desc: 'Acceptable proposition, but comparable options may offer better hardware per rupee.' },
          { range: 'Below 50', label: 'Compare Before Buying', color: 'rose', bg: 'bg-rose-50 border-rose-200 text-rose-800', desc: 'Carries a brand premium or has a higher return rate. Review alternatives.' }
        ].map(band => (
          <div key={band.range} className={`p-5 rounded-2xl border ${band.bg} space-y-2`}>
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-sm">{band.label}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white shadow-2xs">{band.range}</span>
            </div>
            <p className="text-xs opacity-90 leading-relaxed">
              {band.desc}
            </p>
          </div>
        ))}
      </section>

    </div>
  );
}
