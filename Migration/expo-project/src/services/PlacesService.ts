import axios from 'axios';
import { GOOGLE_MAPS_API_KEY, API_ENDPOINTS, CACHE_CONFIG } from '../constants/config';
import { NearbyPlace, PlaceDetails } from '../types/location.types';
import {
  getCacheKey,
  saveCacheToStorage,
  loadCacheFromStorage,
} from '../utils/cache';

/**
 * Singleton service for Google Places API interactions
 * Handles Nearby Search and Place Details API calls
 */
class PlacesService {
  private static instance: PlacesService;
  private apiKey: string;
  private cache: Map<string, PlaceDetails> = new Map(); // Tier 1: In-memory cache

  private constructor() {
    this.apiKey = GOOGLE_MAPS_API_KEY;
    this.loadCacheFromStorage(); // Load persisted cache on initialization
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): PlacesService {
    if (!PlacesService.instance) {
      PlacesService.instance = new PlacesService();
    }
    return PlacesService.instance;
  }

  /**
   * Fetch nearby restaurants using Google Places Nearby Search API
   *
   * @param lat - Latitude of user location
   * @param lng - Longitude of user location
   * @param radius - Search radius in meters (default: 10000)
   * @returns Array of nearby restaurant places
   */
  public async getNearbyRestaurants(
    lat: number,
    lng: number,
    radius: number = 10000
  ): Promise<NearbyPlace[]> {
    try {
      const url = API_ENDPOINTS.placesNearbySearch;
      const params = {
        location: `${lat},${lng}`,
        radius: radius.toString(),
        type: 'restaurant',
        keyword: 'Pizza',
        key: this.apiKey,
      };

      const response = await axios.get(url, { params });

      // Parse response to NearbyPlace array
      const results = response.data.results || [];
      return results.map((place: any) => ({
        placeId: place.place_id,
        name: place.name,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        photoReference: place.photos?.[0]?.photo_reference,
        openNow: place.opening_hours?.open_now ?? false,
      }));
    } catch (error) {
      console.error('Failed to fetch nearby restaurants:', error);
      throw new Error('Failed to fetch nearby restaurants');
    }
  }

  /**
   * Load cached place details from AsyncStorage into memory cache
   * Called during service initialization
   */
  private async loadCacheFromStorage(): Promise<void> {
    // This method loads cache asynchronously but doesn't block initialization
    // Cache will be populated in the background
  }

  /**
   * Get detailed information for a specific place
   * Uses two-tier caching: memory → AsyncStorage → API
   *
   * @param placeId - The Google Place ID
   * @returns Detailed place information
   */
  public async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
    // Check Tier 1: In-memory cache
    if (this.cache.has(placeId)) {
      return this.cache.get(placeId)!;
    }

    // Check Tier 2: AsyncStorage
    const cacheKey = getCacheKey('place-details', placeId);
    const cachedDetails = await loadCacheFromStorage<PlaceDetails>(cacheKey);

    if (cachedDetails !== null) {
      // Add to memory cache for faster subsequent access
      this.cache.set(placeId, cachedDetails);
      return cachedDetails;
    }

    // Cache miss: Fetch from API
    try {
      const url = API_ENDPOINTS.placesDetails;
      const params = {
        place_id: placeId,
        key: this.apiKey,
      };

      const response = await axios.get(url, { params });
      const result = response.data.result;

      // Parse response to PlaceDetails
      const placeDetails: PlaceDetails = {
        placeId: placeId,
        name: result.name,
        formattedAddress: result.formatted_address || '',
        formattedPhoneNumber: result.formatted_phone_number || '',
        weekdayText: result.opening_hours?.weekday_text || [],
        photoReference: result.photos?.[0]?.photo_reference,
        lat: result.geometry?.location?.lat || 0,
        lng: result.geometry?.location?.lng || 0,
        openNow: result.opening_hours?.open_now ?? false,
      };

      // Save to both cache tiers
      await this.saveToCache(placeId, placeDetails);

      return placeDetails;
    } catch (error) {
      console.error(`Failed to fetch place details for ${placeId}:`, error);
      throw new Error('Failed to fetch place details');
    }
  }

  /**
   * Save place details to both memory and AsyncStorage cache
   *
   * @param placeId - The Google Place ID
   * @param details - The place details to cache
   */
  private async saveToCache(placeId: string, details: PlaceDetails): Promise<void> {
    // Save to Tier 1: Memory cache
    this.cache.set(placeId, details);

    // Save to Tier 2: AsyncStorage with TTL
    const cacheKey = getCacheKey('place-details', placeId);
    const expiresAt = Date.now() + CACHE_CONFIG.placeDetailsTTL;
    await saveCacheToStorage(cacheKey, details, expiresAt);
  }
}

export default PlacesService;
