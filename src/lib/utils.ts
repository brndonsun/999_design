import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Country, Retailer } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// Convert feet to pixels for canvas (1 foot = 30 pixels)
export function feetToPixels(feet: number): number {
  return feet * 30;
}

// Convert pixels to feet
export function pixelsToFeet(pixels: number): number {
  return pixels / 30;
}

// Convert inches to pixels (for furniture dimensions)
export function inchesToPixels(inches: number): number {
  return (inches / 12) * 30;
}

// Generate country-specific product URL
export function getProductUrl(baseUrl: string, retailer: Retailer, country: Country): string {
  if (country === 'CA') {
    switch (retailer) {
      case 'ikea':
        // Change /us/en/ to /ca/en/
        return baseUrl.replace('ikea.com/us/en/', 'ikea.com/ca/en/');
      case 'amazon':
        // Change amazon.com to amazon.ca
        return baseUrl.replace('amazon.com', 'amazon.ca');
      case 'wayfair':
        // Change wayfair.com to wayfair.ca
        return baseUrl.replace('wayfair.com', 'wayfair.ca');
      default:
        return baseUrl;
    }
  }
  return baseUrl;
}
