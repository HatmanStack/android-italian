import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation.types';
import { MenuScreen } from '../screens/MenuScreen';
import { OrderScreen } from '../screens/OrderScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { MapScreen } from '../screens/MapScreen';
import { NutritionScreen } from '../screens/NutritionScreen';
import { ContactScreen } from '../screens/ContactScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Menu"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#c41e3a', // Italian red
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{ title: 'Italian Restaurant Menu' }}
        />
        <Stack.Screen
          name="Order"
          component={OrderScreen}
          options={{ title: 'Customize Order' }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ title: 'Shopping Cart' }}
        />
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{ title: 'Find Restaurants' }}
        />
        <Stack.Screen
          name="Nutrition"
          component={NutritionScreen}
          options={{ title: 'Nutrition Facts' }}
        />
        <Stack.Screen
          name="Contact"
          component={ContactScreen}
          options={{ title: 'Contact Us' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
