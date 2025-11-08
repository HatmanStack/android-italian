import { useLocationStore } from '../../src/stores/locationStore';
import PlacesService from '../../src/services/PlacesService';
import { NearbyPlace, PlaceDetails } from '../../src/types/location.types';

// Mock PlacesService
jest.mock('../../src/services/PlacesService');

describe('locationStore', () => {
  let mockPlacesService: jest.Mocked<PlacesService>;

  beforeEach(() => {
    // Reset store state before each test
    useLocationStore.setState({
      userLocation: null,
      nearbyPlaces: [],
      selectedPlace: null,
      loading: false,
      error: null,
    });

    // Create mock PlacesService instance
    mockPlacesService = {
      getNearbyRestaurants: jest.fn(),
      getPlaceDetails: jest.fn(),
    } as unknown as jest.Mocked<PlacesService>;

    // Mock getInstance to return our mock
    (PlacesService.getInstance as jest.Mock) = jest.fn().mockReturnValue(mockPlacesService);
  });

  describe('Initial state', () => {
    it('should have correct initial state', () => {
      const state = useLocationStore.getState();

      expect(state.userLocation).toBeNull();
      expect(state.nearbyPlaces).toEqual([]);
      expect(state.selectedPlace).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('setUserLocation', () => {
    it('should update user location', () => {
      const location = { latitude: 37.39, longitude: -122.08, accuracy: 10 };

      useLocationStore.getState().setUserLocation(location);

      expect(useLocationStore.getState().userLocation).toEqual(location);
    });

    it('should update user location without accuracy', () => {
      const location = { latitude: 37.39, longitude: -122.08 };

      useLocationStore.getState().setUserLocation(location);

      expect(useLocationStore.getState().userLocation).toEqual(location);
    });
  });

  describe('fetchNearbyPlaces', () => {
    const mockNearbyPlaces: NearbyPlace[] = [
      {
        placeId: 'place-1',
        name: 'Restaurant 1',
        lat: 37.39,
        lng: -122.08,
        photoReference: 'photo-1',
        openNow: true,
      },
      {
        placeId: 'place-2',
        name: 'Restaurant 2',
        lat: 37.40,
        lng: -122.09,
        photoReference: 'photo-2',
        openNow: false,
      },
    ];

    it('should fetch nearby places and update state', async () => {
      mockPlacesService.getNearbyRestaurants.mockResolvedValue(mockNearbyPlaces);

      await useLocationStore.getState().fetchNearbyPlaces(37.39, -122.08);

      const state = useLocationStore.getState();
      expect(mockPlacesService.getNearbyRestaurants).toHaveBeenCalledWith(37.39, -122.08);
      expect(state.nearbyPlaces).toEqual(mockNearbyPlaces);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should set loading to true during fetch', async () => {
      mockPlacesService.getNearbyRestaurants.mockImplementation(() => {
        // Check loading state during async operation
        expect(useLocationStore.getState().loading).toBe(true);
        return Promise.resolve(mockNearbyPlaces);
      });

      await useLocationStore.getState().fetchNearbyPlaces(37.39, -122.08);
    });

    it('should set loading to false after successful fetch', async () => {
      mockPlacesService.getNearbyRestaurants.mockResolvedValue(mockNearbyPlaces);

      await useLocationStore.getState().fetchNearbyPlaces(37.39, -122.08);

      expect(useLocationStore.getState().loading).toBe(false);
    });

    it('should handle empty results', async () => {
      mockPlacesService.getNearbyRestaurants.mockResolvedValue([]);

      await useLocationStore.getState().fetchNearbyPlaces(37.39, -122.08);

      expect(useLocationStore.getState().nearbyPlaces).toEqual([]);
      expect(useLocationStore.getState().error).toBeNull();
    });

    it('should handle errors and set error state', async () => {
      const errorMessage = 'Failed to fetch nearby restaurants';
      mockPlacesService.getNearbyRestaurants.mockRejectedValue(new Error(errorMessage));

      await useLocationStore.getState().fetchNearbyPlaces(37.39, -122.08);

      expect(useLocationStore.getState().error).toBe(errorMessage);
      expect(useLocationStore.getState().loading).toBe(false);
      expect(useLocationStore.getState().nearbyPlaces).toEqual([]);
    });

    it('should clear previous error on successful fetch', async () => {
      // Set initial error state
      useLocationStore.setState({ error: 'Previous error' });

      mockPlacesService.getNearbyRestaurants.mockResolvedValue(mockNearbyPlaces);

      await useLocationStore.getState().fetchNearbyPlaces(37.39, -122.08);

      expect(useLocationStore.getState().error).toBeNull();
    });
  });

  describe('selectPlace', () => {
    const mockPlaceDetails: PlaceDetails = {
      placeId: 'place-1',
      name: 'Test Restaurant',
      formattedAddress: '123 Main St',
      formattedPhoneNumber: '(555) 123-4567',
      weekdayText: ['Monday: 11:00 AM – 9:00 PM'],
      photoReference: 'photo-1',
      lat: 37.39,
      lng: -122.08,
      openNow: true,
    };

    it('should fetch place details and update selectedPlace', async () => {
      mockPlacesService.getPlaceDetails.mockResolvedValue(mockPlaceDetails);

      await useLocationStore.getState().selectPlace('place-1');

      expect(mockPlacesService.getPlaceDetails).toHaveBeenCalledWith('place-1');
      expect(useLocationStore.getState().selectedPlace).toEqual(mockPlaceDetails);
      expect(useLocationStore.getState().loading).toBe(false);
      expect(useLocationStore.getState().error).toBeNull();
    });

    it('should set loading to true during fetch', async () => {
      mockPlacesService.getPlaceDetails.mockImplementation(() => {
        // Check loading state during async operation
        expect(useLocationStore.getState().loading).toBe(true);
        return Promise.resolve(mockPlaceDetails);
      });

      await useLocationStore.getState().selectPlace('place-1');
    });

    it('should set loading to false after successful fetch', async () => {
      mockPlacesService.getPlaceDetails.mockResolvedValue(mockPlaceDetails);

      await useLocationStore.getState().selectPlace('place-1');

      expect(useLocationStore.getState().loading).toBe(false);
    });

    it('should handle errors and set error state', async () => {
      const errorMessage = 'Failed to fetch place details';
      mockPlacesService.getPlaceDetails.mockRejectedValue(new Error(errorMessage));

      await useLocationStore.getState().selectPlace('place-1');

      expect(useLocationStore.getState().error).toBe(errorMessage);
      expect(useLocationStore.getState().loading).toBe(false);
      expect(useLocationStore.getState().selectedPlace).toBeNull();
    });

    it('should clear previous error on successful fetch', async () => {
      // Set initial error state
      useLocationStore.setState({ error: 'Previous error' });

      mockPlacesService.getPlaceDetails.mockResolvedValue(mockPlaceDetails);

      await useLocationStore.getState().selectPlace('place-1');

      expect(useLocationStore.getState().error).toBeNull();
    });
  });

  describe('clearSelectedPlace', () => {
    it('should clear selected place', () => {
      // Set initial selected place
      useLocationStore.setState({
        selectedPlace: {
          placeId: 'place-1',
          name: 'Test Restaurant',
          formattedAddress: '123 Main St',
          formattedPhoneNumber: '(555) 123-4567',
          weekdayText: [],
          lat: 37.39,
          lng: -122.08,
          openNow: true,
        },
      });

      useLocationStore.getState().clearSelectedPlace();

      expect(useLocationStore.getState().selectedPlace).toBeNull();
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      // Set initial error state
      useLocationStore.setState({ error: 'Test error' });

      useLocationStore.getState().clearError();

      expect(useLocationStore.getState().error).toBeNull();
    });
  });

  describe('Error message handling', () => {
    it('should handle Error objects', async () => {
      mockPlacesService.getNearbyRestaurants.mockRejectedValue(new Error('Network error'));

      await useLocationStore.getState().fetchNearbyPlaces(37.39, -122.08);

      expect(useLocationStore.getState().error).toBe('Network error');
    });

    it('should handle string errors', async () => {
      mockPlacesService.getNearbyRestaurants.mockRejectedValue('String error');

      await useLocationStore.getState().fetchNearbyPlaces(37.39, -122.08);

      expect(useLocationStore.getState().error).toBe('String error');
    });

    it('should handle unknown errors', async () => {
      mockPlacesService.getNearbyRestaurants.mockRejectedValue({ code: 500 });

      await useLocationStore.getState().fetchNearbyPlaces(37.39, -122.08);

      expect(useLocationStore.getState().error).toBe('An unknown error occurred');
    });
  });
});
