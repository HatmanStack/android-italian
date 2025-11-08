# Phase 3: Map Screen & Bottom Sheet UI

**Status**: Implementation Phase
**Estimated Tokens**: ~22,000
**Dependencies**: Phase 2 (Places API Service Layer)

---

## Phase Goal

Build the interactive map UI with bottom sheet displaying restaurant details, replicating the Android `MapFragmentActivity.java` functionality with an improved UX pattern.

### Success Criteria

- ✅ Tapping marker opens bottom sheet with place details
- ✅ Bottom sheet displays: photo, name, address, phone, hours, open/closed status
- ✅ Call button opens phone dialer
- ✅ Directions button opens maps app
- ✅ Photos load and cache with FastImage
- ✅ Smooth animations and gestures
- ✅ Loading states while fetching details

---

## Prerequisites

- Phase 2 completed with all tests passing
- Understand `@gorhom/bottom-sheet` usage
- Read Phase 0 ADR-003 (Bottom Sheet vs Callouts decision)
- Review Android `MapFragmentActivity.java` (lines 96-148)

---

## Tasks

### Task 1: Install and Configure Bottom Sheet Library

**Goal**: Set up `@gorhom/bottom-sheet` with proper dependencies

**Files to Modify**:
- `Migration/expo-project/package.json`
- `Migration/expo-project/App.tsx`

**Implementation Steps**:

1. Install dependencies (if not already in Phase 1):
   ```bash
   npm install @gorhom/bottom-sheet react-native-reanimated react-native-gesture-handler
   ```

2. Update `App.tsx` to wrap with GestureHandlerRootView:
   ```typescript
   import { GestureHandlerRootView } from 'react-native-gesture-handler';

   export default function App() {
     return (
       <GestureHandlerRootView style={{ flex: 1 }}>
         {/* existing navigation */}
       </GestureHandlerRootView>
     );
   }
   ```

3. Configure react-native-reanimated:
   - Add plugin to `babel.config.js`:
     ```javascript
     module.exports = {
       presets: ['babel-preset-expo'],
       plugins: ['react-native-reanimated/plugin'],
     };
     ```
   - Clear cache: `expo start --clear`

**Verification**: Run app, verify no errors related to reanimated or gesture-handler

**Commit**: `feat(deps): configure bottom-sheet and gesture handler`

**Estimated tokens**: ~1,500

---

### Task 2: Create Restaurant Bottom Sheet Component

**Goal**: Build reusable bottom sheet component for restaurant details

**Files to Create**:
- `Migration/expo-project/src/components/RestaurantBottomSheet.tsx`

**Implementation Steps**:

1. Create component with props interface:
   ```typescript
   interface Props {
     placeDetails: PlaceDetails | null;
     isLoading: boolean;
     onClose: () => void;
   }
   ```

2. Use `BottomSheet` from `@gorhom/bottom-sheet`:
   - Create ref: `const bottomSheetRef = useRef<BottomSheet>(null)`
   - Define snap points: `['25%', '50%', '90%']`
   - Initial snap index: `-1` (closed)

3. Show/hide based on `placeDetails`:
   - `useEffect` to open when `placeDetails !== null`
   - `useEffect` to close when `placeDetails === null`

4. Render content:
   - If `isLoading`: Show skeleton loader
   - If `placeDetails`: Show full details
   - If `null`: Don't render (closed state)

5. Add close button in handle:
   - Tappable handle with "X" icon
   - Calls `onClose()` prop

**Verification**: Bottom sheet opens and closes correctly with animation

**Commit**: `feat(map): create RestaurantBottomSheet component`

**Estimated tokens**: ~2,500

---

### Task 3: Add Restaurant Details Content

**Goal**: Display all restaurant information in bottom sheet

**Files to Modify**:
- `Migration/expo-project/src/components/RestaurantBottomSheet.tsx`

**Implementation Steps**:

1. Create content layout (inside BottomSheet):
   - **Photo Section**: FastImage with restaurant photo
   - **Name Section**: Restaurant name (bold, large text)
   - **Status Badge**: Green "OPEN" or Red "CLOSED" pill
   - **Address**: Full formatted address with icon
   - **Phone**: Formatted phone number with icon
   - **Hours**: Weekday hours in scrollable view

2. Use `FastImage` for photo:
   - Import from `react-native-fast-image`
   - Source: `getPlacePhotoUrl(placeDetails.photoReference)`
   - Show placeholder while loading
   - Handle missing photo gracefully

