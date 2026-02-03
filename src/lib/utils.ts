import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
