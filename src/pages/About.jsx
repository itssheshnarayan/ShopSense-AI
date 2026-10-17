import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  BarChart3, 
  Award, 
  BookOpen, 
  Cpu, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Database
} from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100">
          <Award className="w-3.5 h-3.5 text-indigo-600" />
          <span>MBA Final-Year Project • IT & Business Analytics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          About ShopSense AI
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Bridging Consumer Decision-Making and Merchant Profitability Through Transparent Business Intelligence.
        </p>
      </div>

      {/* Core Concept Overview */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" /> Project Concept & Objectives
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Contemporary e-commerce platforms like Amazon and Flipkart typically optimize for gross merchandise value (GMV) and consumer conversion, frequently leaving customers overwhelmed by deceptive discounts and leaving third-party merchants vulnerable to hidden fees and return logistics losses.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          <strong>ShopSense AI</strong> was engineered as an MBA final-year research prototype to demonstrate how applied data analytics and decision science can simultaneously solve both challenges through:
        </p>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-700 pl-4 list-disc">
          <li>
            <strong>ValueScore Engine:</strong> A multi-attribute decision model (0–100) combining benchmark price competitiveness, credibility-weighted customer reviews, feature-to-price ratios, return reliability, and manufacturer warranties into an explainable score.
          </li>
          <li>
            <strong>Seller Profit Intelligence Engine:</strong> An operational accounting ledger revealing the true net margins behind sales volume after deducting COGS, marketplace commissions, shipping overheads, and reverse logistics costs.
          </li>
        </ul>
      </section>

      {/* Demo Intelligence vs Black-Box AI */}
      <section className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold">Transparent Algorithms vs Opaque AI</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Unlike proprietary recommendation algorithms that use opaque black-box machine learning models, ShopSense AI is built on <strong>explainable, deterministic decision science</strong>. 
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="font-bold text-amber-300">Customer Transparency</span>
            <p className="text-slate-300">
              Shoppers can inspect every component score, customize factor weights, and understand the exact rationale behind a product’s rating.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="font-bold text-emerald-300">Seller Unit Economics</span>
            <p className="text-slate-300">
              Sellers simulate pricing elasticity, test break-even selling points, and detect margin compression before committing warehouse capital.
            </p>
          </div>
        </div>
      </section>

      {/* Limitations of Sample Mock Data */}
      <section className="bg-amber-50 rounded-3xl p-6 sm:p-8 border border-amber-200/80 space-y-4 text-xs text-amber-900">
        <h3 className="text-sm font-bold flex items-center gap-2 text-amber-900">
          <ShieldCheck className="w-4 h-4 text-amber-700" /> Prototype Limitations & Assumptions
        </h3>
        <p className="leading-relaxed">
          This system is an academic proof-of-concept. The 32+ products, historical transaction records, customer reviews, and fulfillment fees are grounded in simulated JavaScript datasets designed to demonstrate realistic retail dynamics. All calculations run client-side in the browser.
        </p>
        <p className="leading-relaxed">
          Product quality, return rates, and customer sentiment have not been verified by third-party testing laboratories.
        </p>
      </section>

      {/* Future Scope */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" /> Future Scope & Commercial Roadmap
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <strong className="text-slate-800">1. Production Microservices Architecture</strong>
            <p>Transition from client-side state to a distributed backend (Node.js/FastAPI + PostgreSQL/BigQuery) with OAuth2 user sessions.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <strong className="text-slate-800">2. Real-Time Marketplace Scrapers</strong>
            <p>Ingest live competitive price feeds across Amazon, Flipkart, and Croma using automated scrapers to calibrate category benchmarks.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <strong className="text-slate-800">3. Predictive Demand ML Models</strong>
            <p>Replace rule-based elasticity with regression models (XGBoost/LSTM) trained on seasonal Indian holiday surges (Diwali, Big Billion Days).</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <strong className="text-slate-800">4. Live Payment Gateway Integration</strong>
            <p>Integrate Razorpay / Stripe for real UPI payments, webhooks, and automatic tax invoicing compliance (GST e-Invoicing).</p>
          </div>
        </div>
      </section>

      {/* Bottom Nav CTA */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-200">
        <Link to="/" className="text-xs font-bold text-slate-600 hover:text-indigo-600">
          ← Back to Homepage
        </Link>
        <Link to="/methodology" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800">
          Inspect Mathematical Methodology <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
