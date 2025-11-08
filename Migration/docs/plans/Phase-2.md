# Phase 2: Google Places API Service Layer

**Status**: Implementation Phase
**Estimated Tokens**: ~20,000
**Dependencies**: Phase 1 (Project Setup & Infrastructure)

---

## Phase Goal

Build a robust Google Places API service with intelligent caching that replicates the Android `LocationHelper.java` functionality while improving performance through lazy loading.

### What We're Building

1. **PlacesService**: Singleton service for all Google Places API interactions
2. **Caching Layer**: Two-tier cache (in-memory + AsyncStorage) with TTL
3. **Location Store**: Zustand store for location state management
4. **Error Handling**: Retry logic with exponential backoff
5. **Unit Tests**: Comprehensive tests for service and caching logic

### Success Criteria

- ✅ PlacesService successfully fetches nearby restaurants
- ✅ Place Details loaded lazily with caching
- ✅ Cache persists across app restarts (24-hour TTL)
- ✅ Location store manages state correctly
- ✅ Error handling and retry logic works
- ✅ Unit tests pass with >85% coverage for services

---

## Prerequisites

### Before Starting

- **Phase 1 completed** with all tests passing
- **Google Maps API Key** verified and working
- **Read Phase 0 "API Integration Architecture" and "Caching Strategy" sections**
- Understand the Android `LocationHelper.java` implementation (lines 67-173)

### Android Reference

The Android implementation in `LocationHelper.java`:
- Makes Nearby Search request (line 67)
- Makes N Place Details requests immediately (line 125)
- Uses `URLConnection` with manual JSON parsing
- Broadcasts results via `LocalBroadcastManager`

Our improvement:
- Make Nearby Search request upfront
- Make Place Details requests lazily (on demand)
- Use Axios with automatic JSON parsing
- Use Zustand store instead of broadcasts

---

## Tasks

### Task 1: Create Cache Utility

**Goal**: Build a reusable cache utility for managing TTL-based caching

**Files to Create**:
- `Migration/expo-project/src/utils/cache.ts` - Cache utility functions

**Prerequisites**:
- Phase 1 Task 3 (directory structure) completed

**Implementation Steps**:

1. Create `cache.ts` with the following functions:
   - `isExpired(timestamp: number, ttl: number): boolean` - Check if cache entry is expired
   - `getCacheKey(prefix: string, id: string): string` - Generate AsyncStorage cache keys
   - `saveCacheToStorage<T>(key: string, data: T, expiresAt: number): Promise<void>` - Save to AsyncStorage
   - `loadCacheFromStorage<T>(key: string): Promise<T | null>` - Load from AsyncStorage
   - `clearExpiredCache(key: string): Promise<void>` - Remove expired entries

2. Implementation guidance:
   - Use `@react-native-async-storage/async-storage` for persistence
   - Store data as JSON with structure: `{ data: T, timestamp: number, expiresAt: number }`
   - Handle JSON parse errors gracefully
   - Return null for missing or expired cache entries

3. Add constants for TTL:
   - `CACHE_TTL_HOURS = 24` (24 hours for place details)
   - `CACHE_TTL_MS = CACHE_TTL_HOURS * 60 * 60 * 1000`

4. Verify TypeScript types are strict (no `any` types except for JSON parsing)

**Verification Checklist**:

- [ ] `cache.ts` created in `src/utils/`
- [ ] All cache functions implemented
- [ ] TypeScript compilation passes
- [ ] Helper functions use generic types properly
- [ ] AsyncStorage errors handled gracefully

**Testing Instructions**:

Write unit tests in `__tests__/utils/cache.test.ts`:
- Test `isExpired()` with current and past timestamps
- Test `saveCacheToStorage()` and `loadCacheFromStorage()` round-trip
- Test expired cache returns null
- Mock AsyncStorage for testing

Example test:
```typescript
describe('cache utilities', () => {
  it('should detect expired cache', () => {
    const pastTimestamp = Date.now() - (25 * 60 * 60 * 1000); // 25 hours ago
    expect(isExpired(pastTimestamp, CACHE_TTL_MS)).toBe(true);
  });

  it('should detect valid cache', () => {
    const recentTimestamp = Date.now() - (1 * 60 * 60 * 1000); // 1 hour ago
    expect(isExpired(recentTimestamp, CACHE_TTL_MS)).toBe(false);
  });
});
```

**Commit Message Template**:
```
feat(cache): implement cache utility with TTL support

- Add isExpired() to check cache validity
- Add saveCacheToStorage() and loadCacheFromStorage()
- Add cache key generation utility
- Support generic types for type-safe caching
- Handle AsyncStorage errors gracefully
- Add unit tests for cache utilities
```

