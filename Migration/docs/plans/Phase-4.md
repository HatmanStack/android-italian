# Phase 4: Menu & Ordering System

**Status**: Implementation Phase
**Estimated Tokens**: ~30,000
**Dependencies**: Phase 1 (Project Setup), Can run in parallel with Phase 3

---

## Phase Goal

Port the complete menu, ordering, and checkout system from Android, including:
- Static menu data migration (60+ items across 6 categories)
- Order customization UI (sizes, toppings, crust)
- Real-time price calculation
- Shopping cart with persistence
- Checkout flow
- Nutrition information display

### Success Criteria

- ✅ All menu categories and items display correctly
- ✅ Order customization works with dynamic pricing
- ✅ Cart persists across app restarts
- ✅ Checkout shows order summary
- ✅ Nutrition info displays for all items
- ✅ Prices calculated correctly (match Android logic exactly)

---

## Prerequisites

- Phase 1 completed
- Read Android files: `ItemLists.java`, `OrderActivity.java`, `CheckoutActivity.java`, `NutritionInfo.java`
- Understand Android price calculation logic (OrderActivity.java lines 155-246)
- Have Android app assets available for migration

---

## Tasks

### Task 1: Migrate Menu Data

**Goal**: Convert Android `ItemLists.java` to TypeScript data

**Files to Create**:
- `Migration/expo-project/src/data/menuData.ts`
- `Migration/expo-project/src/data/priceArrays.ts`

**Implementation Steps**:

1. **Review Android source** (`ItemLists.java`):
   - Lines 14-38: Pizza titles (23 items)
   - Lines 40-64: Pizza image resources
   - Lines 66-90: Pizza descriptions
   - Lines 92-135: Sandwiches (12 items)
   - Lines 137-183: Pastas (13 items)
   - Lines 186-226: Appetizers (11 items)
   - Lines 228-250: Desserts (5 items)
   - Lines 252-265: Salads (2 items)

2. **Create `menuData.ts`**:
   - Import MenuItem and MenuCategory types
   - Create arrays for each category matching Android structure
   - Example structure:
     ```typescript
     export const pizzaItems: MenuItem[] = [
       {
         id: 'pizza-mobster',
         title: 'Mobster',
         description: 'Beef, Pork Sausage, Mushroom...',
         image: require('../../assets/images/menu/mobster.png'),
         category: MenuCategory.PIZZA,
         position: 0, // For price lookup
       },
       // ... 22 more pizzas
     ];
     ```

3. **Migrate images**:
   - Copy Android drawable images to `assets/images/menu/`
   - Convert format if needed (PNG recommended)
   - Name files to match Android names (lowercase)
   - Update `require()` paths in menuData

4. **Create helper to get items by category**:
   ```typescript
   export function getMenuItemsByCategory(category: MenuCategory): MenuItem[] {
     switch(category) {
       case MenuCategory.PIZZA: return pizzaItems;
       // ... other categories
     }
   }
   ```

5. **Create `priceArrays.ts`**:
   - Review Android resource arrays (e.g., `R.array.signature_price`)
   - Port all price arrays to TypeScript
   - All prices in cents (integers)
   - Example:
     ```typescript
     export const priceArrays: PriceArrays = {
       signature_price: [1099, 1599, 1999, 2499], // Small, Med, Large, XL
       specialty_price: [1299, 1799, 2199, 2699],
       topping_price_add: [50, 75, 100, 125], // By size
       // ... all price arrays
     };
     ```

6. **Validate data**:
   - All 60+ items present
   - All descriptions match Android
   - All images load
   - All prices in cents (integers)

**Verification**: Import menuData and log items, verify count and structure

**Commit**: `feat(data): migrate menu data and price arrays from Android`

**Estimated tokens**: ~4,000

---

### Task 2: Migrate Nutrition Data

**Goal**: Convert `NutritionInfo.java` hardcoded data to TypeScript

**Files to Create**:
- `Migration/expo-project/src/data/nutritionData.ts`
- `Migration/expo-project/src/utils/nutritionHelper.ts`

**Implementation Steps**:

1. **Review Android source** (`NutritionInfo.java` lines 19-55):
   - Single string with all nutrition data
   - Format: `ItemName calories fat ... protein`
   - 11 fields per item

