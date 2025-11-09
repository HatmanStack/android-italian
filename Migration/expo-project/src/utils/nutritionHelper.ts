import { NutritionFacts } from '../types/nutrition.types';
import { nutritionDatabase } from '../data/nutritionData';

/**
 * Get nutrition facts for a menu item by name
 * Case-insensitive search
 *
 * @param itemName - The name of the menu item
 * @returns NutritionFacts if found, null otherwise
 */
export function getNutritionByName(itemName: string): NutritionFacts | null {
  const normalized = itemName.trim().toLowerCase();
  const match = nutritionDatabase.find(
    (item) => item.itemName.toLowerCase() === normalized
  );
  return match || null;
}

/**
 * Get nutrition facts by partial name match
 * Useful for menu items with slightly different names
 *
 * @param searchTerm - Partial name to search for
 * @returns Array of matching NutritionFacts
 */
export function searchNutritionByName(searchTerm: string): NutritionFacts[] {
  const normalized = searchTerm.trim().toLowerCase();
  return nutritionDatabase.filter((item) =>
    item.itemName.toLowerCase().includes(normalized)
  );
}

/**
 * Check if nutrition data exists for a menu item
 *
 * @param itemName - The name of the menu item
 * @returns true if nutrition data exists
 */
export function hasNutritionData(itemName: string): boolean {
  return getNutritionByName(itemName) !== null;
}
