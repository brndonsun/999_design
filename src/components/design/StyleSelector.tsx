'use client';

import { cn } from '@/lib/utils';
import { useRoomStore } from '@/store/roomStore';
import { DESIGN_STYLES, DesignStyle } from '@/types';
import { Check } from 'lucide-react';

const styleColors: Record<DesignStyle, string> = {
  contemporary: 'from-slate-400 to-slate-600',
  traditional: 'from-amber-400 to-amber-600',
  minimalist: 'from-gray-200 to-gray-400',
  modern: 'from-blue-400 to-purple-500',
};

export default function StyleSelector() {
  const { roomConfig, setStyle } = useRoomStore();

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">
        Choose Your Style
      </label>
      <div className="grid grid-cols-2 gap-4">
        {DESIGN_STYLES.map((style) => {
          const isSelected = roomConfig.style === style.value;

          return (
            <button
              key={style.value}
              onClick={() => setStyle(style.value)}
              className={cn(
                'relative group overflow-hidden rounded-xl border-2 transition-all',
                isSelected
                  ? 'border-primary-500 ring-2 ring-primary-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              )}
            >
              {/* Gradient preview */}
              <div
                className={cn(
                  'h-24 bg-gradient-to-br',
                  styleColors[style.value]
                )}
              />

              {/* Content */}
              <div className="p-3 bg-white">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">{style.label}</h4>
                  {isSelected && (
                    <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary-500">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 text-left">
                  {style.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