2. **Parse Android data** (one-time conversion):
   - Copy hardcoded string
   - Write temp script to parse into JSON
   - OR manually create array of objects

3. **Create `nutritionData.ts`**:
   ```typescript
   import { NutritionFacts } from '@/types/nutrition.types';

   export const nutritionDatabase: NutritionFacts[] = [
     {
       itemName: 'Cheese',
       calories: 260,
       caloriesFromFat: 60,
       totalFat: 7,
       saturatedFat: 3.5,
       transFat: 0,
       cholesterol: 15,
       sodium: 420,
       totalCarbohydrate: 36,
       dietaryFiber: 1,
       sugars: 2,
       protein: 12,
     },
     // ... all items
   ];
   ```

4. **Create `nutritionHelper.ts`**:
   - `getNutritionByName(itemName: string): NutritionFacts | null`
   - Case-insensitive search
   - Return null if not found

5. **Validate**:
   - All items from Android present
   - Test lookup function

**Verification**: Query nutrition for "Mobster" and verify values match Android

**Commit**: `feat(data): migrate nutrition database to TypeScript`

**Estimated tokens**: ~2,500

---

### Task 3: Create Order Store

**Goal**: Build Zustand store for cart management

**Files to Create**:
- `Migration/expo-project/src/stores/orderStore.ts`

**Implementation Steps**:

1. **Define state interface** (from Phase 0):
   ```typescript
   interface OrderState {
     cart: Cart;
     addItem: (item: OrderItem) => void;
     removeItem: (itemId: string) => void;
     updateItem: (itemId: string, updates: Partial<OrderItem>) => void;
     clearCart: () => void;
     getTotal: () => number;
   }
   ```

2. **Implement with Zustand + persist**:
   - Use `create(persist(...))` pattern
   - Persist entire cart to AsyncStorage
   - Storage key: `order-storage`

3. **Implement actions**:
   - `addItem`: Add to cart.items, recalculate total
   - `removeItem`: Filter out item, recalculate total
   - `updateItem`: Find and update, recalculate total
   - `clearCart`: Reset to empty
   - `getTotal`: Sum all item prices

4. **Match Android storage** (CheckoutActivity.java lines 132-138):
   - Android stores items with keys like `ITEM_STRING_0`, `ITEM_COST_0`
   - Our Zustand persist is cleaner (single JSON object)

**Verification**: Add item, close app, reopen, verify cart persisted

**Commit**: `feat(store): implement order store with cart persistence`

**Estimated tokens**: ~2,500

---

### Task 4: Build Menu Screen

**Goal**: Display menu categories and items

**Files to Modify**:
- `Migration/expo-project/src/screens/MenuScreen.tsx`

**Files to Create**:
- `Migration/expo-project/src/components/MenuItem.tsx`
- `Migration/expo-project/src/components/CategoryTabs.tsx`

**Implementation Steps**:

1. **Create CategoryTabs component**:
   - Horizontal scrollable tabs for categories
   - Active tab highlighted
   - Tap to switch category

2. **Create MenuItem component**:
   - Props: `item: MenuItem`, `onPress: (item) => void`
   - Layout: Image, title, description snippet
   - Tappable card

3. **Build MenuScreen**:
   - State: `selectedCategory`
   - Render CategoryTabs at top
   - Render FlatList of items for selected category
   - `onPress`: Navigate to OrderScreen with item

4. **Navigation**:
   - Pass item data to OrderScreen via route params
   - Use typed navigation

5. **Styling**:
   - Match Android layout (or improve)
   - Grid layout optional (2 columns)

**Verification**: Browse all categories, tap item navigates to OrderScreen

**Commit**: `feat(menu): build menu screen with categories and items`

**Estimated tokens**: ~3,000

---

### Task 5: Build Order Customization Screen (Part 1 - Size Selection)

**Goal**: Implement size selector for order customization

**Files to Modify**:
- `Migration/expo-project/src/screens/OrderScreen.tsx`

**Files to Create**:
- `Migration/expo-project/src/components/OrderCustomization/SizeSelector.tsx`
- `Migration/expo-project/src/utils/priceCalculator.ts`

**Implementation Steps**:

