/**
 * Nutrition facts for a menu item
 * Mirrors Android's NutritionInfo.java data structure
 */
export interface NutritionFacts {
  itemName: string;
  calories: number;
  caloriesFromFat: number;
  totalFat: number; // grams
  saturatedFat: number; // grams
  transFat: number; // grams
  cholesterol: number; // mg
  sodium: number; // mg
  totalCarbohydrate: number; // grams
  dietaryFiber: number; // grams
  sugars: number; // grams
  protein: number; // grams
}
