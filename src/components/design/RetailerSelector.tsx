'use client';

import { useRoomStore } from '@/store/roomStore';
import { Retailer } from '@/types';
import { cn } from '@/lib/utils';

const RETAILERS: { value: Retailer; label: string; color: string; activeClass: string }[] = [
  {
    value: 'ikea',
    label: 'IKEA',
    color: 'text-yellow-800',
    activeClass: 'bg-yellow-400 text-yellow-900 ring-1 ring-yellow-500',
  },
  {
    value: 'amazon',
    label: 'Amazon',
    color: 'text-slate-700',
    activeClass: 'bg-orange-400 text-white ring-1 ring-orange-500',
  },
  {
    value: 'wayfair',
    label: 'Wayfair',
    color: 'text-slate-700',
    activeClass: 'bg-purple-600 text-white ring-1 ring-purple-700',
  },
];

export default function RetailerSelector() {
  const { roomConfig, setRetailers } = useRoomStore();
  const selected = roomConfig.retailers;

  const toggle = (retailer: Retailer) => {
    const isSelected = selected.includes(retailer);
    if (isSelected && selected.length === 1) return; // always keep at least one
    const next = isSelected
      ? selected.filter((r) => r !== retailer)
      : [...selected, retailer];
    setRetailers(next);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">
        Shop From
      </label>
      <div className="flex flex-wrap gap-2">
        {RETAILERS.map((r) => {
          const isSelected = selected.includes(r.value);
          return (
            <button
              key={r.value}
              onClick={() => toggle(r.value)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-semibold transition-all',
                isSelected
                  ? r.activeClass
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              )}
            >
              {r.label}
            </button>
          );
        })}
      </div>
      {selected.length === 0 && (
        <p className="text-xs text-red-500">Select at least one retailer.</p>
      )}
    </div>
  );
}