1. **Review Android logic** (`OrderActivity.java` lines 155-211):
   - Different size options per category
   - Size affects base price and topping prices

2. **Create `priceCalculator.ts`**:
   - `getBasePrice(item: MenuItem, sizeIndex: number): number`
   - Logic to determine which price array to use
   - Based on category and position (signature vs specialty)
   - Return price in cents

3. **Create SizeSelector component**:
   - Props: `item`, `selectedSize`, `onSizeChange`
   - Render size options (Small, Medium, Large, XL)
   - Highlight selected
   - Show price for each size

4. **Build OrderScreen basic structure**:
   - Get item from route params
   - State: `selectedSize`, `toppings`, `crust`, `comments`
   - Render item image and title
   - Render SizeSelector
   - Display current price

**Verification**: Select different sizes, price updates correctly

**Commit**: `feat(order): implement size selection with price calculation`

**Estimated tokens**: ~3,500

---

### Task 6: Build Order Customization Screen (Part 2 - Toppings)

**Goal**: Implement dynamic topping selection

**Files to Create**:
- `Migration/expo-project/src/components/OrderCustomization/ToppingSelector.tsx`

**Files to Modify**:
- `Migration/expo-project/src/screens/OrderScreen.tsx`
- `Migration/expo-project/src/utils/priceCalculator.ts`

**Implementation Steps**:

1. **Review Android logic** (OrderActivity.java lines 214-246):
   - Dynamic list of toppings
   - Add/Remove buttons
   - Half pizza support (left/right)
   - Topping price varies by size

2. **Create ToppingSelector**:
   - List of available toppings
   - Checkboxes to add/remove
   - Each topping shows price
   - For pizzas: "Add to Left/Right/Whole" options

3. **Update priceCalculator**:
   - `getToppingPrice(size: number, direction: 'ADD' | 'REMOVE'): number`
   - Use appropriate price array

4. **Update OrderScreen**:
   - Render ToppingSelector for pizza/calzone
   - Update state when toppings change
   - Recalculate total price

5. **Calculate total**:
   - Base price (size)
   - + Added topping prices
   - + Removed topping prices (yes, Android charges for "NO" items)

**Verification**: Add/remove toppings, price updates correctly

**Commit**: `feat(order): implement topping selection with dynamic pricing`

**Estimated tokens**: ~4,000

---

### Task 7: Complete Order Customization (Crust, Comments, Add to Cart)

**Goal**: Finish order customization flow

**Files to Modify**:
- `Migration/expo-project/src/screens/OrderScreen.tsx`

**Files to Create**:
- `Migration/expo-project/src/components/OrderCustomization/CrustSelector.tsx`

**Implementation Steps**:

1. **Create CrustSelector** (for pizzas):
   - List of crust types
   - Some have additional cost

2. **Add comments input**:
   - TextInput for special instructions
   - Multiline support

3. **Build order summary string**:
   - Match Android format (OrderActivity.java lines 250-272)
   - Example: "LARGE\nADD Pepperoni $0.75\nNO Onions"

4. **Implement "Add to Cart" button**:
   - Build OrderItem object
   - Calculate final total
   - Call `orderStore.addItem()`
   - Navigate back to Menu OR to Checkout

5. **Validate**:
   - Size must be selected
   - Calculate correct total

**Verification**: Customize order, add to cart, verify in store

**Commit**: `feat(order): complete order customization with add to cart`

**Estimated tokens**: ~3,000

---

### Task 8: Build Checkout Screen

**Goal**: Display cart summary and order total

**Files to Modify**:
- `Migration/expo-project/src/screens/CheckoutScreen.tsx`

**Files to Create**:
- `Migration/expo-project/src/components/CartItem.tsx`

**Implementation Steps**:

1. **Review Android** (CheckoutActivity.java):
   - FlatList of cart items
   - Each item: summary string, price, remove button
   - Total at bottom
   - "Clear Cart" and "Place Order" buttons

2. **Create CartItem component**:
   - Props: `item: OrderItem`, `onRemove: () => void`
   - Display order summary (formatted string)
   - Display price
   - Remove button

3. **Build CheckoutScreen**:
   - Get cart from orderStore
   - Render FlatList of CartItems
   - Display total at bottom
   - "Clear Cart" button
   - "Place Order" button (navigate to MapScreen for now)

