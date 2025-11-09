/**
 * Setup tests to verify project configuration
 */

import { GOOGLE_MAPS_API_KEY, MAP_CONFIG, CACHE_CONFIG } from '../src/constants/config';
import { MenuCategory } from '../src/types/menu.types';

describe('Project Setup', () => {
  describe('Environment Configuration', () => {
    it('should have Google Maps API key defined', () => {
      expect(GOOGLE_MAPS_API_KEY).toBeDefined();
      expect(typeof GOOGLE_MAPS_API_KEY).toBe('string');
    });

    it('should have map configuration defined', () => {
      expect(MAP_CONFIG).toBeDefined();
      expect(MAP_CONFIG.initialRegion).toBeDefined();
      expect(MAP_CONFIG.initialRegion.latitude).toBeDefined();
      expect(MAP_CONFIG.initialRegion.longitude).toBeDefined();
    });

    it('should have cache configuration defined', () => {
      expect(CACHE_CONFIG).toBeDefined();
      expect(CACHE_CONFIG.placeDetailsTTL).toBeGreaterThan(0);
    });
  });

  describe('TypeScript Types', () => {
    it('should have MenuCategory enum defined', () => {
      expect(MenuCategory.PIZZA).toBe('pizza');
      expect(MenuCategory.SANDWICHES).toBe('sandwiches');
      expect(MenuCategory.PASTA).toBe('pasta');
      expect(MenuCategory.APPETIZERS).toBe('appetizers');
      expect(MenuCategory.DESSERTS).toBe('desserts');
      expect(MenuCategory.SALADS).toBe('salads');
    });
  });

  describe('Constants', () => {
    it('should have valid initial map region', () => {
      expect(MAP_CONFIG.initialRegion.latitude).toBeGreaterThanOrEqual(-90);
      expect(MAP_CONFIG.initialRegion.latitude).toBeLessThanOrEqual(90);
      expect(MAP_CONFIG.initialRegion.longitude).toBeGreaterThanOrEqual(-180);
      expect(MAP_CONFIG.initialRegion.longitude).toBeLessThanOrEqual(180);
    });

    it('should have valid nearby search radius', () => {
      expect(MAP_CONFIG.nearbySearchRadius).toBeGreaterThan(0);
      expect(MAP_CONFIG.nearbySearchRadius).toBe(10000); // 10km
    });
  });
});
