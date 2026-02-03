'use client';

import { useRoomStore } from '@/store/roomStore';
import { formatPrice, getProductUrl } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { ExternalLink, ShoppingBag, ShoppingCart, Copy, Check, Square, CheckSquare } from 'lucide-react';
import { Retailer } from '@/types';
import { useState, useEffect } from 'react';

export default function PriceSummary() {
  const { furniture, getTotalCost, roomConfig } = useRoomStore();
  const [copiedList, setCopiedList] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Initialize all items as selected when furniture changes
  useEffect(() => {
    setSelectedItems(new Set(furniture.map(item => item.id)));
  }, [furniture]);

  const toggleItem = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const toggleRetailer = (retailer: Retailer) => {
    const retailerItems = furniture.filter(item => item.product.retailer === retailer);
    const allSelected = retailerItems.every(item => selectedItems.has(item.id));

    setSelectedItems(prev => {
      const newSet = new Set(prev);
      retailerItems.forEach(item => {
        if (allSelected) {
          newSet.delete(item.id);
        } else {
          newSet.add(item.id);
        }
      });
      return newSet;
    });
  };

  // Filter furniture to only selected items for calculations
  const selectedFurniture = furniture.filter(item => selectedItems.has(item.id));
  const selectedTotal = selectedFurniture.reduce((sum, item) => sum + item.product.price, 0);
  const totalCost = getTotalCost();

  // Group all items by retailer (for display)
  const itemsByRetailer = furniture.reduce((acc, item) => {
    const retailer = item.product.retailer;
    if (!acc[retailer]) {
      acc[retailer] = [];
    }
    acc[retailer].push(item);
    return acc;
  }, {} as Record<Retailer, typeof furniture>);

  // Group selected items by retailer (for checkout)
  const selectedByRetailer = selectedFurniture.reduce((acc, item) => {
    const retailer = item.product.retailer;
    if (!acc[retailer]) {
      acc[retailer] = [];
    }
    acc[retailer].push(item);
    return acc;
  }, {} as Record<Retailer, typeof furniture>);

  const retailerInfo: Record<Retailer, { name: string; color: string; bgLight: string }> = {
    ikea: { name: 'IKEA', color: 'bg-blue-600 hover:bg-blue-700', bgLight: 'bg-blue-50' },
    amazon: { name: 'Amazon', color: 'bg-orange-500 hover:bg-orange-600', bgLight: 'bg-orange-50' },
    wayfair: { name: 'Wayfair', color: 'bg-purple-600 hover:bg-purple-700', bgLight: 'bg-purple-50' },
  };

  const openRetailerLinks = (retailer: Retailer) => {
    const items = selectedByRetailer[retailer];
    if (!items || items.length === 0) return;

    // Amazon has a special "add to cart" URL format
    if (retailer === 'amazon') {
      const baseUrl = roomConfig.country === 'CA'
        ? 'https://www.amazon.ca/gp/aws/cart/add.html?'
        : 'https://www.amazon.com/gp/aws/cart/add.html?';

      const params = items.map((item, index) =>
        `ASIN.${index + 1}=${item.product.externalId}&Quantity.${index + 1}=1`
      ).join('&');

      window.open(baseUrl + params, '_blank');
      return;
    }

    // For other retailers, open each product page
    items.forEach((item) => {
      const url = getProductUrl(item.product.productUrl, item.product.retailer, roomConfig.country);
      window.open(url, '_blank');
    });
  };

  const openSingleProduct = (url: string, retailer: Retailer) => {
    const countryUrl = getProductUrl(url, retailer, roomConfig.country);
    window.open(countryUrl, '_blank');
  };

  // Copy shopping list to clipboard (only selected items)
  const copyShoppingList = () => {
    const list = selectedFurniture.map(item => {
      const url = getProductUrl(item.product.productUrl, item.product.retailer, roomConfig.country);
      return `${item.product.name} - ${formatPrice(item.product.price)}\n${url}`;
    }).join('\n\n');

    const fullText = `Ave999Designs Shopping List\n${'='.repeat(30)}\n\n${list}\n\n${'='.repeat(30)}\nTotal: ${formatPrice(selectedTotal)}`;

    navigator.clipboard.writeText(fullText);
    setCopiedList(true);
    setTimeout(() => setCopiedList(false), 2000);
  };

  if (furniture.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <ShoppingCart className="h-5 w-5 text-primary-600" />
        Shopping Cart
      </h3>

      {/* Items breakdown by retailer */}
      <div className="space-y-4 mb-6">
        {Object.entries(itemsByRetailer).map(([retailer, items]) => {
          const selectedRetailerItems = items.filter(item => selectedItems.has(item.id));
          const subtotal = selectedRetailerItems.reduce((sum, item) => sum + item.product.price, 0);
          const allSelected = items.every(item => selectedItems.has(item.id));
          const someSelected = items.some(item => selectedItems.has(item.id));
          const info = retailerInfo[retailer as Retailer];

          return (
            <div key={retailer} className={`p-4 rounded-lg ${info.bgLight}`}>
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => toggleRetailer(retailer as Retailer)}
                  className="flex items-center gap-2 font-semibold text-slate-800 hover:text-slate-900"
                >
                  {allSelected ? (
                    <CheckSquare className="h-5 w-5 text-primary-600" />
                  ) : someSelected ? (
                    <div className="h-5 w-5 border-2 border-primary-600 rounded bg-primary-100" />
                  ) : (
                    <Square className="h-5 w-5 text-slate-400" />
                  )}
                  {info.name}
                </button>
                <span className="font-bold text-slate-900">
                  {formatPrice(subtotal)}
                  {selectedRetailerItems.length < items.length && (
                    <span className="text-xs text-slate-500 ml-1">
                      ({selectedRetailerItems.length}/{items.length})
                    </span>
                  )}
                </span>
              </div>
              <ul className="space-y-2">
                {items.map((item) => {
                  const isSelected = selectedItems.has(item.id);
                  return (
                    <li
                      key={item.id}
                      className={`flex items-center justify-between rounded-md p-2 transition-colors ${
                        isSelected ? 'bg-white' : 'bg-white/50 opacity-60'
                      }`}
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="flex items-center gap-2 flex-1 min-w-0 text-left"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-primary-600 flex-shrink-0" />
                        ) : (
                          <Square className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className={`text-sm font-medium truncate ${isSelected ? 'text-slate-700' : 'text-slate-500 line-through'}`}>
                            {item.product.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatPrice(item.product.price)}
                          </p>
                        </div>
                      </button>
                      <button
                        onClick={() => openSingleProduct(item.product.productUrl, item.product.retailer)}
                        className="ml-2 p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                        title={`View on ${info.name}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between py-4 border-t border-slate-200">
        <div>
          <span className="text-lg font-medium text-slate-700">Selected Total</span>
          <p className="text-xs text-slate-500">
            {selectedFurniture.length} of {furniture.length} items
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(selectedTotal)}
          </span>
          {roomConfig.budget > 0 && (
            <p className="text-xs text-slate-400">
              {selectedTotal <= roomConfig.budget ? (
                <span className="text-green-600">
                  {formatPrice(roomConfig.budget - selectedTotal)} under budget
                </span>
              ) : (
                <span className="text-red-500">
                  {formatPrice(selectedTotal - roomConfig.budget)} over budget
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Copy shopping list */}
      <button
        onClick={copyShoppingList}
        className="w-full mt-4 py-2 px-4 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center gap-2 transition-colors"
      >
        {copiedList ? (
          <>
            <Check className="h-4 w-4 text-green-600" />
            Copied to clipboard!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy Shopping List
          </>
        )}
      </button>

      {/* Shop buttons */}
      <div className="space-y-3 mt-4">
        {Object.entries(itemsByRetailer).map(([retailer]) => {
          const selectedCount = selectedByRetailer[retailer as Retailer]?.length || 0;
          const isDisabled = selectedCount === 0;

          return (
            <Button
              key={retailer}
              onClick={() => openRetailerLinks(retailer as Retailer)}
              className={`w-full ${retailerInfo[retailer as Retailer].color} text-white ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isDisabled}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              {retailer === 'amazon'
                ? `Add to Amazon Cart (${selectedCount})`
                : `Shop ${retailerInfo[retailer as Retailer].name} Items (${selectedCount})`
              }
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 text-center mt-4">
        Amazon items can be added directly to your cart. IKEA/Wayfair open search results.
      </p>
    </div>
  );
}
