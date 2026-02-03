'use client';

import { useRoomStore } from '@/store/roomStore';
import { formatPrice } from '@/lib/utils';
import ProductCard from './ProductCard';
import { ShoppingCart } from 'lucide-react';

interface ProductListProps {
  onSwapClick: (furnitureId: string) => void;
}

export default function ProductList({ onSwapClick }: ProductListProps) {
  const { furniture, getTotalCost, setSelectedFurniture, selectedFurnitureId } = useRoomStore();
  const totalCost = getTotalCost();

  if (furniture.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <ShoppingCart className="h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-medium text-slate-600">No furniture yet</h3>
        <p className="text-sm text-slate-400 mt-1">
          Generate a design to see recommended furniture
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 pb-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Selected Furniture</h3>
        <p className="text-sm text-slate-500">{furniture.length} items</p>
      </div>

      {/* Product list */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {furniture.map((item) => (
          <ProductCard
            key={item.id}
            product={item.product}
            isSelected={selectedFurnitureId === item.id}
            onSelect={() => setSelectedFurniture(item.id)}
            onSwap={() => onSwapClick(item.id)}
            compact
          />
        ))}
      </div>

      {/* Total */}
      <div className="flex-shrink-0 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-600">Subtotal</span>
          <span className="text-xl font-bold text-slate-900">
            {formatPrice(totalCost)}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          * Prices shown before tax and shipping
        </p>
      </div>
    </div>
  );
}
