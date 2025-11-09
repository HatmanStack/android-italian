import { renderHook, act } from '@testing-library/react-native';
import { useOrderStore } from '../../stores/orderStore';
import { PriceCalculator } from '../../utils/priceCalculator';
import { OrderItem, Topping } from '../../types/order.types';
import { MenuCategory } from '../../types/menu.types';
import { getSizesForItem } from '../../components/OrderCustomization/SizeSelector';
import { crustTypes } from '../../data/priceArrays';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('Order Flow Integration Tests', () => {
  const mockImage = 1; // Mock image value

  beforeEach(() => {
    const { result } = renderHook(() => useOrderStore());
    act(() => {
      result.current.clearCart();
    });
  });

  describe('Complete Pizza Order Flow', () => {
    it('should create a complete pizza order with all customizations', () => {
      // 1. Select a signature pizza (Mobster)
      const menuItem = {
        id: 'pizza-mobster',
        title: 'Mobster',
        description: 'Beef, Pork Sausage, Mushroom, Pepperoni, Green Pepper, Onion',
        image: mockImage,
        category: MenuCategory.PIZZA,
        position: 0,
      };

      // 2. Select Medium size (index 2)
      const sizeIndex = 2;
      const sizes = getSizesForItem(menuItem);
      const sizeName = sizes[sizeIndex];
      expect(sizeName).toBe('Medium 12"');

      // 3. Calculate base price
      const basePrice = PriceCalculator.getBasePrice(menuItem, sizeIndex);
      expect(basePrice).toBe(1749); // Medium signature pizza

      // 4. Add toppings
      const toppingsAdded: Topping[] = [
        {
          name: 'Extra Cheese',
          price: PriceCalculator.getToppingPrice(sizeIndex, 'ADD'),
          direction: 'ADD',
        },
        {
          name: 'Jalapeno',
          price: PriceCalculator.getToppingPrice(sizeIndex, 'ADD'),
          direction: 'ADD',
        },
      ];
      expect(toppingsAdded[0].price).toBe(199); // Medium topping price
      expect(toppingsAdded[1].price).toBe(199);

      // 5. Select Sicilian Crust (index 2)
      const crustIndex = 2;
      const crustPrice = PriceCalculator.getCrustPrice(crustIndex);
      expect(crustPrice).toBe(100); // Corrected: Sicilian is $1.00

      // 6. Add special comments
      const comments = 'Extra sauce, well done';

      // 7. Calculate total price
      const totalPrice = PriceCalculator.calculateOrderItemTotal(
        basePrice,
        toppingsAdded,
        [],
        crustPrice
      );
      expect(totalPrice).toBe(1749 + 199 + 199 + 100); // 2247

      // 8. Build order summary
      const orderSummary = `${sizeName} ${menuItem.title} - ${crustTypes[crustIndex]}
+ Extra Cheese, Jalapeno
Note: ${comments}`;

      // 9. Create order item
      const orderItem: OrderItem = {
        id: `${Date.now()}`,
        menuItem,
        size: sizeName,
        sizeIndex,
        toppingsAdded,
        toppingsRemoved: [],
        crustType: crustTypes[crustIndex],
        comments,
        totalPrice,
        orderSummary,
      };

      // 10. Add to cart
      const { result } = renderHook(() => useOrderStore());
      act(() => {
        result.current.addItem(orderItem);
      });

      // Verify cart state
      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.totalCost).toBe(2247);
      expect(result.current.cart.items[0].totalPrice).toBe(2247);
    });

    it('should handle multiple items in cart', () => {
      const { result } = renderHook(() => useOrderStore());

      // Order 1: Medium Signature Pizza with toppings
      const pizza1 = {
        id: 'pizza-1',
        title: 'Mobster',
        description: 'Test',
        image: mockImage,
        category: MenuCategory.PIZZA,
        position: 0,
      };
      const item1: OrderItem = {
        id: '1',
        menuItem: pizza1,
        size: 'Medium 12"',
        sizeIndex: 2,
        toppingsAdded: [
          { name: 'Pepperoni', price: 199, direction: 'ADD' },
        ],
        toppingsRemoved: [],
        crustType: 'Original Crust',
        totalPrice: PriceCalculator.calculateOrderItemTotal(
          1749,
          [{ name: 'Pepperoni', price: 199, direction: 'ADD' }],
          [],
          0
        ),
        orderSummary: 'Medium 12" Mobster + Pepperoni',
      };

      // Order 2: Family Pasta
      const pasta = {
        id: 'pasta-1',
        title: 'Spaghetti',
        description: 'Test',
        image: mockImage,
        category: MenuCategory.PASTA,
        position: 0,
      };
      const item2: OrderItem = {
        id: '2',
        menuItem: pasta,
        size: 'Family (8)',
        sizeIndex: 1,
        toppingsAdded: [],
        toppingsRemoved: [],
        totalPrice: 2049,
        orderSummary: 'Family (8) Spaghetti',
      };

      act(() => {
        result.current.addItem(item1);
        result.current.addItem(item2);
      });

      expect(result.current.cart.items).toHaveLength(2);
      expect(result.current.cart.totalCost).toBe(1948 + 2049); // 3997
    });
  });

  describe('Pricing Validation Against Android', () => {
    it('should match Android pricing for signature pizzas', () => {
      const menuItem = {
        id: 'pizza-mobster',
        title: 'Mobster',
        description: 'Test',
        image: mockImage,
        category: MenuCategory.PIZZA,
        position: 0, // Signature
      };

      // Android signature_price: [799, 1399, 1749, 1999, 2399]
      expect(PriceCalculator.getBasePrice(menuItem, 0)).toBe(799);
      expect(PriceCalculator.getBasePrice(menuItem, 1)).toBe(1399);
      expect(PriceCalculator.getBasePrice(menuItem, 2)).toBe(1749);
      expect(PriceCalculator.getBasePrice(menuItem, 3)).toBe(1999);
      expect(PriceCalculator.getBasePrice(menuItem, 4)).toBe(2399);
    });

    it('should match Android topping prices', () => {
      // Android topping_price_add: [69, 169, 199, 225, 225]
      expect(PriceCalculator.getToppingPrice(0, 'ADD')).toBe(69);
      expect(PriceCalculator.getToppingPrice(1, 'ADD')).toBe(169);
      expect(PriceCalculator.getToppingPrice(2, 'ADD')).toBe(199);
      expect(PriceCalculator.getToppingPrice(3, 'ADD')).toBe(225);
      expect(PriceCalculator.getToppingPrice(4, 'ADD')).toBe(225);

      // Android topping_price_remove: all zeros
      expect(PriceCalculator.getToppingPrice(0, 'REMOVE')).toBe(0);
      expect(PriceCalculator.getToppingPrice(1, 'REMOVE')).toBe(0);
    });

    it('should match Android crust upgrade pricing', () => {
      // Actual Android crust_price: [0, 0, 100]
      expect(PriceCalculator.getCrustPrice(0)).toBe(0); // Original - free
      expect(PriceCalculator.getCrustPrice(1)).toBe(0); // Thin - free
      expect(PriceCalculator.getCrustPrice(2)).toBe(100); // Sicilian - $1.00
    });
  });

  describe('Edge Cases', () => {
    it('should handle order with no toppings or crust changes', () => {
      const basePrice = 1399; // Small signature pizza
      const total = PriceCalculator.calculateOrderItemTotal(basePrice, [], [], 0);
      expect(total).toBe(1399);
    });

    it('should handle order with maximum toppings', () => {
      const basePrice = 1749; // Medium
      const toppings: Topping[] = Array(10)
        .fill(null)
        .map((_, i) => ({
          name: `Topping${i}`,
          price: 199,
          direction: 'ADD' as const,
        }));

      const total = PriceCalculator.calculateOrderItemTotal(basePrice, toppings, [], 0);
      expect(total).toBe(1749 + 199 * 10); // 3739
    });

    it('should handle price formatting edge cases', () => {
      expect(PriceCalculator.formatPrice(0)).toBe('$0.00');
      expect(PriceCalculator.formatPrice(1)).toBe('$0.01');
      expect(PriceCalculator.formatPrice(99)).toBe('$0.99');
      expect(PriceCalculator.formatPrice(10000)).toBe('$100.00');
    });
  });

  describe('Cart Operations', () => {
    it('should calculate correct tax and grand total', () => {
      const { result } = renderHook(() => useOrderStore());

      const item: OrderItem = {
        id: '1',
        menuItem: {
          id: 'test',
          title: 'Test',
          description: 'Test',
          image: mockImage,
          category: MenuCategory.PIZZA,
          position: 0,
        },
        size: 'Medium',
        sizeIndex: 2,
        toppingsAdded: [],
        toppingsRemoved: [],
        totalPrice: 2000, // $20.00
        orderSummary: 'Test order',
      };

      act(() => {
        result.current.addItem(item);
      });

      const subtotal = result.current.cart.totalCost;
      const tax = Math.round(subtotal * 0.0625); // 6.25% tax
      const grandTotal = Math.round(subtotal * 1.0625);

      expect(subtotal).toBe(2000);
      expect(tax).toBe(125); // $1.25
      expect(grandTotal).toBe(2125); // $21.25
    });
  });
});
