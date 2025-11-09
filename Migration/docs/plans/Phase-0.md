# Phase 0: Architecture & Foundation

**Status**: Reference Document (Read Before Implementation)
**Purpose**: Establish technical decisions, design patterns, and conventions for all phases

---

## Overview

Phase 0 is a **reference document** that defines the architectural foundation for the entire migration. This is not an implementation phase - instead, it provides the context and rationale for technical decisions made throughout Phases 1-5.

**Read this document completely before beginning Phase 1.**

---

## Table of Contents

1. [Architecture Decisions (ADRs)](#architecture-decisions-adrs)
2. [Tech Stack Rationale](#tech-stack-rationale)
3. [Data Models & Type System](#data-models--type-system)
4. [Design Patterns](#design-patterns)
5. [State Management Strategy](#state-management-strategy)
6. [API Integration Architecture](#api-integration-architecture)
7. [Caching Strategy](#caching-strategy)
8. [Testing Strategy](#testing-strategy)
9. [Common Pitfalls & Solutions](#common-pitfalls--solutions)

---

## Architecture Decisions (ADRs)

### ADR-001: Expo vs React Native CLI

**Decision**: Use Expo managed workflow

**Context**:
- Android app is a simple POC with no custom native modules
- Need to support both iOS and Android with minimal configuration
- Team may not have deep native development experience
- Rapid iteration and testing required

**Rationale**:
- Expo provides out-of-the-box support for maps, location, and camera
- Easier build and deployment process (EAS Build)
- Over-the-air updates capability
- Simplified environment setup
- Can eject to bare workflow if needed (unlikely for this POC)

**Consequences**:
- ✅ Faster development cycle
- ✅ Simpler dependency management
- ✅ Built-in testing on physical devices via Expo Go
- ⚠️ Slightly larger app bundle size (acceptable for POC)
- ⚠️ Cannot use libraries requiring custom native code (not needed)

---

### ADR-002: State Management - Zustand vs Redux vs Context API

**Decision**: Use Zustand with persist middleware

**Context**:
- Android app uses SharedPreferences for persistence
- Need global state for: orders, cart, location data, cached API responses
- Want minimal boilerplate and good TypeScript support
- Team may be new to advanced state management patterns

**Rationale**:

**Zustand Advantages**:
- Minimal boilerplate (< 10 lines to create a store)
- Excellent TypeScript inference
- No provider wrapper needed
- Built-in middleware for persistence (direct AsyncStorage integration)
- Tiny bundle size (< 1KB gzipped)
- Easier to understand than Redux for developers new to the codebase

**Redux Toolkit Disadvantages**:
- More boilerplate (slices, reducers, actions)
- Steeper learning curve
- Overkill for this POC scope
- Heavier bundle size

**Context API Disadvantages**:
- Can cause unnecessary re-renders without optimization
- Requires provider wrappers (nesting)
- No built-in persistence mechanism
- More manual work for complex state logic

**Consequences**:
- ✅ Faster development
- ✅ Direct replacement for SharedPreferences pattern
- ✅ Easy to test (just import the store)
- ✅ Automatic persistence with middleware
- ⚠️ Less ecosystem tooling than Redux (acceptable trade-off)

---

### ADR-003: Maps UI Pattern - Callouts vs Bottom Sheet

**Decision**: Use simple markers with @gorhom/bottom-sheet for details

**Context**:
- Android app uses custom info windows on map markers
- react-native-maps has custom callouts, but behavior differs between iOS/Android
- Need to display: restaurant photo, name, address, phone, hours, open/closed status

**Rationale**:

**Bottom Sheet Advantages**:
- Modern mobile UX pattern (familiar to users)
- Consistent behavior across iOS/Android
- More space for complex UI (photos, buttons, formatted text)
- Better animation support
- Easier to implement call/directions buttons
- Can show loading state while fetching place details

**Custom Callouts Disadvantages**:
- Platform-specific quirks
- Limited space for content
- Harder to implement interactive elements
- Image loading can be problematic
- Requires more custom code for cross-platform consistency

**Consequences**:
- ✅ Better UX than original Android app
- ✅ Easier to maintain
- ✅ More flexibility for future enhancements
- ⚠️ Different interaction pattern from original (user feedback: improved)

---

### ADR-004: API Strategy - Eager vs Lazy Loading

**Decision**: Hybrid approach - Nearby Search upfront, lazy-load Place Details with caching

**Context**:
- Android app makes 1 Nearby Search + N Place Details requests immediately
- This can be slow and expensive (API costs per request)
- Users may not tap all markers

**Rationale**:

**Hybrid Approach**:
1. On map load: Fetch Nearby Search (basic info for all locations)
2. On marker tap: Fetch Place Details for that specific location (if not cached)
3. Cache Place Details in memory + AsyncStorage (24-hour TTL)

**Benefits**:
- Faster initial map load
- Reduced API costs (only fetch details when needed)
- Better user experience (progressive loading)
- Acceptable slight delay when opening bottom sheet (< 500ms typically)

**Consequences**:
- ✅ 70-80% reduction in API calls (typical user taps 2-3 markers)
- ✅ Faster time-to-interactive
- ✅ Lower monthly API costs
- ⚠️ Need loading state in bottom sheet (good practice anyway)

---

### ADR-005: Price Storage - Integers (Cents) vs Decimals

**Decision**: Store all prices as integers representing cents

**Context**:
- Android app stores prices as integers (e.g., 1299 = $12.99)
- JavaScript has floating-point precision issues
- Need accurate price calculations

**Rationale**:
- Matches original implementation exactly
- Avoids floating-point arithmetic errors (e.g., 0.1 + 0.2 !== 0.3)
- Industry standard for financial calculations
- Simple arithmetic (addition/subtraction of integers)
- Easy conversion to display format: `cents / 100`

**Example**:
```typescript
// Storage
const pizzaPrice = 1299; // $12.99

// Calculation
const total = pizzaPrice + toppingPrice; // Simple addition

// Display
const displayPrice = `$${(total / 100).toFixed(2)}`; // "$12.99"
```

**Consequences**:
- ✅ No precision errors
- ✅ Direct port from Android
- ✅ Simpler arithmetic
- ⚠️ Need utility function for display formatting (trivial)

---

### ADR-006: Navigation Pattern

**Decision**: Use React Navigation Stack Navigator with type-safe routing

**Context**:
- Android app uses Activity-based navigation
- Need screen-to-screen navigation with params
- Want type safety for navigation props

**Rationale**:
- React Navigation is the standard for React Native apps
- Stack Navigator mimics Android's back stack behavior
- TypeScript integration provides compile-time safety for routes
- Supports header customization, transitions, gestures

**Consequences**:
- ✅ Type-safe navigation
- ✅ Familiar patterns for React Native developers
- ✅ Good documentation and community support

---

## Tech Stack Rationale

### Core Dependencies

#### 1. **expo** (~v49+)
- **Purpose**: Application framework and build system
- **Why**: Simplifies native module integration, provides EAS Build, supports OTA updates
- **Alternatives Considered**: React Native CLI (rejected: more complex setup)

#### 2. **react-native-maps**
- **Purpose**: Map display and marker management
- **Why**: Most mature maps library for RN, supports Google Maps + Apple Maps
- **Alternatives Considered**:
  - `expo-maps` (too new, less stable)
  - `react-native-mapbox-gl` (overkill, different API key needed)

#### 3. **zustand** + **zustand/middleware**
- **Purpose**: Global state management with persistence
- **Why**: Minimal boilerplate, excellent TypeScript support, built-in persistence
- **Alternatives Considered**: Redux Toolkit (too heavy), Context API (no persistence)

#### 4. **@react-native-async-storage/async-storage**
- **Purpose**: Persistent key-value storage (replaces SharedPreferences)
- **Why**: Official React Native storage solution, works with Zustand persist
- **Alternatives Considered**: expo-secure-store (unnecessary encryption overhead)

#### 5. **axios**
- **Purpose**: HTTP client for Google Places API
- **Why**: Better error handling than fetch, interceptors for retry logic, TypeScript types
- **Alternatives Considered**: fetch (no retry/interceptor support)

#### 6. **react-native-fast-image**
- **Purpose**: Performant image loading with caching
- **Why**: Caches images (network + memory), better performance than <Image>
- **Alternatives Considered**: expo-image (good alternative, but less mature)

#### 7. **@gorhom/bottom-sheet**
- **Purpose**: Bottom sheet UI component for restaurant details
- **Why**: Best-in-class bottom sheet, smooth animations, gesture support
- **Alternatives Considered**: react-native-reanimated-bottom-sheet (deprecated)

#### 8. **@react-navigation/native** + **@react-navigation/stack**
- **Purpose**: Screen navigation
- **Why**: Industry standard, type-safe, extensive documentation
- **Alternatives Considered**: react-native-navigation (native nav bar, unnecessary complexity)

#### 9. **expo-location**
- **Purpose**: GPS location access and permissions
- **Why**: Cross-platform location API, handles permissions elegantly
- **Alternatives Considered**: react-native-geolocation (less maintained)

### Development Dependencies

#### 10. **typescript**
- **Purpose**: Type safety and better developer experience
- **Why**: Catches errors at compile time, better IDE support, self-documenting code

#### 11. **@types/react**, **@types/react-native**
- **Purpose**: TypeScript definitions for React/RN
- **Why**: Required for TypeScript support

#### 12. **jest** + **@testing-library/react-native**
- **Purpose**: Unit and integration testing
- **Why**: Standard testing tools, good RN support

#### 13. **eslint** + **prettier**
- **Purpose**: Code quality and formatting
- **Why**: Consistent code style, catch common errors

---

## Data Models & Type System

### Core Type Definitions

Based on analysis of Android source code, the following TypeScript interfaces will be created in `src/types/`:

#### **menu.types.ts**

```typescript
/**
 * Represents a single menu item
 * Mirrors Android's ItemLists.java data structure
 */
export interface MenuItem {
  id: string;                  // Unique identifier
  title: string;               // Item name (e.g., "Mobster Pizza")
  description: string;         // Item description
  image: any;                  // require() asset
  category: MenuCategory;      // Category enum
  position: number;            // Position in category (for price lookup)
}

export enum MenuCategory {
  PIZZA = 'pizza',
  SANDWICHES = 'sandwiches',
  PASTA = 'pasta',
  APPETIZERS = 'appetizers',
  DESSERTS = 'desserts',
  SALADS = 'salads',
}

/**
 * Price arrays mapped by category and size
 * Mirrors Android's resource arrays (R.array.signature_price, etc.)
 */
export interface PriceArrays {
  signature_price: number[];           // [small, medium, large, xlarge]
  specialty_price: number[];
  create_your_own_price: number[];
  sandwich_price: number[];
  appetizer_small_price: number[];
  appetizer_medium_price: number[];
  appetizer_large_price: number[];
  pasta_individual_price: number[];
  pasta_family_price: number[];
  topping_price_add: number[];         // By size
  topping_price_remove: number[];      // By size
  crust_price: number[];
  salad_price: number[];
  desert_price: number[];
}

export type PriceArrayKey = keyof PriceArrays;
```

#### **order.types.ts**

```typescript
/**
 * Represents a customized order item in the cart
 * Mirrors Android's OrderActivity data structure
 */
export interface OrderItem {
  id: string;                          // Unique order item ID
  menuItem: MenuItem;                  // Reference to base menu item
  size: string;                        // "Small", "Medium", "Large", etc.
  sizeIndex: number;                   // Index for price lookup
  toppingsAdded: Topping[];            // Added toppings
  toppingsRemoved: Topping[];          // Removed toppings (for pizzas)
  crustType?: string;                  // Pizza crust selection
  comments?: string;                   // Special instructions
  totalPrice: number;                  // Total in cents
  orderSummary: string;                // Human-readable summary
}

export interface Topping {
  name: string;
  price: number;                       // In cents
  direction: 'ADD' | 'REMOVE' | 'LEFT' | 'RIGHT'; // For half pizzas
}

/**
 * Shopping cart state
 * Mirrors Android's CheckoutActivity + SharedPreferences
 */
export interface Cart {
  items: OrderItem[];
  totalCost: number;                   // In cents
}
```

#### **location.types.ts**

```typescript
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
  formattedPhoneNumber: string;
  weekdayText: string[];               // Hours (array of strings)
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
  timestamp: number;                   // Unix timestamp
  expiresAt: number;                   // Unix timestamp
}

/**
 * User location
 */
export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}
```

#### **nutrition.types.ts**

```typescript
/**
 * Nutrition facts for a menu item
 * Mirrors Android's NutritionInfo.java data structure
 */
export interface NutritionFacts {
  itemName: string;
  calories: number;
  caloriesFromFat: number;
  totalFat: number;                    // grams
  saturatedFat: number;                // grams
  transFat: number;                    // grams
  cholesterol: number;                 // mg
  sodium: number;                      // mg
  totalCarbohydrate: number;           // grams
  dietaryFiber: number;                // grams
  sugars: number;                      // grams
  protein: number;                     // grams
}
```

---

## Design Patterns

### 1. Service Pattern (API Integration)

**Purpose**: Encapsulate API calls and caching logic

**Pattern**:
```typescript
// src/services/PlacesService.ts
class PlacesService {
  private cache: Map<string, CachedPlaceDetails>;

  async getNearbyRestaurants(lat: number, lng: number): Promise<NearbyPlace[]> {
    // API call logic
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
    // Check cache first, then API
  }

  private async loadFromCache(): Promise<void> {
    // Load from AsyncStorage
  }

  private async saveToCache(): Promise<void> {
    // Save to AsyncStorage
  }
}

export const placesService = new PlacesService(); // Singleton
```

**Benefits**:
- Single responsibility (API calls)
- Testable in isolation
- Centralized caching logic
- Easy to mock for testing

---

### 2. Store Pattern (State Management)

**Purpose**: Centralize state logic with Zustand

**Pattern**:
```typescript
// src/stores/orderStore.ts
interface OrderState {
  cart: Cart;
  addItem: (item: OrderItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getTotalCost: () => number;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      cart: { items: [], totalCost: 0 },

      addItem: (item) => set((state) => ({
        cart: {
          items: [...state.cart.items, item],
          totalCost: state.cart.totalCost + item.totalPrice,
        },
      })),

      removeItem: (itemId) => set((state) => {
        const newItems = state.cart.items.filter(i => i.id !== itemId);
        return {
          cart: {
            items: newItems,
            totalCost: newItems.reduce((sum, i) => sum + i.totalPrice, 0),
          },
        };
      }),

      clearCart: () => set({ cart: { items: [], totalCost: 0 } }),

      getTotalCost: () => get().cart.totalCost,
    }),
    {
      name: 'order-storage', // AsyncStorage key
    }
  )
);
```

**Benefits**:
- Automatic persistence
- Type-safe state access
- Easy to use in components: `const { cart, addItem } = useOrderStore()`

---

### 3. Utility Pattern (Price Calculation)

**Purpose**: Centralize business logic for reusability

**Pattern**:
```typescript
// src/utils/priceCalculator.ts
export class PriceCalculator {
  static calculateOrderItemTotal(
    basePrice: number,
    toppingsAdded: Topping[],
    toppingsRemoved: Topping[]
  ): number {
    const toppingsAddedCost = toppingsAdded.reduce((sum, t) => sum + t.price, 0);
    const toppingsRemovedCost = toppingsRemoved.reduce((sum, t) => sum + t.price, 0);
    return basePrice + toppingsAddedCost + toppingsRemovedCost;
  }

  static formatPrice(cents: number): string {
    const dollars = cents / 100;
    return `$${dollars.toFixed(2)}`;
  }

  static getPriceForSize(
    category: MenuCategory,
    position: number,
    sizeIndex: number,
    priceArrays: PriceArrays
  ): number {
    // Logic to determine which price array to use
    // Mirrors Android's OrderActivity.getPriceArray()
  }
}
```

**Benefits**:
- DRY (Don't Repeat Yourself)
- Testable pure functions
- Matches Android's logic exactly

---

### 4. Component Composition Pattern

**Purpose**: Build complex UIs from small, reusable components

**Pattern**:
```typescript
// src/components/MenuItem.tsx
export const MenuItem: React.FC<MenuItemProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <FastImage source={item.image} />
      <Text>{item.title}</Text>
      <Text>{item.description}</Text>
    </TouchableOpacity>
  );
};

// src/screens/MenuScreen.tsx
export const MenuScreen = () => {
  const menuItems = useMenuData();

  return (
    <FlatList
      data={menuItems}
      renderItem={({ item }) => (
        <MenuItem item={item} onPress={handleMenuItemPress} />
      )}
    />
  );
};
```

**Benefits**:
- Single Responsibility Principle
- Easy to test components in isolation
- Reusable across screens

---

## State Management Strategy

### Store Organization

**Two Primary Stores**:

1. **orderStore** (Persisted)
   - Shopping cart items
   - Total cost
   - Order history (optional)

2. **locationStore** (Partially Persisted)
   - User location (not persisted)
   - Nearby places (not persisted)
   - Selected place for bottom sheet (not persisted)
   - Cached place details (persisted with TTL)

### Persistence Strategy

**What to Persist**:
- ✅ Shopping cart (`orderStore.cart`)
- ✅ Cached place details (`locationStore.cachedDetails`)

**What NOT to Persist**:
- ❌ User location (privacy, becomes stale)
- ❌ Nearby places (becomes stale quickly)
- ❌ UI state (selected marker, bottom sheet open/closed)

**TTL (Time To Live)**:
- Place details cache: 24 hours
- Shopping cart: No expiration (until cleared)

---

## API Integration Architecture

### Google Places API Endpoints

Based on analysis of `LocationHelper.java`:

#### 1. **Nearby Search API**

**Endpoint**:
```
GET https://maps.googleapis.com/maps/api/place/nearbysearch/json
```

**Parameters**:
- `location`: `{lat},{lng}` (user's location)
- `radius`: `10000` (10km in meters)
- `type`: `restaurant`
- `keyword`: `Pizza`
- `key`: API key

**Response** (relevant fields):
```json
{
  "results": [
    {
      "place_id": "ChIJ...",
      "name": "Restaurant Name",
      "geometry": {
        "location": { "lat": 37.123, "lng": -122.456 }
      },
      "photos": [
        { "photo_reference": "CmRa..." }
      ],
      "opening_hours": {
        "open_now": true
      }
    }
  ]
}
```

#### 2. **Place Details API**

**Endpoint**:
```
GET https://maps.googleapis.com/maps/api/place/details/json
```

**Parameters**:
- `place_id`: Place ID from Nearby Search
- `key`: API key

**Response** (relevant fields):
```json
{
  "result": {
    "name": "Restaurant Name",
    "formatted_address": "123 Main St, City, State 12345",
    "formatted_phone_number": "(123) 456-7890",
    "opening_hours": {
      "weekday_text": [
        "Monday: 11:00 AM – 9:00 PM",
        "Tuesday: 11:00 AM – 9:00 PM",
        ...
      ]
    }
  }
}
```

#### 3. **Place Photo API**

**Endpoint**:
```
GET https://maps.googleapis.com/maps/api/place/photo
```

**Parameters**:
- `maxwidth`: `400` (pixels)
- `photo_reference`: From Nearby Search or Place Details
- `key`: API key

**Response**: Binary image data (JPEG)

**Usage**: Construct URL and pass to `<FastImage source={{ uri }}>` for caching

---

### Error Handling Strategy

**Retry Logic**:
- Implement exponential backoff for network errors
- Max 3 retries
- Backoff: 1s, 2s, 4s

**User-Facing Errors**:
- Network error: "Unable to load restaurants. Check your connection."
- Permission denied: "Location permission required to find nearby restaurants."
- No results: "No restaurants found nearby."

---

## Caching Strategy

### Two-Tier Caching

#### **Tier 1: In-Memory Cache (Map)**
- **Purpose**: Fast access during app session
- **Lifetime**: Until app is closed
- **Storage**: `Map<placeId, PlaceDetails>`
- **Size Limit**: No limit (small dataset)

#### **Tier 2: AsyncStorage Cache**
- **Purpose**: Persist across app restarts
- **Lifetime**: 24 hours (TTL)
- **Storage**: JSON string in AsyncStorage
- **Key**: `places-cache`

### Cache Workflow

```
1. User taps marker
2. Check Tier 1 (in-memory) → if hit, return immediately
3. Check Tier 2 (AsyncStorage) → if hit and not expired, update Tier 1, return
4. Fetch from API → update Tier 1 and Tier 2, return
```

### Cache Invalidation

**Automatic**:
- TTL expiration (24 hours)

**Manual** (optional enhancement):
- Pull-to-refresh on map screen
- "Refresh" button in bottom sheet

### Why 24-Hour TTL?

- Restaurant hours rarely change daily
- Balances freshness with API cost
- Matches typical user behavior (check once per day)

---

## Testing Strategy

### Testing Pyramid

```
        /\
       /  \         E2E Tests (Manual - 5%)
      /____\
     /      \       Integration Tests (20%)
    /________\
   /          \     Unit Tests (75%)
  /____________\
```

### Unit Tests (Priority)

**Test Coverage Targets**:
- Services: 90%+ (critical business logic)
- Stores: 85%+ (state management)
- Utils: 90%+ (pure functions)
- Components: 60%+ (focus on logic, not rendering)

**What to Test**:
- ✅ `PlacesService`: API calls, caching, error handling
- ✅ `orderStore`: Add/remove items, price calculation
- ✅ `locationStore`: Cache management, TTL expiration
- ✅ `PriceCalculator`: All calculation functions
- ✅ Formatters: Price display, text formatting

**Example**:
```typescript
// __tests__/services/PlacesService.test.ts
describe('PlacesService', () => {
  it('should fetch nearby restaurants', async () => {
    const places = await placesService.getNearbyRestaurants(37.39, -122.08);
    expect(places).toHaveLength(5);
    expect(places[0]).toHaveProperty('placeId');
  });

  it('should cache place details', async () => {
    const details1 = await placesService.getPlaceDetails('test-id');
    const details2 = await placesService.getPlaceDetails('test-id');
    expect(details1).toBe(details2); // Same reference (cached)
  });
});
```

### Integration Tests

**Test Scenarios**:
- ✅ Order flow: Select item → Customize → Add to cart → Checkout
- ✅ Map flow: Load map → Tap marker → View details
- ✅ Persistence: Add to cart → Close app → Reopen → Cart intact

### Manual Testing

**Test on Real Devices**:
- Android physical device OR emulator
- iOS physical device OR simulator (if available)

**Test Scenarios**:
- Location permissions (allow/deny)
- Offline behavior
- API errors
- Slow network
- App backgrounding/foregrounding

---

## Common Pitfalls & Solutions

### Pitfall 1: Forgetting to Await Async Functions

**Problem**:
```typescript
// ❌ Bad
const details = placesService.getPlaceDetails(placeId); // Returns Promise
console.log(details.name); // Undefined!
```

**Solution**:
```typescript
// ✅ Good
const details = await placesService.getPlaceDetails(placeId);
console.log(details.name);
```

---

### Pitfall 2: Mutating State Directly in Zustand

**Problem**:
```typescript
// ❌ Bad
addItem: (item) => {
  get().cart.items.push(item); // Direct mutation!
}
```

**Solution**:
```typescript
// ✅ Good
addItem: (item) => set((state) => ({
  cart: {
    ...state.cart,
    items: [...state.cart.items, item], // New array
  },
}))
```

---

### Pitfall 3: Not Handling API Errors

**Problem**:
```typescript
// ❌ Bad
const places = await fetch(url).then(r => r.json());
// What if network fails?
```

**Solution**:
```typescript
// ✅ Good
try {
  const response = await axios.get(url);
  return response.data;
} catch (error) {
  if (axios.isAxiosError(error)) {
    // Handle network error
    throw new Error('Network error');
  }
  throw error;
}
```

---

### Pitfall 4: FlatList Performance Issues

**Problem**:
```typescript
// ❌ Bad
<FlatList
  data={menuItems}
  renderItem={({ item }) => <MenuItem item={item} />}
/>
// Re-renders all items on every state change!
```

**Solution**:
```typescript
// ✅ Good
<FlatList
  data={menuItems}
  renderItem={renderMenuItem}
  keyExtractor={item => item.id}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>

const renderMenuItem = useCallback(({ item }) => (
  <MenuItem item={item} />
), []);
```

---

### Pitfall 5: Hardcoding API Keys

**Problem**:
```typescript
// ❌ Bad
const API_KEY = 'AIzaSy...'; // Committed to git!
```

**Solution**:
```typescript
// ✅ Good
// .env file (add to .gitignore)
GOOGLE_MAPS_API_KEY=AIzaSy...

// app.json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": process.env.GOOGLE_MAPS_API_KEY
        }
      }
    }
  }
}

// Access in code
import Constants from 'expo-constants';
const API_KEY = Constants.manifest?.android?.config?.googleMaps?.apiKey;
```

---

### Pitfall 6: Not Testing on Real Devices

**Problem**:
- Map works in simulator but not on real device
- Location permissions behave differently

**Solution**:
- **Always test on physical devices before marking phase complete**
- Use Expo Go for rapid testing
- Test location permissions flow on real device

---

### Pitfall 7: Floating-Point Price Calculations

**Problem**:
```typescript
// ❌ Bad
const price = 12.99;
const total = price + 0.50; // 13.49? Not always!
console.log(0.1 + 0.2); // 0.30000000000000004
```

**Solution**:
```typescript
// ✅ Good
const price = 1299; // Cents
const total = price + 50; // 1349 (exact)
const display = `$${(total / 100).toFixed(2)}`; // "$13.49"
```

---

## Phase Dependencies

### Phase Execution Order

```
Phase 0 (Foundation) → Read thoroughly before starting
  ↓
Phase 1 (Project Setup) → Must complete before Phase 2
  ↓
Phase 2 (Places API) → Must complete before Phase 3
  ↓
Phase 3 (Map UI) → Can parallelize with Phase 4*
  ↓
Phase 4 (Menu/Order) → Can parallelize with Phase 3*
  ↓
Phase 5 (Polish/Deploy) → Must complete all previous phases
```

*Phases 3 and 4 are semi-independent after Phase 1 is complete. They can be developed in parallel if desired, but sequential execution is recommended for clarity.

---

## Conclusion

Phase 0 establishes the technical foundation for the migration:

- **Architecture Decisions** define the "why" behind technology choices
- **Tech Stack** provides the "what" tools we'll use
- **Data Models** define the "how" we'll structure data
- **Design Patterns** establish the "how" we'll organize code
- **Testing Strategy** ensures quality throughout

**Next Step**: Proceed to **[Phase 1: Project Setup & Infrastructure](./Phase-1.md)** to begin implementation with this foundation in mind.
