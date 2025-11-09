import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation.types';
import { getNutritionByName } from '../utils/nutritionHelper';

type NutritionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Nutrition'>;
type NutritionScreenRouteProp = RouteProp<RootStackParamList, 'Nutrition'>;

interface Props {
  navigation: NutritionScreenNavigationProp;
  route: NutritionScreenRouteProp;
}

export const NutritionScreen: React.FC<Props> = ({ route }) => {
  const { itemName } = route.params;
  const nutritionFacts = getNutritionByName(itemName);

  if (!nutritionFacts) {
    return (
      <View style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundIcon}>📊</Text>
          <Text style={styles.notFoundTitle}>Nutrition Data Not Available</Text>
          <Text style={styles.notFoundSubtitle}>
            We don&apos;t have nutrition information for &quot;{itemName}&quot; at this time.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.labelContainer}>
        {/* Title */}
        <Text style={styles.itemName}>{nutritionFacts.itemName}</Text>
        <View style={styles.divider} />

        {/* Calories */}
        <View style={styles.caloriesSection}>
          <Text style={styles.caloriesLabel}>Calories</Text>
          <Text style={styles.caloriesValue}>{nutritionFacts.calories}</Text>
        </View>

        <View style={styles.smallDivider} />
        <Text style={styles.dailyValueHeader}>% Daily Value*</Text>
        <View style={styles.divider} />

        {/* Total Fat */}
        <View style={styles.nutrientRow}>
          <Text style={styles.nutrientLabel}>
            <Text style={styles.bold}>Total Fat</Text> {nutritionFacts.totalFat}g
          </Text>
          <Text style={styles.dailyValue}>{Math.round((nutritionFacts.totalFat / 78) * 100)}%</Text>
        </View>

        {/* Saturated Fat */}
        <View style={[styles.nutrientRow, styles.subNutrient]}>
          <Text style={styles.nutrientLabel}>Saturated Fat {nutritionFacts.saturatedFat}g</Text>
          <Text style={styles.dailyValue}>
            {Math.round((nutritionFacts.saturatedFat / 20) * 100)}%
          </Text>
        </View>

        {/* Trans Fat */}
        <View style={[styles.nutrientRow, styles.subNutrient]}>
          <Text style={styles.nutrientLabel}>Trans Fat {nutritionFacts.transFat}g</Text>
        </View>

        <View style={styles.thinDivider} />

        {/* Cholesterol */}
        <View style={styles.nutrientRow}>
          <Text style={styles.nutrientLabel}>
            <Text style={styles.bold}>Cholesterol</Text> {nutritionFacts.cholesterol}mg
          </Text>
          <Text style={styles.dailyValue}>
            {Math.round((nutritionFacts.cholesterol / 300) * 100)}%
          </Text>
        </View>

        <View style={styles.thinDivider} />

        {/* Sodium */}
        <View style={styles.nutrientRow}>
          <Text style={styles.nutrientLabel}>
            <Text style={styles.bold}>Sodium</Text> {nutritionFacts.sodium}mg
          </Text>
          <Text style={styles.dailyValue}>
            {Math.round((nutritionFacts.sodium / 2300) * 100)}%
          </Text>
        </View>

        <View style={styles.thinDivider} />

        {/* Total Carbohydrate */}
        <View style={styles.nutrientRow}>
          <Text style={styles.nutrientLabel}>
            <Text style={styles.bold}>Total Carbohydrate</Text> {nutritionFacts.totalCarbohydrate}g
          </Text>
          <Text style={styles.dailyValue}>
            {Math.round((nutritionFacts.totalCarbohydrate / 275) * 100)}%
          </Text>
        </View>

        {/* Dietary Fiber */}
        <View style={[styles.nutrientRow, styles.subNutrient]}>
          <Text style={styles.nutrientLabel}>Dietary Fiber {nutritionFacts.dietaryFiber}g</Text>
          <Text style={styles.dailyValue}>
            {Math.round((nutritionFacts.dietaryFiber / 28) * 100)}%
          </Text>
        </View>

        {/* Sugars */}
        <View style={[styles.nutrientRow, styles.subNutrient]}>
          <Text style={styles.nutrientLabel}>Sugars {nutritionFacts.sugars}g</Text>
        </View>

        <View style={styles.divider} />

        {/* Protein */}
        <View style={styles.nutrientRow}>
          <Text style={styles.nutrientLabel}>
            <Text style={styles.bold}>Protein</Text> {nutritionFacts.protein}g
          </Text>
        </View>

        <View style={styles.thickDivider} />

        {/* Footer Note */}
        <Text style={styles.footnote}>
          * Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher
          or lower depending on your calorie needs.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  labelContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#333',
  },
  itemName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  divider: {
    height: 8,
    backgroundColor: '#333',
    marginVertical: 4,
  },
  thinDivider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 2,
  },
  smallDivider: {
    height: 4,
    backgroundColor: '#333',
    marginVertical: 4,
  },
  thickDivider: {
    height: 12,
    backgroundColor: '#333',
    marginVertical: 4,
  },
  caloriesSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginVertical: 8,
  },
  caloriesLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  caloriesValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  dailyValueHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
    marginVertical: 4,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  subNutrient: {
    paddingLeft: 16,
  },
  nutrientLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  bold: {
    fontWeight: 'bold',
  },
  dailyValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 40,
    textAlign: 'right',
  },
  footnote: {
    fontSize: 11,
    color: '#666',
    lineHeight: 16,
    marginTop: 8,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  notFoundIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  notFoundSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
