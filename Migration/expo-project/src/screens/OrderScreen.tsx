import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation.types';
import { Topping, OrderItem } from '../types/order.types';
import { MenuCategory } from '../types/menu.types';
import { SizeSelector, getSizesForItem } from '../components/OrderCustomization/SizeSelector';
import { ToppingSelector } from '../components/OrderCustomization/ToppingSelector';
import { CrustSelector } from '../components/OrderCustomization/CrustSelector';
import { CommentsInput } from '../components/OrderCustomization/CommentsInput';
import { PriceCalculator } from '../utils/priceCalculator';
import { crustTypes } from '../data/priceArrays';
import { useOrderStore } from '../stores/orderStore';

type OrderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Order'>;
type OrderScreenRouteProp = RouteProp<RootStackParamList, 'Order'>;

interface Props {
  navigation: OrderScreenNavigationProp;
  route: OrderScreenRouteProp;
}

export const OrderScreen: React.FC<Props> = ({ navigation, route }) => {
  const { menuItem } = route.params;
  const { addItem } = useOrderStore();

  // Order customization state
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [toppingsAdded, setToppingsAdded] = useState<Topping[]>([]);
  const [toppingsRemoved, setToppingsRemoved] = useState<Topping[]>([]);
  const [crustIndex, setCrustIndex] = useState(0);
  const [comments, setComments] = useState('');

  // Calculate current price
  const basePrice = PriceCalculator.getBasePrice(menuItem, selectedSizeIndex);
  const crustPrice = PriceCalculator.getCrustPrice(crustIndex);
  const totalPrice = PriceCalculator.calculateOrderItemTotal(
    basePrice,
    toppingsAdded,
    toppingsRemoved,
    crustPrice
  );

  const handleSizeChange = useCallback((sizeIndex: number) => {
    setSelectedSizeIndex(sizeIndex);
    // Reset toppings when size changes (prices vary by size)
    setToppingsAdded([]);
    setToppingsRemoved([]);
  }, []);

  const handleToppingAdd = useCallback((topping: Topping) => {
    setToppingsAdded((prev) => [...prev, topping]);
  }, []);

  const handleToppingRemove = useCallback((toppingName: string) => {
    setToppingsAdded((prev) => prev.filter((t) => t.name !== toppingName));
  }, []);

  const handleCrustChange = useCallback((index: number) => {
    setCrustIndex(index);
  }, []);

  const handleCommentsChange = useCallback((text: string) => {
    setComments(text);
  }, []);

  /**
   * Build human-readable order summary
   * Mirrors Android OrderActivity.buildOrderString()
   */
  const buildOrderSummary = useCallback((): string => {
    const sizes = getSizesForItem(menuItem);
    const sizeName = sizes[selectedSizeIndex];

    let summary = `${sizeName} ${menuItem.title}`;

    // Add crust type if applicable and not original
    if (menuItem.category === MenuCategory.PIZZA && crustIndex !== 0) {
      summary += ` - ${crustTypes[crustIndex]}`;
    }

    // Add toppings
    const addedToppings = toppingsAdded.filter((t) => t.direction === 'ADD');
    const removedToppings = toppingsAdded.filter((t) => t.direction === 'REMOVE');

    if (addedToppings.length > 0) {
      summary += '\n+ ' + addedToppings.map((t) => t.name).join(', ');
    }

    if (removedToppings.length > 0) {
      summary += '\n- ' + removedToppings.map((t) => t.name).join(', ');
    }

    // Add comments
    if (comments.trim()) {
      summary += `\nNote: ${comments.trim()}`;
    }

    return summary;
  }, [menuItem, selectedSizeIndex, crustIndex, toppingsAdded, comments]);

  const handleAddToCart = useCallback(() => {
    const sizes = getSizesForItem(menuItem);
    const orderItem: OrderItem = {
      id: `${Date.now()}-${Math.random()}`, // Generate unique ID
      menuItem,
      size: sizes[selectedSizeIndex],
      sizeIndex: selectedSizeIndex,
      toppingsAdded,
      toppingsRemoved: [], // Not using toppingsRemoved separately, REMOVE direction is in toppingsAdded
      crustType: menuItem.category === MenuCategory.PIZZA ? crustTypes[crustIndex] : undefined,
      comments: comments.trim() || undefined,
      totalPrice,
      orderSummary: buildOrderSummary(),
    };

    addItem(orderItem);

    // Show confirmation and navigate to checkout
    Alert.alert(
      'Added to Cart',
      `${menuItem.title} has been added to your cart.`,
      [
        { text: 'Continue Shopping', onPress: () => navigation.goBack() },
        { text: 'View Cart', onPress: () => navigation.navigate('Checkout') },
      ]
    );
  }, [
    menuItem,
    selectedSizeIndex,
    toppingsAdded,
    crustIndex,
    comments,
    totalPrice,
    buildOrderSummary,
    addItem,
    navigation,
  ]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header with image and title */}
        <View style={styles.header}>
          <Image source={menuItem.image} style={styles.image} resizeMode="cover" />
          <Text style={styles.title}>{menuItem.title}</Text>
          <Text style={styles.description}>{menuItem.description}</Text>
        </View>

        {/* Size Selector */}
        <SizeSelector
          item={menuItem}
          selectedSizeIndex={selectedSizeIndex}
          onSizeChange={handleSizeChange}
        />

        {/* Topping Selector */}
        <ToppingSelector
          category={menuItem.category}
          sizeIndex={selectedSizeIndex}
          toppingsAdded={toppingsAdded}
          toppingsRemoved={toppingsRemoved}
          onToppingAdd={handleToppingAdd}
          onToppingRemove={handleToppingRemove}
        />

        {/* Crust Selector */}
        <CrustSelector
          category={menuItem.category}
          selectedCrustIndex={crustIndex}
          onCrustChange={handleCrustChange}
        />

        {/* Comments Input */}
        <CommentsInput value={comments} onChangeText={handleCommentsChange} />

        {/* Price Display */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Current Price:</Text>
          <Text style={styles.priceValue}>{PriceCalculator.formatPrice(totalPrice)}</Text>
        </View>

        {/* Add to Cart Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddToCart} activeOpacity={0.8}>
            <Text style={styles.addButtonText}>Add to Cart</Text>
            <Text style={styles.addButtonPrice}>{PriceCalculator.formatPrice(totalPrice)}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  priceContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c41e3a',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    paddingBottom: 32,
  },
  addButton: {
    backgroundColor: '#c41e3a',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  addButtonPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
