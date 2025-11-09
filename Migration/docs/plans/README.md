# Android to React Native (Expo) Migration Plan
## Italian Restaurant App - Complete Technical Specification

---

## Overview

This migration plan provides a comprehensive, step-by-step guide for porting the **Italian Restaurant App** from native Android (Java) to React Native using Expo. The original app is a proof-of-concept for an Italian restaurant chain, featuring menu browsing, order customization, and a location finder using Google Places API.

### Core Application Features

The Italian Restaurant app provides:

1. **Menu Browsing System**
   - Six menu categories: Pizza, Sandwiches, Pasta, Appetizers, Desserts, Salads/Calzones
   - 60+ menu items with titles, descriptions, and images
   - Nutrition information for all menu items

2. **Advanced Order Customization**
   - Dynamic size selection (Small, Medium, Large, etc.)
   - Topping management (add/remove with pricing)
   - Crust type selection for pizzas
   - Special half-pizza customization
   - Real-time price calculation in cents
   - Order comments

3. **Shopping Cart & Checkout**
   - Multi-item cart management
   - Persistent storage (survives app restart)
   - Order summary with itemized pricing
   - Clear cart functionality

4. **Location & Maps Integration**
   - GPS-based user location
   - Google Places API integration (Nearby Search + Place Details)
   - Custom map markers for restaurant locations
   - Restaurant details: name, address, phone, hours
   - Real-time open/closed status
   - Place photos integration

### Technical Migration Scope

This migration replaces Android-specific components with React Native equivalents while maintaining feature parity:

| Android Component | React Native Replacement |
|-------------------|-------------------------|
| Activities | Screen components |
| RecyclerView + Adapters | FlatList with renderItem |
| SharedPreferences | AsyncStorage + Zustand persist |
| LocationHelper (Worker) | PlacesService + Expo Location |
| BroadcastReceiver | Zustand store subscriptions |
| Picasso | react-native-fast-image |
| GoogleMap.setInfoWindowAdapter | @gorhom/bottom-sheet |
| Static ArrayLists | TypeScript interfaces + const data |

---

## Prerequisites

Before beginning implementation, ensure you have:

### Development Environment

- **Node.js**: v18.x or higher
- **npm** or **yarn**: Latest stable version
- **Expo CLI**: `npm install -g expo-cli`
- **Git**: For version control
- **Code Editor**: VS Code recommended with ESLint/Prettier

### API Keys & Credentials

- **Google Maps API Key**:
  - Must have Places API enabled
  - Must have Maps SDK for Android/iOS enabled
  - Must have Places Photos API enabled
  - Billing enabled (required for Places API)

### Mobile Testing Setup

- **Android**: Android Studio with emulator OR physical device
- **iOS**: Xcode (macOS only) with simulator OR physical device
- **Expo Go App**: Installed on physical devices for rapid testing

### Knowledge Requirements

- TypeScript fundamentals
- React hooks (useState, useEffect, useCallback)
- React Navigation patterns
- Async/await and Promises
- RESTful API integration

---

## Phase Summary

This migration is divided into 5 sequential phases, each designed to fit within a single AI context window (~100,000 tokens). Each phase builds upon the previous, creating a logical progression from project setup to deployment.

| Phase | Focus Area | Token Estimate | Key Deliverables |
|-------|-----------|----------------|------------------|
| **[Phase 0](./Phase-0.md)** | Architecture & Foundation | N/A (Reference) | Architecture decisions, tech stack rationale, design patterns, testing strategy |
| **[Phase 1](./Phase-1.md)** | Project Setup & Infrastructure | ~25,000 | Expo project initialization, navigation structure, basic map integration, environment configuration |
| **[Phase 2](./Phase-2.md)** | Google Places API Service | ~20,000 | PlacesService implementation, caching layer, location store, API integration tests |
| **[Phase 3](./Phase-3.md)** | Map Screen & Bottom Sheet UI | ~22,000 | Interactive map with markers, restaurant bottom sheet, photo loading, location permissions |
| **[Phase 4](./Phase-4.md)** | Menu & Ordering System | ~30,000 | Menu data migration, order customization, cart management, checkout flow, nutrition info |
| **[Phase 5](./Phase-5.md)** | Polish, Testing & Deployment | ~18,000 | UI/UX refinement, performance optimization, comprehensive testing, production builds |
| **Total** | | **~115,000** | Production-ready React Native app with feature parity |

---

## Navigation Guide

### Start Here

1. **[Phase 0: Architecture & Foundation](./Phase-0.md)** - **READ THIS FIRST**
   - Understand the technical decisions and rationale
   - Review the tech stack and why each library was chosen
   - Learn the design patterns used throughout the migration
   - Understand the testing strategy

### Implementation Phases (Sequential Order)

2. **[Phase 1: Project Setup & Infrastructure](./Phase-1.md)**
   - Initialize Expo TypeScript project
   - Set up navigation structure
   - Configure Google Maps
   - Create basic screen scaffolding

