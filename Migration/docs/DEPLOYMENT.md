# Deployment Guide

Complete guide to building and deploying the Italian Restaurant app to production.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [EAS Build Setup](#eas-build-setup)
3. [Building for Android](#building-for-android)
4. [Building for iOS](#building-for-ios)
5. [Google Play Store Submission](#google-play-store-submission)
6. [App Store Submission](#app-store-submission)
7. [Internal Testing](#internal-testing)
8. [Troubleshooting](#troubleshooting)

## Pre-Deployment Checklist

Before building for production, ensure:

### Code Quality
- [ ] All tests passing: `npm test`
- [ ] No console errors or warnings
- [ ] No TypeScript errors: `npm run type-check`
- [ ] Code linted: `npm run lint`
- [ ] Latest code merged to main branch

### Configuration
- [ ] App version updated in `app.config.js`
- [ ] Android `versionCode` incremented
- [ ] iOS `buildNumber` incremented
- [ ] Production Google Maps API key configured
- [ ] `.env` file has production values

### Assets
- [ ] App icon (1024x1024) looks good
- [ ] Splash screen displays correctly
- [ ] All menu images optimized
- [ ] No missing assets

### Features
- [ ] All features tested on real devices
- [ ] No crashes during user flows
- [ ] Offline mode works
- [ ] Permissions handled correctly
- [ ] Deep links work (if applicable)

### Legal & Compliance
- [ ] Privacy policy ready (required for stores)
- [ ] Terms of service ready
- [ ] Content rating completed
- [ ] App description and screenshots ready

## EAS Build Setup

### Install EAS CLI

```bash
npm install -g eas-cli
```

### Login to Expo Account

```bash
eas login
```

If you don't have an account, create one at [expo.dev](https://expo.dev).

### Configure Project

The project already has `eas.json` configured. Review it:

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk"
      }
    },
    "production-aab": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

## Building for Android

### Build APK (for direct distribution)

APK files can be installed directly on Android devices.

```bash
eas build --platform android --profile production
```

**Process**:
1. Code is uploaded to EAS Build servers
2. Android build runs in the cloud (15-30 minutes)
3. APK is generated and available for download

**Download build**:
```bash
eas build:download --platform android
```

Or download from [expo.dev/accounts/[username]/projects/italian-restaurant/builds](https://expo.dev)

### Build AAB (for Google Play Store)

App Bundle is required for Play Store submission.

```bash
eas build --platform android --profile production-aab
```

**Advantages of AAB**:
- Smaller download size for users
- Google Play optimization
- Required for new apps on Play Store

### Install APK on Device

#### Method 1: Direct Install
1. Download APK to your computer
2. Transfer to Android device
3. Enable "Install from unknown sources"
4. Tap APK file to install

#### Method 2: ADB Install
```bash
adb install path/to/app.apk
```

### Verify Production Build

Test the production build thoroughly:
- [ ] App launches without errors
- [ ] All features work
- [ ] No dev tools visible
- [ ] Performance is smooth
- [ ] Maps display correctly
- [ ] API calls work

## Building for iOS

**Prerequisites**:
- Mac computer
- Apple Developer account ($99/year)
- Xcode installed

### Build IPA

```bash
eas build --platform ios --profile production
```

### Requirements

You'll need to configure:
1. **App Store Connect**:
   - Create app in App Store Connect
   - Configure bundle identifier
   - Set up app information

2. **Certificates and Provisioning**:
   - EAS Build handles this automatically
   - Or manage manually in Apple Developer Portal

3. **Build Configuration**:
   ```json
   {
     "ios": {
       "buildConfiguration": "Release",
       "bundleIdentifier": "com.italian.restaurant"
     }
   }
   ```

## Google Play Store Submission

### Step 1: Create Play Console Account

1. Go to [Google Play Console](https://play.google.com/console)
2. Pay $25 one-time registration fee
3. Complete developer profile

### Step 2: Create App

1. Click "Create app"
2. Fill in app details:
   - **App name**: Italian Restaurant
   - **Default language**: English (US)
   - **App or game**: App
   - **Free or paid**: Free
3. Accept declarations
4. Click "Create app"

### Step 3: Store Listing

Complete the store listing:

**App details**:
- Short description (80 chars):
  ```
  Browse menu, customize orders, and find nearby Italian restaurants
  ```
- Full description (4000 chars):
  ```
  Italian Restaurant - Your Italian Dining Companion

  Browse our extensive menu of authentic Italian cuisine:
  • Pizza with customizable toppings and crust options
  • Fresh pasta dishes
  • Appetizers and salads
  • Delicious desserts
  • Subs and sandwiches

  Features:
  • 60+ menu items with images and descriptions
  • Real-time price calculation
  • Shopping cart with persistent storage
  • Find nearby restaurant locations on map
  • View restaurant details, hours, and photos
  • Get directions or call directly

  Perfect for planning your next Italian meal!
  ```

**Graphics**:
- App icon: 512 x 512 PNG
- Feature graphic: 1024 x 500 JPG/PNG
- Phone screenshots: At least 2 (1080 x 1920 or higher)
- Tablet screenshots: At least 2 (1536 x 2048 or higher)

**Categorization**:
- **App category**: Food & Drink
- **Tags**: restaurant, food, Italian, menu, pizza

### Step 4: Content Rating

1. Fill out content rating questionnaire
2. App will likely be rated "Everyone"
3. Submit for rating

### Step 5: Privacy Policy

Required for all apps. Create privacy policy covering:
- Data collection (location, app usage)
- Google Maps usage
- No personal data stored on servers
- Local storage only

Host at: `https://yourdomain.com/privacy-policy`

### Step 6: Upload App Bundle

1. Navigate to "Production" → "Create new release"
2. Upload AAB file built with EAS
3. Add release notes:
   ```
   Version 1.0.0
   - Initial release
   - Browse Italian restaurant menu
   - Customize pizza and pasta orders
   - Find nearby restaurant locations
   - View restaurant details and hours
   ```
4. Review and rollout

### Step 7: Submit for Review

1. Complete all sections (green checkmarks)
2. Click "Review and publish"
3. Wait for review (1-3 days typically)

### Step 8: After Approval

- App is live on Play Store
- Monitor crash reports and reviews
- Respond to user reviews
- Push updates as needed

## App Store Submission

### Step 1: App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Sign in with Apple Developer account
3. Click "My Apps" → "+" → "New App"

### Step 2: App Information

- **Platform**: iOS
- **Name**: Italian Restaurant
- **Bundle ID**: com.italian.restaurant
- **SKU**: com.italian.restaurant.001
- **Primary Language**: English (US)

### Step 3: Pricing and Availability

- **Price**: Free
- **Availability**: All countries

### Step 4: Prepare for Submission

**App Information**:
- Subtitle: Your Italian Dining Companion
- Category: Food & Drink
- License Agreement: Standard

**Screenshots**:
- 6.5" iPhone: At least 2 screenshots
- 5.5" iPhone: At least 2 screenshots
- iPad Pro: At least 2 screenshots

**App Review Information**:
- Contact information
- Demo account (if required)
- Notes for reviewer

**Version Information**:
- Build: Upload IPA from EAS Build
- What's new:
  ```
  Version 1.0.0
  - Initial release
  - Browse menu with 60+ items
  - Customize orders
  - Find nearby locations
  - View restaurant details
  ```

### Step 5: TestFlight (Optional)

Before production release:
```bash
eas build --platform ios --profile preview
```

Upload to TestFlight for internal testing.

### Step 6: Submit for Review

1. Complete all sections
2. Submit for App Review
3. Wait for review (1-2 days typically)

### Step 7: After Approval

- Release to App Store
- Monitor crash reports in Xcode
- Respond to user reviews

## Internal Testing

### TestFlight (iOS)

1. Build with preview profile:
   ```bash
   eas build --platform ios --profile preview
   ```
2. Upload to TestFlight
3. Add internal testers (up to 100)
4. Testers receive email invitation
5. Install via TestFlight app

### Internal Testing Track (Android)

1. Upload AAB to internal testing track
2. Add tester emails in Play Console
3. Share opt-in URL with testers
4. Testers can install from Play Store

### Direct APK Distribution

For quick testing:
1. Build APK
2. Share APK file directly
3. Testers enable "unknown sources"
4. Install APK

## Troubleshooting

### Build Fails

**Check logs**:
```bash
eas build:view --platform android
```

**Common issues**:
- Gradle build errors: Check `build.gradle` syntax
- Memory issues: Builds run in cloud with limited resources
- Asset issues: Ensure all referenced assets exist

**Solutions**:
- Clean build: `eas build --clear-cache`
- Check `eas.json` configuration
- Verify `app.config.js` settings

### App Rejected

**Play Store**:
- Missing privacy policy
- Misleading content
- Crashes on certain devices
- Permission issues

**App Store**:
- App crashes
- Missing functionality
- Guideline violations
- Metadata issues

**Resolution**:
- Read rejection reason carefully
- Fix issues
- Increment version number
- Resubmit

### Crash Reports

**Android**:
- View in Play Console → Android Vitals
- Check stack traces
- Fix and release update

**iOS**:
- View in App Store Connect → Analytics
- Download crash logs
- Fix and release update

## Update Process

### Version Update

1. Update version in `app.config.js`:
   ```javascript
   version: '1.1.0',  // Increment
   versionCode: 2,     // Android
   buildNumber: '1.1.0'  // iOS
   ```

2. Update release notes

3. Build new version:
   ```bash
   eas build --platform android --profile production-aab
   ```

4. Upload to Play Console → Production → New release

5. Submit for review

### Hot Updates (JavaScript only)

For minor JavaScript changes, use Expo Updates:
```bash
eas update --branch production --message "Fix cart bug"
```

Users get updates without app store review.

**Limitations**:
- JavaScript and assets only
- No native code changes
- No permission changes

## Monitoring

### Analytics

Consider adding:
- Firebase Analytics
- Sentry for crash reporting
- App Store/Play Console analytics

### User Feedback

- Monitor app reviews
- Respond to user issues
- Track common problems
- Plan updates accordingly

## Best Practices

1. **Test thoroughly before release**
2. **Increment version numbers properly**
3. **Keep detailed release notes**
4. **Monitor crash reports**
5. **Respond to user reviews**
6. **Plan regular updates**
7. **Maintain privacy policy**
8. **Backup signing keys**

## Resources

- [Expo EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [React Native Performance](https://reactnative.dev/docs/performance)

---

**Last Updated**: November 2025
