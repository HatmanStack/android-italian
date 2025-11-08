import axios from 'axios';
import { GOOGLE_MAPS_API_KEY, API_ENDPOINTS } from '../constants/config';
import { NearbyPlace } from '../types/location.types';

/**
 * Singleton service for Google Places API interactions
 * Handles Nearby Search and Place Details API calls
 */
class PlacesService {
  private static instance: PlacesService;
  private apiKey: string;

  private constructor() {
    this.apiKey = GOOGLE_MAPS_API_KEY;
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
}

export default PlacesService;