**Estimated tokens**: ~2,500

---

### Task 2: Implement PlacesService - Nearby Search

**Goal**: Create PlacesService singleton with Nearby Search API integration

**Files to Create**:
- `Migration/expo-project/src/services/PlacesService.ts` - Google Places API service

**Prerequisites**:
- Task 1 completed (cache utilities ready)

**Implementation Steps**:

1. Create `PlacesService.ts` as a class:
   - Private constructor (singleton pattern)
   - Static `getInstance()` method
   - Private `apiKey` field (from Constants)
   - Private `baseUrl` constant for Google Places API

2. Implement `getNearbyRestaurants(lat: number, lng: number, radius: number = 10000): Promise<NearbyPlace[]>`:
   - Build URL: `https://maps.googleapis.com/maps/api/place/nearbysearch/json`
   - Query params:
     - `location`: `${lat},${lng}`
     - `radius`: `10000` (10km, matching Android)
     - `type`: `restaurant`
     - `keyword`: `Pizza`
     - `key`: API key
   - Use Axios to make GET request
   - Parse response JSON
   - Map `results` array to `NearbyPlace[]` interface:
     - Extract `place_id`, `name`, `geometry.location.lat/lng`
     - Extract `photos[0].photo_reference` (if exists)
     - Extract `opening_hours.open_now` (if exists, default to false)
   - Return array of `NearbyPlace` objects
   - Handle errors (network, invalid API key, etc.)

3. Add error handling:
   - Wrap in try/catch
   - Throw meaningful errors: `'Failed to fetch nearby restaurants'`
   - Log errors to console (for debugging, remove in production)

4. Verify TypeScript types:
   - Use `NearbyPlace` interface from `location.types.ts`
   - Ensure no `any` types

5. Reference Android implementation:
   - LocationHelper.java lines 67-68 (URL construction)
   - LocationHelper.java lines 96-114 (JSON parsing)

**Verification Checklist**:

- [ ] PlacesService.ts created with singleton pattern
- [ ] `getNearbyRestaurants()` implemented
- [ ] Returns array of NearbyPlace objects
- [ ] Uses Axios for HTTP requests
- [ ] Error handling implemented
- [ ] TypeScript types correct

**Testing Instructions**:

Write unit tests in `__tests__/services/PlacesService.test.ts`:
- Mock Axios responses
- Test successful fetch returns NearbyPlace array
- Test error handling (network error, invalid API key)
- Test URL construction with correct parameters

Example test:
```typescript
import axios from 'axios';
jest.mock('axios');

describe('PlacesService.getNearbyRestaurants', () => {
  it('should fetch nearby restaurants', async () => {
    const mockResponse = {
      data: {
        results: [
          {
            place_id: 'test-id',
            name: 'Test Restaurant',
            geometry: { location: { lat: 37.39, lng: -122.08 } },
            photos: [{ photo_reference: 'photo-ref' }],
            opening_hours: { open_now: true },
          },
        ],
      },
    };

    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const service = PlacesService.getInstance();
    const places = await service.getNearbyRestaurants(37.39, -122.08);

    expect(places).toHaveLength(1);
    expect(places[0].placeId).toBe('test-id');
    expect(places[0].name).toBe('Test Restaurant');
  });
});
```

**Commit Message Template**:
```
feat(places): implement Nearby Search API in PlacesService

- Create PlacesService singleton class
- Implement getNearbyRestaurants() method
- Fetch restaurants within 10km radius with "Pizza" keyword
- Parse Google Places API response to NearbyPlace[]
- Add error handling for network failures
- Add unit tests with mocked Axios
- Match Android LocationHelper.java functionality (lines 67-114)
```

**Estimated tokens**: ~3,000

---

### Task 3: Implement PlacesService - Place Details with Caching

**Goal**: Add Place Details API integration with two-tier caching

**Files to Modify**:
- `Migration/expo-project/src/services/PlacesService.ts` - Add getPlaceDetails method

**Prerequisites**:
- Tasks 1-2 completed (cache utilities and Nearby Search working)

**Implementation Steps**:

1. Add private in-memory cache to PlacesService class:
   - `private cache: Map<string, PlaceDetails> = new Map()`
   - This is Tier 1 cache (fast, in-memory)

2. Add method to load cache from AsyncStorage on initialization:
   - `private async loadCacheFromStorage(): Promise<void>`
   - Load all cached place details from AsyncStorage
   - Filter out expired entries
   - Populate in-memory cache with valid entries
   - Call this in `getInstance()` (make it async if needed)

