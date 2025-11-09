import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MenuCategory } from '../../types/menu.types';
import { crustTypes } from '../../data/priceArrays';
import { PriceCalculator } from '../../utils/priceCalculator';

interface Props {
  category: MenuCategory;
  selectedCrustIndex: number;
  onCrustChange: (crustIndex: number) => void;
}

/**
 * Check if crust options are applicable for a category
 * Only pizzas have crust options (calzones are in the pizza category)
 */
function canHaveCrust(category: MenuCategory): boolean {
  return category === MenuCategory.PIZZA;
}

export const CrustSelector: React.FC<Props> = ({
  category,
  selectedCrustIndex,
  onCrustChange,
}) => {
  if (!canHaveCrust(category)) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Crust Type</Text>
      <Text style={styles.subtitle}>Choose your preferred crust</Text>

      <View style={styles.crustGrid}>
        {crustTypes.map((crust, index) => {
          const isSelected = selectedCrustIndex === index;
          const price = PriceCalculator.getCrustPrice(index);
          const priceText = price > 0 ? ` (+${PriceCalculator.formatPrice(price)})` : '';

          return (
            <TouchableOpacity
              key={crust}
              style={[styles.crustButton, isSelected && styles.crustButtonSelected]}
              onPress={() => onCrustChange(index)}
              activeOpacity={0.7}
            >
              <Text style={[styles.crustText, isSelected && styles.crustTextSelected]}>
                {crust}
              </Text>
              {priceText !== '' && (
                <Text style={[styles.priceText, isSelected && styles.priceTextSelected]}>
                  {priceText}
                </Text>
              )}
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
    marginTop: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  crustGrid: {
    flexDirection: 'column',
    gap: 8,
  },
  crustButton: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#fff',
  },
  crustButtonSelected: {
    borderColor: '#c41e3a',
    backgroundColor: '#fff5f5',
  },
  crustText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  crustTextSelected: {
    color: '#c41e3a',
    fontWeight: '600',
  },
  priceText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  priceTextSelected: {
    color: '#c41e3a',
  },
});
