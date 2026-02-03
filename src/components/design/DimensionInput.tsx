'use client';

import { useRoomStore } from '@/store/roomStore';
import { cn } from '@/lib/utils';
import { Ruler } from 'lucide-react';

export default function DimensionInput() {
  const { roomConfig, setDimensions } = useRoomStore();
  const dimensions = roomConfig.dimensions || { width: 10, length: 12, height: 8 };

  const handleChange = (field: 'width' | 'length' | 'height', value: string) => {
    const numValue = parseFloat(value) || 0;
    setDimensions({
      ...dimensions,
      [field]: numValue,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Ruler className="h-5 w-5 text-slate-400" />
        <label className="text-sm font-medium text-slate-700">
          Room Dimensions (feet)
        </label>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Width</label>
          <input
            type="number"
            min="1"
            max="100"
            step="0.5"
            value={dimensions.width}
            onChange={(e) => handleChange('width', e.target.value)}
            className={cn(
              'w-full px-3 py-2 rounded-lg border border-slate-300',
              'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
              'text-center font-medium'
            )}
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Length</label>
          <input
            type="number"
            min="1"
            max="100"
            step="0.5"
            value={dimensions.length}
            onChange={(e) => handleChange('length', e.target.value)}
            className={cn(
              'w-full px-3 py-2 rounded-lg border border-slate-300',
              'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
              'text-center font-medium'
            )}
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Height</label>
          <input
            type="number"
            min="1"
            max="20"
            step="0.5"
            value={dimensions.height || 8}
            onChange={(e) => handleChange('height', e.target.value)}
            className={cn(
              'w-full px-3 py-2 rounded-lg border border-slate-300',
              'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
              'text-center font-medium'
            )}
          />
        </div>
      </div>

      {/* Visual preview */}
      <div className="flex items-center justify-center py-6 bg-slate-50 rounded-lg">
        <div
          className="relative border-2 border-dashed border-slate-300 bg-white"
          style={{
            width: Math.min(dimensions.width * 15, 200),
            height: Math.min(dimensions.length * 15, 200),
          }}
        >
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-500">
            {dimensions.width} ft
          </span>
          <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-xs text-slate-500 rotate-90">
            {dimensions.length} ft
          </span>
        </div>
      </div>
    </div>
  );
}
