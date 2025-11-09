import {
  getNutritionByName,
  searchNutritionByName,
  hasNutritionData,
} from '../../utils/nutritionHelper';

describe('NutritionHelper', () => {
  describe('getNutritionByName', () => {
    it('should return nutrition facts for exact match', () => {
      const result = getNutritionByName('Cheese');
      expect(result).not.toBeNull();
      expect(result?.itemName).toBe('Cheese');
      expect(result?.calories).toBe(260);
    });

    it('should be case-insensitive', () => {
      const result1 = getNutritionByName('cheese');
      const result2 = getNutritionByName('CHEESE');
      const result3 = getNutritionByName('ChEeSe');

      expect(result1).not.toBeNull();
      expect(result2).not.toBeNull();
      expect(result3).not.toBeNull();
      expect(result1?.calories).toBe(260);
      expect(result2?.calories).toBe(260);
      expect(result3?.calories).toBe(260);
    });

    it('should handle leading/trailing whitespace', () => {
      const result = getNutritionByName('  Cheese  ');
      expect(result).not.toBeNull();
      expect(result?.itemName).toBe('Cheese');
    });

    it('should return null for non-existent item', () => {
      const result = getNutritionByName('NonExistentItem');
      expect(result).toBeNull();
    });

    it('should return correct nutrition data for multiple items', () => {
      const cheese = getNutritionByName('Cheese');
      const pepperoni = getNutritionByName('Pepperoni');
      const sausage = getNutritionByName('Sliced Italian Sausage');

      expect(cheese?.calories).toBe(260);
      expect(pepperoni?.calories).toBe(280); // Corrected: actual value is 280
      expect(sausage?.calories).toBe(330); // Use full name
    });
  });

  describe('searchNutritionByName', () => {
    it('should return multiple results for partial match', () => {
      const results = searchNutritionByName('Ch');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((item) => item.itemName.includes('Ch'))).toBe(true);
    });

    it('should be case-insensitive for search', () => {
      const lower = searchNutritionByName('che');
      const upper = searchNutritionByName('CHE');

      expect(lower.length).toBeGreaterThan(0);
      expect(upper.length).toBeGreaterThan(0);
      expect(lower.length).toBe(upper.length);
    });

    it('should return empty array for no matches', () => {
      const results = searchNutritionByName('XYZ123NonExistent');
      expect(results).toEqual([]);
    });

    it('should find items with partial name', () => {
      const results = searchNutritionByName('Chicken');
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((item) => item.itemName.toLowerCase().includes('chicken'))).toBe(true);
    });
  });

  describe('hasNutritionData', () => {
    it('should return true for items with nutrition data', () => {
      expect(hasNutritionData('Cheese')).toBe(true);
      expect(hasNutritionData('Pepperoni')).toBe(true);
      expect(hasNutritionData('Sliced Italian Sausage')).toBe(true);
    });

    it('should return false for items without nutrition data', () => {
      expect(hasNutritionData('NonExistentItem')).toBe(false);
      expect(hasNutritionData('Sausage')).toBe(false); // Only "Sliced Italian Sausage" exists
    });

    it('should be case-insensitive', () => {
      expect(hasNutritionData('cheese')).toBe(true);
      expect(hasNutritionData('CHEESE')).toBe(true);
    });
  });

  describe('Data Integrity', () => {
    it('should have all required nutrition fields', () => {
      const cheese = getNutritionByName('Cheese');
      expect(cheese).toHaveProperty('itemName');
      expect(cheese).toHaveProperty('calories');
      expect(cheese).toHaveProperty('caloriesFromFat');
      expect(cheese).toHaveProperty('totalFat');
      expect(cheese).toHaveProperty('saturatedFat');
      expect(cheese).toHaveProperty('transFat');
      expect(cheese).toHaveProperty('cholesterol');
      expect(cheese).toHaveProperty('sodium');
      expect(cheese).toHaveProperty('totalCarbohydrate');
      expect(cheese).toHaveProperty('dietaryFiber');
      expect(cheese).toHaveProperty('sugars');
      expect(cheese).toHaveProperty('protein');
    });

    it('should have numeric values for all nutrient fields', () => {
      const cheese = getNutritionByName('Cheese');
      expect(typeof cheese?.calories).toBe('number');
      expect(typeof cheese?.totalFat).toBe('number');
      expect(typeof cheese?.protein).toBe('number');
    });
  });
});
