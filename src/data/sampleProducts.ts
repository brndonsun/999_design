import { Product } from '@/types';

// Multi-retailer furniture database
// Uses search URLs for reliability - direct product links often break
export const sampleProducts: Product[] = [
  // ============ IKEA PRODUCTS ============
  // BEDROOM
  {
    id: 'ikea-malm-bed',
    retailer: 'ikea',
    externalId: '890.024.32',
    name: 'MALM Bed Frame, High',
    category: 'bed',
    price: 199,
    currency: 'USD',
    productUrl: 'https://www.ikea.com/us/en/search/?q=MALM+bed+frame',
    width: 66,
    depth: 83,
    height: 15,
    styles: ['contemporary', 'minimalist'],
    roomTypes: ['bedroom'],
    color: '#f5f5f5',
  },
  {
    id: 'ikea-hemnes-bed',
    retailer: 'ikea',
    externalId: '092.108.05',
    name: 'HEMNES Bed Frame',
    category: 'bed',
    price: 249,
    currency: 'USD',
    productUrl: 'https://www.ikea.com/us/en/search/?q=HEMNES+bed+frame',
    width: 67,
    depth: 84,
    height: 26,
    styles: ['traditional', 'contemporary'],
    roomTypes: ['bedroom'],
    color: '#d4a373',
  },
  {
    id: 'ikea-hemnes-nightstand',
    retailer: 'ikea',
    externalId: '502.145.49',
    name: 'HEMNES Nightstand',
    category: 'nightstand',
    price: 79,
    currency: 'USD',
    productUrl: 'https://www.ikea.com/us/en/search/?q=HEMNES+nightstand',
    width: 18,
    depth: 14,
    height: 27,
    styles: ['traditional', 'contemporary'],
    roomTypes: ['bedroom'],
    color: '#ffffff',
  },
  {
    id: 'ikea-malm-dresser',
    retailer: 'ikea',
    externalId: '002.392.38',
    name: 'MALM 6-Drawer Dresser',
    category: 'dresser',
    price: 179,
    currency: 'USD',
    productUrl: 'https://www.ikea.com/us/en/search/?q=MALM+dresser',
    width: 63,
    depth: 19,
    height: 31,
    styles: ['contemporary', 'minimalist'],
    roomTypes: ['bedroom'],
    color: '#ffffff',
  },
  {
    id: 'ikea-kallax-shelf',
    retailer: 'ikea',
    externalId: '802.758.85',
    name: 'KALLAX Shelf Unit',
    category: 'bookshelf',
    price: 49,
    currency: 'USD',
    productUrl: 'https://www.ikea.com/us/en/search/?q=KALLAX+shelf',
    width: 57,
    depth: 15,
    height: 57,
    styles: ['modern', 'minimalist', 'contemporary'],
    roomTypes: ['office', 'living_room', 'bedroom'],
    color: '#ffffff',
  },

  // LIVING ROOM
  {
    id: 'ikea-kivik-sofa',
    retailer: 'ikea',
    externalId: '094.405.89',
    name: 'KIVIK Sofa',
    category: 'sofa',
    price: 499,
    currency: 'USD',
    productUrl: 'https://www.ikea.com/us/en/search/?q=KIVIK+sofa',
    width: 90,
    depth: 37,
    height: 32,
    styles: ['contemporary', 'modern'],
    roomTypes: ['living_room', 'den'],
    color: '#6b7280',
  },
  {
    id: 'ikea-lack-coffee',
    retailer: 'ikea',
    externalId: '704.499.97',
    name: 'LACK Coffee Table',
    category: 'table',
    price: 19,
    currency: 'USD',
    productUrl: 'https://www.ikea.com/us/en/search/?q=LACK+coffee+table',
    width: 35,
    depth: 22,
    height: 18,
    styles: ['minimalist', 'modern'],
    roomTypes: ['living_room', 'den'],
    color: '#ffffff',
  },
  {
    id: 'ikea-besta-tv',
    retailer: 'ikea',
    externalId: '702.432.97',
    name: 'BESTA TV Unit',
    category: 'storage',
    price: 99,
    currency: 'USD',
    productUrl: 'https://www.ikea.com/us/en/search/?q=BESTA+TV+unit',
    width: 47,
    depth: 16,
    height: 15,
    styles: ['contemporary', 'minimalist'],
    roomTypes: ['living_room', 'den'],
    color: '#ffffff',
  },
  {
    id: 'ikea-poang-chair',
    retailer: 'ikea',
    externalId: '292.408.19',
    name: 'POANG Armchair',
    category: 'chair',
    price: 99,
    currency: 'USD',
    productUrl: 'https://www.ikea.com/us/en/search/?q=POANG+armchair',
    width: 27,
    depth: 32,
    height: 39,
    styles: ['modern', 'contemporary'],
    roomTypes: ['living_room', 'bedroom', 'den'],
    color: '#d4a373',
  },
  {
    id: 'ikea-hektar-lamp',
    retailer: 'ikea',
    externalId: '301.841.73',
    name: 'HEKTAR Floor Lamp',
    category: 'lighting',
    price: 49,
    currency: 'USD',
    productUrl: 'https://www.ikea.com/us/en/search/?q=HEKTAR+floor+lamp',
    width: 12,
    depth: 12,
    height: 71,
    styles: ['contemporary', 'modern'],
    roomTypes: ['living_room', 'bedroom', 'office'],
    color: '#4a4a4a',
  },

  // OFFICE
  {
    id: 'ikea-bekant-desk',
    retailer: 'ikea',
    externalId: '291.335.59',
    name: 'BEKANT Desk',
    category: 'desk',
    price: 249,
    currency: 'USD',
    productUrl: 'https://www.ikea.com/us/en/search/?q=BEKANT+desk',
    width: 63,
    depth: 31,
    height: 30,
    styles: ['modern', 'minimalist'],
    roomTypes: ['office'],
    color: '#ffffff',
  },
  {
    id: 'ikea-markus-chair',
    retailer: 'ikea',
    externalId: '203.904.22',
    name: 'MARKUS Office Chair',
    category: 'chair',
    price: 169,
    currency: 'USD',
    productUrl: 'https://www.ikea.com/us/en/search/?q=MARKUS+office+chair',
    width: 24,
    depth: 24,
    height: 52,
    styles: ['modern', 'contemporary'],
    roomTypes: ['office'],
    color: '#4a4a4a',
  },
  {
    id: 'ikea-micke-desk',
    retailer: 'ikea',
    externalId: '204.792.53',
    name: 'MICKE Desk',
    category: 'desk',
    price: 69,
    currency: 'USD',
    productUrl: 'https://www.ikea.com/us/en/search/?q=MICKE+desk',
    width: 41,
    depth: 20,
    height: 30,
    styles: ['modern', 'minimalist'],
    roomTypes: ['bedroom', 'office'],
    color: '#ffffff',
  },

  // ============ WAYFAIR PRODUCTS ============
  {
    id: 'wayfair-sectional',
    retailer: 'wayfair',
    externalId: 'W003246807',
    name: 'Reversible Sectional Sofa',
    category: 'sofa',
    price: 449,
    currency: 'USD',
    productUrl: 'https://www.wayfair.com/keyword.html?keyword=reversible+sectional+sofa',
    width: 80,
    depth: 60,
    height: 34,
    styles: ['modern', 'contemporary'],
    roomTypes: ['living_room', 'den'],
    color: '#374151',
  },
  {
    id: 'wayfair-platform-bed',
    retailer: 'wayfair',
    externalId: 'W006081142',
    name: 'Upholstered Platform Bed',
    category: 'bed',
    price: 259,
    currency: 'USD',
    productUrl: 'https://www.wayfair.com/keyword.html?keyword=upholstered+platform+bed',
    width: 64,
    depth: 86,
    height: 45,
    styles: ['modern', 'contemporary'],
    roomTypes: ['bedroom'],
    color: '#6b7280',
  },
  {
    id: 'wayfair-coffee-table',
    retailer: 'wayfair',
    externalId: 'W001793067',
    name: 'Coffee Table with Storage',
    category: 'table',
    price: 129,
    currency: 'USD',
    productUrl: 'https://www.wayfair.com/keyword.html?keyword=coffee+table+with+storage',
    width: 44,
    depth: 22,
    height: 18,
    styles: ['modern', 'contemporary'],
    roomTypes: ['living_room', 'den'],
    color: '#92400e',
  },
  {
    id: 'wayfair-accent-chair',
    retailer: 'wayfair',
    externalId: 'W002056447',
    name: 'Velvet Accent Chair',
    category: 'chair',
    price: 179,
    currency: 'USD',
    productUrl: 'https://www.wayfair.com/keyword.html?keyword=velvet+accent+chair',
    width: 30,
    depth: 32,
    height: 33,
    styles: ['modern', 'contemporary', 'traditional'],
    roomTypes: ['living_room', 'bedroom', 'den'],
    color: '#1e3a5f',
  },
  {
    id: 'wayfair-bookcase',
    retailer: 'wayfair',
    externalId: 'W001321234',
    name: 'Ladder Bookcase',
    category: 'bookshelf',
    price: 89,
    currency: 'USD',
    productUrl: 'https://www.wayfair.com/keyword.html?keyword=ladder+bookcase',
    width: 24,
    depth: 15,
    height: 72,
    styles: ['modern', 'contemporary', 'minimalist'],
    roomTypes: ['office', 'living_room'],
    color: '#d4a373',
  },
  {
    id: 'wayfair-area-rug',
    retailer: 'wayfair',
    externalId: 'W003901245',
    name: 'Geometric Area Rug',
    category: 'rug',
    price: 99,
    currency: 'USD',
    productUrl: 'https://www.wayfair.com/keyword.html?keyword=geometric+area+rug',
    width: 96,
    depth: 120,
    height: 0,
    styles: ['modern', 'contemporary'],
    roomTypes: ['living_room', 'bedroom', 'dining_room'],
    color: '#e5e7eb',
  },

  // ============ AMAZON PRODUCTS ============
  {
    id: 'amazon-platform-bed',
    retailer: 'amazon',
    externalId: 'B08L3X8KYH',
    name: 'Zinus Platform Bed Frame',
    category: 'bed',
    price: 139,
    currency: 'USD',
    productUrl: 'https://www.amazon.com/s?k=Zinus+platform+bed+frame',
    width: 60,
    depth: 80,
    height: 14,
    styles: ['modern', 'minimalist'],
    roomTypes: ['bedroom'],
    color: '#4a4a4a',
  },
  {
    id: 'amazon-nightstand',
    retailer: 'amazon',
    externalId: 'B07Q7PMBXD',
    name: 'Nathan James Nightstand',
    category: 'nightstand',
    price: 59,
    currency: 'USD',
    productUrl: 'https://www.amazon.com/s?k=Nathan+James+nightstand',
    width: 16,
    depth: 14,
    height: 20,
    styles: ['modern', 'minimalist'],
    roomTypes: ['bedroom'],
    color: '#d4a373',
  },
  {
    id: 'amazon-sofa',
    retailer: 'amazon',
    externalId: 'B0BVWLZ1J8',
    name: 'Rivet Revolve Modern Sofa',
    category: 'sofa',
    price: 699,
    currency: 'USD',
    productUrl: 'https://www.amazon.com/s?k=Rivet+Revolve+modern+sofa',
    width: 80,
    depth: 34,
    height: 33,
    styles: ['modern', 'contemporary'],
    roomTypes: ['living_room', 'den'],
    color: '#78716c',
  },
  {
    id: 'amazon-desk-chair',
    retailer: 'amazon',
    externalId: 'B09WMXQZX2',
    name: 'Ergonomic Office Chair',
    category: 'chair',
    price: 109,
    currency: 'USD',
    productUrl: 'https://www.amazon.com/s?k=ergonomic+office+chair',
    width: 24,
    depth: 24,
    height: 34,
    styles: ['modern', 'contemporary'],
    roomTypes: ['bedroom', 'office'],
    color: '#1f2937',
  },
  {
    id: 'amazon-standing-desk',
    retailer: 'amazon',
    externalId: 'B08CB4Y3L5',
    name: 'Electric Standing Desk',
    category: 'desk',
    price: 279,
    currency: 'USD',
    productUrl: 'https://www.amazon.com/s?k=electric+standing+desk',
    width: 55,
    depth: 28,
    height: 48,
    styles: ['modern', 'minimalist'],
    roomTypes: ['office'],
    color: '#ffffff',
  },
  {
    id: 'amazon-bookcase',
    retailer: 'amazon',
    externalId: 'B07F66KMG5',
    name: 'Nathan James Theo Bookcase',
    category: 'bookshelf',
    price: 79,
    currency: 'USD',
    productUrl: 'https://www.amazon.com/s?k=Nathan+James+Theo+bookcase',
    width: 24,
    depth: 12,
    height: 72,
    styles: ['modern', 'contemporary'],
    roomTypes: ['office', 'living_room'],
    color: '#d4a373',
  },
  {
    id: 'amazon-floor-lamp',
    retailer: 'amazon',
    externalId: 'B07GVBTRLK',
    name: 'Brightech Arc Floor Lamp',
    category: 'lighting',
    price: 59,
    currency: 'USD',
    productUrl: 'https://www.amazon.com/s?k=Brightech+arc+floor+lamp',
    width: 15,
    depth: 15,
    height: 69,
    styles: ['modern', 'contemporary', 'minimalist'],
    roomTypes: ['living_room', 'bedroom'],
    color: '#fbbf24',
  },
  {
    id: 'amazon-area-rug',
    retailer: 'amazon',
    externalId: 'B07KX1WQZH',
    name: 'Safavieh Modern Rug',
    category: 'rug',
    price: 89,
    currency: 'USD',
    productUrl: 'https://www.amazon.com/s?k=Safavieh+modern+rug',
    width: 60,
    depth: 96,
    height: 0,
    styles: ['contemporary', 'modern'],
    roomTypes: ['bedroom', 'living_room'],
    color: '#d1d5db',
  },
  {
    id: 'amazon-tv-stand',
    retailer: 'amazon',
    externalId: 'B08LMZW4ZP',
    name: 'Walker Edison TV Stand',
    category: 'storage',
    price: 129,
    currency: 'USD',
    productUrl: 'https://www.amazon.com/s?k=Walker+Edison+TV+stand',
    width: 58,
    depth: 16,
    height: 24,
    styles: ['modern', 'contemporary'],
    roomTypes: ['living_room', 'den'],
    color: '#78350f',
  },

  // ============ DINING ROOM ============
  {
    id: 'ikea-dining-table',
    retailer: 'ikea',
    externalId: '893.117.73',
    name: 'LISABO Dining Table',
    category: 'table',
    price: 149,
    currency: 'USD',
    productUrl: 'https://www.ikea.com/us/en/search/?q=LISABO+dining+table',
    width: 55,
    depth: 30,
    height: 29,
    styles: ['contemporary', 'modern', 'minimalist'],
    roomTypes: ['dining_room', 'kitchen'],
    color: '#d4a373',
  },
  {
    id: 'ikea-dining-chair',
    retailer: 'ikea',
    externalId: '003.608.77',
    name: 'ODGER Chair',
    category: 'chair',
    price: 69,
    currency: 'USD',
    productUrl: 'https://www.ikea.com/us/en/search/?q=ODGER+chair',
    width: 18,
    depth: 20,
    height: 32,
    styles: ['contemporary', 'modern', 'minimalist'],
    roomTypes: ['dining_room', 'kitchen'],
    color: '#f5f5f4',
  },
  {
    id: 'wayfair-dining-set',
    retailer: 'wayfair',
    externalId: 'W004567890',
    name: '5-Piece Dining Set',
    category: 'table',
    price: 299,
    currency: 'USD',
    productUrl: 'https://www.wayfair.com/keyword.html?keyword=5+piece+dining+set',
    width: 48,
    depth: 30,
    height: 30,
    styles: ['contemporary', 'traditional'],
    roomTypes: ['dining_room'],
    color: '#78350f',
  },
];

