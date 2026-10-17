import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-xs font-black text-2xl">
        404
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-black text-slate-900">Page Not Found</h1>
        <p className="text-xs text-slate-500">
          The page or product you are looking for doesn't exist or has moved.
        </p>
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-xs hover:bg-indigo-700 transition-colors"
        >
          <Home className="w-4 h-4" /> Go to Homepage
        </Link>
        <Link
          to="/products"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
        >
          <Search className="w-4 h-4" /> Browse Catalog
        </Link>
      </div>
    </div>
  );
}
