'use client';

import { Product, Country } from '@/types';
import { formatPrice, getProductUrl } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { ExternalLink, RefreshCw } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isSelected?: boolean;
  onSelect?: () => void;
  onSwap?: () => void;
  compact?: boolean;
  country?: Country;
}

export default function ProductCard({
  product,
  isSelected,
  onSelect,
  onSwap,
  compact = false,
  country = 'US',
}: ProductCardProps) {
  const productUrl = getProductUrl(product.productUrl, product.retailer, country);
  const retailerColors: Record<string, string> = {
    ikea: 'bg-blue-100 text-blue-700',
    amazon: 'bg-orange-100 text-orange-700',
    wayfair: 'bg-purple-100 text-purple-700',
  };

  if (compact) {
    return (
      <div
        onClick={onSelect}
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer',
          isSelected
            ? 'border-primary-500 bg-primary-50'
            : 'border-slate-200 hover:border-slate-300 bg-white'
        )}
      >
        {/* Product color swatch */}
        <div
          className="w-12 h-12 rounded-lg flex-shrink-0"
          style={{ backgroundColor: product.color || '#e2e8f0' }}
        />

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-slate-900 truncate">
            {product.name}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn('text-xs px-2 py-0.5 rounded-full', retailerColors[product.retailer])}>
              {product.retailer.toUpperCase()}
            </span>
            <span className="text-sm font-semibold text-primary-600">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>

        {onSwap && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSwap();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            title="Find alternatives"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={onSelect}
      className={cn(
        'rounded-xl border overflow-hidden transition-all cursor-pointer',
        isSelected
          ? 'border-primary-500 ring-2 ring-primary-500/20'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
      )}
    >
      {/* Product color swatch */}
      <div
        className="h-32 w-full"
        style={{ backgroundColor: product.color || '#e2e8f0' }}
      />

      <div className="p-4">
        {/* Retailer badge */}
        <span className={cn('text-xs px-2 py-1 rounded-full', retailerColors[product.retailer])}>
          {product.retailer.toUpperCase()}
        </span>

        {/* Product name */}
        <h4 className="mt-2 font-medium text-slate-900 line-clamp-2">
          {product.name}
        </h4>

        {/* Dimensions */}
        <p className="mt-1 text-xs text-slate-500">
          {product.width}" W x {product.depth}" D
          {product.height && ` x ${product.height}" H`}
        </p>

        {/* Price and actions */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>

          <a
            href={productUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600"
          >
            View <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
