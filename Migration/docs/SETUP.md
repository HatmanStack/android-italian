# Development Environment Setup Guide

Complete guide to setting up your development environment for the Italian Restaurant React Native app.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Node.js and npm](#nodejs-and-npm)
3. [Expo CLI](#expo-cli)
4. [Google Maps API Setup](#google-maps-api-setup)
5. [IDE Setup](#ide-setup)
6. [Platform-Specific Setup](#platform-specific-setup)
7. [Troubleshooting](#troubleshooting)

## System Requirements

### Minimum Requirements
- **OS**: macOS 10.15+, Windows 10+, or Ubuntu 20.04+
- **RAM**: 8GB minimum, 16GB recommended
- **Disk Space**: 10GB free space
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Recommended
- **RAM**: 16GB+
- **SSD**: For faster build times
- **Internet**: Stable connection for npm packages and API calls

## Node.js and npm

### Installation

#### macOS (using Homebrew)
```bash
brew install node
```

#### Windows
Download installer from [nodejs.org](https://nodejs.org/)

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Verify Installation
```bash
node --version  # Should be v18.0.0+
npm --version   # Should be v9.0.0+
```

### Update npm (if needed)
```bash
npm install -g npm@latest
```

## Expo CLI

### Installation
```bash
npm install -g expo-cli
```

### Verify Installation
```bash
expo --version
```

### Login to Expo (required for builds)
```bash
expo login
```

Create account at [expo.dev](https://expo.dev) if you don't have one.

## Google Maps API Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "Italian Restaurant"
4. Click "Create"

### Step 2: Enable Required APIs

Enable these APIs in your project:

1. **Maps SDK for Android**
   - Navigation: APIs & Services → Library
   - Search: "Maps SDK for Android"
   - Click "Enable"

2. **Maps SDK for iOS**
   - Search: "Maps SDK for iOS"
   - Click "Enable"

3. **Places API**
   - Search: "Places API"
   - Click "Enable"

4. **Geocoding API**
   - Search: "Geocoding API"
   - Click "Enable"

### Step 3: Create API Key

1. Navigation: APIs & Services → Credentials
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key
4. Click "Restrict Key" (recommended)

### Step 4: Configure API Key Restrictions

**Application restrictions**:
- Android apps: Add package name `com.italian.restaurant`
- iOS apps: Add bundle ID `com.italian.restaurant`

**API restrictions**:
- Select "Restrict key"
- Choose:
  - Maps SDK for Android
  - Maps SDK for iOS
  - Places API
  - Geocoding API

### Step 5: Add API Key to Project

1. Navigate to project root:
   ```bash
   cd Migration/expo-project
   ```

2. Create `.env` file:
   ```bash
   touch .env
   ```

3. Add your API key:
   ```env
   GOOGLE_MAPS_API_KEY=AIzaSy...your_actual_key_here
   ```

4. **Important**: Never commit `.env` to git (already in `.gitignore`)

### Verify API Key

Run the app and check the map screen:
```bash
npm start
```

If maps don't load, check:
- API key is correct in `.env`
- Required APIs are enabled
- API key restrictions match your app

## IDE Setup

### Visual Studio Code (Recommended)

#### Installation
Download from [code.visualstudio.com](https://code.visualstudio.com/)

#### Recommended Extensions
Install these VS Code extensions:

```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension expo.vscode-expo-tools
```

Or search in VS Code Extensions:
- ESLint
- Prettier - Code formatter
- TypeScript and JavaScript Language Features
- Expo Tools

#### Workspace Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### Alternative IDEs

- **WebStorm**: Excellent TypeScript support
- **Atom**: Lightweight option
- **Sublime Text**: Fast and minimal

## Platform-Specific Setup

### Android Development

#### Option 1: Android Studio (Recommended)

1. Download [Android Studio](https://developer.android.com/studio)
2. Install Android SDK (API 33+)
3. Create Android Virtual Device (AVD):
   - Open AVD Manager
   - Create Device
   - Select Pixel 5 or similar
   - Choose System Image: API 33 (Android 13)
   - Finish

4. Start emulator:
   ```bash
   # Or use Android Studio AVD Manager
   ```

#### Option 2: Physical Android Device

1. Enable Developer Options:
   - Settings → About Phone
   - Tap "Build Number" 7 times

2. Enable USB Debugging:
   - Settings → Developer Options
   - Enable "USB Debugging"

3. Connect device via USB

4. Verify connection:
   ```bash
   adb devices
   ```

### iOS Development (macOS only)

#### Install Xcode

1. Download Xcode from Mac App Store
2. Install Command Line Tools:
   ```bash
   xcode-select --install
   ```

3. Accept license:
   ```bash
   sudo xcodebuild -license
   ```

#### Install CocoaPods

```bash
sudo gem install cocoapods
```

#### iOS Simulator

Simulators are included with Xcode:
```bash
# List available simulators
xcrun simctl list devices

# Open simulator
open -a Simulator
```

#### Option: Physical iOS Device

1. Connect device via USB
2. Trust computer on device
3. Select device in Xcode

### Web Development

No additional setup required for web. Just run:
```bash
npm run web
```

## Project Installation

### Clone and Install

```bash
# Clone repository
git clone <repository-url>
cd Migration/expo-project

# Install dependencies
npm install

# Start development server
npm start
```

### First Run Checklist

- [ ] Node.js 18+ installed
- [ ] Expo CLI installed globally
- [ ] Google Maps API key in `.env`
- [ ] Required Google APIs enabled
- [ ] Android emulator or iOS simulator running
- [ ] `npm install` completed successfully
- [ ] `npm start` runs without errors

## Troubleshooting

### Common Issues

#### "Cannot find module" errors
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

#### Metro bundler errors
```bash
# Clear Metro cache
expo start -c

# Or manually
rm -rf node_modules/.cache
```

#### TypeScript errors
```bash
# Ensure TypeScript is installed
npm install -D typescript

# Restart TypeScript server in VS Code
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

#### Android emulator won't start
- Ensure Android SDK is installed
- Check virtualization is enabled in BIOS
- Try creating a new AVD with less RAM
- Use x86 image instead of ARM

#### iOS simulator won't start
- Ensure Xcode is fully installed
- Run `xcode-select --install`
- Open Xcode and accept licenses
- Restart computer

#### Maps not showing
- Verify `.env` file exists in project root
- Check API key is valid
- Ensure APIs are enabled in Google Cloud Console
- Restart Metro bundler after changing `.env`

#### "SDK location not found" (Android)
Create `local.properties` in `android/`:
```
sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
```

### Getting Help

1. Check error message carefully
2. Search issue in [Expo forums](https://forums.expo.dev/)
3. Check [React Native documentation](https://reactnative.dev/)
4. Check [Expo documentation](https://docs.expo.dev/)
5. Create issue in repository

## Next Steps

After setup is complete:
1. Read the main [README.md](../expo-project/README.md)
2. Review [TESTING.md](./TESTING.md) for test guidelines
3. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for build instructions
4. Start developing!

---

**Last Updated**: November 2025