4. **Implement actions**:
   - Remove item: Call `orderStore.removeItem()`
   - Clear cart: Call `orderStore.clearCart()`
   - Place order: Navigate to MapScreen (Android flow)

**Verification**: Items display, remove works, total correct, clear cart works

**Commit**: `feat(checkout): build checkout screen with cart management`

**Estimated tokens**: ~2,500

---

### Task 9: Build Nutrition Screen

**Goal**: Display nutrition facts for menu items

**Files to Modify**:
- `Migration/expo-project/src/screens/NutritionScreen.tsx`

**Implementation Steps**:

1. **Review Android** (NutritionInfoActivity.java):
   - Simple table display
   - All 11 nutrition fields
   - Accessed from menu item

2. **Build NutritionScreen**:
   - Get item name from route params
   - Look up nutrition with `getNutritionByName()`
   - Display in table format:
     - Calories, Fat, Carbs, Protein, etc.
   - Handle missing data gracefully

3. **Add navigation from MenuScreen**:
   - Long press or info button on MenuItem
   - Navigate to NutritionScreen with item name

**Verification**: View nutrition for multiple items, all fields display

**Commit**: `feat(nutrition): build nutrition info screen`

**Estimated tokens**: ~2,000

---

### Task 10: Write Comprehensive Tests

**Goal**: Test all ordering logic and price calculations

**Files to Create**:
- `Migration/expo-project/__tests__/utils/priceCalculator.test.ts`
- `Migration/expo-project/__tests__/stores/orderStore.test.ts`
- `Migration/expo-project/__tests__/screens/OrderScreen.test.tsx`

**Implementation Steps**:

1. **Test priceCalculator**:
   - Test `getBasePrice()` for all categories
   - Test signature vs specialty pizza pricing
   - Test topping prices by size
   - Test edge cases

2. **Test orderStore**:
   - Test addItem updates cart and total
   - Test removeItem recalculates total
   - Test clearCart resets state
   - Test persistence (mock AsyncStorage)

3. **Integration tests**:
   - Test complete order flow: Select item → Customize → Add to cart
   - Test multiple items in cart
   - Test price calculations match Android exactly

4. **Comparison testing** (critical):
   - Pick 5 complex orders from Android app
   - Replicate in React Native app
   - Verify prices match exactly

**Verification**: All tests pass, prices match Android 100%

**Commit**: `test(order): comprehensive test suite for ordering system`

**Estimated tokens**: ~3,500

---

## Phase Verification

### Integration Tests

1. **Complete Order Flow**:
   - Browse menu → Select pizza
   - Choose Large size
   - Add 3 toppings
   - Select crust
   - Add comments
   - Add to cart
   - Go to checkout
   - Verify price matches expected
   - Remove item
   - Repeat with sandwich and pasta
   - Place order (navigate to map)

2. **Cart Persistence Test**:
   - Add 3 items to cart
   - Close app completely
   - Reopen app
   - Go to checkout
   - Verify all 3 items still in cart
   - Verify total is correct

3. **Price Calculation Test**:
   - Create order: Large Specialty Pizza + 5 toppings + premium crust
   - Calculate price manually
   - Verify matches app
   - Repeat for different categories

4. **Nutrition Info Test**:
   - View nutrition for 5 different items
   - Verify data displays
   - Verify matches Android app

### Expected State

- ✅ All menu items browsable
- ✅ Order customization working
- ✅ Cart persists across restarts
- ✅ Prices calculated correctly
- ✅ Nutrition info displays

---

## Next Steps

**Proceed to**: **[Phase 5: Polish, Testing & Deployment](./Phase-5.md)**

---

## Review Feedback (Iteration 1)

### Phase Completion Status

**Verification Results:**
- ✅ Tests: 165/165 passing (92 new tests added!)
- ❌ Type-check: 2 TypeScript errors in OrderScreen.tsx
- ⚠️ Lint: 4 errors, 2 warnings (minor issues, mostly auto-fixable)
- ✅ Phase completion: 10 of 10 tasks completed (100%)

