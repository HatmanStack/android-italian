import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MenuItem as MenuItemType } from '../types/menu.types';

interface Props {
  item: MenuItemType;
  onPress: (item: MenuItemType) => void;
  onNutritionPress?: (itemName: string) => void;
}

export const MenuItem: React.FC<Props> = ({ item, onPress, onNutritionPress }) => {
  const handleNutritionPress = (e: any) => {
    e.stopPropagation();
    onNutritionPress?.(item.title);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <Image source={item.image} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          {onNutritionPress && (
            <TouchableOpacity
              style={styles.infoButton}
              onPress={handleNutritionPress}
              activeOpacity={0.7}
            >
              <Text style={styles.infoIcon}>ℹ️</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  infoButton: {
    padding: 4,
    marginLeft: 8,
  },
  infoIcon: {
    fontSize: 16,
  },
  description: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});
