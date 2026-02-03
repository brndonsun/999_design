export type RoomType = 'bedroom' | 'living_room' | 'office' | 'den' | 'dining_room' | 'kitchen';

export type DesignStyle = 'contemporary' | 'traditional' | 'minimalist' | 'modern';

export type Retailer = 'amazon' | 'ikea' | 'wayfair';

export type Country = 'US' | 'CA';

export type FurnitureCategory =
  | 'bed'
  | 'sofa'
  | 'chair'
  | 'table'
  | 'desk'
  | 'storage'
  | 'lighting'
  | 'decor'
  | 'rug'
  | 'nightstand'
  | 'dresser'
  | 'bookshelf';

export interface RoomDimensions {
  width: number;
  length: number;
  height?: number;
}

export interface Product {
  id: string;
  retailer: Retailer;
  externalId: string;
  name: string;
  category: FurnitureCategory;
  price: number;
  currency: string;
  imageUrl: string;
  productUrl: string;
  width: number;
  depth: number;
  height?: number;
  styles: DesignStyle[];
  roomTypes: RoomType[];
  color?: string;
}

export interface FurnitureItem {
  id: string;
  product: Product;
  positionX: number;
  positionY: number;
  rotation: number;
}

export interface RoomConfig {
  type: RoomType | null;
  dimensions: RoomDimensions | null;
  style: DesignStyle | null;
  budget: number;
  country: Country;
  photoUrl?: string;
}

export interface BudgetOption {
  value: number;
  label: string;
}

export const BUDGET_OPTIONS: BudgetOption[] = [
  { value: 2000, label: '$2,000' },
  { value: 3000, label: '$3,000' },
  { value: 5000, label: '$5,000' },
  { value: 10000, label: '$10,000' },
  { value: 0, label: 'No Budget' },
];

export const ROOM_TYPES: { value: RoomType; label: string }[] = [
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'living_room', label: 'Living Room' },
  { value: 'office', label: 'Office' },
  { value: 'den', label: 'Den' },
  { value: 'dining_room', label: 'Dining Room' },
  { value: 'kitchen', label: 'Kitchen' },
];

export const DESIGN_STYLES: { value: DesignStyle; label: string; description: string }[] = [
  {
    value: 'contemporary',
    label: 'Contemporary',
    description: 'Clean lines, neutral colors, and current trends'
  },
  {
    value: 'traditional',
    label: 'Traditional',
    description: 'Classic elegance with ornate details'
  },
  {
    value: 'minimalist',
    label: 'Minimalist',
    description: 'Simple, clutter-free with essential pieces only'
  },
  {
    value: 'modern',
    label: 'Modern',
    description: 'Bold geometric shapes and innovative materials'
  },
];