3. Implement `getPlaceDetails(placeId: string): Promise<PlaceDetails>`:
   - **Check Tier 1** (in-memory cache):
     - If hit, return immediately
   - **Check Tier 2** (AsyncStorage):
     - Load from AsyncStorage with key `place-details-${placeId}`
     - If hit and not expired:
       - Add to Tier 1 cache
       - Return data
   - **Fetch from API**:
     - Build URL: `https://maps.googleapis.com/maps/api/place/details/json`
     - Query params: `place_id`, `key`
     - Make Axios GET request
     - Parse response `result` object:
       - Extract `name`, `formatted_address`, `formatted_phone_number`
       - Extract `opening_hours.weekday_text` array
       - Extract coordinates if needed
     - Create `PlaceDetails` object
     - Save to Tier 1 and Tier 2 caches
     - Return data

4. Add private method for saving to cache:
   - `private async saveToCache(placeId: string, details: PlaceDetails): Promise<void>`
   - Save to in-memory cache (Tier 1)
   - Save to AsyncStorage (Tier 2) with TTL of 24 hours
   - Use cache utility from Task 1

5. Reference Android implementation:
   - LocationHelper.java lines 125-145 (URL and parsing)

**Verification Checklist**:

- [ ] In-memory cache (Map) added to PlacesService
- [ ] `loadCacheFromStorage()` implemented
- [ ] `getPlaceDetails()` implemented with three-tier check
- [ ] Cache hit returns immediately without API call
- [ ] Cache miss fetches from API and saves to both caches
- [ ] Expired cache entries are filtered out

**Testing Instructions**:

Write unit tests in `__tests__/services/PlacesService.test.ts`:
- Test cache hit (in-memory) returns without API call
- Test cache miss makes API call
- Test expired cache is ignored
- Test successful API response is cached
- Mock both Axios and AsyncStorage

Example test:
```typescript
describe('PlacesService.getPlaceDetails', () => {
  it('should return cached details without API call', async () => {
    const service = PlacesService.getInstance();

    // First call (cache miss, API called)
    await service.getPlaceDetails('test-id');

    // Second call (cache hit, API not called)
    const axiosSpy = jest.spyOn(axios, 'get');
    await service.getPlaceDetails('test-id');

    expect(axiosSpy).not.toHaveBeenCalled();
  });

  it('should fetch and cache new place details', async () => {
    const mockResponse = {
      data: {
        result: {
          name: 'Test Restaurant',
          formatted_address: '123 Main St',
          formatted_phone_number: '(555) 123-4567',
          opening_hours: {
            weekday_text: ['Monday: 11:00 AM – 9:00 PM'],
          },
        },
      },
    };

    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const service = PlacesService.getInstance();
    const details = await service.getPlaceDetails('new-id');

    expect(details.name).toBe('Test Restaurant');
    expect(details.formattedAddress).toBe('123 Main St');
  });
});
```

**Commit Message Template**:
```
feat(places): implement Place Details API with two-tier caching

- Add in-memory cache (Map) to PlacesService
- Implement getPlaceDetails() with lazy loading
- Check Tier 1 (memory) → Tier 2 (AsyncStorage) → API
- Save fetched details to both cache tiers
- Add loadCacheFromStorage() for persistence across restarts
- Add saveToCache() for cache management
- Add unit tests for caching behavior
- 24-hour TTL for cached entries
- Match Android LocationHelper.java (lines 125-145)
```

**Estimated tokens**: ~3,500

---

### Task 4: Add Retry Logic with Exponential Backoff

**Goal**: Implement robust retry logic for API failures

**Files to Modify**:
- `Migration/expo-project/src/services/PlacesService.ts` - Add retry wrapper

**Prerequisites**:
- Tasks 1-3 completed (basic API calls working)

**Implementation Steps**:

1. Create a private retry utility method:
   - `private async retryWithBackoff<T>(fn: () => Promise<T>, maxRetries: number = 3): Promise<T>`
   - Parameters:
     - `fn`: Async function to retry
     - `maxRetries`: Max retry attempts (default 3)
   - Retry delays: 1s, 2s, 4s (exponential backoff)

2. Implementation logic:
   - Try executing `fn()`
   - On error:
     - Check if network error (use `axios.isAxiosError()`)
     - If retries remaining:
       - Wait delay (2^attempt * 1000 ms)
       - Retry
     - If no retries remaining:
       - Throw error
   - On success:
     - Return result

3. Wrap API calls:
   - Wrap `getNearbyRestaurants()` Axios call in `retryWithBackoff()`
   - Wrap `getPlaceDetails()` Axios call in `retryWithBackoff()`

