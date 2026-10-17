import React from 'react';
import { getScoreBand } from '../../utils/valueScore';
import { Sparkles } from 'lucide-react';

export default function ValueScoreBadge({ score, size = 'md', showLabel = true, className = '' }) {
  if (score === null || score === undefined || isNaN(score)) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-500 font-medium border border-slate-200">
        N/A
      </span>
    );
  }

  const band = getScoreBand(score);

  if (size === 'sm') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${band.bgClass} ${className}`}>
        <Sparkles className="w-3 h-3 shrink-0" />
        <span>{score}</span>
        {showLabel && <span className="hidden sm:inline font-normal">| {band.label}</span>}
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`inline-flex items-center gap-3 px-3.5 py-1.5 rounded-xl border ${band.bgClass} ${className}`}>
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white shadow-sm font-bold text-lg text-slate-800">
          {score}
        </div>
        <div>
          <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            ValueScore
          </div>
          <div className="text-sm font-semibold text-slate-900">{band.label}</div>
        </div>
      </div>
    );
  }

  // Default 'md'
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border shadow-xs ${band.bgClass} ${className}`}>
      <span className="flex items-center justify-center w-5 h-5 rounded-md bg-white/90 text-slate-800 font-bold text-[11px] shadow-2xs">
        {score}
      </span>
      <span className="font-medium text-slate-800">
        ValueScore: <strong className="font-semibold">{showLabel ? band.label : score}</strong>
      </span>
    </div>
  );
}
