import { MenuItem } from './menu.types';

/**
 * Represents a customized order item in the cart
 * Mirrors Android's OrderActivity data structure
 */
export interface OrderItem {
  id: string; // Unique order item ID
  menuItem: MenuItem; // Reference to base menu item
  size: string; // "Small", "Medium", "Large", etc.
  sizeIndex: number; // Index for price lookup
  toppingsAdded: Topping[]; // Added toppings
  toppingsRemoved: Topping[]; // Removed toppings (for pizzas)
  crustType?: string; // Pizza crust selection
  comments?: string; // Special instructions
  totalPrice: number; // Total in cents
  orderSummary: string; // Human-readable summary
}

export interface Topping {
  name: string;
  price: number; // In cents
  direction: 'ADD' | 'REMOVE' | 'LEFT' | 'RIGHT'; // For half pizzas
}

/**
 * Shopping cart state
 * Mirrors Android's CheckoutActivity + SharedPreferences
 */
export interface Cart {
  items: OrderItem[];
  totalCost: number; // In cents
}
