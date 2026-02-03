'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  formatValue?: (value: number) => string;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      label,
      min = 0,
      max = 100,
      step = 1,
      value,
      showValue = true,
      formatValue = (v) => String(v),
      ...props
    },
    ref
  ) => {
    const currentValue = typeof value === 'string' ? parseFloat(value) : (value as number) || min;
    const percentage = ((currentValue - min) / (max - min)) * 100;

    return (
      <div className="w-full">
        {(label || showValue) && (
          <div className="flex items-center justify-between mb-2">
            {label && (
              <label className="text-sm font-medium text-slate-700">{label}</label>
            )}
            {showValue && (
              <span className="text-sm font-semibold text-primary-600">
                {formatValue(currentValue)}
              </span>
            )}
          </div>
        )}
        <div className="relative">
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            className={cn(
              'w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer',
              '[&::-webkit-slider-thumb]:appearance-none',
              '[&::-webkit-slider-thumb]:w-5',
              '[&::-webkit-slider-thumb]:h-5',
              '[&::-webkit-slider-thumb]:rounded-full',
              '[&::-webkit-slider-thumb]:bg-primary-600',
              '[&::-webkit-slider-thumb]:border-2',
              '[&::-webkit-slider-thumb]:border-white',
              '[&::-webkit-slider-thumb]:shadow-md',
              '[&::-webkit-slider-thumb]:cursor-pointer',
              '[&::-webkit-slider-thumb]:transition-transform',
              '[&::-webkit-slider-thumb]:hover:scale-110',
              className
            )}
            style={{
              background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`,
            }}
            {...props}
          />
        </div>
      </div>
    );
  }
);

Slider.displayName = 'Slider';

export default Slider;
