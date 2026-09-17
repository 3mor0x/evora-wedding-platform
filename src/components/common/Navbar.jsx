import React from 'react';
import { Link } from 'react-router-dom';
import { CircleDot, Plus } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center bg-slate-50">
            <CircleDot className="w-4 h-4 text-slate-800" />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-sm font-bold tracking-tight text-slate-900">
              إيفورا | Evora
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
              Digital Wedding Invitations
            </span>
          </div>
        </Link>

        <Link
          to="/order"
          className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>طلب تصميم خاص</span>
        </Link>
      </div>
    </header>
  );
}