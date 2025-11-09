import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation.types';
import { MenuCategory, MenuItem as MenuItemType } from '../types/menu.types';
import { getMenuItemsByCategory } from '../data/menuData';
import { CategoryTabs } from '../components/CategoryTabs';
import { MenuItem } from '../components/MenuItem';

type MenuScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Menu'>;

interface Props {
  navigation: MenuScreenNavigationProp;
}

export const MenuScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>(MenuCategory.PIZZA);

  const menuItems = getMenuItemsByCategory(selectedCategory);

  const handleCategoryChange = useCallback((category: MenuCategory) => {
    setSelectedCategory(category);
  }, []);

  const handleMenuItemPress = useCallback(
    (item: MenuItemType) => {
      navigation.navigate('Order', { menuItem: item });
    },
    [navigation]
  );

  const renderMenuItem = useCallback(
    ({ item }: { item: MenuItemType }) => (
      <MenuItem item={item} onPress={handleMenuItemPress} />
    ),
    [handleMenuItemPress]
  );

  const keyExtractor = useCallback((item: MenuItemType) => item.id, []);

  return (
    <View style={styles.container}>
      <CategoryTabs
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
      />
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
});
