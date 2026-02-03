'use client';

import { useRoomStore } from '@/store/roomStore';
import { BUDGET_OPTIONS } from '@/types';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';
import Slider from '@/components/ui/Slider';
import { useState } from 'react';

export default function BudgetSelector() {
  const { roomConfig, setBudget } = useRoomStore();
  const [isCustom, setIsCustom] = useState(false);

  const handlePresetClick = (value: number) => {
    setIsCustom(false);
    setBudget(value);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudget(parseInt(e.target.value, 10));
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-slate-700">
        Set Your Budget
      </label>

      {/* Preset options */}
      <div className="flex flex-wrap gap-2">
        {BUDGET_OPTIONS.map((option) => {
          const isSelected = !isCustom && roomConfig.budget === option.value;

          return (
            <button
              key={option.value}
              onClick={() => handlePresetClick(option.value)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                isSelected
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              )}
            >
              {option.label}
            </button>
          );
        })}
        <button
          onClick={() => setIsCustom(true)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all',
            isCustom
              ? 'bg-primary-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          )}
        >
          Custom
        </button>
      </div>

      {/* Custom slider */}
      {isCustom && (
        <div className="pt-2 animate-slide-up">
          <Slider
            min={500}
            max={25000}
            step={500}
            value={roomConfig.budget}
            onChange={handleCustomChange}
            formatValue={(v) => formatPrice(v)}
            showValue
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>$500</span>
            <span>$25,000</span>
          </div>
        </div>
      )}

      {/* Display selected budget */}
      <div className="text-center py-4 bg-slate-50 rounded-lg">
        <p className="text-sm text-slate-500">Your budget</p>
        <p className="text-2xl font-bold text-primary-600">
          {roomConfig.budget === 0 ? 'No Limit' : formatPrice(roomConfig.budget)}
        </p>
      </div>
    </div>
  );
}
