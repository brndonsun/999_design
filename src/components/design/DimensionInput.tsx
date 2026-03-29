'use client';

import { useState, useEffect } from 'react';
import { useRoomStore } from '@/store/roomStore';
import { cn } from '@/lib/utils';
import { Ruler } from 'lucide-react';

const DEFAULTS = { width: '10', length: '12', height: '8' };

export default function DimensionInput() {
  const { roomConfig, setDimensions } = useRoomStore();
  const [values, setValues] = useState(DEFAULTS);

  // Pre-populate the store with default dimensions on mount
  useEffect(() => {
    setDimensions({ width: 10, length: 12, height: 8 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (field: 'width' | 'length' | 'height', raw: string) => {
    setValues((prev) => ({ ...prev, [field]: raw }));

    const next = {
      width: parseFloat(field === 'width' ? raw : values.width) || 0,
      length: parseFloat(field === 'length' ? raw : values.length) || 0,
      height: parseFloat(field === 'height' ? raw : values.height) || 0,
    };

    if (next.width > 0 && next.length > 0) {
      setDimensions(next);
    } else {
      setDimensions(null);
    }
  };

  const dims = roomConfig.dimensions;
  const showPreview = dims && dims.width > 0 && dims.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Ruler className="h-5 w-5 text-slate-400" />
        <label className="text-sm font-medium text-slate-700">
          Room Dimensions (feet)
        </label>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {(['width', 'length', 'height'] as const).map((field) => (
          <div key={field}>
            <label className="block text-xs text-slate-500 mb-1capitalize">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="number"
              min="1"
              max={field === 'height' ? 20 : 100}
              step="0.5"
              placeholder="—"
              value={values[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              className={cn(
                'w-full px-3 py-2 rounded-lg border',
                'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
                'text-center font-medium',
                values[field] ? 'border-slate-300' : 'border-slate-200 bg-slate-50'
              )}
            />
          </div>
        ))}
      </div>

      {/* Visual preview — only shown once width + length are entered */}
      {showPreview && (
        <div className="flex items-center justify-center py-6 bg-slate-50 rounded-lg">
          <div
            className="relative border-2 border-dashed border-slate-300 bg-white"
            style={{
              width: Math.min(dims.width * 15, 200),
              height: Math.min(dims.length * 15, 200),
            }}
          >
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-500">
              {dims.width} ft
            </span>
            <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-xs text-slate-500 rotate-90">
              {dims.length} ft
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