**Completed Tasks:**
- ✅ Task 1: Menu Data Migration (commit 15201c7) - 65 images, complete menuData.ts
- ✅ Task 2: Nutrition Data (commit f07e704) - nutritionData.ts with helper
- ✅ Task 3: Order Store (commit 2175d83) - Zustand with persistence
- ✅ Task 4: Menu Screen (commit 48da370) - CategoryTabs, MenuItem components
- ✅ Task 5: Size Selection (commit e6eb622) - SizeSelector component
- ✅ Task 6: Toppings (commit 19eab2d) - ToppingSelector component
- ✅ Task 7: Crust & Cart (commit 678fcdf) - CrustSelector, CommentsInput, CartItem
- ✅ Task 8: Checkout Screen (commit 010d80e) - Complete checkout implementation
- ✅ Task 9: Nutrition Screen (commit 625af8e) - FDA-compliant nutrition label
- ✅ Task 10: Tests (commit b295896) - 92 new tests (orderStore, priceCalculator, nutritionHelper, integration)

### Critical Issue: TypeScript Compilation Errors

> **Consider:** Run `npm run type-check` - what do you see on lines 78 and 111 of `OrderScreen.tsx`?
>
> **Reflect:** Look at the type of `menuItem.category`. In `src/types/menu.types.ts`, what is the `MenuCategory` enum defined as?
>
> **Think about:** Line 78 compares `menuItem.category === 'PIZZA'` (uppercase string), but the enum value is `MenuCategory.PIZZA = 'pizza'` (lowercase). What's the TypeScript-safe way to compare?
>
> **Action needed:** Fix both comparisons:
> ```typescript
> // Line 78 - current (wrong):
> if (menuItem.category === 'PIZZA' && crustIndex !== 0) {
>
> // Should be:
> if (menuItem.category === MenuCategory.PIZZA && crustIndex !== 0) {
>
> // Line 111 - current (wrong):
> crustType: menuItem.category === 'PIZZA' ? crustTypes[crustIndex] : undefined,
>
> // Should be:
> crustType: menuItem.category === MenuCategory.PIZZA ? crustTypes[crustIndex] : undefined,
> ```
>
> **Remember:** Import `MenuCategory` at the top of the file if not already imported.

**Commit format:** `fix(order): use MenuCategory enum instead of string literals`

### ESLint Issues (Minor)

> **Consider:** Run `npm run lint` - you'll see 4 errors and 2 warnings. Most are trivial.
>
> **Reflect:** Three errors in `NutritionScreen.tsx` line 27 are about unescaped quotes in JSX. React wants you to use HTML entities for quotes in text.
>
> **Think about:** One error in `priceCalculator.ts:147` is about a trivial type annotation. One warning in `ToppingSelector.tsx:29` is about an unused variable `toppingsRemoved`.
>
> **Action needed:** Run `npm run lint -- --fix` to auto-fix the fixable issues, then manually fix:
> - NutritionScreen.tsx:27 - Replace quotes with `&apos;` or remove them
> - ToppingSelector.tsx:29 - Rename unused var to `_toppingsRemoved` or remove it
> - priceCalculator.ts:147 - Remove the type annotation (TypeScript can infer it)

**Commit format:** `fix(lint): resolve ESLint errors and warnings`

### Implementation Quality Review

**Outstanding Work - Excellent Execution:**

This is the largest phase with the most complex implementation, and it's executed exceptionally well:

**Data Migration (Tasks 1-2):**
- ✅ All 65 menu item images migrated from Android drawables
- ✅ menuData.ts: 6 categories, 60+ items with proper typing
- ✅ priceArrays.ts: All Android price arrays ported (integer cents)
- ✅ nutritionData.ts: Complete FDA nutrition facts for all items
- ✅ Helper functions: getMenuItemsByCategory, getNutritionByName

**State Management (Task 3):**
- ✅ orderStore.ts: Clean Zustand implementation with persistence
- ✅ Cart operations: addItem, removeItem, updateItem, clearCart, getTotal
- ✅ Proper total recalculation on every operation
- ✅ AsyncStorage persistence with JSON serialization

**UI Components (Tasks 4-7):**
- ✅ CategoryTabs: Horizontal scrollable tabs with active highlighting
- ✅ MenuItem: Card layout with image, title, description
- ✅ SizeSelector: Radio buttons with price display per size
- ✅ ToppingSelector: Add/remove toppings with dynamic price updates
- ✅ CrustSelector: Thin, original, deep dish options
- ✅ CommentsInput: Special instructions field
- ✅ CartItem: Display order summary with customizations