4. Add logging (optional):
   - Log retry attempts: `console.log('Retry attempt ${attempt} after ${delay}ms')`
   - Remove or make conditional for production

**Verification Checklist**:

- [ ] `retryWithBackoff()` method implemented
- [ ] Exponential backoff delays: 1s, 2s, 4s
- [ ] Max 3 retries before failing
- [ ] Both API methods wrapped with retry logic
- [ ] Non-network errors fail immediately (no retry)

**Testing Instructions**:

Write unit tests:
- Test successful call on first try (no retries)
- Test network error with successful retry on 2nd attempt
- Test network error exhausts retries and throws
- Test non-network error fails immediately
- Mock timers to speed up tests (`jest.useFakeTimers()`)

Example test:
```typescript
describe('PlacesService retry logic', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should retry on network error and succeed', async () => {
    let callCount = 0;
    (axios.get as jest.Mock).mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        throw new Error('Network Error');
      }
      return Promise.resolve({ data: { results: [] } });
    });

    const service = PlacesService.getInstance();

    const promise = service.getNearbyRestaurants(37.39, -122.08);

    // Fast-forward timers to trigger retry
    jest.advanceTimersByTime(1000);

    const result = await promise;
    expect(callCount).toBe(2); // First fail, second success
    expect(result).toEqual([]);
  });

  it('should fail after max retries', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('Network Error'));

    const service = PlacesService.getInstance();

    await expect(
      service.getNearbyRestaurants(37.39, -122.08)
    ).rejects.toThrow('Network Error');
  });
});
```

**Commit Message Template**:
```
feat(places): add retry logic with exponential backoff

- Implement retryWithBackoff() utility method
- Retry API calls up to 3 times on network errors
- Exponential backoff delays: 1s, 2s, 4s
- Wrap getNearbyRestaurants() and getPlaceDetails() calls
- Add unit tests for retry behavior
- Non-network errors fail immediately (no retry)
```

**Estimated tokens**: ~2,500

---

### Task 5: Create Location Store with Zustand

**Goal**: Build Zustand store for managing location state

**Files to Create**:
- `Migration/expo-project/src/stores/locationStore.ts` - Location state management

**Prerequisites**:
- Task 3 completed (PlacesService with caching ready)

**Implementation Steps**:

1. Create `locationStore.ts` with Zustand:
   - Use `create` from `zustand`
   - Use `persist` middleware for caching place details
   - Define state interface:
     ```typescript
     interface LocationState {
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
     ```

2. Implement actions:
   - `setUserLocation(location)`: Update user location state
   - `fetchNearbyPlaces(lat, lng)`:
     - Set loading = true
     - Call `PlacesService.getNearbyRestaurants()`
     - Set nearbyPlaces state
     - Set loading = false
     - Handle errors and set error state
   - `selectPlace(placeId)`:
     - Set loading = true
     - Call `PlacesService.getPlaceDetails()`
     - Set selectedPlace state
     - Set loading = false
     - Handle errors
   - `clearSelectedPlace()`: Set selectedPlace = null
   - `clearError()`: Set error = null

3. Configure persistence:
   - Only persist `nearbyPlaces` (optional, may become stale)
   - Do NOT persist `userLocation` (privacy concern)
   - Do NOT persist UI state (loading, selectedPlace)
   - Storage key: `location-storage`

4. Use `PlacesService` instance:
   - Import and use `PlacesService.getInstance()`
   - Call service methods from store actions

**Verification Checklist**:

- [ ] `locationStore.ts` created with Zustand
- [ ] All state fields defined
- [ ] All actions implemented
- [ ] Actions call PlacesService methods
- [ ] Error handling in actions
- [ ] Persistence configured (partial)
- [ ] TypeScript types correct

**Testing Instructions**:

Write unit tests in `__tests__/stores/locationStore.test.ts`:
- Test `setUserLocation()` updates state
- Test `fetchNearbyPlaces()` calls PlacesService and updates state
- Test `selectPlace()` calls PlacesService and updates selectedPlace
- Test error handling sets error state
- Mock PlacesService

