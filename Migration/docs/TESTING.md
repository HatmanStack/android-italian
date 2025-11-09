# Testing Guide

Comprehensive guide to testing the Italian Restaurant React Native app.

## Table of Contents

1. [Testing Overview](#testing-overview)
2. [Running Tests](#running-tests)
3. [Test Coverage](#test-coverage)
4. [Writing Tests](#writing-tests)
5. [Manual Testing](#manual-testing)
6. [Performance Testing](#performance-testing)
7. [Accessibility Testing](#accessibility-testing)

## Testing Overview

### Testing Stack

- **Test Runner**: Jest
- **React Testing**: React Native Testing Library
- **Mocking**: Jest mocks
- **Coverage**: Jest coverage reports

### Test Categories

1. **Unit Tests**: Individual functions and components
2. **Integration Tests**: Multiple components working together
3. **Service Tests**: API interactions and data fetching
4. **Store Tests**: State management logic

### Current Test Coverage

- **Test Suites**: 13 passed
- **Tests**: 178 passed
- **Overall Coverage**: >80%
  - Services: >85%
  - Stores: >80%
  - Utils: >90%

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Run Specific Test File

```bash
npm test orderStore.test.ts
```

### Run Tests Matching Pattern

```bash
npm test integration
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

Coverage report will be generated in `coverage/` directory.

### View Coverage Report

```bash
# Generate coverage
npm test -- --coverage

# Open HTML report
open coverage/lcov-report/index.html
```

## Test Coverage

### Coverage Thresholds

Configured in `jest.config.js`:

```javascript
coverageThreshold: {
  global: {
    statements: 80,
    branches: 75,
    functions: 80,
    lines: 80,
  },
}
```

### Current Coverage by Category

#### Stores (>80%)
- `orderStore.test.ts`: Cart operations, persistence
- `locationStore.test.ts`: Location and places management

#### Services (>85%)
- `PlacesService.test.ts`: Google Places API integration
- API error handling
- Caching logic

#### Utils (>90%)
- `priceCalculator.test.ts`: Price calculations
- `nutritionHelper.test.ts`: Nutrition data lookups
- `placesHelpers.test.ts`: Places data formatting

#### Components (>75%)
- `RestaurantBottomSheet.test.tsx`: Bottom sheet UI
- `Skeleton.test.tsx`: Loading skeleton
- `RootNavigator.test.tsx`: Navigation structure

#### Integration (>80%)
- `orderFlow.test.ts`: Complete order flow
- `checkoutFlow.test.tsx`: Cart and checkout flow
- Multi-step user journeys

## Writing Tests

### Test File Structure

```typescript
import { renderHook, act } from '@testing-library/react-native';
import { useOrderStore } from '../../stores/orderStore';

// Mock external dependencies
jest.mock('@react-native-async-storage/async-storage');

describe('OrderStore', () => {
  beforeEach(() => {
    // Reset state before each test
    const { result } = renderHook(() => useOrderStore());
    act(() => {
      result.current.clearCart();
    });
  });

  describe('addItem', () => {
    it('should add item to cart', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        result.current.addItem(mockOrderItem);
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.totalCost).toBe(1749);
    });
  });
});
```

### Testing Hooks

Use `renderHook` for testing custom hooks:

```typescript
const { result } = renderHook(() => useOrderStore());

act(() => {
  result.current.addItem(item);
});

expect(result.current.cart.items).toHaveLength(1);
```

### Testing Components

Use `render` and query functions:

```typescript
const { getByText, getByTestId } = render(
  <MenuItem item={mockItem} onPress={jest.fn()} />
);

expect(getByText('Pizza')).toBeTruthy();
```

### Testing Async Operations

Use `waitFor` for async expectations:

```typescript
await waitFor(() => {
  expect(result.current.places).toHaveLength(5);
});
```

### Mocking AsyncStorage

```typescript
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
```

### Mocking API Calls

```typescript
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

mockedAxios.get.mockResolvedValue({
  data: { results: [] }
});
```

## Manual Testing

### Manual Testing Checklist

Complete this checklist on physical devices before release.

#### Order Flow
- [ ] Browse menu categories
- [ ] View menu item details
- [ ] Select size (Small, Medium, Large, etc.)
- [ ] Add toppings (price updates correctly)
- [ ] Remove default toppings (no charge)
- [ ] Select crust type
- [ ] Add special comments
- [ ] Add to cart
- [ ] View cart with all items
- [ ] Remove item from cart
- [ ] Clear entire cart
- [ ] Place order
- [ ] See success toast

#### Map Flow
- [ ] Open map screen
- [ ] Grant location permission
- [ ] See current location marker
- [ ] See restaurant markers
- [ ] Tap restaurant marker
- [ ] Bottom sheet opens with details
- [ ] See restaurant photo
- [ ] See business hours
- [ ] See open/closed status
- [ ] Tap phone number to call
- [ ] Tap "Get Directions" (opens Google Maps)
- [ ] Close bottom sheet

#### Persistence
- [ ] Add items to cart
- [ ] Close app completely
- [ ] Reopen app
- [ ] Cart items still present
- [ ] Search for places
- [ ] Close app
- [ ] Reopen app
- [ ] Places cache still valid

#### Error Handling
- [ ] Disable internet
- [ ] Try to load map
- [ ] See error message
- [ ] Re-enable internet
- [ ] Tap retry
- [ ] Data loads successfully

#### Permissions
- [ ] Deny location permission
- [ ] See permission rationale
- [ ] Open settings
- [ ] Grant permission
- [ ] Return to app
- [ ] Location works

#### Edge Cases
- [ ] Empty cart message displayed
- [ ] Very long item name displays correctly
- [ ] Maximum toppings (10+) work
- [ ] Zero results on map search
- [ ] Very long comments field
- [ ] Multiple rapid button presses

### Testing on Different Devices

#### Android
- [ ] Pixel 5 or newer
- [ ] Samsung Galaxy
- [ ] OnePlus device
- [ ] Android 11+
- [ ] Android 13+

#### iOS
- [ ] iPhone 11 or newer
- [ ] iPad (if supported)
- [ ] iOS 14+
- [ ] iOS 16+

### Screen Sizes

Test on various screen sizes:
- Small phones (< 5.5")
- Medium phones (5.5" - 6.5")
- Large phones (> 6.5")
- Tablets

### Orientations

- [ ] Portrait mode
- [ ] Landscape mode (if supported)
- [ ] Rotation handling

## Performance Testing

### Metrics to Monitor

1. **App Startup Time**
   - Target: < 3 seconds
   - Measure: From tap to interactive

2. **Screen Load Time**
   - Menu screen: < 1 second
   - Map screen: < 2 seconds
   - Order screen: < 500ms

3. **Scroll Performance**
   - Target: 60 FPS
   - Test: Fast scroll through menu
   - Monitor: React DevTools Profiler

4. **Image Load Time**
   - Target: < 500ms per image
   - Test: Menu images
   - Check: FastImage caching works

### Performance Testing Tools

#### React DevTools Profiler

1. Install React DevTools
2. Run app in dev mode
3. Open Profiler
4. Record interaction
5. Analyze flame graph

```bash
npm start
# Press 'd' to open dev menu
# Enable Performance Monitor
```

#### Metro Bundler Stats

Check bundle size:
```bash
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output bundle.js
ls -lh bundle.js
```

### Memory Usage

Monitor memory in production:
- Android: Use Android Studio Profiler
- iOS: Use Xcode Instruments

### Network Performance

Test with various network conditions:
- WiFi (fast)
- 4G (normal)
- 3G (slow)
- Offline (no connection)

## Accessibility Testing

### Screen Reader Testing

#### iOS VoiceOver

1. Enable: Settings → Accessibility → VoiceOver
2. Navigate with swipes
3. Verify all elements announced
4. Check announcements are clear

#### Android TalkBack

1. Enable: Settings → Accessibility → TalkBack
2. Navigate with swipes
3. Verify all elements announced
4. Check announcements are clear

### Accessibility Checklist

- [ ] All buttons have `accessibilityLabel`
- [ ] All images have `accessibilityLabel`
- [ ] Interactive elements have proper `accessibilityRole`
- [ ] Form fields have `accessibilityHint`
- [ ] Navigation is logical with screen reader
- [ ] All content readable by screen reader
- [ ] No accessibility errors in console

### Color Contrast

Use tools to verify:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Minimum ratio: 4.5:1 (WCAG AA)

### Touch Targets

Verify minimum size:
- Minimum: 44x44 points
- Recommended: 48x48 points
- Check all buttons meet standard

### Dynamic Text

Test with large text:
1. Enable large text in device settings
2. Verify all text scales properly
3. Ensure no text cutoff
4. Layout adjusts appropriately

## Automated Testing in CI/CD

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3
```

### Pre-commit Hooks

Install husky for pre-commit testing:

```bash
npm install -D husky
npx husky install
npx husky add .git/hooks/pre-commit "npm test"
```

## Debugging Tests

### Debug Single Test

```javascript
it.only('should add item to cart', () => {
  // This test will run in isolation
});
```

### Skip Test

```javascript
it.skip('should handle edge case', () => {
  // This test will be skipped
});
```

### Console Logging

```javascript
console.log('Cart state:', result.current.cart);
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal"
}
```

## Test Maintenance

### Keep Tests Fast

- Mock expensive operations
- Avoid unnecessary `waitFor`
- Use `renderHook` over full component renders
- Clear state between tests

### Keep Tests Reliable

- Don't rely on timing
- Mock external dependencies
- Use data-testid for queries
- Avoid testing implementation details

### Keep Tests Maintainable

- One assertion per test (ideally)
- Descriptive test names
- Group related tests with `describe`
- Extract common test data to fixtures

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Expo Testing Guide](https://docs.expo.dev/develop/unit-testing/)

---

**Last Updated**: November 2025
