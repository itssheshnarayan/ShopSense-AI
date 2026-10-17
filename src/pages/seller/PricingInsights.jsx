import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  RotateCcw, 
  HelpCircle, 
  Info,
  DollarSign,
  Scale
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { PRODUCTS } from '../../data/products';
import { simulatePricingScenario } from '../../utils/profitCalculations';
import { formatCurrency } from '../../utils/formatCurrency';

export default function PricingInsights() {
  const [selectedProductId, setSelectedProductId] = useState('prod-1');
  const product = PRODUCTS.find(p => p.id === selectedProductId) || PRODUCTS[0];

  // Simulator Inputs
  const [proposedPrice, setProposedPrice] = useState(product.sellingPrice);
  const [unitCost, setUnitCost] = useState(product.unitCost);
  const [platformFeePct, setPlatformFeePct] = useState(product.platformFeePct || 8.0);
  const [shippingCost, setShippingCost] = useState(product.shippingCost || 150);
  const [unitsSold, setUnitsSold] = useState(product.demoUnitsSold || 50);
  const [demandElasticityPct, setDemandElasticityPct] = useState(0);

  // When changing product, reset inputs
  const handleSelectProduct = (id) => {
    const p = PRODUCTS.find(item => item.id === id);
    if (p) {
      setSelectedProductId(p.id);
      setProposedPrice(p.sellingPrice);
      setUnitCost(p.unitCost);
      setPlatformFeePct(p.platformFeePct || 8.0);
      setShippingCost(p.shippingCost || 150);
      setUnitsSold(p.demoUnitsSold || 50);
      setDemandElasticityPct(0);
    }
  };

  // Run simulation
  const simulation = useMemo(() => {
    return simulatePricingScenario({
      currentPrice: product.sellingPrice,
      unitCost,
      currentUnits: unitsSold,
      proposedPrice,
      platformFeePct,
      shippingCost,
      demandElasticityPct,
      fixedOverhead: 15000
    });
  }, [product, unitCost, unitsSold, proposedPrice, platformFeePct, shippingCost, demandElasticityPct]);

  // Generate sensitivity curve (Price vs Profit)
  const simulationCurve = useMemo(() => {
    const points = [];
    const baseP = Number(product.sellingPrice);
    const steps = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4];

    steps.forEach(step => {
      const pricePoint = Math.round(baseP * (1 + step));
      // Simplified demand delta: for every 10% price hike, demand falls 8% (elasticity = -0.8)
      const simulatedElasticity = -(step * 0.8) * 100;
      const res = simulatePricingScenario({
        currentPrice: baseP,
        unitCost,
        currentUnits: unitsSold,
        proposedPrice: pricePoint,
        platformFeePct,
        shippingCost,
        demandElasticityPct: simulatedElasticity,
        fixedOverhead: 15000
      });
      points.push({
        price: pricePoint,
        netProfit: res.proposed.netProfit,
        marginPct: res.proposed.marginPct
      });
    });
    return points;
  }, [product, unitCost, unitsSold, platformFeePct, shippingCost]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-200 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Scenario Sandbox</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Pricing & Margin Simulator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Model price elasticity, break-even selling points, and target-margin thresholds.
          </p>
        </div>

        {/* Product selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Select Product:</span>
          <select
            value={selectedProductId}
            onChange={(e) => handleSelectProduct(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-2xs outline-hidden cursor-pointer"
          >
            {PRODUCTS.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* --- SIDE-BY-SIDE CURRENT VS PROPOSED CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Current Baseline Scenario */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Baseline</span>
            <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
              Selling Price: {formatCurrency(simulation.current.price)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400">Baseline Volume</span>
              <div className="text-lg font-bold text-slate-900 mt-0.5">{simulation.current.units} Units</div>
            </div>
            <div>
              <span className="text-slate-400">Gross Revenue</span>
              <div className="text-lg font-bold text-slate-900 mt-0.5">{formatCurrency(simulation.current.revenue)}</div>
            </div>
            <div>
              <span className="text-slate-400">Total Expenses</span>
              <div className="text-lg font-bold text-slate-600 mt-0.5">{formatCurrency(simulation.current.expenses)}</div>
            </div>
            <div>
              <span className="text-slate-400">Estimated Net Profit</span>
              <div className="text-lg font-extrabold text-slate-900 mt-0.5">{formatCurrency(simulation.current.netProfit)}</div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">Net Profit Margin:</span>
            <span className="text-base font-black text-slate-900">{simulation.current.marginPct}%</span>
          </div>
        </div>

        {/* Proposed Simulation Scenario */}
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-lg border border-indigo-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Proposed Strategy</span>
            <span className="text-xs font-extrabold text-emerald-300 bg-white/10 px-2 py-0.5 rounded-full">
              Simulated Price: {formatCurrency(simulation.proposed.price)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-indigo-200">Projected Volume</span>
              <div className="text-lg font-bold text-white mt-0.5">{simulation.proposed.units} Units</div>
            </div>
            <div>
              <span className="text-indigo-200">Projected Revenue</span>
              <div className="text-lg font-bold text-white mt-0.5">{formatCurrency(simulation.proposed.revenue)}</div>
            </div>
            <div>
              <span className="text-indigo-200">Profit Impact</span>
              <div className={`text-lg font-black mt-0.5 ${
                simulation.proposed.profitDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {simulation.proposed.profitDelta >= 0 ? '+' : ''}{formatCurrency(simulation.proposed.profitDelta)}
              </div>
            </div>
            <div>
              <span className="text-indigo-200">Projected Net Profit</span>
              <div className="text-lg font-black text-white mt-0.5">{formatCurrency(simulation.proposed.netProfit)}</div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="font-semibold text-indigo-200">Projected Margin:</span>
            <div className="text-right">
              <span className="text-xl font-black text-emerald-400">{simulation.proposed.marginPct}%</span>
              <span className="text-[10px] text-indigo-300 ml-2">
                ({simulation.proposed.marginDelta >= 0 ? '+' : ''}{simulation.proposed.marginDelta}%)
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* --- CONTROLS & THRESHOLDS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sliders (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900">Adjust Scenario Variables</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Price slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Proposed Selling Price</span>
                <span className="text-indigo-600">{formatCurrency(proposedPrice)}</span>
              </div>
              <input
                type="range"
                min={Math.round(product.sellingPrice * 0.5)}
                max={Math.round(product.sellingPrice * 1.6)}
                step="500"
                value={proposedPrice}
                onChange={(e) => setProposedPrice(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Unit cost slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Procurement Unit Cost</span>
                <span className="text-slate-900">{formatCurrency(unitCost)}</span>
              </div>
              <input
                type="range"
                min={Math.round(product.unitCost * 0.5)}
                max={Math.round(product.unitCost * 1.5)}
                step="250"
                value={unitCost}
                onChange={(e) => setUnitCost(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Platform fee slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Platform Fee Rate</span>
                <span className="text-slate-900">{platformFeePct}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="18"
                step="0.5"
                value={platformFeePct}
                onChange={(e) => setPlatformFeePct(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Demand elasticity slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Demand Sensitivity Delta</span>
                <span className={`${demandElasticityPct >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {demandElasticityPct >= 0 ? '+' : ''}{demandElasticityPct}% Volume
                </span>
              </div>
              <input
                type="range"
                min="-40"
                max="40"
                step="5"
                value={demandElasticityPct}
                onChange={(e) => setDemandElasticityPct(Number(e.target.value))}
                className="w-full"
              />
            </div>

          </div>

          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            * Note: This simulation models unit gross margins and volume tradeoffs. Higher prices typically exert downward pressure on consumer conversion rates.
          </p>
        </div>

        {/* Calculated Thresholds (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Calculated Thresholds</h2>

          {/* Break-Even Price */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Break-Even Selling Price
            </span>
            <div className="text-2xl font-black text-slate-900">
              {formatCurrency(simulation.breakEvenPrice)}
            </div>
            <p className="text-[11px] text-slate-500">
              Minimum retail price required to cover COGS, platform fee ({platformFeePct}%), and shipping.
            </p>
          </div>

          {/* Target 20% Margin Price */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              Target 20% Net Margin Price
            </span>
            <div className="text-2xl font-black text-emerald-700">
              {formatCurrency(simulation.targetMarginPrice)}
            </div>
            <p className="text-[11px] text-emerald-800">
              Optimal price point to guarantee a healthy 20% net margin after all fee deductions.
            </p>
          </div>

        </div>

      </div>

      {/* --- SENSITIVITY CURVE CHART --- */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900">Profit vs Selling Price Curve</h3>
          <p className="text-xs text-slate-500">Simulating net profit response across price variations accounting for elasticity.</p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={simulationCurve} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="price" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(val, name) => [formatCurrency(val), name === 'netProfit' ? 'Net Profit' : 'Margin %']}
                labelFormatter={(price) => `Selling Price: ${formatCurrency(price)}`}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <ReferenceLine y={0} stroke="#f43f5e" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="netProfit" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

    </div>
  );
}