Example test:
```typescript
import { useLocationStore } from '@/stores/locationStore';
import { PlacesService } from '@/services/PlacesService';

jest.mock('@/services/PlacesService');

describe('locationStore', () => {
  it('should fetch nearby places and update state', async () => {
    const mockPlaces = [{ placeId: 'test', name: 'Test', lat: 0, lng: 0, openNow: true }];
    const mockService = {
      getNearbyRestaurants: jest.fn().mockResolvedValue(mockPlaces),
    };
    (PlacesService.getInstance as jest.Mock).mockReturnValue(mockService);

    const store = useLocationStore.getState();
    await store.fetchNearbyPlaces(37.39, -122.08);

    expect(store.nearbyPlaces).toEqual(mockPlaces);
    expect(store.loading).toBe(false);
  });

  it('should handle errors gracefully', async () => {
    const mockService = {
      getNearbyRestaurants: jest.fn().mockRejectedValue(new Error('API Error')),
    };
    (PlacesService.getInstance as jest.Mock).mockReturnValue(mockService);

    const store = useLocationStore.getState();
    await store.fetchNearbyPlaces(37.39, -122.08);

    expect(store.error).toBe('Failed to fetch nearby restaurants');
    expect(store.loading).toBe(false);
  });
});
```

**Commit Message Template**:
```
feat(store): implement location store with Zustand

- Create locationStore with user location, nearby places, selected place
- Add fetchNearbyPlaces() action with PlacesService integration
- Add selectPlace() action for lazy loading place details
- Add error handling and loading states
- Configure partial persistence (cache nearby places)
- Add unit tests for store actions
- Do not persist user location (privacy)
```

**Estimated tokens**: ~3,000

---

### Task 6: Integrate Location Store with MapScreen

**Goal**: Connect locationStore to MapScreen to display nearby restaurants

**Files to Modify**:
- `Migration/expo-project/src/screens/MapScreen.tsx` - Integrate store and display markers

**Prerequisites**:
- Task 5 completed (locationStore ready)
- Phase 1 Task 8 completed (basic MapScreen with user location)

**Implementation Steps**:

1. Import locationStore in MapScreen:
   - `import { useLocationStore } from '@/stores/locationStore'`
   - Destructure needed state and actions

2. Update MapScreen logic:
   - After getting user location (existing code):
     - Call `fetchNearbyPlaces(lat, lng)` to load restaurants
   - Access `nearbyPlaces` from store
   - Display loading indicator while `loading === true`
   - Display error message if `error !== null`

3. Add markers to map:
   - Map over `nearbyPlaces` array
   - Render `<Marker>` component from `react-native-maps` for each place
   - Set marker coordinates: `{ latitude: place.lat, longitude: place.lng }`
   - Set marker title: `place.name`
   - Set marker id: `place.placeId`

4. Add marker press handler (prepare for Phase 3):
   - `onPress={() => handleMarkerPress(place.placeId)}`
   - For now, just log the place ID (Phase 3 will open bottom sheet)
   - Optionally show alert with place name

5. Update UI:
   - Show loading overlay while fetching places
   - Show error message with retry button if error occurs
   - Show markers on map when places loaded

**Verification Checklist**:

- [ ] MapScreen uses locationStore
- [ ] Fetches nearby places after getting user location
- [ ] Displays markers for all nearby places
- [ ] Markers show on correct coordinates
- [ ] Marker press logs place ID
- [ ] Loading state displayed
- [ ] Error state displayed with retry option

**Testing Instructions**:

Manual testing:
1. Run app and open MapScreen
2. Grant location permission
3. Verify markers appear on map (should be ~10-20 pizza restaurants)
4. Tap a marker and verify place ID logged to console
5. Test error state by disabling network and retrying

**Commit Message Template**:
```
feat(map): integrate location store and display restaurant markers

- Import and use locationStore in MapScreen
- Fetch nearby places after getting user location
- Display markers for all nearby restaurants
- Add marker press handler (logs place ID)
- Show loading state while fetching
- Show error state with retry button
- Markers appear at correct coordinates
```

**Estimated tokens**: ~2,500

---

### Task 7: Add Place Photo URL Generator

**Goal**: Create utility to generate Place Photo API URLs

**Files to Create**:
- `Migration/expo-project/src/utils/placesHelpers.ts` - Helper functions for Places API

**Prerequisites**:
- Task 3 completed (understand Place Photos API)

**Implementation Steps**:

1. Create `placesHelpers.ts`:
   - Export `getPlacePhotoUrl(photoReference: string, maxWidth: number = 400): string`
   - Build URL: `https://maps.googleapis.com/maps/api/place/photo`
   - Query params:
     - `maxwidth`: `400` (or passed parameter)
     - `photo_reference`: photoReference parameter
     - `key`: API key (from Constants)
   - Return full URL as string

2. Reference Android implementation:
   - MapFragmentActivity.java lines 96-98 (URL construction)

3. Add helper for formatting hours:
   - `formatBusinessHours(weekdayText: string[]): string`
   - Join array with newlines
   - Return formatted string for display

