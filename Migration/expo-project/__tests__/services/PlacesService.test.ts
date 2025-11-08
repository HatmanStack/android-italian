import axios from 'axios';
import PlacesService from '../../src/services/PlacesService';
import * as cache from '../../src/utils/cache';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock cache utilities
jest.mock('../../src/utils/cache');

describe('PlacesService', () => {
  let service: PlacesService;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset singleton instance for each test to clear memory cache
    // @ts-ignore - Accessing private static property for testing
    PlacesService.instance = undefined;
    service = PlacesService.getInstance();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = PlacesService.getInstance();
      const instance2 = PlacesService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('getNearbyRestaurants', () => {
    it('should fetch nearby restaurants successfully', async () => {
      const mockResponse = {
        data: {
          results: [
            {
              place_id: 'test-id-1',
              name: 'Test Restaurant 1',
              geometry: {
                location: {
                  lat: 37.39,
                  lng: -122.08,
                },
              },
              photos: [{ photo_reference: 'photo-ref-1' }],
              opening_hours: { open_now: true },
            },
            {
              place_id: 'test-id-2',
              name: 'Test Restaurant 2',
              geometry: {
                location: {
                  lat: 37.40,
                  lng: -122.09,
                },
              },
              photos: [{ photo_reference: 'photo-ref-2' }],
              opening_hours: { open_now: false },
            },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const places = await service.getNearbyRestaurants(37.39, -122.08);

      expect(places).toHaveLength(2);
      expect(places[0]).toEqual({
        placeId: 'test-id-1',
        name: 'Test Restaurant 1',
        lat: 37.39,
        lng: -122.08,
        photoReference: 'photo-ref-1',
        openNow: true,
      });
      expect(places[1]).toEqual({
        placeId: 'test-id-2',
        name: 'Test Restaurant 2',
        lat: 37.40,
        lng: -122.09,
        photoReference: 'photo-ref-2',
        openNow: false,
      });
    });

    it('should handle places without photos', async () => {
      const mockResponse = {
        data: {
          results: [
            {
              place_id: 'test-id',
              name: 'Test Restaurant',
              geometry: {
                location: {
                  lat: 37.39,
                  lng: -122.08,
                },
              },
              // No photos
              opening_hours: { open_now: true },
            },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const places = await service.getNearbyRestaurants(37.39, -122.08);

      expect(places).toHaveLength(1);
      expect(places[0].photoReference).toBeUndefined();
    });

    it('should handle places without opening hours', async () => {
      const mockResponse = {
        data: {
          results: [
            {
              place_id: 'test-id',
              name: 'Test Restaurant',
              geometry: {
                location: {
                  lat: 37.39,
                  lng: -122.08,
                },
              },
              // No opening_hours
            },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const places = await service.getNearbyRestaurants(37.39, -122.08);

      expect(places).toHaveLength(1);
      expect(places[0].openNow).toBe(false); // Defaults to false
    });

    it('should return empty array when no results', async () => {
      const mockResponse = {
        data: {
          results: [],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const places = await service.getNearbyRestaurants(37.39, -122.08);

      expect(places).toEqual([]);
    });

    it('should build correct API URL with parameters', async () => {
      const mockResponse = {
        data: {
          results: [],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await service.getNearbyRestaurants(37.39, -122.08, 5000);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
        {
          params: {
            location: '37.39,-122.08',
            radius: '5000',
            type: 'restaurant',
            keyword: 'Pizza',
            key: expect.any(String),
          },
        }
      );
    });

    it('should use default radius of 10000m if not specified', async () => {
      const mockResponse = {
        data: {
          results: [],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await service.getNearbyRestaurants(37.39, -122.08);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            radius: '10000',
          }),
        })
      );
    });

    it('should throw error on network failure', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(service.getNearbyRestaurants(37.39, -122.08)).rejects.toThrow(
        'Failed to fetch nearby restaurants'
      );
    });

    it('should throw error on invalid API response', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Invalid API key'));

      await expect(service.getNearbyRestaurants(37.39, -122.08)).rejects.toThrow(
        'Failed to fetch nearby restaurants'
      );
    });
  });

  describe('getPlaceDetails', () => {
    const mockPlaceId = 'test-place-id';
    const mockPlaceDetails = {
      placeId: mockPlaceId,
      name: 'Test Restaurant',
      formattedAddress: '123 Main St, San Francisco, CA',
      formattedPhoneNumber: '(555) 123-4567',
      weekdayText: [
        'Monday: 11:00 AM – 9:00 PM',
        'Tuesday: 11:00 AM – 9:00 PM',
        'Wednesday: 11:00 AM – 9:00 PM',
        'Thursday: 11:00 AM – 9:00 PM',
        'Friday: 11:00 AM – 10:00 PM',
        'Saturday: 12:00 PM – 10:00 PM',
        'Sunday: 12:00 PM – 9:00 PM',
      ],
      photoReference: 'photo-ref',
      lat: 37.39,
      lng: -122.08,
      openNow: true,
    };

    beforeEach(() => {
      (cache.loadCacheFromStorage as jest.Mock).mockResolvedValue(null);
      (cache.saveCacheToStorage as jest.Mock).mockResolvedValue(undefined);
      (cache.getCacheKey as jest.Mock).mockImplementation(
        (prefix, id) => `${prefix}-${id}`
      );
    });

    it('should fetch place details from API successfully', async () => {
      const mockResponse = {
        data: {
          result: {
            name: 'Test Restaurant',
            formatted_address: '123 Main St, San Francisco, CA',
            formatted_phone_number: '(555) 123-4567',
            opening_hours: {
              weekday_text: [
                'Monday: 11:00 AM – 9:00 PM',
                'Tuesday: 11:00 AM – 9:00 PM',
                'Wednesday: 11:00 AM – 9:00 PM',
                'Thursday: 11:00 AM – 9:00 PM',
                'Friday: 11:00 AM – 10:00 PM',
                'Saturday: 12:00 PM – 10:00 PM',
                'Sunday: 12:00 PM – 9:00 PM',
              ],
              open_now: true,
            },
            photos: [{ photo_reference: 'photo-ref' }],
            geometry: {
              location: {
                lat: 37.39,
                lng: -122.08,
              },
            },
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const details = await service.getPlaceDetails(mockPlaceId);

      expect(details).toEqual(mockPlaceDetails);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://maps.googleapis.com/maps/api/place/details/json',
        {
          params: {
            place_id: mockPlaceId,
            key: expect.any(String),
          },
        }
      );
    });

    it('should save fetched details to both cache tiers', async () => {
      const mockResponse = {
        data: {
          result: {
            name: 'Test Restaurant',
            formatted_address: '123 Main St',
            formatted_phone_number: '(555) 123-4567',
            opening_hours: {
              weekday_text: [],
              open_now: true,
            },
            geometry: {
              location: {
                lat: 37.39,
                lng: -122.08,
              },
            },
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await service.getPlaceDetails(mockPlaceId);

      // Verify cache was saved
      expect(cache.saveCacheToStorage).toHaveBeenCalledWith(
        `place-details-${mockPlaceId}`,
        expect.objectContaining({
          placeId: mockPlaceId,
          name: 'Test Restaurant',
        }),
        expect.any(Number)
      );
    });

    it('should return cached details without API call (memory cache)', async () => {
      const mockResponse = {
        data: {
          result: {
            name: 'Test Restaurant',
            formatted_address: '123 Main St',
            geometry: { location: { lat: 37.39, lng: -122.08 } },
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      // First call - fetches from API
      await service.getPlaceDetails(mockPlaceId);

      jest.clearAllMocks();

      // Second call - should use memory cache
      const details = await service.getPlaceDetails(mockPlaceId);

      expect(mockedAxios.get).not.toHaveBeenCalled();
      expect(details.placeId).toBe(mockPlaceId);
    });

    it('should load from AsyncStorage cache when memory cache misses', async () => {
      // Mock AsyncStorage cache hit
      (cache.loadCacheFromStorage as jest.Mock).mockResolvedValue(mockPlaceDetails);

      const details = await service.getPlaceDetails(mockPlaceId);

      expect(details).toEqual(mockPlaceDetails);
      expect(mockedAxios.get).not.toHaveBeenCalled();
      expect(cache.loadCacheFromStorage).toHaveBeenCalled();
    });

    it('should handle places with minimal data', async () => {
      const mockResponse = {
        data: {
          result: {
            name: 'Minimal Restaurant',
            // No address, phone, hours, photos
            geometry: {
              location: {
                lat: 37.39,
                lng: -122.08,
              },
            },
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const details = await service.getPlaceDetails(mockPlaceId);

      expect(details.formattedAddress).toBe('');
      expect(details.formattedPhoneNumber).toBe('');
      expect(details.weekdayText).toEqual([]);
      expect(details.photoReference).toBeUndefined();
      expect(details.openNow).toBe(false);
    });

    it('should throw error on API failure', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      await expect(service.getPlaceDetails(mockPlaceId)).rejects.toThrow(
        'Failed to fetch place details'
      );
    });
  });
});
