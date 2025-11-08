import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation.types';

type NutritionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Nutrition'>;
type NutritionScreenRouteProp = RouteProp<RootStackParamList, 'Nutrition'>;

interface Props {
  navigation: NutritionScreenNavigationProp;
  route: NutritionScreenRouteProp;
}

export const NutritionScreen: React.FC<Props> = ({ route }) => {
  const { itemName } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nutrition Screen</Text>
      <Text style={styles.subtitle}>Nutrition info for: {itemName}</Text>
      <Text style={styles.subtitle}>(Coming in Phase 4)</Text>
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
});
