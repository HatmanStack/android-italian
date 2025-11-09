import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MenuCategory } from '../../types/menu.types';
import { Topping } from '../../types/order.types';
import { availableToppings } from '../../data/priceArrays';
import { PriceCalculator } from '../../utils/priceCalculator';

interface Props {
  category: MenuCategory;
  sizeIndex: number;
  /** Array containing both ADD and REMOVE toppings (distinguished by direction field) */
  toppingsAdded: Topping[];
  onToppingAdd: (topping: Topping) => void;
  onToppingRemove: (toppingName: string) => void;
}

/**
 * Check if toppings are applicable for a category
 * Only pizzas and calzones have toppings
 */
function canHaveToppings(category: MenuCategory): boolean {
  return category === MenuCategory.PIZZA;
}

export const ToppingSelector: React.FC<Props> = ({
  category,
  sizeIndex,
  toppingsAdded,
  onToppingAdd,
  onToppingRemove,
}) => {
  if (!canHaveToppings(category)) {
    return null;
  }

  const handleAddTopping = (toppingName: string) => {
    const price = PriceCalculator.getToppingPrice(sizeIndex, 'ADD');
    const topping: Topping = {
      name: toppingName,
      price,
      direction: 'ADD',
    };
    onToppingAdd(topping);
  };

  const handleRemoveTopping = (toppingName: string) => {
    const price = PriceCalculator.getToppingPrice(sizeIndex, 'REMOVE');
    const topping: Topping = {
      name: toppingName,
      price,
      direction: 'REMOVE',
    };
    onToppingAdd(topping); // Add to toppings list with REMOVE direction
  };

  const isToppingAdded = (name: string) => {
    return toppingsAdded.some((t) => t.name === name && t.direction === 'ADD');
  };

  const isToppingRemoved = (name: string) => {
    return toppingsAdded.some((t) => t.name === name && t.direction === 'REMOVE');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Customize Toppings</Text>
      <Text style={styles.subtitle}>Tap to add or remove toppings</Text>

      <ScrollView style={styles.toppingList} nestedScrollEnabled>
        {availableToppings.map((toppingName) => {
          const isAdded = isToppingAdded(toppingName);
          const isRemoved = isToppingRemoved(toppingName);
          const addPrice = PriceCalculator.getToppingPrice(sizeIndex, 'ADD');
          const removePrice = PriceCalculator.getToppingPrice(sizeIndex, 'REMOVE');

          return (
            <View key={toppingName} style={styles.toppingRow}>
              <Text style={styles.toppingName}>{toppingName}</Text>
              <View style={styles.toppingButtons}>
                {/* Add Topping Button */}
                <TouchableOpacity
                  style={[styles.actionButton, isAdded && styles.actionButtonActive]}
                  onPress={() => {
                    if (isAdded) {
                      onToppingRemove(toppingName);
                    } else {
                      handleAddTopping(toppingName);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.actionText, isAdded && styles.actionTextActive]}>
                    {isAdded ? '✓ ' : '+ '}ADD {PriceCalculator.formatPrice(addPrice)}
                  </Text>
                </TouchableOpacity>

                {/* Remove Topping Button (for pizzas that come with toppings) */}
                {removePrice === 0 && (
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      styles.removeButton,
                      isRemoved && styles.actionButtonActive,
                    ]}
                    onPress={() => {
                      if (isRemoved) {
                        onToppingRemove(toppingName);
                      } else {
                        handleRemoveTopping(toppingName);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.actionText,
                        styles.removeText,
                        isRemoved && styles.actionTextActive,
                      ]}
                    >
                      {isRemoved ? '✓ ' : '− '}NO
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
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
  toppingList: {
    maxHeight: 400,
  },
  toppingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  toppingName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  toppingButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    borderWidth: 1,
    borderColor: '#c41e3a',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  actionButtonActive: {
    backgroundColor: '#c41e3a',
  },
  removeButton: {
    borderColor: '#666',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#c41e3a',
  },
  actionTextActive: {
    color: '#fff',
  },
  removeText: {
    color: '#666',
  },
});
