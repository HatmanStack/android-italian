import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation.types';
import { useOrderStore } from '../stores/orderStore';
import { CartItem } from '../components/Cart/CartItem';
import { OrderItem } from '../types/order.types';
import { PriceCalculator } from '../utils/priceCalculator';

type CheckoutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Checkout'>;

interface Props {
  navigation: CheckoutScreenNavigationProp;
}

export const CheckoutScreen: React.FC<Props> = ({ navigation }) => {
  const { cart, removeItem, clearCart } = useOrderStore();
  const { items, totalCost } = cart;

  const handleRemoveItem = useCallback(
    (itemId: string) => {
      Alert.alert('Remove Item', 'Remove this item from your cart?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeItem(itemId),
        },
      ]);
    },
    [removeItem]
  );

  const handleClearCart = useCallback(() => {
    if (items.length === 0) return;

    Alert.alert('Clear Cart', 'Remove all items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: () => {
          clearCart();
          Alert.alert('Cart Cleared', 'All items have been removed from your cart.');
        },
      },
    ]);
  }, [items.length, clearCart]);

  const handlePlaceOrder = useCallback(() => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before placing an order.');
      return;
    }

    // In a real app, this would send the order to a backend
    // For now, we'll show a success message and clear the cart
    Alert.alert(
      'Order Placed',
      `Your order of ${items.length} item(s) totaling ${PriceCalculator.formatPrice(totalCost)} has been placed!\n\nThank you for your order!`,
      [
        {
          text: 'OK',
          onPress: () => {
            clearCart();
            navigation.navigate('Menu');
          },
        },
      ]
    );
  }, [items.length, totalCost, clearCart, navigation]);

  const renderItem = useCallback(
    ({ item }: { item: OrderItem }) => <CartItem item={item} onRemove={handleRemoveItem} />,
    [handleRemoveItem]
  );

  const keyExtractor = useCallback((item: OrderItem) => item.id, []);

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🛒</Text>
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>Add items from the menu to get started</Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => navigation.navigate('Menu')}
        activeOpacity={0.8}
      >
        <Text style={styles.shopButtonText}>Browse Menu</Text>
      </TouchableOpacity>
    </View>
  );

  if (items.length === 0) {
    return <View style={styles.container}>{renderEmptyCart()}</View>;
  }

  return (
    <View style={styles.container}>
      {/* Cart Items List */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Your Order</Text>
            <TouchableOpacity onPress={handleClearCart}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Order Summary Footer */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>{PriceCalculator.formatPrice(totalCost)}</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tax (6.25%)</Text>
          <Text style={styles.totalValue}>
            {PriceCalculator.formatPrice(Math.round(totalCost * 0.0625))}
          </Text>
        </View>

        <View style={[styles.totalRow, styles.grandTotalRow]}>
          <Text style={styles.grandTotalLabel}>Total</Text>
          <Text style={styles.grandTotalValue}>
            {PriceCalculator.formatPrice(Math.round(totalCost * 1.0625))}
          </Text>
        </View>

        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder} activeOpacity={0.8}>
          <Text style={styles.placeOrderText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  clearText: {
    fontSize: 14,
    color: '#c41e3a',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: '#c41e3a',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  shopButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  totalLabel: {
    fontSize: 15,
    color: '#666',
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 8,
    paddingTop: 12,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c41e3a',
  },
  placeOrderButton: {
    backgroundColor: '#c41e3a',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  placeOrderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
