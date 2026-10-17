import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, X, ArrowRight } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { PRODUCTS } from '../../data/products';

export default function CompareDrawer() {
  const { compareIds, removeFromCompare, clearCompare } = useCompare();

  if (!compareIds.length) return null;

  const comparedProducts = PRODUCTS.filter(p => compareIds.includes(p.id));

  return (
    <aside aria-label="Compare Tray" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-2xl bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/80 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        
        {/* Left Thumbnails */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mr-2 shrink-0">
            <Scale className="w-4 h-4" />
            <span>Compare ({compareIds.length}/4):</span>
          </div>

          {comparedProducts.map(prod => (
            <div key={prod.id} className="relative group shrink-0">
              <img
                src={prod.image}
                alt={prod.name}
                className="w-9 h-9 rounded-lg object-cover border border-slate-600 bg-white"
              />
              <button
                onClick={() => removeFromCompare(prod.id)}
                className="absolute -top-1 -right-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-0.5 shadow-xs"
                title={`Remove ${prod.name}`}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}

          {Array.from({ length: Math.max(0, 4 - comparedProducts.length) }).map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className="w-9 h-9 rounded-lg border border-dashed border-slate-700 flex items-center justify-center text-slate-600 text-[10px] shrink-0"
            >
              +
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearCompare}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 transition-colors"
          >
            Clear
          </button>

          <Link
            to="/compare"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            Compare Now
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </aside>
  );
}
