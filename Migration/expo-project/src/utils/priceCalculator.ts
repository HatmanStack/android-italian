import { MenuItem, MenuCategory } from '../types/menu.types';
import { priceArrays } from '../data/priceArrays';
import { Topping } from '../types/order.types';

/**
 * Price Calculator Utility
 * Mirrors Android OrderActivity.java price calculation logic
 * All prices in cents (integers)
 */
export class PriceCalculator {
  /**
   * Get base price for a menu item at a specific size
   *
   * @param item - The menu item
   * @param sizeIndex - Index of the size (0 = smallest, 4 = largest)
   * @returns Price in cents
   */
  static getBasePrice(item: MenuItem, sizeIndex: number): number {
    const { category, position } = item;

    switch (category) {
      case MenuCategory.PIZZA:
        return this.getPizzaPrice(position, sizeIndex);

      case MenuCategory.SANDWICHES:
        return priceArrays.sandwich_price[position] || 0;

      case MenuCategory.PASTA:
        // Pasta has 2 sizes: Individual (0) and Family (1)
        if (sizeIndex === 0) {
          return priceArrays.pasta_individual_price[position] || 0;
        } else {
          return priceArrays.pasta_family_price[position] || 0;
        }

      case MenuCategory.APPETIZERS:
        return this.getAppetizerPrice(position, sizeIndex);

      case MenuCategory.DESSERTS:
        // Desserts have 4 sizes except the cookie
        if (position === 3) {
          // Normous Cookie has only one price
          return 999; // From arrays.xml cookie_price
        }
        return priceArrays.desert_price[sizeIndex] || 0;

      case MenuCategory.SALADS:
        return priceArrays.salad_price[position] || 0;

      default:
        return 0;
    }
  }

  /**
   * Get pizza price based on position and size
   * Signature pizzas (positions 0-20) vs Create Your Own (position 21) vs Calzone (position 22)
   */
  private static getPizzaPrice(position: number, sizeIndex: number): number {
    // Create Your Own (position 21)
    if (position === 21) {
      return priceArrays.create_your_own_price[sizeIndex] || 0;
    }

    // Calzone (position 22)
    if (position === 22) {
      // Calzone has only 2 sizes
      return sizeIndex === 0 ? 899 : 1499; // From arrays.xml calzone_price
    }

    // Positions 0-10 are signature pizzas
    if (position <= 10) {
      return priceArrays.signature_price[sizeIndex] || 0;
    }

    // Positions 11-20 are specialty pizzas
    return priceArrays.specialty_price[sizeIndex] || 0;
  }

  /**
   * Get appetizer price based on position and size
   * Different appetizers have different size options
   */
  private static getAppetizerPrice(position: number, sizeIndex: number): number {
    // Buffalo Wings, Buffalo Blasters, Cheese Stick Pizza, Italian Cheese Stick Pizza
    // have 3 sizes (Small, Medium, Large)
    if ([0, 1, 5, 6].includes(position)) {
      const prices = [
        priceArrays.appetizer_small_price[position],
        priceArrays.appetizer_medium_price[position],
        priceArrays.appetizer_large_price[position],
      ];
      return prices[sizeIndex] || 0;
    }

    // Breadsticks, Breadsticks with Cheese, Garlic Bread, Garlic Bread with Cheese
    // have 2 sizes (Small, Large)
    if ([2, 3, 7, 8].includes(position)) {
      const prices = [
        priceArrays.appetizer_small_price[position],
        priceArrays.appetizer_medium_price[position], // "Large" is stored in medium array
      ];
      return prices[sizeIndex] || 0;
    }

    // Other appetizers have only 1 size
    return priceArrays.appetizer_small_price[position] || 0;
  }

  /**
   * Get topping price based on size and direction (ADD or REMOVE)
   *
   * @param sizeIndex - Size index (0-4)
   * @param direction - 'ADD' or 'REMOVE'
   * @returns Price in cents
   */
  static getToppingPrice(sizeIndex: number, direction: 'ADD' | 'REMOVE' | 'LEFT' | 'RIGHT'): number {
    if (direction === 'REMOVE') {
      return priceArrays.topping_price_remove[sizeIndex] || 0;
    }
    return priceArrays.topping_price_add[sizeIndex] || 0;
  }

  /**
   * Get crust price based on crust index
   *
   * @param crustIndex - 0 = Original, 1 = Thin, 2 = Sicilian
   * @returns Price in cents
   */
  static getCrustPrice(crustIndex: number): number {
    return priceArrays.crust_price[crustIndex] || 0;
  }

  /**
   * Calculate total price for an order item
   *
   * @param basePrice - Base price in cents
   * @param toppingsAdded - Array of added toppings
   * @param toppingsRemoved - Array of removed toppings
   * @param crustPrice - Additional crust price (optional)
   * @returns Total price in cents
   */
  static calculateOrderItemTotal(
    basePrice: number,
    toppingsAdded: Topping[],
    toppingsRemoved: Topping[] = [],
    crustPrice: number = 0
  ): number {
    const toppingsAddedCost = toppingsAdded.reduce((sum, t) => sum + t.price, 0);
    const toppingsRemovedCost = toppingsRemoved.reduce((sum, t) => sum + t.price, 0);
    return basePrice + toppingsAddedCost + toppingsRemovedCost + crustPrice;
  }

  /**
   * Format price in cents to display string
   *
   * @param cents - Price in cents
   * @returns Formatted string (e.g., "$12.99")
   */
  static formatPrice(cents: number): string {
    const dollars = cents / 100;
    return `$${dollars.toFixed(2)}`;
  }
}
