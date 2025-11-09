import { PriceCalculator } from '../../utils/priceCalculator';
import { MenuItem, MenuCategory } from '../../types/menu.types';
import { Topping } from '../../types/order.types';

describe('PriceCalculator', () => {
  const mockImage = 1; // Mock image value for tests

  describe('getBasePrice', () => {
    it('should calculate signature pizza prices correctly', () => {
      const signaturePizza: MenuItem = {
        id: 'pizza-mobster',
        title: 'Mobster',
        description: 'Test',
        image: mockImage,
        category: MenuCategory.PIZZA,
        position: 0, // Signature pizza
      };

      // Signature prices: [799, 1399, 1749, 1999, 2399]
      expect(PriceCalculator.getBasePrice(signaturePizza, 0)).toBe(799); // Mini
      expect(PriceCalculator.getBasePrice(signaturePizza, 1)).toBe(1399); // Small
      expect(PriceCalculator.getBasePrice(signaturePizza, 2)).toBe(1749); // Medium
      expect(PriceCalculator.getBasePrice(signaturePizza, 3)).toBe(1999); // Large
      expect(PriceCalculator.getBasePrice(signaturePizza, 4)).toBe(2399); // Crazy
    });

    it('should calculate specialty pizza prices correctly', () => {
      const specialtyPizza: MenuItem = {
        id: 'pizza-greek',
        title: 'Greek',
        description: 'Test',
        image: mockImage,
        category: MenuCategory.PIZZA,
        position: 11, // Specialty pizza
      };

      // Specialty prices: [699, 1249, 1599, 1849, 2249]
      expect(PriceCalculator.getBasePrice(specialtyPizza, 0)).toBe(699); // Mini
      expect(PriceCalculator.getBasePrice(specialtyPizza, 1)).toBe(1249); // Small
      expect(PriceCalculator.getBasePrice(specialtyPizza, 2)).toBe(1599); // Medium
    });

    it('should calculate Create Your Own pizza prices correctly', () => {
      const createYourOwn: MenuItem = {
        id: 'pizza-create',
        title: 'Create Your Own',
        description: 'Test',
        image: mockImage,
        category: MenuCategory.PIZZA,
        position: 21,
      };

      // Create Your Own prices: [349, 699, 999, 1199, 1599]
      expect(PriceCalculator.getBasePrice(createYourOwn, 0)).toBe(349);
      expect(PriceCalculator.getBasePrice(createYourOwn, 1)).toBe(699);
      expect(PriceCalculator.getBasePrice(createYourOwn, 2)).toBe(999);
    });

    it('should calculate calzone prices correctly', () => {
      const calzone: MenuItem = {
        id: 'pizza-calzone',
        title: 'Calzone',
        description: 'Test',
        image: mockImage,
        category: MenuCategory.PIZZA,
        position: 22,
      };

      // Calzone only has 2 sizes: Small (899) and Large (1499)
      expect(PriceCalculator.getBasePrice(calzone, 0)).toBe(899);
      expect(PriceCalculator.getBasePrice(calzone, 1)).toBe(1499);
    });

    it('should calculate pasta prices correctly', () => {
      const pasta: MenuItem = {
        id: 'pasta-spaghetti',
        title: 'Spaghetti',
        description: 'Test',
        image: mockImage,
        category: MenuCategory.PASTA,
        position: 0,
      };

      // Pasta prices: [799, 2049] (Individual, Family)
      expect(PriceCalculator.getBasePrice(pasta, 0)).toBe(799);
      expect(PriceCalculator.getBasePrice(pasta, 1)).toBe(2049);
    });
  });

  describe('getToppingPrice', () => {
    it('should calculate ADD topping prices by size', () => {
      // topping_price_add: [69, 169, 199, 225, 225]
      expect(PriceCalculator.getToppingPrice(0, 'ADD')).toBe(69); // Mini
      expect(PriceCalculator.getToppingPrice(1, 'ADD')).toBe(169); // Small
      expect(PriceCalculator.getToppingPrice(2, 'ADD')).toBe(199); // Medium
      expect(PriceCalculator.getToppingPrice(3, 'ADD')).toBe(225); // Large
      expect(PriceCalculator.getToppingPrice(4, 'ADD')).toBe(225); // Crazy
    });

    it('should calculate REMOVE topping prices (free for specialty pizzas)', () => {
      // topping_price_remove: [0, 0, 0, 0, 0] - free to remove
      expect(PriceCalculator.getToppingPrice(0, 'REMOVE')).toBe(0);
      expect(PriceCalculator.getToppingPrice(1, 'REMOVE')).toBe(0);
      expect(PriceCalculator.getToppingPrice(2, 'REMOVE')).toBe(0);
    });
  });

  describe('getCrustPrice', () => {
    it('should return correct crust prices', () => {
      // Actual values from priceArrays: [0, 0, 100]
      expect(PriceCalculator.getCrustPrice(0)).toBe(0); // Original - free
      expect(PriceCalculator.getCrustPrice(1)).toBe(0); // Thin - free
      expect(PriceCalculator.getCrustPrice(2)).toBe(100); // Sicilian - $1.00
    });
  });

  describe('calculateOrderItemTotal', () => {
    it('should calculate total with base price only', () => {
      const basePrice = 1399;
      const total = PriceCalculator.calculateOrderItemTotal(basePrice, [], [], 0);
      expect(total).toBe(1399);
    });

    it('should calculate total with added toppings', () => {
      const basePrice = 1399; // Small pizza
      const toppings: Topping[] = [
        { name: 'Pepperoni', price: 169, direction: 'ADD' },
        { name: 'Mushroom', price: 169, direction: 'ADD' },
      ];
      const total = PriceCalculator.calculateOrderItemTotal(basePrice, toppings, [], 0);
      expect(total).toBe(1399 + 169 + 169); // 1737
    });

    it('should calculate total with crust upgrade', () => {
      const basePrice = 1399;
      const crustPrice = 100;
      const total = PriceCalculator.calculateOrderItemTotal(basePrice, [], [], crustPrice);
      expect(total).toBe(1499); // 1399 + 100
    });

    it('should calculate complete order total', () => {
      const basePrice = 1749; // Medium signature pizza
      const toppings: Topping[] = [
        { name: 'Pepperoni', price: 199, direction: 'ADD' },
        { name: 'Sausage', price: 199, direction: 'ADD' },
      ];
      const crustPrice = 100; // Sicilian crust
      const total = PriceCalculator.calculateOrderItemTotal(basePrice, toppings, [], crustPrice);
      expect(total).toBe(1749 + 199 + 199 + 100); // 2247
    });
  });

  describe('formatPrice', () => {
    it('should format cents as dollars with $ sign', () => {
      expect(PriceCalculator.formatPrice(799)).toBe('$7.99');
      expect(PriceCalculator.formatPrice(1399)).toBe('$13.99');
      expect(PriceCalculator.formatPrice(100)).toBe('$1.00');
      expect(PriceCalculator.formatPrice(0)).toBe('$0.00');
      expect(PriceCalculator.formatPrice(2347)).toBe('$23.47');
    });
  });
});