4. Add TypeScript types for all parameters and returns

**Verification Checklist**:

- [ ] `placesHelpers.ts` created in `src/utils/`
- [ ] `getPlacePhotoUrl()` implemented
- [ ] Returns valid Google Places Photo URL
- [ ] `formatBusinessHours()` implemented
- [ ] TypeScript types correct

**Testing Instructions**:

Write unit tests:
- Test `getPlacePhotoUrl()` returns correct URL format
- Test URL includes all required parameters
- Test `formatBusinessHours()` joins array with newlines

Example test:
```typescript
describe('placesHelpers', () => {
  it('should generate photo URL with correct parameters', () => {
    const photoRef = 'CmRaAAAA...';
    const url = getPlacePhotoUrl(photoRef, 400);

    expect(url).toContain('https://maps.googleapis.com/maps/api/place/photo');
    expect(url).toContain(`photo_reference=${photoRef}`);
    expect(url).toContain('maxwidth=400');
    expect(url).toContain('key=');
  });

  it('should format business hours', () => {
    const hours = ['Monday: 11:00 AM – 9:00 PM', 'Tuesday: 11:00 AM – 9:00 PM'];
    const formatted = formatBusinessHours(hours);

    expect(formatted).toBe('Monday: 11:00 AM – 9:00 PM\nTuesday: 11:00 AM – 9:00 PM');
  });
});
```

**Commit Message Template**:
```
feat(utils): add Places API helper functions

- Add getPlacePhotoUrl() to generate photo URLs
- Add formatBusinessHours() for display formatting
- Match Android MapFragmentActivity.java photo URL logic (lines 96-98)
- Add unit tests for helper functions
```

**Estimated tokens**: ~1,500

---

### Task 8: Write Comprehensive Service Tests

**Goal**: Achieve >85% test coverage for PlacesService

**Files to Create/Modify**:
- `Migration/expo-project/__tests__/services/PlacesService.test.ts` - Expand tests

**Prerequisites**:
- Tasks 1-7 completed (all service code ready)

**Implementation Steps**:

1. Organize tests into describe blocks:
   - `describe('PlacesService.getNearbyRestaurants')`
   - `describe('PlacesService.getPlaceDetails')`
   - `describe('PlacesService caching')`
   - `describe('PlacesService error handling')`

2. Test Nearby Search:
   - Successful fetch with valid response
   - Empty results array
   - Network error with retry
   - Invalid API key error
   - Malformed response handling

3. Test Place Details:
   - Successful fetch
   - Cache hit (no API call)
   - Cache miss (API call)
   - Expired cache (fetches new)
   - Network error with retry

4. Test Caching:
   - In-memory cache stores data
   - AsyncStorage cache persists across "restarts" (simulate by clearing memory cache)
   - Expired entries are not returned
   - Cache is properly saved after fetch

5. Test Error Handling:
   - Network errors retry 3 times
   - Non-network errors fail immediately
   - Proper error messages returned

6. Mock dependencies:
   - Mock Axios for API calls
   - Mock AsyncStorage for persistence
   - Mock timers for retry delays

7. Aim for >85% code coverage:
   - Run `npm test -- --coverage`
   - Identify uncovered branches
   - Add tests for uncovered code

**Verification Checklist**:

- [ ] All PlacesService methods tested
- [ ] Cache behavior tested thoroughly
- [ ] Error scenarios covered
- [ ] Retry logic tested
- [ ] Test coverage >85%
- [ ] All tests pass

**Testing Instructions**:

```bash
npm test -- --coverage
```

Review coverage report and ensure PlacesService is >85%.

**Commit Message Template**:
```
test(places): comprehensive PlacesService test suite

- Add tests for getNearbyRestaurants() success and error cases
- Add tests for getPlaceDetails() with caching scenarios
- Test cache hit, cache miss, and expired cache
- Test retry logic with exponential backoff
- Test error handling for network and API errors
- Achieve >85% code coverage for PlacesService
- Mock Axios and AsyncStorage
```

**Estimated tokens**: ~2,500

---

## Phase Verification

### Integration Tests

After completing all tasks, perform these integration tests:

1. **Clean State Test**:
   - Clear app data/cache
   - Launch app
   - Open MapScreen
   - Verify nearby places fetched
   - Verify markers displayed

2. **Cache Persistence Test**:
   - Open MapScreen (loads nearby places)
   - Tap a marker (loads place details - will be logged for now)
   - Close app completely
   - Reopen app
   - Verify cached data loads faster (no API delay)

3. **Offline Behavior Test**:
   - Turn off network
   - Launch app
   - Try to fetch nearby places
   - Verify error message displayed
   - Verify retry button works
   - Turn on network
   - Retry and verify success

