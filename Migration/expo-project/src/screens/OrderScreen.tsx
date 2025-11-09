import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation.types';
import { Topping } from '../types/order.types';
import { SizeSelector } from '../components/OrderCustomization/SizeSelector';
import { PriceCalculator } from '../utils/priceCalculator';

type OrderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Order'>;
type OrderScreenRouteProp = RouteProp<RootStackParamList, 'Order'>;

interface Props {
  navigation: OrderScreenNavigationProp;
  route: OrderScreenRouteProp;
}

export const OrderScreen: React.FC<Props> = ({ navigation, route }) => {
  const { menuItem } = route.params;

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

        {/* Price Display */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Current Price:</Text>
          <Text style={styles.priceValue}>{PriceCalculator.formatPrice(totalPrice)}</Text>
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
});