3. **[Phase 2: Google Places API Service Layer](./Phase-2.md)**
   - Build PlacesService with caching
   - Implement location state management
   - Create API integration layer
   - Add error handling and retry logic

4. **[Phase 3: Map Screen & Bottom Sheet UI](./Phase-3.md)**
   - Implement interactive map with markers
   - Build restaurant details bottom sheet
   - Integrate photo loading
   - Handle location permissions

5. **[Phase 4: Menu & Ordering System](./Phase-4.md)**
   - Migrate menu data to TypeScript
   - Build order customization flows
   - Implement cart management
   - Create checkout experience

6. **[Phase 5: Polish, Testing & Deployment](./Phase-5.md)**
   - Refine UI/UX to match Android app
   - Optimize performance
   - Write comprehensive tests
   - Build production artifacts

---

## Key Technical Decisions

### State Management: Zustand with Persistence

**Decision**: Use Zustand with persist middleware instead of Redux or Context API

**Rationale**:
- Lightweight (< 1KB gzipped)
- Minimal boilerplate compared to Redux
- Built-in TypeScript support
- Persist middleware handles AsyncStorage integration seamlessly
- Direct replacement for Android's SharedPreferences pattern
- No provider wrapper needed (cleaner than Context API)

### Maps Implementation: Markers + Bottom Sheet

**Decision**: Use simple markers with bottom sheet details instead of custom callouts

**Rationale**:
- More modern mobile UX pattern
- Consistent behavior across iOS/Android
- Easier to implement complex UI (photos, buttons, formatted text)
- Better animation support
- Avoids platform-specific callout limitations

### API Strategy: Lazy Loading with Caching

**Decision**: Fetch basic location data upfront, load details on demand with caching

**Rationale**:
- Faster initial map load
- Reduced API costs (only fetch details when user taps marker)
- Better user experience (progressive data loading)
- Cache layer prevents redundant API calls
- Matches mobile best practices

### Price Handling: Integer Cents

**Decision**: Store prices as integers (cents) throughout the app

**Rationale**:
- Matches Android implementation exactly
- Avoids floating-point precision issues
- Simpler arithmetic calculations
- Industry standard for financial calculations
- Easy conversion to display format

---

## Project Structure

The final Expo project structure will be organized as follows:

```plaintext
Migration/
├── expo-project/
│   ├── src/
│   │   ├── screens/
│   │   │   ├── MenuScreen.tsx
│   │   │   ├── OrderScreen.tsx
│   │   │   ├── CheckoutScreen.tsx
│   │   │   ├── MapScreen.tsx
│   │   │   ├── NutritionScreen.tsx
│   │   │   └── ContactScreen.tsx
│   │   ├── components/
│   │   │   ├── MenuItem.tsx
│   │   │   ├── OrderCustomization/
│   │   │   ├── RestaurantBottomSheet.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── common/
│   │   ├── navigation/
│   │   │   └── RootNavigator.tsx
│   │   ├── services/
│   │   │   ├── PlacesService.ts
│   │   │   └── LocationService.ts
│   │   ├── stores/
│   │   │   ├── orderStore.ts
│   │   │   └── locationStore.ts
│   │   ├── data/
│   │   │   ├── menuData.ts
│   │   │   ├── nutritionData.ts
│   │   │   └── priceArrays.ts
│   │   ├── types/
│   │   │   ├── menu.types.ts
│   │   │   ├── order.types.ts
│   │   │   └── location.types.ts
│   │   ├── utils/
│   │   │   ├── priceCalculator.ts
│   │   │   ├── formatters.ts
│   │   │   └── cache.ts
│   │   ├── constants/
│   │   │   └── config.ts
│   │   └── assets/
│   │       ├── images/
│   │       └── fonts/
│   ├── __tests__/
│   │   ├── services/
│   │   ├── stores/
│   │   └── utils/
│   ├── app.json
│   ├── App.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── docs/
│   └── plans/
│       ├── README.md (this file)
│       ├── Phase-0.md
│       ├── Phase-1.md
│       ├── Phase-2.md
│       ├── Phase-3.md
│       ├── Phase-4.md
│       └── Phase-5.md
└── assets/
    └── original-android-assets/
```

---

## Android Source Code Reference

### Key Files for Understanding Implementation

The following Android source files were analyzed to create this migration plan:

**Menu & Data**:
- `/app/src/main/java/gemenielabs/italian/Data/ItemLists.java` (292 lines)
  - Static menu data for all categories
  - Image resource mappings
  - Menu item descriptions

- `/app/src/main/java/gemenielabs/italian/Data/NutritionInfo.java` (85 lines)
  - Hardcoded nutrition database
  - Regex-based parsing logic

**Order Flow**:
- `/app/src/main/java/gemenielabs/italian/OrderActivity.java` (343 lines)
  - Complex order customization logic
  - Dynamic topping spinners
  - Price calculation algorithms

- `/app/src/main/java/gemenielabs/italian/CheckoutActivity.java` (179 lines)
  - Cart management
  - SharedPreferences persistence
  - Order summary display