3. Style open/closed badge:
   - Green background + white text for OPEN
   - Red background + white text for CLOSED
   - Round corners, padding, centered

4. Format phone and address with icons:
   - Use icons from `@expo/vector-icons` (MaterialIcons)
   - `phone` icon for phone number
   - `location-on` icon for address
   - `schedule` icon for hours

5. Make hours scrollable:
   - Use `ScrollView` for weekday_text array
   - Each day on new line
   - Max height: 150px

**Verification**: All details display correctly, photo loads, layout looks professional

**Commit**: `feat(map): add restaurant details content to bottom sheet`

**Estimated tokens**: ~3,000

---

### Task 4: Add Call and Directions Buttons

**Goal**: Implement action buttons for call and directions

**Files to Modify**:
- `Migration/expo-project/src/components/RestaurantBottomSheet.tsx`

**Implementation Steps**:

1. Add action buttons section below details:
   - Two buttons: "Call" and "Directions"
   - Side by side layout (flex-direction: row)
   - Icons + text labels

2. Implement Call button:
   - Import `Linking` from `react-native`
   - `onPress={() => Linking.openURL(`tel:${placeDetails.formattedPhoneNumber}`)}`
   - Handle platforms that don't support phone calls

3. Implement Directions button:
   - Open native maps app with destination
   - iOS: `maps://?q=${lat},${lng}`
   - Android: `geo:${lat},${lng}?q=${name}`
   - Use `Platform.select()` for platform-specific URLs

4. Add error handling:
   - Wrap in try/catch
   - Show alert if can't open URL

5. Style buttons:
   - Primary color background
   - White text
   - Round corners
   - Press feedback (opacity change)

**Verification**: Tapping Call opens dialer, tapping Directions opens maps

**Commit**: `feat(map): add call and directions action buttons`

**Estimated tokens**: ~2,000

---

### Task 5: Integrate Bottom Sheet with MapScreen

**Goal**: Connect bottom sheet to MapScreen with marker tap

**Files to Modify**:
- `Migration/expo-project/src/screens/MapScreen.tsx`

**Implementation Steps**:

1. Import RestaurantBottomSheet component

2. Access location store state:
   - `selectedPlace` from store
   - `selectPlace(placeId)` action
   - `clearSelectedPlace()` action
   - `loading` state

3. Update marker `onPress`:
   - Call `selectPlace(place.placeId)`
   - This triggers lazy loading of place details

4. Render `<RestaurantBottomSheet>` at bottom of MapScreen:
   - Pass `placeDetails={selectedPlace}`
   - Pass `isLoading={loading}`
   - Pass `onClose={() => clearSelectedPlace()}`

5. Handle keyboard:
   - Wrap in `KeyboardAvoidingView` if needed
   - Bottom sheet handles this automatically on most platforms

**Verification**: Tap marker → bottom sheet opens → shows details → close button works

**Commit**: `feat(map): integrate bottom sheet with marker tap`

**Estimated tokens**: ~2,500

---

### Task 6: Add Loading States and Skeletons

**Goal**: Improve UX with loading skeletons

**Files to Create**:
- `Migration/expo-project/src/components/common/Skeleton.tsx`

**Files to Modify**:
- `Migration/expo-project/src/components/RestaurantBottomSheet.tsx`

**Implementation Steps**:

1. Create reusable Skeleton component:
   - Props: `width`, `height`, `borderRadius`
   - Animated gray rectangle that pulses
   - Use `Animated` API for pulse effect

2. Add loading state to bottom sheet:
   - When `isLoading === true`:
     - Show skeleton for photo (rectangle)
     - Show skeleton for name (line)
     - Show skeleton for address (line)
     - Show skeleton for hours (multiple lines)

3. Ensure smooth transition:
   - Fade in content when loaded
   - Fade out skeleton

**Verification**: Loading state shows skeleton, then fades to real content

**Commit**: `feat(ui): add loading skeletons for bottom sheet`

**Estimated tokens**: ~2,000

---

### Task 7: Enhance Map Markers

**Goal**: Customize marker appearance for better UX

**Files to Modify**:
- `Migration/expo-project/src/screens/MapScreen.tsx`

**Implementation Steps**:

1. Create custom marker view (optional):
   - Use `<Marker>` with custom `children`
   - Custom pin image or styled view
   - OR use default pin with custom color

2. Add marker clustering (optional, for many results):
   - Install `react-native-map-clustering` if >20 markers
   - Group nearby markers
   - Show count badge

3. Highlight selected marker:
   - Track selected marker ID in state
   - Change marker color when selected
   - Use `pinColor` prop

