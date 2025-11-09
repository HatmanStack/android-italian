import Constants from 'expo-constants';

/**
 * Application configuration constants
 */

// Google Maps API Key from app.json extra config
const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;

// Validate API key is configured (allow placeholder in test environment)
if (
  (!apiKey || apiKey === 'your_api_key_here') &&
  process.env.NODE_ENV !== 'test'
) {
  console.error(
    '⚠️  GOOGLE_MAPS_API_KEY is not configured!\n' +
    'Please set it in your .env file:\n' +
    '  GOOGLE_MAPS_API_KEY=your_actual_key_here\n' +
    'See Migration/expo-project/.env.example for details.'
  );
}

export const GOOGLE_MAPS_API_KEY = apiKey || 'your_api_key_here';

// Map configuration
export const MAP_CONFIG = {
  initialRegion: {
    latitude: 37.7749, // San Francisco (default)
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  nearbySearchRadius: 10000, // 10km in meters
  searchKeyword: 'Pizza',
  searchType: 'restaurant',
};

// Cache configuration
export const CACHE_CONFIG = {
  placeDetailsTTL: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
};

// API endpoints
export const API_ENDPOINTS = {
  placesNearbySearch: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
  placesDetails: 'https://maps.googleapis.com/maps/api/place/details/json',
  placesPhoto: 'https://maps.googleapis.com/maps/api/place/photo',
};
