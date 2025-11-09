# Italian Restaurant - React Native App

A cross-platform mobile application for browsing Italian restaurant menus, customizing orders, and finding nearby locations. Migrated from native Android to React Native (Expo) with full feature parity and enhanced UX.

## Features

### Menu & Ordering
- 📋 6 menu categories (Pizza, Pasta, Appetizers, Salads, Subs, Desserts)
- 🍕 60+ menu items with high-quality images and descriptions
- 📏 Dynamic size selection for all item types
- 🧀 Add/remove toppings with real-time pricing
- 🥖 Crust selection for pizzas (Original, Thin, Sicilian)
- 🔪 Half-pizza customization support
- 💰 Real-time price calculation
- 📝 Order comments field

### Cart & Checkout
- 🛒 Multi-item cart management
- 💾 Persistent cart (survives app restart)
- ❌ Remove individual items
- 📊 Itemized pricing display
- 🧮 Tax calculation (6.25%)
- 🧹 Clear cart functionality
- 🎉 Toast notifications for user feedback

### Maps & Location
- 📍 User location detection
- 🔍 Nearby restaurant search (10km radius)
- 🗺️ Interactive map with restaurant markers
- 📱 Modern bottom sheet UI for restaurant details
- 📸 Restaurant photos from Google Places
- 🕐 Open/closed status with business hours
- ☎️ Call restaurant directly
- 🧭 Get directions via Google Maps

### Performance & Quality
- ⚡ Optimized image loading with FastImage
- 🚀 React.memo and useCallback for efficient rendering
- 📦 API response caching (5-minute TTL)
- 🖼️ Image caching for menu items
- 📱 60 FPS smooth scrolling
- ♿ Comprehensive accessibility support
- ✅ 178 passing tests (>80% coverage)

## Tech Stack

- **Framework**: React Native (Expo SDK 54)
- **Language**: TypeScript
- **Navigation**: React Navigation 7 (Stack Navigator)
- **State Management**: Zustand
- **Maps**: react-native-maps + Google Maps API
- **UI Components**:
  - @gorhom/bottom-sheet (modern bottom sheet)
  - react-native-fast-image (optimized images)
  - react-native-toast-message (notifications)
- **HTTP Client**: Axios
- **Storage**: AsyncStorage
- **Testing**: Jest + React Native Testing Library
- **Location**: expo-location

## Prerequisites

- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- Google Maps API key ([Get one here](https://developers.google.com/maps/documentation/javascript/get-api-key))
- iOS Simulator (Mac only) or Android Emulator
- Physical device with Expo Go app (optional)

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Migration/expo-project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   Create `.env` file in the project root:
   ```env
   GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

4. **Enable required APIs** in Google Cloud Console:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API
   - Geocoding API

## Running Locally

### Development Mode

Start the development server:
```bash
npm start
```

Then choose your platform:
- Press `a` for Android emulator
- Press `i` for iOS simulator (Mac only)
- Scan QR code with Expo Go app on physical device

### Platform-Specific Commands

```bash
# Android
npm run android

# iOS (Mac only)
npm run ios

# Web
npm run web
```

## Testing

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Current Test Coverage
- **Test Suites**: 13 passed
- **Tests**: 178 passed
- **Coverage**: >80% overall
  - Services: >85%
  - Stores: >80%
  - Utils: >90%

### Test Files
- Unit tests: `__tests__/` and `src/__tests__/`
- Integration tests: `src/__tests__/integration/`
- Component tests: `__tests__/components/`

## Building for Production

### Prerequisites for Building
1. Install EAS CLI globally:
   ```bash
   npm install -g eas-cli
   ```

2. Login to Expo account:
   ```bash
   eas login
   ```

### Build Android APK
```bash
eas build --platform android --profile production
```

### Build Android AAB (for Play Store)
```bash
eas build --platform android --profile production-aab
```

### Build iOS (Mac required)
```bash
eas build --platform ios --profile production
```

### Download Build
After build completes, download from the EAS website or use:
```bash
eas build:download
```

## Project Structure

```
expo-project/
├── App.tsx                 # Root component
├── src/
│   ├── components/         # Reusable components
│   │   ├── Cart/          # Cart-related components
│   │   ├── common/        # Common UI components
│   │   └── OrderCustomization/  # Order customization widgets
│   ├── constants/         # Theme, colors, design tokens
│   ├── data/              # Menu data, price arrays
│   ├── navigation/        # Navigation configuration
│   ├── screens/           # Screen components
│   ├── services/          # API services (Google Places)
│   ├── stores/            # Zustand state stores
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Helper functions
├── assets/                # Images, icons, splash screens
├── __tests__/            # Test files
└── docs/                 # Additional documentation

```

## Configuration

### app.config.js
Main Expo configuration file. Key settings:
- App name, slug, version
- Icons and splash screens
- Platform-specific config (iOS/Android)
- Permissions
- Google Maps API key injection

### eas.json
EAS Build configuration:
- Build profiles (development, preview, production)
- Platform-specific build settings
- Submit configuration for app stores

## Environment Variables

Required environment variables in `.env`:
```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Troubleshooting

### Maps not showing
- Verify `.env` file exists and has valid API key
- Check that Google Maps APIs are enabled in Cloud Console
- Restart Metro bundler after changing `.env`

### Build fails
- Run `npm install` to ensure all dependencies are installed
- Clear cache: `expo start -c`
- Check `eas.json` configuration

### Tests failing
- Ensure you're in the correct directory
- Run `npm install` first
- Check Node.js version (18+ required)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Run tests: `npm test`
4. Commit changes: `git commit -am 'Add my feature'`
5. Push to branch: `git push origin feature/my-feature`
6. Submit a pull request

## License

[Your License Here]

## Acknowledgments

- Original Android app architecture
- Expo team for excellent tooling
- React Native community
- Google Maps Platform

## Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation in `/docs`
- Review troubleshooting guide

---

**Version**: 1.0.0
**Last Updated**: November 2025
**Platform**: iOS & Android
