/**
 * Navigation tests to verify screens exist
 */

/* eslint-disable @typescript-eslint/no-var-requires */

describe('RootNavigator Configuration', () => {
  it('should have screen components exported', () => {
    const { MenuScreen } = require('../../src/screens/MenuScreen');
    const { OrderScreen } = require('../../src/screens/OrderScreen');
    const { CheckoutScreen } = require('../../src/screens/CheckoutScreen');
    const { MapScreen } = require('../../src/screens/MapScreen');
    const { NutritionScreen } = require('../../src/screens/NutritionScreen');
    const { ContactScreen } = require('../../src/screens/ContactScreen');

    expect(MenuScreen).toBeDefined();
    expect(OrderScreen).toBeDefined();
    expect(CheckoutScreen).toBeDefined();
    expect(MapScreen).toBeDefined();
    expect(NutritionScreen).toBeDefined();
    expect(ContactScreen).toBeDefined();
  });

  it('should have RootNavigator exported', () => {
    const { RootNavigator } = require('../../src/navigation/RootNavigator');
    expect(RootNavigator).toBeDefined();
    expect(typeof RootNavigator).toBe('function');
  });

  it('should have navigation types defined', () => {
    const navigationTypes = require('../../src/types/navigation.types');
    expect(navigationTypes).toBeDefined();
  });
});
