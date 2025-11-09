import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MenuCategory } from '../types/menu.types';

interface Props {
  selectedCategory: MenuCategory;
  onCategoryChange: (category: MenuCategory) => void;
}

const CATEGORIES = [
  { key: MenuCategory.PIZZA, label: 'Pizza' },
  { key: MenuCategory.SANDWICHES, label: 'Sandwiches' },
  { key: MenuCategory.PASTA, label: 'Pasta' },
  { key: MenuCategory.APPETIZERS, label: 'Appetizers' },
  { key: MenuCategory.DESSERTS, label: 'Desserts' },
  { key: MenuCategory.SALADS, label: 'Salads' },
];

export const CategoryTabs: React.FC<Props> = ({ selectedCategory, onCategoryChange }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.key;
          return (
            <TouchableOpacity
              key={category.key}
              style={[styles.tab, isSelected && styles.tabActive]}
              onPress={() => onCategoryChange(category.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  tabActive: {
    backgroundColor: '#c41e3a',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  tabTextActive: {
    color: '#fff',
  },
});
