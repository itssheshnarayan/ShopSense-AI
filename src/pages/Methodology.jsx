import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  BarChart3, 
  Calculator, 
  CheckCircle2, 
  Info, 
  ArrowLeft,
  BookOpen,
  DollarSign
} from 'lucide-react';
import { DEFAULT_WEIGHTS, WEIGHT_LABELS } from '../utils/valueScore';
import { CATEGORY_BENCHMARKS } from '../data/benchmarks';
import { formatCurrency } from '../utils/formatCurrency';

export default function Methodology() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span>Academic Mathematical Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          ValueScore & Profit Intelligence Methodology
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Complete mathematical formulas, multi-criteria normalization functions, accounting equations, and sample calculations.
        </p>
      </div>

      {/* --- PART 1: VALUESCORE ENGINE MATHEMATICAL MODEL --- */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">1. Customer ValueScore Engine Formula</h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The <strong>ValueScore</strong> is a normalized multi-attribute composite utility index ranging from <strong>1 to 100</strong>. It represents the value received per rupee spent relative to verified category benchmarks.
        </p>

        {/* Master Weighted Formula */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl font-mono text-xs sm:text-sm overflow-x-auto">
          <code>
            ValueScore = (w₁ · S_price) + (w₂ · S_rating) + (w₃ · S_feature) + (w₄ · S_quality) + (w₅ · S_warranty)
          </code>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Default Factor Weightings (100% Total)</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {Object.entries(DEFAULT_WEIGHTS).map(([key, val]) => (
              <div key={key} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-700">{WEIGHT_LABELS[key]}</span>
                <span className="font-extrabold text-indigo-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">{val}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Component Normalizations */}
        <div className="space-y-4 pt-4 border-t border-slate-100 text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Normalization Functions (0 to 100 Scale)</h3>
          
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="font-bold text-slate-900 text-sm">A. Price Competitiveness (S_price)</span>
              <p className="text-slate-600">
                Compares product retail price \(P\) against category benchmark \(P_{bench}\):
              </p>
              <div className="font-mono bg-white p-2 rounded-xl text-slate-800 border border-slate-200">
                S_price = 60 + 0.5 × [ (P_{bench} - P) / P_{bench} × 100 ]
              </div>
              <p className="text-[11px] text-slate-500">Clamped between 15 and 98 to avoid extreme boundary artifacts.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="font-bold text-slate-900 text-sm">B. Customer Rating Component (S_rating)</span>
              <p className="text-slate-600">
                Combines star rating \(R\) (out of 5) with logarithmic review volume confidence:
              </p>
              <div className="font-mono bg-white p-2 rounded-xl text-slate-800 border border-slate-200">
                S_rating = (R / 5.0 × 80) + min(20, log10(ReviewCount + 1) × 5.5)
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="font-bold text-slate-900 text-sm">C. Feature-to-Price Assessment (S_feature)</span>
              <p className="text-slate-600">
                Measures feature density delivered per unit of currency relative to benchmark:
              </p>
              <div className="font-mono bg-white p-2 rounded-xl text-slate-800 border border-slate-200">
                S_feature = [ FeatureScore / max(0.4, (P / P_{bench})) ] × 0.88
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="font-bold text-slate-900 text-sm">D. Quality & Reliability (S_quality)</span>
              <div className="font-mono bg-white p-2 rounded-xl text-slate-800 border border-slate-200">
                S_quality = (QualityScore × 0.7) + [ 100 - (ReturnRate × 4) ] × 0.3
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="font-bold text-slate-900 text-sm">E. Warranty & Support (S_warranty)</span>
              <div className="font-mono bg-white p-2 rounded-xl text-slate-800 border border-slate-200">
                S_warranty = min(100, (WarrantyMonths / 24) × 100)
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* --- PART 2: SELLER PROFIT INTELLIGENCE ACCOUNTING MODEL --- */}
      <section id="profit-math" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <DollarSign className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900">2. Seller Profit Intelligence Accounting Model</h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The seller analytics module applies standard management accounting principles to determine unit contribution margins and net profit.
        </p>

        {/* Master Accounting Equations */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl font-mono text-xs sm:text-sm space-y-2 overflow-x-auto">
          <div>Gross Revenue = ∑ (Selling Price × Units Sold)</div>
          <div>COGS = ∑ (Unit Procurement Cost × Units Sold)</div>
          <div>Platform Fees = Gross Revenue × (Platform Fee Rate % / 100)</div>
          <div>Shipping & Fulfillment = ∑ (Unit Shipping Cost × Units Sold)</div>
          <div>Net Return Costs = Units × (Return Rate % / 100) × (0.25 × Selling Price + Unit Shipping)</div>
          <div>Operating Overhead = Gross Revenue × 0.02 (Packaging & Administration)</div>
          <div className="text-emerald-400 font-bold pt-2 border-t border-slate-700">
            Estimated Net Profit = Gross Revenue − COGS − Platform Fees − Shipping − Return Losses − Overhead
          </div>
          <div className="text-indigo-300 font-bold">
            Net Profit Margin (%) = (Estimated Net Profit ÷ Gross Revenue) × 100
          </div>
        </div>

        {/* Pricing Simulator Formulas */}
        <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Pricing Simulator Derivations</h3>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="font-bold text-slate-900 text-sm">Break-Even Retail Price Calculation</span>
            <p className="text-slate-600 leading-relaxed">
              Equating Gross Revenue to Total Costs yields the minimum threshold to avoid negative profit:
            </p>
            <div className="font-mono bg-white p-2 rounded-xl text-slate-800 border border-slate-200">
              BreakEven Price = [ UnitCost + UnitShipping + (FixedOverhead / Units) ] ÷ (1 − PlatformFeeRate)
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="font-bold text-slate-900 text-sm">Target 20% Net Margin Price Calculation</span>
            <div className="font-mono bg-white p-2 rounded-xl text-slate-800 border border-slate-200">
              Target Margin Price = [ UnitCost + UnitShipping + (FixedOverhead / Units) ] ÷ (1 − PlatformFeeRate − TargetMarginRate)
            </div>
          </div>
        </div>

      </section>

      {/* --- PART 3: STEP-BY-STEP WORKED EXAMPLE --- */}
      <section className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-4 text-xs">
        <h3 className="text-sm font-bold text-slate-900">Worked Academic Example: AuraPhone Pro 5G</h3>
        
        <div className="space-y-2 text-slate-600">
          <p>• <strong>Product:</strong> AuraPhone Pro 5G (Category: Smartphones)</p>
          <p>• <strong>Selling Price:</strong> ₹42,999 vs Category Benchmark: ₹28,500</p>
          <p>• <strong>Rating:</strong> 4.6★ (1,420 Reviews) | Feature Score: 92 | Return Rate: 3.8% | Warranty: 12M</p>
          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 font-mono">
            <div>S_price = 60 + 0.5 × ((28500 - 42999) / 28500 × 100) = 35</div>
            <div>S_rating = (4.6 / 5 × 80) + (log10(1421) × 5.5) = 73.6 + 17.3 = 91</div>
            <div>S_feature = (92 / (42999 / 28500)) × 0.88 = 91</div>
            <div>S_quality = (90 × 0.7) + (100 - (3.8 × 4)) × 0.3 = 63 + 25.4 = 88</div>
            <div>S_warranty = (12 / 24) × 100 = 50</div>
            <div className="pt-2 font-bold text-indigo-700">
              Overall ValueScore = (0.30×35) + (0.25×91) + (0.20×91) + (0.15×88) + (0.10×50) ≈ 70 ("Good Value")
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-between items-center pt-4 border-t border-slate-200">
        <Link to="/about" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600">
          <ArrowLeft className="w-4 h-4" /> About the Project
        </Link>
        <Link to="/valuescore" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800">
          Launch ValueScore Customizer →
        </Link>
      </div>

    </div>
  );
}
