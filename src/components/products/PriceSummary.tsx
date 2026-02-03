'use client';

import { useRoomStore } from '@/store/roomStore';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { ExternalLink, ShoppingBag } from 'lucide-react';
import { Retailer } from '@/types';

export default function PriceSummary() {
  const { furniture, getTotalCost, roomConfig } = useRoomStore();
  const totalCost = getTotalCost();

  // Group items by retailer
  const itemsByRetailer = furniture.reduce((acc, item) => {
    const retailer = item.product.retailer;
    if (!acc[retailer]) {
      acc[retailer] = [];
    }
    acc[retailer].push(item);
    return acc;
  }, {} as Record<Retailer, typeof furniture>);

  const retailerInfo: Record<Retailer, { name: string; color: string }> = {
    ikea: { name: 'IKEA', color: 'bg-blue-600 hover:bg-blue-700' },
    amazon: { name: 'Amazon', color: 'bg-orange-500 hover:bg-orange-600' },
    wayfair: { name: 'Wayfair', color: 'bg-purple-600 hover:bg-purple-700' },
  };

  const openRetailerLinks = (retailer: Retailer) => {
    const items = itemsByRetailer[retailer];
    items?.forEach((item) => {
      window.open(item.product.productUrl, '_blank');
    });
  };

  if (furniture.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <ShoppingBag className="h-5 w-5 text-primary-600" />
        Order Summary
      </h3>

      {/* Items breakdown by retailer */}
      <div className="space-y-4 mb-6">
        {Object.entries(itemsByRetailer).map(([retailer, items]) => {
          const subtotal = items.reduce((sum, item) => sum + item.product.price, 0);

          return (
            <div key={retailer} className="pb-4 border-b border-slate-100 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-700">
                  {retailerInfo[retailer as Retailer].name} ({items.length} items)
                </span>
                <span className="font-semibold text-slate-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <ul className="text-sm text-slate-500 space-y-1">
                {items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span className="truncate pr-4">{item.product.name}</span>
                    <span>{formatPrice(item.product.price)}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between py-4 border-t border-slate-200">
        <span className="text-lg font-medium text-slate-700">Total</span>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(totalCost)}
          </span>
          {roomConfig.budget > 0 && (
            <p className="text-xs text-slate-400">
              {totalCost <= roomConfig.budget ? (
                <span className="text-green-600">
                  {formatPrice(roomConfig.budget - totalCost)} under budget
                </span>
              ) : (
                <span className="text-red-500">
                  {formatPrice(totalCost - roomConfig.budget)} over budget
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Shop buttons */}
      <div className="space-y-3 mt-6">
        {Object.entries(itemsByRetailer).map(([retailer, items]) => (
          <Button
            key={retailer}
            onClick={() => openRetailerLinks(retailer as Retailer)}
            className={`w-full ${retailerInfo[retailer as Retailer].color} text-white`}
          >
            Shop {retailerInfo[retailer as Retailer].name} ({items.length})
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        ))}
      </div>

      <p className="text-xs text-slate-400 text-center mt-4">
        Clicking will open product pages in new tabs
      </p>
    </div>
  );
}
