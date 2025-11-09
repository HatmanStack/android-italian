import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MenuItem, MenuCategory } from '../../types/menu.types';
import { sizeArrays } from '../../data/priceArrays';
import { PriceCalculator } from '../../utils/priceCalculator';

interface Props {
  item: MenuItem;
  selectedSizeIndex: number;
  onSizeChange: (sizeIndex: number) => void;
}

/**
 * Get available sizes for a menu item based on category and position
 */
export function getSizesForItem(item: MenuItem): string[] {
  const { category, position } = item;

  switch (category) {
    case MenuCategory.PIZZA:
      // Calzone has only 2 sizes
      if (position === 22) {
        return ['Small', 'Large'];
      }
      return sizeArrays.pizza;

    case MenuCategory.SANDWICHES:
    case MenuCategory.SALADS:
      return sizeArrays.sandwich;

    case MenuCategory.PASTA:
      return sizeArrays.pasta;

    case MenuCategory.APPETIZERS:
      // Different appetizers have different size options
      // Positions 0, 1, 5, 6 have 3 sizes
      if ([0, 1, 5, 6].includes(position)) {
        return sizeArrays.appetizer_large;
      }
      // Positions 2, 3, 7, 8 have 2 sizes
      if ([2, 3, 7, 8].includes(position)) {
        return sizeArrays.appetizer_medium;
      }
      // Others have 1 size
      return sizeArrays.appetizer_small;

    case MenuCategory.DESSERTS:
      // Cookie has only 1 size
      if (position === 3) {
        return ['Regular'];
      }
      return sizeArrays.desert;

    default:
      return ['Regular'];
  }
}

export const SizeSelector: React.FC<Props> = ({ item, selectedSizeIndex, onSizeChange }) => {
  const sizes = getSizesForItem(item);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Size</Text>
      <View style={styles.sizeGrid}>
        {sizes.map((size, index) => {
          const isSelected = selectedSizeIndex === index;
          const price = PriceCalculator.getBasePrice(item, index);
          const formattedPrice = PriceCalculator.formatPrice(price);

          return (
            <TouchableOpacity
              key={index}
              style={[styles.sizeButton, isSelected && styles.sizeButtonSelected]}
              onPress={() => onSizeChange(index)}
              activeOpacity={0.7}
            >
              <Text style={[styles.sizeText, isSelected && styles.sizeTextSelected]}>
                {size}
              </Text>
              <Text style={[styles.priceText, isSelected && styles.priceTextSelected]}>
                {formattedPrice}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sizeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  sizeButton: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    margin: 6,
    minWidth: 100,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  sizeButtonSelected: {
    borderColor: '#c41e3a',
    backgroundColor: '#fff5f5',
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  sizeTextSelected: {
    color: '#c41e3a',
    fontWeight: '600',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  priceTextSelected: {
    color: '#c41e3a',
  },
});
