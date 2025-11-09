# Plan Review - Tech Lead Feedback

**Review Date**: 2025-11-08
**Reviewer**: Tech Lead
**Plan Version**: Initial Draft

---

## Issues Found

### Critical Issues (Must Fix)

#### 1. **Phase 1, Task 7**: Environment Variable Configuration Ambiguity

**Location**: `Phase-1.md`, lines 516-517

**Issue**: The task instructs the implementer to "research the current best practice for Expo environment variables" which is too vague for a zero-context engineer. This could lead to:
- Inconsistent implementation approaches
- Wasted time researching
- Potential security issues if wrong approach chosen
- Implementation that doesn't work with EAS Build

**Current Text**:
```
5. For Expo to read .env files, you may need to use a library like `dotenv` or `expo-env`
   - Research the current best practice for Expo environment variables
   - Implement the recommended approach
```

**Recommended Fix**: Specify the exact approach to use. Based on current Expo best practices (as of Expo SDK 49+), the plan should specify:

1. **For development**: Use `expo-constants` with `app.config.js` (not `app.json`) and `extra` field
2. **For production**: Use EAS Secrets with `eas build`

**Replacement Text**:
```
5. Configure environment variables for Expo:
   a. Rename `app.json` to `app.config.js`
   b. Install dotenv: `npm install dotenv`
   c. At top of `app.config.js`, add: `require('dotenv').config();`
   d. Update app.config.js structure:
      ```javascript
      export default {
        expo: {
          // ... existing config
          extra: {
            googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
          },
          android: {
            config: {
              googleMaps: {
                apiKey: process.env.GOOGLE_MAPS_API_KEY
              }
            }
          }
        }
      }
      ```
   e. Access in code:
      ```typescript
      import Constants from 'expo-constants';
      const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
      ```
   f. For production builds with EAS, add secrets:
      ```bash
      eas secret:create --name GOOGLE_MAPS_API_KEY --value your_key_here
      ```
```

This provides exact, actionable steps with no ambiguity.

---

### Suggestions (Nice to Have)

#### 2. **Phase 3, Task 7**: Optional Features Need Clearer Guidance

**Location**: `Phase-3.md`, Task 7 (lines 290-323)

**Issue**: The task includes several "optional" features (marker clustering, animations, custom markers) but doesn't clearly define:
- What is required vs truly optional
- When to implement optional features
- Success criteria for optional features

**Suggestion**: Break this task into two:
- **Task 7A (Required)**: Highlight Selected Marker
  - Clear, focused scope
  - Specific verification criteria
- **Task 7B (Optional Enhancement)**: Advanced Marker Features
  - Explicitly marked as optional
  - Provide decision criteria (e.g., "implement clustering if >50 markers")

This gives the engineer clear guidance on what MUST be done vs what can be skipped.

---

#### 3. **Phase 4, Task 1**: Android Asset Extraction Needs More Detail

**Location**: `Phase-4.md`, Task 1, step 3 (line 83)

**Issue**: States "Copy Android drawable images to `assets/images/menu/`" but doesn't specify:
- Where to find them in Android project structure
- What format they're in
- How to handle different density folders (hdpi, xhdpi, etc.)

**Suggestion**: Add explicit guidance:
```
3. Migrate images from Android project:
   - Source location: `app/src/main/res/drawable-xxhdpi/` (use xxhdpi for best quality)
   - Find all menu images (mobster.png, margherita.png, etc.)
   - Copy to `Migration/expo-project/assets/images/menu/`
   - If images are in XML vector format (not PNG):
     - Convert to PNG first using Android Studio (right-click → Convert to PNG)
     - Or use higher density folder (xxxhdpi) for better quality
   - Verify all 60+ images are present (check count matches Android)
```

---

#### 4. **Phase 2, Task 4**: Test Examples for Async Retry Logic Could Be More Complete

**Location**: `Phase-2.md`, Task 4, testing instructions (lines 438-481)

**Issue**: The test example shows use of `jest.useFakeTimers()` but the actual test code doesn't properly await the promise with fake timers, which could confuse engineers unfamiliar with Jest timer mocks.

