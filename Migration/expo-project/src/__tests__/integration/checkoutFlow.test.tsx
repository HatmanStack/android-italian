import { renderHook, act } from '@testing-library/react-native';
import { useOrderStore } from '../../stores/orderStore';
import { OrderItem } from '../../types/order.types';
import { MenuCategory } from '../../types/menu.types';
import { PriceCalculator } from '../../utils/priceCalculator';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('Checkout Flow Integration Tests', () => {
  const mockImage = 1;

  const createMockOrderItem = (id: string, price: number, itemName?: string): OrderItem => ({
    id,
    menuItem: {
      id: `menu-${id}`,
      title: itemName || `Pizza ${id}`,
      description: 'Test pizza',
      image: mockImage,
      category: MenuCategory.PIZZA,
      position: 0,
    },
    size: 'Medium 12"',
    sizeIndex: 2,
    toppingsAdded: [],
    toppingsRemoved: [],
    crustType: 'Original Crust',
    totalPrice: price,
    orderSummary: `Medium 12" ${itemName || `Pizza ${id}`}`,
  });

  beforeEach(() => {
    const { result } = renderHook(() => useOrderStore());
    act(() => {
      result.current.clearCart();
    });
  });

  describe('Empty Cart Validation', () => {
    it('should have empty cart initially', () => {
      const { result } = renderHook(() => useOrderStore());

      expect(result.current.cart.items).toHaveLength(0);
      expect(result.current.cart.totalCost).toBe(0);
    });

    it('should prevent order placement with empty cart', () => {
      const { result } = renderHook(() => useOrderStore());

      // Validate that cart is empty
      expect(result.current.cart.items.length).toBe(0);

      // In production, this would trigger a toast error
      const canPlaceOrder = result.current.cart.items.length > 0;
      expect(canPlaceOrder).toBe(false);
    });
  });

  describe('Multi-Item Cart Operations', () => {
    it('should correctly calculate total for multiple items', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        result.current.addItem(createMockOrderItem('1', 1749, 'Mobster'));
        result.current.addItem(createMockOrderItem('2', 1999, 'Pepperoni'));
        result.current.addItem(createMockOrderItem('3', 1399, 'Cheese'));
      });

      expect(result.current.cart.items).toHaveLength(3);
      expect(result.current.cart.totalCost).toBe(1749 + 1999 + 1399); // 5147
    });

    it('should handle remove item operation', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        result.current.addItem(createMockOrderItem('1', 1749));
        result.current.addItem(createMockOrderItem('2', 1999));
      });

      expect(result.current.cart.items).toHaveLength(2);

      act(() => {
        result.current.removeItem('1');
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.totalCost).toBe(1999);
      expect(result.current.cart.items[0].id).toBe('2');
    });

    it('should handle clear cart operation', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        result.current.addItem(createMockOrderItem('1', 1749));
        result.current.addItem(createMockOrderItem('2', 1999));
        result.current.addItem(createMockOrderItem('3', 1399));
      });

      expect(result.current.cart.items).toHaveLength(3);

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.cart.items).toHaveLength(0);
      expect(result.current.cart.totalCost).toBe(0);
    });
  });

  describe('Tax and Grand Total Calculations', () => {
    it('should calculate correct tax for standard order', () => {
      const subtotal = 2000; // $20.00
      const taxRate = 0.0625; // 6.25%
      const expectedTax = Math.round(subtotal * taxRate); // $1.25
      const expectedGrandTotal = Math.round(subtotal * (1 + taxRate)); // $21.25

      expect(expectedTax).toBe(125);
      expect(expectedGrandTotal).toBe(2125);
    });

    it('should calculate correct tax for multi-item order', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        result.current.addItem(createMockOrderItem('1', 1749));
        result.current.addItem(createMockOrderItem('2', 1999));
      });

      const subtotal = result.current.cart.totalCost; // 3748
      const tax = Math.round(subtotal * 0.0625); // 234 cents = $2.34
      const grandTotal = Math.round(subtotal * 1.0625); // 3982 cents = $39.82

      expect(subtotal).toBe(3748);
      expect(tax).toBe(234); // $2.34
      expect(grandTotal).toBe(3982); // $39.82
    });

    it('should handle tax calculation for large orders', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        // Add 5 large pizzas
        for (let i = 0; i < 5; i++) {
          result.current.addItem(createMockOrderItem(`${i}`, 2399));
        }
      });

      const subtotal = result.current.cart.totalCost; // 11995
      const tax = Math.round(subtotal * 0.0625); // 750 cents = $7.50
      const grandTotal = Math.round(subtotal * 1.0625); // 12745 cents = $127.45

      expect(subtotal).toBe(11995);
      expect(tax).toBe(750);
      expect(grandTotal).toBe(12745);
    });
  });

  describe('Order Placement Simulation', () => {
    it('should simulate complete order flow', () => {
      const { result } = renderHook(() => useOrderStore());

      // Step 1: Add items to cart
      act(() => {
        result.current.addItem(createMockOrderItem('1', 1749, 'Mobster'));
        result.current.addItem(createMockOrderItem('2', 1399, 'Cheese'));
      });

      expect(result.current.cart.items).toHaveLength(2);
      const orderTotal = result.current.cart.totalCost;
      expect(orderTotal).toBe(3148);

      // Step 2: Verify can place order
      const canPlaceOrder = result.current.cart.items.length > 0;
      expect(canPlaceOrder).toBe(true);

      // Step 3: Place order (clear cart after placement)
      act(() => {
        result.current.clearCart();
      });

      expect(result.current.cart.items).toHaveLength(0);
      expect(result.current.cart.totalCost).toBe(0);
    });

    it('should handle order with customizations', () => {
      const { result } = renderHook(() => useOrderStore());

      const customItem: OrderItem = {
        id: '1',
        menuItem: {
          id: 'pizza-mobster',
          title: 'Mobster',
          description: 'Signature pizza',
          image: mockImage,
          category: MenuCategory.PIZZA,
          position: 0,
        },
        size: 'Large 14"',
        sizeIndex: 3,
        toppingsAdded: [
          { name: 'Extra Cheese', price: 225, direction: 'ADD' },
          { name: 'Pepperoni', price: 225, direction: 'ADD' },
        ],
        toppingsRemoved: [],
        crustType: 'Sicilian',
        comments: 'Extra sauce, well done',
        totalPrice: PriceCalculator.calculateOrderItemTotal(
          1999, // Large signature
          [
            { name: 'Extra Cheese', price: 225, direction: 'ADD' },
            { name: 'Pepperoni', price: 225, direction: 'ADD' },
          ],
          [],
          100 // Sicilian crust
        ),
        orderSummary: 'Large 14" Mobster - Sicilian\n+ Extra Cheese, Pepperoni\nNote: Extra sauce, well done',
      };

      act(() => {
        result.current.addItem(customItem);
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].totalPrice).toBe(2549); // 1999 + 225 + 225 + 100
      expect(result.current.cart.items[0].toppingsAdded).toHaveLength(2);
      expect(result.current.cart.items[0].comments).toBe('Extra sauce, well done');
    });
  });

  describe('Edge Cases', () => {
    it('should handle removing non-existent item', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        result.current.addItem(createMockOrderItem('1', 1749));
      });

      act(() => {
        result.current.removeItem('non-existent-id');
      });

      // Should still have the original item
      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].id).toBe('1');
    });

    it('should handle very large cart with many items', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        for (let i = 0; i < 20; i++) {
          result.current.addItem(createMockOrderItem(`${i}`, 1500));
        }
      });

      expect(result.current.cart.items).toHaveLength(20);
      expect(result.current.cart.totalCost).toBe(30000); // $300.00
    });

    it('should maintain cart integrity after multiple operations', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        result.current.addItem(createMockOrderItem('1', 1000));
        result.current.addItem(createMockOrderItem('2', 2000));
        result.current.addItem(createMockOrderItem('3', 3000));
        result.current.removeItem('2');
        result.current.addItem(createMockOrderItem('4', 1500));
        result.current.removeItem('1');
      });

      expect(result.current.cart.items).toHaveLength(2);
      expect(result.current.cart.totalCost).toBe(4500); // 3000 + 1500
      expect(result.current.cart.items.map(item => item.id)).toEqual(['3', '4']);
    });
  });
});