**Maps & Location**:
- `/app/src/main/java/gemenielabs/italian/Data/LocationHelper.java` (174 lines)
  - Google Places API integration
  - Nearby Search implementation
  - Place Details fetching

- `/app/src/main/java/gemenielabs/italian/MapFragmentActivity.java` (153 lines)
  - Map display logic
  - Custom info window implementation
  - Photo loading with Picasso

**Adapters (UI Components)**:
- `/app/src/main/java/gemenielabs/italian/Adapters/AllMenuItemsAdapter.java` (98 lines)
- `/app/src/main/java/gemenielabs/italian/Adapters/SpinnerAdapter.java` (144 lines)
- `/app/src/main/java/gemenielabs/italian/Adapters/OrderSummaryAdapter.java` (67 lines)

---

## Success Criteria

### Feature Parity Checklist

The migration is complete when the React Native app achieves:

**Menu & Ordering**:
- [ ] All 6 menu categories functional
- [ ] 60+ menu items with images and descriptions
- [ ] Size selection working for all item types
- [ ] Dynamic topping add/remove with pricing
- [ ] Crust selection for pizzas
- [ ] Half-pizza customization
- [ ] Real-time price calculation
- [ ] Order comments field

**Cart & Checkout**:
- [ ] Multi-item cart management
- [ ] Persistent cart (survives app restart)
- [ ] Remove items from cart
- [ ] Itemized pricing display
- [ ] Total calculation
- [ ] Clear cart functionality

**Maps & Location**:
- [ ] User location detection
- [ ] Nearby restaurant search (10km radius)
- [ ] Map markers for all locations
- [ ] Bottom sheet with restaurant details
- [ ] Restaurant photos displayed
- [ ] Open/closed status shown
- [ ] Business hours displayed
- [ ] Phone number with call functionality
- [ ] Directions integration

**Data & Performance**:
- [ ] All menu data migrated accurately
- [ ] Nutrition info for all items
- [ ] API response caching working
- [ ] Image caching functional
- [ ] Smooth scrolling (60 FPS)
- [ ] Fast map interactions

**Quality & Testing**:
- [ ] Unit tests for stores (>80% coverage)
- [ ] Unit tests for PlacesService
- [ ] Integration tests for order flow
- [ ] Manual testing on iOS/Android
- [ ] No console errors or warnings
- [ ] Proper error handling

**Deployment**:
- [ ] Production Android APK/AAB builds
- [ ] Production iOS IPA builds (optional)
- [ ] App icons and splash screen
- [ ] Documentation complete

---

## Development Best Practices

### Commit Strategy

Use conventional commits format:

```
type(scope): brief description

- Detail 1
- Detail 2
- Detail 3

Closes #issue-number
```

**Types**: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`

**Examples**:
- `feat(places): implement nearby search with caching`
- `fix(order): correct price calculation for half pizzas`
- `refactor(menu): extract MenuItem component`
- `test(store): add orderStore unit tests`

### Testing Approach

Follow Test-Driven Development (TDD) where appropriate:

1. Write failing test
2. Implement minimum code to pass
3. Refactor for quality
4. Commit

**Priority**: Services > Stores > Utils > Components

### Code Quality

- **DRY**: Extract repeated logic into utilities
- **YAGNI**: Don't add features not in the spec
- **Type Safety**: Leverage TypeScript, avoid `any`
- **Immutability**: Use const, avoid mutations
- **Single Responsibility**: One purpose per function/component

---

## Troubleshooting Guide

### Common Issues

**API Key Issues**:
- Ensure billing is enabled in Google Cloud Console
- Verify API key restrictions allow your bundle ID
- Check API key has all required APIs enabled

**Location Permission Errors**:
- Add location permission strings to app.json
- Request permissions before accessing location
- Handle permission denied gracefully

**Build Errors**:
- Clear cache: `expo start --clear`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Expo SDK compatibility

**Performance Issues**:
- Use React.memo for expensive components
- Implement FlatList optimizations (getItemLayout, keyExtractor)
- Optimize image sizes
- Enable Hermes engine

---

## Resources

### Documentation Links

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [react-native-maps Guide](https://github.com/react-native-maps/react-native-maps)
- [Google Places API Reference](https://developers.google.com/maps/documentation/places/web-service)

### Original App References

- **Demo Video**: [YouTube](https://www.youtube.com/watch?v=0L9OZ7Lr804)
- **Play Store**: [Italian Restaurant App](https://play.google.com/store/apps/details?id=gemenielabs.italian)

---

## Support & Questions

For questions during implementation:

1. Review the relevant Phase documentation
2. Check Phase-0.md for architectural guidance
3. Reference Android source code in `/app/src/main/java/`
4. Consult the troubleshooting section above

---

## License

This migration plan is provided as-is for the purpose of porting the Italian Restaurant Android app to React Native (Expo).

---

**Next Step**: Read **[Phase 0: Architecture & Foundation](./Phase-0.md)** to understand the technical decisions and design patterns before beginning implementation.