4. Add marker animations:
   - Markers drop in when loaded (stagger animation)
   - Selected marker bounces

**Verification**: Markers look good, selected marker highlighted, animations smooth

**Commit**: `feat(map): enhance marker appearance and interactions`

**Estimated tokens**: ~2,500

---

### Task 8: Add Map Controls and Polish

**Goal**: Add zoom buttons, re-center, and other UX improvements

**Files to Modify**:
- `Migration/expo-project/src/screens/MapScreen.tsx`

**Implementation Steps**:

1. Add floating action button (FAB) to re-center on user:
   - Position: bottom-right (above bottom sheet)
   - Icon: crosshairs or my-location
   - `onPress`: Animate map to user location

2. Add map controls:
   - Enable zoom controls (Android default)
   - Enable compass (rotates map)
   - Enable scale bar (shows distance)

3. Improve map region handling:
   - Fit all markers in view on initial load
   - Use `fitToCoordinates()` method

4. Add error states:
   - No results found → show message
   - Location permission denied → show prompt

5. Add pull-to-refresh:
   - Swipe down to refresh nearby places
   - Clear cache and re-fetch

**Verification**: All controls work, map behavior is intuitive

**Commit**: `feat(map): add map controls and UX polish`

**Estimated tokens**: ~2,500

---

### Task 9: Test Bottom Sheet Interactions

**Goal**: Ensure bottom sheet UX is smooth and bug-free

**Files to Create**:
- `Migration/expo-project/__tests__/components/RestaurantBottomSheet.test.tsx`

**Implementation Steps**:

1. Write component tests:
   - Test bottom sheet opens when placeDetails provided
   - Test bottom sheet closes when onClose called
   - Test loading state shows skeleton
   - Test details render correctly

2. Write integration tests:
   - Test marker tap opens bottom sheet
   - Test bottom sheet displays correct place
   - Test call button with mock Linking
   - Test directions button with mock Linking

3. Manual testing checklist:
   - Tap different markers (switch places)
   - Close and reopen bottom sheet
   - Scroll hours list
   - Tap call and directions buttons
   - Test on iOS and Android

**Verification**: All tests pass, manual testing reveals no bugs

**Commit**: `test(map): add tests for bottom sheet interactions`

**Estimated tokens**: ~2,000

---

### Task 10: Optimize Performance

**Goal**: Ensure smooth map and bottom sheet performance

**Files to Modify**:
- `Migration/expo-project/src/screens/MapScreen.tsx`
- `Migration/expo-project/src/components/RestaurantBottomSheet.tsx`

**Implementation Steps**:

1. Memoize components:
   - Wrap RestaurantBottomSheet in `React.memo()`
   - Memoize marker rendering with `useCallback()`

2. Optimize images:
   - Use `FastImage` priority levels
   - Set appropriate image sizes (don't load 4K for 400px view)
   - Enable caching

3. Debounce map region changes:
   - Don't fetch on every pan
   - Only fetch when user stops moving

4. Reduce re-renders:
   - Use Zustand selectors to subscribe to specific state
   - Avoid passing entire store

5. Profile performance:
   - Use React DevTools Profiler
   - Check for unnecessary renders
   - Optimize hot paths

**Verification**: Map scrolls at 60 FPS, bottom sheet animates smoothly

**Commit**: `perf(map): optimize rendering and animations`

**Estimated tokens**: ~2,000

---

## Phase Verification

### Integration Tests

1. **Complete Flow Test**:
   - Open MapScreen
   - Grant location permission
   - Verify markers load
   - Tap marker
   - Bottom sheet opens with details
   - Verify photo loads
   - Verify open/closed status shows
   - Tap call button → dialer opens
   - Tap directions → maps opens
   - Close bottom sheet → closes smoothly

2. **Performance Test**:
   - Load map with 20+ markers
   - Scroll map rapidly
   - Verify no lag or stuttering
   - Open bottom sheet while scrolling → smooth
   - Switch between markers quickly → no crashes

3. **Error Handling Test**:
   - Turn off network
   - Tap marker
   - Verify error message in bottom sheet
   - Turn on network
   - Retry → details load

### Expected State

- ✅ Full map UX complete
- ✅ Bottom sheet displays all restaurant details
- ✅ Photos load and cache
- ✅ Call and directions buttons work
- ✅ Smooth animations (60 FPS)
- ⚠️ No menu/ordering yet (Phase 4)

---

## Next Steps

**Proceed to**: **[Phase 4: Menu & Ordering System](./Phase-4.md)**
