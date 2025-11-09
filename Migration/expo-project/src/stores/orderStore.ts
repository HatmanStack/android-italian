import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cart, OrderItem } from '../types/order.types';

interface OrderState {
  cart: Cart;
  addItem: (item: OrderItem) => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, updates: Partial<OrderItem>) => void;
  clearCart: () => void;
  getTotal: () => number;
}

/**
 * Order store with cart management and persistence
 * Mirrors Android's CheckoutActivity + SharedPreferences
 */
export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      cart: {
        items: [],
        totalCost: 0,
      },

      /**
       * Add an item to the cart
       * Recalculates total cost
       */
      addItem: (item: OrderItem) => {
        set((state) => {
          const newItems = [...state.cart.items, item];
          const newTotal = newItems.reduce((sum, i) => sum + i.totalPrice, 0);
          return {
            cart: {
              items: newItems,
              totalCost: newTotal,
            },
          };
        });
      },

      /**
       * Remove an item from the cart
       * Recalculates total cost
       */
      removeItem: (itemId: string) => {
        set((state) => {
          const newItems = state.cart.items.filter((i) => i.id !== itemId);
          const newTotal = newItems.reduce((sum, i) => sum + i.totalPrice, 0);
          return {
            cart: {
              items: newItems,
              totalCost: newTotal,
            },
          };
        });
      },

      /**
       * Update an existing item in the cart
       * Recalculates total cost
       */
      updateItem: (itemId: string, updates: Partial<OrderItem>) => {
        set((state) => {
          const newItems = state.cart.items.map((item) =>
            item.id === itemId ? { ...item, ...updates } : item
          );
          const newTotal = newItems.reduce((sum, i) => sum + i.totalPrice, 0);
          return {
            cart: {
              items: newItems,
              totalCost: newTotal,
            },
          };
        });
      },

      /**
       * Clear all items from the cart
       */
      clearCart: () => {
        set({
          cart: {
            items: [],
            totalCost: 0,
          },
        });
      },

      /**
       * Get the current total cost
       * Returns value in cents
       */
      getTotal: () => {
        return get().cart.totalCost;
      },
    }),
    {
      name: 'order-storage', // AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
