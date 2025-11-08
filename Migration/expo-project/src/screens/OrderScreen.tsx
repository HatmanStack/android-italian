import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation.types';

type OrderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Order'>;
type OrderScreenRouteProp = RouteProp<RootStackParamList, 'Order'>;

interface Props {
  navigation: OrderScreenNavigationProp;
  route: OrderScreenRouteProp;
}

export const OrderScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Screen</Text>
      <Text style={styles.subtitle}>Customize your order (Coming in Phase 4)</Text>
      <View style={styles.buttonContainer}>
        <Button title="Go to Checkout" onPress={() => navigation.navigate('Checkout')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
