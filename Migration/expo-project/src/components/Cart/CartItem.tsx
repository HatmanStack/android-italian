import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { OrderItem } from '../../types/order.types';
import { PriceCalculator } from '../../utils/priceCalculator';

interface Props {
  item: OrderItem;
  onRemove: (itemId: string) => void;
}

const CartItemComponent: React.FC<Props> = ({ item, onRemove }) => {
  const handleRemove = useCallback(() => {
    onRemove(item.id);
  }, [onRemove, item.id]);

  return (
    <View style={styles.container}>
      <FastImage source={item.menuItem.image} style={styles.image} resizeMode={FastImage.resizeMode.cover} />

      <View style={styles.content}>
        <Text style={styles.title}>{item.menuItem.title}</Text>
        <Text style={styles.summary} numberOfLines={4}>
          {item.orderSummary}
        </Text>
        <Text style={styles.price}>{PriceCalculator.formatPrice(item.totalPrice)}</Text>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={handleRemove}
        activeOpacity={0.7}
      >
        <Text style={styles.removeIcon}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  summary: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c41e3a',
    marginTop: 4,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  removeIcon: {
    fontSize: 24,
    color: '#666',
    fontWeight: '300',
  },
});

export const CartItem = React.memo(CartItemComponent);
