import { renderHook, act } from '@testing-library/react-native';
import { useOrderStore } from '../../stores/orderStore';
import { OrderItem } from '../../types/order.types';
import { MenuCategory } from '../../types/menu.types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('OrderStore', () => {
  const mockImage = 1; // Mock image value

  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useOrderStore());
    act(() => {
      result.current.clearCart();
    });
  });

  const createMockOrderItem = (overrides?: Partial<OrderItem>): OrderItem => ({
    id: '1',
    menuItem: {
      id: 'pizza-mobster',
      title: 'Mobster',
      description: 'Test pizza',
      image: mockImage,
      category: MenuCategory.PIZZA,
      position: 0,
    },
    size: 'Medium',
    sizeIndex: 2,
    toppingsAdded: [],
    toppingsRemoved: [],
    crustType: 'Original Crust',
    comments: undefined,
    totalPrice: 1749,
    orderSummary: 'Medium Mobster',
    ...overrides,
  });

  describe('Initial State', () => {
    it('should start with empty cart', () => {
      const { result } = renderHook(() => useOrderStore());
      expect(result.current.cart.items).toEqual([]);
      expect(result.current.cart.totalCost).toBe(0);
    });
  });

  describe('addItem', () => {
    it('should add item to cart', () => {
      const { result } = renderHook(() => useOrderStore());
      const item = createMockOrderItem();

      act(() => {
        result.current.addItem(item);
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0]).toEqual(item);
      expect(result.current.cart.totalCost).toBe(1749);
    });

    it('should add multiple items to cart', () => {
      const { result } = renderHook(() => useOrderStore());
      const item1 = createMockOrderItem({ id: '1', totalPrice: 1749 });
      const item2 = createMockOrderItem({ id: '2', totalPrice: 899 });

      act(() => {
        result.current.addItem(item1);
        result.current.addItem(item2);
      });

      expect(result.current.cart.items).toHaveLength(2);
      expect(result.current.cart.totalCost).toBe(1749 + 899); // 2648
    });

    it('should update total cost when adding items', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        result.current.addItem(createMockOrderItem({ totalPrice: 1000 }));
      });
      expect(result.current.cart.totalCost).toBe(1000);

      act(() => {
        result.current.addItem(createMockOrderItem({ id: '2', totalPrice: 500 }));
      });
      expect(result.current.cart.totalCost).toBe(1500);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const { result } = renderHook(() => useOrderStore());
      const item = createMockOrderItem({ id: 'test-1' });

      act(() => {
        result.current.addItem(item);
      });
      expect(result.current.cart.items).toHaveLength(1);

      act(() => {
        result.current.removeItem('test-1');
      });
      expect(result.current.cart.items).toHaveLength(0);
      expect(result.current.cart.totalCost).toBe(0);
    });

    it('should remove correct item when multiple items exist', () => {
      const { result } = renderHook(() => useOrderStore());
      const item1 = createMockOrderItem({ id: 'item-1', totalPrice: 1000 });
      const item2 = createMockOrderItem({ id: 'item-2', totalPrice: 500 });
      const item3 = createMockOrderItem({ id: 'item-3', totalPrice: 750 });

      act(() => {
        result.current.addItem(item1);
        result.current.addItem(item2);
        result.current.addItem(item3);
      });

      act(() => {
        result.current.removeItem('item-2');
      });

      expect(result.current.cart.items).toHaveLength(2);
      expect(result.current.cart.items.find((i) => i.id === 'item-2')).toBeUndefined();
      expect(result.current.cart.totalCost).toBe(1750); // 1000 + 750
    });

    it('should update total cost when removing items', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        result.current.addItem(createMockOrderItem({ id: '1', totalPrice: 1000 }));
        result.current.addItem(createMockOrderItem({ id: '2', totalPrice: 500 }));
      });
      expect(result.current.cart.totalCost).toBe(1500);

      act(() => {
        result.current.removeItem('1');
      });
      expect(result.current.cart.totalCost).toBe(500);
    });
  });

  describe('updateItem', () => {
    it('should update item properties', () => {
      const { result } = renderHook(() => useOrderStore());
      const item = createMockOrderItem({ id: 'test-1', comments: 'Original' });

      act(() => {
        result.current.addItem(item);
      });

      act(() => {
        result.current.updateItem('test-1', { comments: 'Updated comment' });
      });

      expect(result.current.cart.items[0].comments).toBe('Updated comment');
    });

    it('should update total cost when updating item price', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        result.current.addItem(createMockOrderItem({ id: '1', totalPrice: 1000 }));
      });
      expect(result.current.cart.totalCost).toBe(1000);

      act(() => {
        result.current.updateItem('1', { totalPrice: 1500 });
      });
      expect(result.current.cart.totalCost).toBe(1500);
    });

    it('should not affect other items when updating one item', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        result.current.addItem(createMockOrderItem({ id: '1', totalPrice: 1000 }));
        result.current.addItem(createMockOrderItem({ id: '2', totalPrice: 500 }));
      });

      act(() => {
        result.current.updateItem('1', { totalPrice: 2000 });
      });

      expect(result.current.cart.items[0].totalPrice).toBe(2000);
      expect(result.current.cart.items[1].totalPrice).toBe(500);
      expect(result.current.cart.totalCost).toBe(2500);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        result.current.addItem(createMockOrderItem({ id: '1', totalPrice: 1000 }));
        result.current.addItem(createMockOrderItem({ id: '2', totalPrice: 500 }));
      });
      expect(result.current.cart.items).toHaveLength(2);

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.cart.items).toHaveLength(0);
      expect(result.current.cart.totalCost).toBe(0);
    });
  });

  describe('getTotal', () => {
    it('should return current total cost', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        result.current.addItem(createMockOrderItem({ totalPrice: 1234 }));
      });

      expect(result.current.getTotal()).toBe(1234);
    });

    it('should return 0 for empty cart', () => {
      const { result } = renderHook(() => useOrderStore());
      expect(result.current.getTotal()).toBe(0);
    });
  });
});