**Suggestion**: Provide a more complete working example:
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
        return Promise.reject(new Error('Network Error'));
      }
      return Promise.resolve({ data: { results: [] } });
    });

    const service = PlacesService.getInstance();

    // Start the async operation
    const promise = service.getNearbyRestaurants(37.39, -122.08);

    // Fast-forward through the 1 second retry delay
    await jest.advanceTimersByTimeAsync(1000);

    // Now await the result
    const result = await promise;

    expect(callCount).toBe(2); // First fail, second success
    expect(result).toEqual([]);
  });
});
```

Note the use of `advanceTimersByTimeAsync` and proper promise handling.

---

#### 5. **Phase 1, Task 2**: Peer Dependency Warnings

**Location**: `Phase-1.md`, Task 2, verification (line 160)

**Issue**: Says "No installation errors or peer dependency warnings" but peer dependency warnings are common and often safe to ignore. This could cause unnecessary concern.

**Suggestion**: Clarify:
```
- [ ] No critical installation errors
- [ ] Peer dependency warnings reviewed (some are expected and safe)
- [ ] All required packages installed successfully
```

---

## What Went Well

### ✅ Excellent Phase Structure
- Clear progression: Foundation → Infrastructure → API → UI → Features → Polish
- Logical dependencies explicitly stated
- Phase 0 as architecture reference is excellent practice

### ✅ Realistic Scope and Token Estimates
- Total: ~115k tokens (fits in context window with buffer)
- Individual phases well-balanced (18k-30k)
- Task-level estimates align with phase totals
- Largest phase (Phase 4 at 30k) still manageable

### ✅ Strong Architecture Foundation (Phase 0)
- Architecture Decision Records (ADRs) explain "why" not just "what"
- Clear tech stack rationale with alternatives considered
- Comprehensive data models with TypeScript interfaces
- Common pitfalls section is valuable

### ✅ Actionable Implementation Steps
- Most tasks have clear, step-by-step instructions
- Code examples provided where helpful
- Android source code references with line numbers
- Good balance of guidance vs over-prescription

### ✅ Robust Testing Strategy
- Testing pyramid defined (75% unit, 20% integration, 5% E2E)
- Specific coverage targets per layer (Services 90%, Stores 85%, etc.)
- Test examples included in tasks
- Integration tests at phase boundaries

### ✅ Clear Verification Criteria
- Each task has objective checklist
- Testing instructions are specific
- Success criteria can be verified programmatically
- Integration verification at phase level

### ✅ Strong Commit Strategy
- Conventional commits format throughout
- Scope and type specified
- Templates provided for each task
- Encourages atomic commits

### ✅ Comprehensive Coverage
- All Android app features addressed
- Edge cases considered
- Error handling throughout
- Security (API keys, permissions) addressed
- Documentation included (Phase 5)

---

## Plan Completeness Review

### Phase 0: Architecture ✓
- [x] ADRs for major decisions
- [x] Tech stack with rationale
- [x] Data models and types
- [x] Design patterns
- [x] Testing strategy
- [x] Common pitfalls

### Phase 1: Project Setup ✓
- [x] Expo initialization
- [x] Dependencies installed
- [x] Directory structure
- [x] TypeScript/ESLint config
- [x] Type definitions
- [x] Navigation setup
- [x] Google Maps configuration
- [x] Basic map with location

### Phase 2: Places API ✓
- [x] Cache utilities
- [x] Nearby Search API
- [x] Place Details API with caching
- [x] Retry logic
- [x] Location store
- [x] Map integration
- [x] Helper functions
- [x] Comprehensive tests

### Phase 3: Map UI ✓
- [x] Bottom sheet setup
- [x] Restaurant details display
- [x] Call/directions buttons
- [x] Bottom sheet integration
- [x] Loading states
- [x] Marker enhancements
- [x] Map controls
- [x] Performance optimization

### Phase 4: Menu & Ordering ✓
- [x] Menu data migration
- [x] Nutrition data
- [x] Order store
- [x] Menu screen
- [x] Size selection
- [x] Topping selection
- [x] Crust/comments/add to cart
- [x] Checkout screen
- [x] Nutrition screen
- [x] Comprehensive tests

### Phase 5: Polish & Deploy ✓
- [x] UI theming
- [x] Loading/empty states
- [x] Toast notifications
- [x] Image optimization
- [x] React optimization
- [x] Integration testing
- [x] Accessibility
- [x] App icons/splash
- [x] Production builds
- [x] Documentation

---

## Token Estimates Validation

| Phase | Estimated | Task Sum | Delta | Status |
|-------|-----------|----------|-------|--------|
| Phase 1 | 25,000 | ~21,300 | -3,700 | ✓ Reasonable buffer |
| Phase 2 | 20,000 | ~21,000 | +1,000 | ✓ Accurate |
| Phase 3 | 22,000 | ~22,500 | +500 | ✓ Accurate |
| Phase 4 | 30,000 | ~30,500 | +500 | ✓ Accurate |
| Phase 5 | 18,000 | ~18,500 | +500 | ✓ Accurate |
| **Total** | **115,000** | **~113,800** | **-1,200** | ✓ Well calibrated |

Token estimates are realistic and account for complexity.

---

## Dependency Analysis

```
Phase 0 (Reference)
  ↓
