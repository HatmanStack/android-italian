import { MenuItem } from './menu.types';

/**
 * Type-safe navigation parameter list
 * Defines the params for each screen in the app
 */
export type RootStackParamList = {
  Menu: undefined;
  Order: {
    menuItem: MenuItem;
  };
  Checkout: undefined;
  Map: undefined;
  Nutrition: {
    itemName: string;
  };
  Contact: undefined;
};