4. **API Key Error Test**:
   - Temporarily use invalid API key
   - Try to fetch places
   - Verify error message shown
   - Restore valid API key

5. **Unit Test Suite**:
   ```bash
   npm test -- --coverage
   ```
   - Verify all tests pass
   - Verify PlacesService >85% coverage
   - Verify locationStore >80% coverage

### Expected State

At the end of Phase 2:

- ✅ PlacesService fetches nearby restaurants successfully
- ✅ Place Details loaded with two-tier caching
- ✅ Cache persists across app restarts (24-hour TTL)
- ✅ Retry logic works for network failures
- ✅ MapScreen displays markers for nearby places
- ✅ Location store manages state correctly
- ⚠️ No UI for place details yet (Phase 3 - bottom sheet)
- ⚠️ Marker press only logs ID (Phase 3 - open bottom sheet)

### Known Limitations

- Place details cached but not displayed in UI yet (Phase 3)
- Photos can be loaded but not shown yet (Phase 3)
- No bottom sheet UI yet (Phase 3)

### Technical Debt

None expected - caching and service layer are production-ready.

---

## Troubleshooting

### Common Issues

**Issue**: Nearby Search returns empty array
- **Solution**: Verify API key has Places API enabled
- Check radius (10km may be too small in rural areas)
- Verify keyword "Pizza" matches nearby restaurants
- Check response in network inspector

**Issue**: Cache not persisting across restarts
- **Solution**: Verify AsyncStorage is installed correctly
- Check persist middleware is configured in store
- Verify cache key is consistent
- Check AsyncStorage data in React Native Debugger

**Issue**: Retry logic not working
- **Solution**: Verify exponential backoff delays
- Check that network errors are detected correctly
- Use `jest.useFakeTimers()` in tests
- Verify Axios errors are handled

**Issue**: TypeScript errors in PlacesService
- **Solution**: Verify all interfaces imported correctly
- Check generic types in cache functions
- Ensure no `any` types used
- Run `npm run type-check`

**Issue**: Tests failing with AsyncStorage errors
- **Solution**: Mock AsyncStorage in tests:
  ```typescript
  jest.mock('@react-native-async-storage/async-storage');
  ```
- Clear mocks between tests: `jest.clearAllMocks()`

---

## Next Steps

After completing Phase 2, you should have:
- ✅ Fully functional PlacesService with Nearby Search and Place Details
- ✅ Two-tier caching (memory + AsyncStorage)
- ✅ Retry logic for network failures
- ✅ Location store managing state
- ✅ MapScreen displaying markers
- ✅ Comprehensive test coverage (>85%)

---

## Review Feedback (Iteration 1)

### Critical Issue: TypeScript Compilation Failures

> **Consider:** Run `npm run type-check` in your terminal. What errors do you see? TypeScript compilation must pass before Phase 2 can be approved.

#### Error 1: locationStore.ts Line 94

> **Reflect:** Look at `src/stores/locationStore.ts` line 94. You're using `partialPersist: true` in the persist options.
>
> **Investigate:** Open the Zustand documentation for the persist middleware. Does `partialPersist` exist as a configuration option?
>
> **Think about:** What are you trying to achieve with this option? You want to persist only `nearbyPlaces`, not the entire state. Look at line 95 where you use `partialize`.
>
> **Question:** Is `partialize` sufficient on its own to achieve partial persistence? Do you actually need `partialPersist: true`?
>
> **Action needed:** Review the Zustand persist middleware documentation. The `partialize` function already handles partial persistence. Remove line 94 (`partialPersist: true`) as it's not a valid option.

#### Error 2: PlacesService.test.ts Line 26

> **Consider:** Look at `__tests__/services/PlacesService.test.ts` line 26. You're trying to assign `mockIsAxiosError` to `axios.isAxiosError`, but TypeScript complains about type compatibility.
>
> **Reflect:** The error says you're converting a type guard function to a Mock. What's the type signature of `axios.isAxiosError`?
>
> **Think about:** You created `mockIsAxiosError` as `jest.fn()` on line 13. Does this match the expected type of a type guard function?
>
> **Question:** Would it work better to use type assertion? Instead of:
> ```typescript
> (axios.isAxiosError as jest.Mock) = mockIsAxiosError;
> ```
> Could you use:
> ```typescript
> (axios.isAxiosError as unknown as jest.Mock) = mockIsAxiosError;
> ```
> Or better yet, mock it directly at the import level?
>
> **Action needed:** Fix the type assignment. Either use `as unknown as jest.Mock` for double type assertion, or restructure the mock setup.