Phase 1 (Setup) ← Must complete first
  ↓
  ├─→ Phase 2 (API) ← Sequential dependency
  │     ↓
  │   Phase 3 (Map UI) ← Sequential dependency
  │
  └─→ Phase 4 (Menu) ← Can run parallel with Phase 3*
       ↓
Phase 5 (Polish) ← Requires all previous phases
```

*Note: Phases 3 and 4 can theoretically run in parallel after Phase 1, but sequential is recommended for clarity. The plan correctly notes this.

**Dependency Validation**: ✓ No circular dependencies, logical flow

---

## Security & Best Practices Review

### ✓ API Key Management
- Keys stored in `.env` (gitignored)
- `.env.example` provided for documentation
- Access via Constants pattern
- **Issue**: Environment setup needs clarification (see Critical Issue #1)

### ✓ Location Permissions
- Proper permission request flow
- Graceful handling of denial
- Privacy: User location not persisted

### ✓ Data Validation
- TypeScript strict mode enabled
- Type-safe navigation
- No `any` types policy

### ✓ Error Handling
- Network errors with retry
- User-facing error messages
- Offline behavior addressed

---

## Recommended Priority for Fixes

1. **MUST FIX** (before implementation):
   - Critical Issue #1: Environment variable configuration

2. **SHOULD FIX** (improve implementation quality):
   - Suggestion #2: Clarify optional vs required in Task 7
   - Suggestion #3: Add asset extraction details
   - Suggestion #4: Improve test examples

3. **NICE TO HAVE** (minor improvements):
   - Suggestion #5: Clarify peer dependency warnings

---

## Final Assessment

### Overall Score: **EXCELLENT** ✓

This plan is:
- ✅ **Complete**: All features covered
- ✅ **Realistic**: Token estimates are accurate
- ✅ **Actionable**: Most tasks have clear steps
- ✅ **Testable**: Verification criteria are specific
- ✅ **Well-structured**: Logical phase progression
- ✅ **Thorough**: Testing and error handling addressed

### Ready for Implementation: **YES** (with one critical fix)

After addressing Critical Issue #1 (environment variables), this plan is ready for a zero-context engineer to execute. The suggestions would improve quality but are not blockers.

---

## Questions for Planner

Before marking this plan as **APPROVED**, please confirm:

1. **Environment Variable Approach**: Will you specify the exact approach (app.config.js with dotenv) or do you prefer a different solution? This is the only critical ambiguity.

2. **Optional Features in Phase 3**: Should Task 7 (marker enhancements) include any required elements, or can the entire task be skipped if time is constrained?

3. **Asset Availability**: Do you confirm that all Android menu images are available in PNG format in the Android project's drawable folders?

Once Critical Issue #1 is addressed, I recommend **APPROVAL** for implementation.

---

**End of Review**
