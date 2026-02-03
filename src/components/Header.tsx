'use client';

import CountryToggle from './design/CountryToggle';
import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Ave999Designs</h1>
              <p className="text-xs text-slate-500">Your AI interior design tool</p>
            </div>
          </div>

          {/* Country toggle */}
          <CountryToggle />
        </div>
      </div>
    </header>
  );
}