**Screens (Tasks 8-9):**
- ✅ MenuScreen: Category tabs + scrollable item list
- ✅ OrderScreen: Complete customization flow with real-time pricing
- ✅ CheckoutScreen: Cart review, total calculation, order placement
- ✅ NutritionScreen: FDA-compliant nutrition facts label

**Business Logic (Tasks 5-8):**
- ✅ priceCalculator.ts: Mirrors Android OrderActivity.java logic exactly
- ✅ Handles all categories: pizza (23 items), sandwiches (12), pasta (13), appetizers (11), desserts (5), salads (2)
- ✅ Size-based pricing: Pizza has 5 sizes, pasta has 2, appetizers have 3, etc.
- ✅ Topping prices: $0.75 for add, $0.25 for remove (stored as 75 and 25 cents)
- ✅ Crust modifications: Deep dish +$1.50, thin crust +$0.00
- ✅ Edge cases: Normous Cookie single price, category-specific logic

**Testing (Task 10):**
- ✅ 92 new tests added (73 → 165 total)
- ✅ Unit tests: orderStore (8 tests), priceCalculator (9 tests), nutritionHelper (4 tests)
- ✅ Component tests: RestaurantBottomSheet (12 tests), Skeleton (7 tests)
- ✅ Integration tests: orderFlow (12 tests) - complete add-to-cart flow
- ✅ All tests passing with proper mocks and assertions

**Architectural Consistency:**
- ✅ Follows Phase-0 data model exactly
- ✅ TypeScript interfaces match Android POJOs
- ✅ Price calculation logic matches Android 1:1
- ✅ Integer cents (no floating point) per Phase-0 ADR-005
- ✅ Zustand for state management per Phase-0
- ✅ AsyncStorage for persistence (replaces SharedPreferences)

**Code Quality:**
- ✅ Excellent documentation: JSDoc comments on all utility functions
- ✅ DRY principles: Reusable components, shared utilities
- ✅ Type safety: Comprehensive TypeScript interfaces
- ✅ Error handling: Null checks, fallback values
- ✅ Clean separation: Data layer, state layer, UI layer

### Phase Approval Criteria

To receive **APPROVED** status, the following must be verified with tools:

- [x] **All 10 tasks completed** ✅
- [x] **All tests passing** ✅ 165/165
- [ ] **Type-check passing** ❌ (2 errors in OrderScreen.tsx)
- [ ] **Lint passing** ⚠️ (4 errors, 2 warnings - minor)
- [x] **All commits follow conventional format** ✅
- [x] **Menu data migrated** ✅ (65 images, 60+ items)
- [x] **Price calculation working** ✅ (matches Android logic)
- [x] **Order store with persistence** ✅
- [x] **All screens implemented** ✅
- [x] **Comprehensive tests** ✅ (92 new tests)

**Current Status:** ❌ **NOT APPROVED** - 95% complete

**Blocking Issues (2):**
1. ❌ **TypeScript errors**: OrderScreen.tsx comparing enum to string literal
2. ⚠️ **ESLint errors**: Minor issues (unescaped quotes, unused vars, trivial type annotation)

**Implementation Quality:** Exceptional - This is the most complex phase with the largest codebase changes, and the implementation is outstanding. All business logic correctly ported from Android, comprehensive test coverage, clean architecture, and excellent code quality.

Once the TypeScript errors are fixed (simple enum comparison fix) and ESLint errors are resolved (mostly auto-fixable), this phase will receive **APPROVED** status.

### Additional Notes

**Bonus Implementation:**
- Commit c6ce180 adds navigation to nutrition screen from menu (not in original plan but great UX addition)

**Performance:**
- Test suite runs in 14.6 seconds (165 tests)
- No performance concerns in implementation

**Migration Fidelity:**
- Price calculation logic matches Android `OrderActivity.java` lines 155-246 exactly
- Menu data matches Android `ItemLists.java` completely
- Nutrition data matches Android `arrays.xml` nutrition arrays
- All 6 menu categories from Android ported successfully
