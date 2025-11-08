import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PlacesService from '../services/PlacesService';
import { UserLocation, NearbyPlace, PlaceDetails } from '../types/location.types';

/**
 * Location store state interface
 */
interface LocationState {
  // State
  userLocation: UserLocation | null;
  nearbyPlaces: NearbyPlace[];
  selectedPlace: PlaceDetails | null;
  loading: boolean;
  error: string | null;

  // Actions
  setUserLocation: (location: UserLocation) => void;
  fetchNearbyPlaces: (lat: number, lng: number) => Promise<void>;
  selectPlace: (placeId: string) => Promise<void>;
  clearSelectedPlace: () => void;
  clearError: () => void;
}

/**
 * Zustand store for location state management
 * Uses PlacesService for API calls and caching
 *
 * Persistence:
 * - nearbyPlaces: persisted (optional, may become stale)
 * - userLocation: NOT persisted (privacy concern)
 * - UI state (loading, selectedPlace, error): NOT persisted
 */
export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      // Initial state
      userLocation: null,
      nearbyPlaces: [],
      selectedPlace: null,
      loading: false,
      error: null,

      // Actions
      setUserLocation: (location: UserLocation) => {
        set({ userLocation: location });
      },

      fetchNearbyPlaces: async (lat: number, lng: number) => {
        set({ loading: true, error: null });
        try {
          const placesService = PlacesService.getInstance();
          const places = await placesService.getNearbyRestaurants(lat, lng);
          set({ nearbyPlaces: places, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error
            ? error.message
            : typeof error === 'string'
            ? error
            : 'An unknown error occurred';
          set({ error: errorMessage, loading: false, nearbyPlaces: [] });
        }
      },

      selectPlace: async (placeId: string) => {
        set({ loading: true, error: null });
        try {
          const placesService = PlacesService.getInstance();
          const placeDetails = await placesService.getPlaceDetails(placeId);
          set({ selectedPlace: placeDetails, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error
            ? error.message
            : typeof error === 'string'
            ? error
            : 'An unknown error occurred';
          set({ error: errorMessage, loading: false, selectedPlace: null });
        }
      },

      clearSelectedPlace: () => {
        set({ selectedPlace: null });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'location-storage', // Storage key
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist nearbyPlaces (partial persistence)
      partialPersist: true,
      partialize: (state) => ({
        nearbyPlaces: state.nearbyPlaces,
      }),
    }
  )
);
