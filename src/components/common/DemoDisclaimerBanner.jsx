import React, { useState } from 'react';
import { Info, X, Sparkles } from 'lucide-react';

export default function DemoDisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white text-xs px-4 py-2 border-b border-indigo-800/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="flex items-center gap-1 bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded-full border border-indigo-400/30 text-[10px] uppercase tracking-wider shrink-0">
            <Sparkles className="w-3 h-3 text-indigo-400" /> MBA Project Demo
          </span>
          <p className="truncate text-slate-300">
            <strong className="text-white font-medium">ShopSense AI Intelligence:</strong> Product ValueScores and Seller Profit Analytics are computed via transparent in-browser mathematical algorithms using realistic sample data.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-1 transition-colors shrink-0"
          title="Dismiss notification"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