### ESLint Plugin Dependencies Missing

> **Consider:** Run `npm run lint` - it still fails, right? Look at the error message. While ESLint v8 is now installed (good!), what other issue does it report?
>
> **Reflect:** Look at your `.eslintrc.js` file lines 6-7. You're extending `plugin:react/recommended` and `plugin:react-hooks/recommended`.
>
> **Investigate:** Run `npm ls eslint-plugin-react eslint-plugin-react-hooks`. Are these packages installed?
>
> **Think about:** You installed `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser` (good!), but did you install the React plugins?
>
> **Action needed:** Install the missing plugins:
> ```bash
> npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks
> ```
> Then verify `npm run lint` passes.

### Code Quality - Excellent Work! ✓

> **Congratulations!** Your implementation shows strong software engineering:
>
> - ✅ All 73 tests passing (64 new tests added!)
> - ✅ Cache utility with TTL implemented correctly
> - ✅ PlacesService singleton pattern properly implemented
> - ✅ Retry logic with exponential backoff working
> - ✅ locationStore with Zustand properly structured
> - ✅ MapScreen integration clean and functional
> - ✅ Error handling comprehensive
> - ✅ Test organization excellent (describe blocks, mocking, coverage)
> - ✅ Commit messages follow conventional commits format perfectly
> - ✅ Phase 1 issues addressed (directories created, app.config.js, ESLint downgraded)
>
> **Notable achievements:**
> - Clean separation of concerns (Service → Store → UI)
> - Proper use of TypeScript generics in cache utilities
> - Good test coverage with meaningful tests (not just shallow tests)
> - Consistent error handling patterns
> - Two-tier caching correctly implemented

### Task Completion Verification

Let me verify each task against the plan:

#### Task 1: Cache Utility ✓
- [x] cache.ts created with all 5 functions
- [x] TTL constants defined
- [x] Generic types used correctly
- [x] Error handling graceful
- [x] Unit tests comprehensive (9 tests)

#### Task 2: Nearby Search API ✓
- [x] PlacesService singleton implemented
- [x] getNearbyRestaurants() working
- [x] Axios integration correct
- [x] Response parsing to NearbyPlace[]
- [x] Unit tests thorough

#### Task 3: Place Details with Caching ✓
- [x] In-memory cache (Map)
- [x] Two-tier check (memory → AsyncStorage → API)
- [x] getPlaceDetails() implemented
- [x] saveToCache() private method
- [x] Unit tests cover all paths

#### Task 4: Retry Logic ✓
- [x] retryWithBackoff() implemented
- [x] Exponential backoff (1s, 2s, 4s)
- [x] Network error detection
- [x] Max 3 retries
- [x] Unit tests with mocked timers

#### Task 5: Location Store ✓
- [x] Zustand store created
- [x] All actions implemented
- [x] PlacesService integration
- [x] Error handling
- [x] Partial persistence (⚠️ minor bug: remove `partialPersist: true`)
- [x] Unit tests comprehensive

#### Task 6: MapScreen Integration ✓
- [x] Store imported and used
- [x] Fetches nearby places
- [x] Displays markers
- [x] Marker press handler
- [x] Loading states
- [x] Error states with retry

#### Task 7: Photo URL Helper ✓
- [x] getPlacePhotoUrl() implemented
- [x] formatBusinessHours() implemented
- [x] Unit tests passing

#### Task 8: Comprehensive Tests ✓
- [x] All PlacesService methods tested
- [x] Cache behavior tested
- [x] Error scenarios covered
- [x] Retry logic tested
- [x] 73 total tests passing

### Next Steps

To complete Phase 2 and get APPROVAL:

1. **Fix TypeScript errors** (2 errors):
   - Remove `partialPersist: true` from locationStore.ts line 94
   - Fix type assertion in PlacesService.test.ts line 26

2. **Install missing ESLint plugins**:
   - `npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks`

3. **Verify all checks pass**:
   ```bash
   npm test              # Should pass (already does ✓)
   npm run type-check    # Should pass (currently fails ✗)
   npm run lint          # Should pass (currently fails ✗)
   ```

Once these are fixed, Phase 2 will be ready for approval! You're 95% there - just 2 small type issues and missing dependencies.

---

**Proceed to**: **[Phase 3: Map Screen & Bottom Sheet UI](./Phase-3.md)**

Phase 3 will build on this foundation by:
- Adding bottom sheet UI for restaurant details
- Integrating photo loading with FastImage
- Displaying open/closed status and hours
- Adding call and directions buttons
- Polishing map UX
