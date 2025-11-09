/**
 * Basic restaurant info from Nearby Search API
 * Mirrors Android's LocationHelper initial data
 */
export interface NearbyPlace {
  placeId: string;
  name: string;
  lat: number;
  lng: number;
  photoReference?: string;
  openNow: boolean;
}

/**
 * Detailed restaurant info from Place Details API
 * Mirrors Android's LocationHelper detailed data
 */
export interface PlaceDetails {
  placeId: string;
  name: string;
  formattedAddress: string;
  formattedPhoneNumber?: string;
  weekdayText?: string[]; // Hours (array of strings)
  photoReference?: string;
  lat: number;
  lng: number;
  openNow: boolean;
}

/**
 * Cache entry with TTL
 */
export interface CachedPlaceDetails {
  data: PlaceDetails;
  timestamp: number; // Unix timestamp
  expiresAt: number; // Unix timestamp
}

/**
 * User location
 */
export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}
