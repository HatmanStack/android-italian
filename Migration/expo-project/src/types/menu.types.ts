/**
 * Represents a single menu item
 * Mirrors Android's ItemLists.java data structure
 */
export interface MenuItem {
  id: string; // Unique identifier
  title: string; // Item name (e.g., "Mobster Pizza")
  description: string; // Item description
  image: any; // require() asset
  category: MenuCategory; // Category enum
  position: number; // Position in category (for price lookup)
}

export enum MenuCategory {
  PIZZA = 'pizza',
  SANDWICHES = 'sandwiches',
  PASTA = 'pasta',
  APPETIZERS = 'appetizers',
  DESSERTS = 'desserts',
  SALADS = 'salads',
}

/**
 * Price arrays mapped by category and size
 * Mirrors Android's resource arrays (R.array.signature_price, etc.)
 */
export interface PriceArrays {
  signature_price: number[]; // [small, medium, large, xlarge]
  specialty_price: number[];
  create_your_own_price: number[];
  sandwich_price: number[];
  appetizer_small_price: number[];
  appetizer_medium_price: number[];
  appetizer_large_price: number[];
  pasta_individual_price: number[];
  pasta_family_price: number[];
  topping_price_add: number[]; // By size
  topping_price_remove: number[]; // By size
  crust_price: number[];
  salad_price: number[];
  desert_price: number[];
}

export type PriceArrayKey = keyof PriceArrays;