// Get products filtered by room type, style, and budget
// Returns a curated selection that aims to use the budget well
export function getRecommendedProducts(
  roomType: string,
  style: string,
  maxBudget: number
): Product[] {
  // Get all matching products
  const allMatching = sampleProducts.filter((product) => {
    const matchesRoom = product.roomTypes.includes(roomType as any);
    const matchesStyle = product.styles.includes(style as any);
    return matchesRoom && matchesStyle;
  });

  // Define essential categories per room type
  const essentialCategories: Record<string, string[]> = {
    bedroom: ['bed', 'nightstand', 'dresser', 'lighting', 'rug', 'chair'],
    living_room: ['sofa', 'table', 'chair', 'lighting', 'rug', 'storage', 'bookshelf'],
    office: ['desk', 'chair', 'bookshelf', 'lighting', 'storage'],
    den: ['sofa', 'chair', 'table', 'lighting', 'rug', 'storage'],
    dining_room: ['table', 'chair', 'lighting', 'storage', 'rug'],
    kitchen: ['table', 'chair', 'lighting', 'storage'],
  };

  const categories = essentialCategories[roomType] || ['sofa', 'chair', 'table', 'lighting'];
  const selected: Product[] = [];
  const usedIds = new Set<string>();
  let totalSpent = 0;

  // First pass: get one item from each essential category
  for (const category of categories) {
    const inCategory = allMatching.filter(
      (p) => p.category === category && !usedIds.has(p.id)
    );

    if (inCategory.length > 0) {
      // Sort by price descending to prefer higher quality items
      const sorted = inCategory.sort((a, b) => b.price - a.price);

      // Find the best item that fits the remaining budget
      const remaining = maxBudget === 0 ? Infinity : maxBudget - totalSpent;
      const fits = sorted.filter((p) => p.price <= remaining);

      if (fits.length > 0) {
        const pick = fits[0];
        selected.push(pick);
        usedIds.add(pick.id);
        totalSpent += pick.price;
      }
    }
  }

  // Second pass: add more items if budget allows (aim for 60%+ budget usage)
  const targetSpend = maxBudget === 0 ? Infinity : maxBudget * 0.6;

  if (totalSpent < targetSpend) {
    // Add secondary items from any category
    const remaining = allMatching
      .filter((p) => !usedIds.has(p.id))
      .sort((a, b) => b.price - a.price);

    for (const product of remaining) {
      if (totalSpent >= targetSpend) break;

      const budgetRemaining = maxBudget === 0 ? Infinity : maxBudget - totalSpent;
      if (product.price <= budgetRemaining) {
        selected.push(product);
        usedIds.add(product.id);
        totalSpent += product.price;
      }
    }
  }

  // Add nightstands in pairs for bedroom
  if (roomType === 'bedroom') {
    const nightstands = selected.filter((p) => p.category === 'nightstand');
    if (nightstands.length === 1) {
      const another = allMatching.find(
        (p) => p.category === 'nightstand' && !usedIds.has(p.id) &&
        (maxBudget === 0 || p.price <= maxBudget - totalSpent)
      );
      if (another) {
        selected.push(another);
        usedIds.add(another.id);
        totalSpent += another.price;
      }
    }
  }

  return selected;
}

// Get alternative products for a given product
export function getAlternatives(
  currentProduct: Product,
  maxBudget: number
): Product[] {
  return sampleProducts.filter((product) => {
    const sameCategory = product.category === currentProduct.category;
    const differentProduct = product.id !== currentProduct.id;
    const withinBudget = maxBudget === 0 || product.price <= maxBudget;
    return sameCategory && differentProduct && withinBudget;
  });
}

// Get products by category
export function getProductsByCategory(
  category: string,
  style?: string,
  maxBudget?: number
): Product[] {
  return sampleProducts.filter((product) => {
    const matchesCategory = product.category === category;
    const matchesStyle = !style || product.styles.includes(style as any);
    const withinBudget = !maxBudget || maxBudget === 0 || product.price <= maxBudget;
    return matchesCategory && matchesStyle && withinBudget;
  });
}
