import axios from 'axios';
import PlacesService from '../../src/services/PlacesService';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PlacesService', () => {
  let service: PlacesService;

  beforeEach(() => {
    jest.clearAllMocks();
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
});
