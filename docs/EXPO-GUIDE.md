# Expo for Beginners - Complete Guide

## What is Expo?

**Expo** is a framework for building mobile apps (iOS, Android, Web) using **React Native** and JavaScript/TypeScript.

Think of it like this:

- **React** = Build websites
- **React Native** = Build mobile apps with React
- **Expo** = Makes React Native much easier (pre-configured tools, cloud builds, etc.)

---

## Required Tools & Setup

### 1. Node.js (Required)

```bash
# Download from: https://nodejs.org
# Install version 18 or higher

# Verify installation:
node -v    # Should show v18.0.0 or higher
npm -v     # Should show 9.0.0 or higher
```

### 2. Expo CLI (Required)

```bash
# Install globally:
npm install -g expo-cli

# Or use with npx (no installation needed):
npx expo --version
```

### 3. VS Code (Recommended Editor)

**Download:** https://code.visualstudio.com

#### Recommended Extensions:

**Essential:**

- **Expo Tools** (`expo.vscode-expo-tools`) - Expo integration, debugging
- **ES7+ React/Redux/React-Native snippets** (`dsznajder.es7-react-js-snippets`) - Code snippets
- **TypeScript Vue Plugin (Volar)** - Better TypeScript support (if needed)

**Code Quality:**

- **ESLint** (`dbaeumer.vscode-eslint`) - Linting errors
- **Prettier** (`esbenp.prettier-vscode`) - Code formatting
- **Error Lens** (`usernamehw.errorlens`) - Inline errors

**Productivity:**

- **Auto Rename Tag** (`formulahendry.auto-rename-tag`) - Rename paired tags
- **Path Intellisense** (`christian-kohler.path-intellisense`) - Autocomplete file paths
- **GitLens** (`eamodio.gitlens`) - Git integration
- **Material Icon Theme** (`pkief.material-icon-theme`) - Better file icons

**React Native Specific:**

- **React Native Tools** (`msjsdiag.vscode-react-native`) - Debugging, IntelliSense
- **React Native Snippet** (`jundat95.react-native-snippet`) - RN-specific snippets

#### VS Code Settings (Recommended)

Create/update `.vscode/settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit",
    "source.organizeImports": "explicit"
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "javascript.preferences.importModuleSpecifier": "non-relative",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### 4. Platform-Specific Tools

#### For Android Development:

- **Android Studio** (includes Android SDK and emulator)
  - Download: https://developer.android.com/studio
  - After install: Configure Android SDK via SDK Manager
  - Create virtual device (AVD) for testing

#### For iOS Development (Mac only):

- **Xcode** (from Mac App Store)
- **Xcode Command Line Tools:**
  ```bash
  xcode-select --install
  ```
- **CocoaPods:**
  ```bash
  sudo gem install cocoapods
  ```

#### For Testing on Physical Device:

- **Expo Go app** (easiest option)
  - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
  - iOS: https://apps.apple.com/app/expo-go/id982107779

### 5. Optional but Useful Tools

**Package Managers:**

- **Yarn** (alternative to npm): `npm install -g yarn`
- **pnpm** (faster alternative): `npm install -g pnpm`

**Version Management:**

- **nvm** (Node Version Manager) - Switch Node versions easily
  - Windows: https://github.com/coreybutler/nvm-windows
  - Mac/Linux: https://github.com/nvm-sh/nvm

**Debugging:**

- **React Developer Tools** (browser extension)
- **Flipper** (advanced debugging) - https://fbflipper.com

**Design Tools:**

- **Figma** - Design mockups
- **Zeplin** - Design handoff

### 6. Quick Installation Script

**Windows (PowerShell):**

```powershell
# Install Node.js first from nodejs.org, then:
npm install -g expo-cli eas-cli
```

**Mac/Linux:**

```bash
# Install Node.js, then:
npm install -g expo-cli eas-cli

# iOS-specific (Mac only):
xcode-select --install
sudo gem install cocoapods
```

### 7. Verify Installation

```bash
node -v           # Should show v18+
npm -v            # Should show v9+
npx expo --version # Should show Expo CLI version
git --version     # Should show Git version
```

---

## How Does It All Work?

### The Big Picture

```
Your Code (TypeScript/React)
        ↓
   npm start (Metro Bundler)
        ↓
   Test on Device/Emulator
        ↓
   npx eas build (Production Build)
        ↓
   Submit to App Store / Play Store
```

---

## Development Workflow (Day-to-Day Coding)

### Step 1: Install Dependencies

```bash
npm install
```

**What it does:** Downloads all the libraries your app needs (React, Expo Router, etc.)
**When to run:** Once at the start, or after adding new packages

### Step 2: Start Development Server

```bash
npm start
# or
npx expo start
```

**What it does:**

- Starts **Metro Bundler** (JavaScript packager)
- Shows QR code in terminal
- Opens developer tools in browser

**Output:**

```
› Metro waiting on exp://192.168.1.100:8081
› Scan the QR code above with Expo Go (Android) or Camera (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
```

### Step 3: Run on Device/Simulator

**Option A: Physical Phone (Easiest for Beginners)**

1. Install **Expo Go** app (from App Store or Play Store)
2. Scan QR code from terminal
3. App opens in Expo Go
4. Edit code → Auto-refreshes (Hot Reload)

**Option B: Emulator/Simulator**

- Press `a` for Android emulator (requires Android Studio)
- Press `i` for iOS simulator (requires Mac + Xcode)
- Press `w` for web browser

**Option C: Local Development Build**

```bash
npm run android  # Requires Android Studio
npm run ios      # Requires Mac + Xcode
```

---

## The File Structure

```
expo-crm-app/
├── app/                    # Your screens (Expo Router)
│   ├── _layout.tsx        # Root layout
│   ├── (tabs)/            # Tab navigation group
│   │   ├── _layout.tsx    # Tab bar setup
│   │   ├── index.tsx      # Home screen
│   │   └── explore.tsx    # Explore screen
│   └── modal.tsx          # Modal screen
├── components/            # Reusable UI components
├── constants/             # Colors, themes, config
├── hooks/                 # Custom React hooks
├── assets/                # Images, fonts, etc.
├── app.json              # Expo configuration
├── package.json          # Dependencies & scripts
└── tsconfig.json         # TypeScript config
```

### How Routing Works (Expo Router)

**File-based routing** = File path becomes URL

```
app/(tabs)/index.tsx     → /
app/(tabs)/explore.tsx   → /explore
app/modal.tsx            → /modal
app/settings.tsx         → /settings
```

**Navigating between screens:**

```tsx
import { Link } from 'expo-router';

<Link href="/explore">Go to Explore</Link>
<Link href="/modal">Open Modal</Link>
```

---

## Making Changes (Development Cycle)

### 1. Edit Code

```tsx
// app/(tabs)/index.tsx
export default function HomeScreen() {
  return (
    <ThemedView>
      <ThemedText type="title">Hello World!</ThemedText>
    </ThemedView>
  );
}
```

### 2. Save File

- **Hot Reload** automatically refreshes
- See changes instantly on device/simulator
- No need to rebuild

### 3. If Something Breaks

```bash
# In terminal, press 'r' to reload
# or
# Shake device → "Reload"
```

### 4. Developer Tools

```bash
# Shake device or:
# iOS Simulator: Cmd + D
# Android Emulator: Cmd + M
```

**Debug menu options:**

- Reload
- Debug Remote JS
- Show Performance Monitor
- Show Element Inspector

---

## Styling Your App

### Current Approach: StyleSheet API

```tsx
import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

export default function MyScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">My Screen</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take full screen
    padding: 16, // 16px padding
    gap: 8, // 8px spacing between children
  },
});
```

### Themed Components

```tsx
// Automatically adapts to light/dark mode
<ThemedView>               {/* Background changes with theme */}
<ThemedText>Hello</ThemedText>  {/* Text color changes with theme */}

// Override theme colors
<ThemedView lightColor="#fff" darkColor="#000">
```

### Want Tailwind-style Classes?

```bash
# Install NativeWind
npx expo install nativewind
npx expo install --dev tailwindcss

# Then use:
<View className="flex-1 p-4 bg-white">
  <Text className="text-xl font-bold">Hello</Text>
</View>
```

---

## Building for Production

### Why Build?

**Development (`npm start`):**

- ✅ Fast testing
- ✅ Hot reload
- ✅ Debug tools
- ❌ Requires Expo Go or dev build
- ❌ Can't submit to stores

**Production Build (`npx eas build`):**

- ✅ Standalone app
- ✅ Can submit to App Store/Play Store
- ✅ Share with anyone (no Expo Go needed)
- ❌ Slower process (10-30 minutes)

### When Do You Need a Build?

**DON'T build for:**

- Daily development
- Testing features
- Bug fixing
- UI changes

**DO build for:**

- Submitting to App Store/Play Store
- Sharing with beta testers (outside Expo Go)
- Final release
- Testing native features (camera, push notifications, etc.)

### How to Build

#### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

#### Step 2: Login

```bash
eas login
# Enter your Expo account credentials
```

#### Step 3: Configure Project

```bash
eas build:configure
# Creates eas.json config file
```

#### Step 4: Build

```bash
# Android build
npx eas build --platform android --profile preview

# iOS build
npx eas build --platform ios --profile preview

# Both platforms
npx eas build --platform all --profile preview
```

**What happens:**

1. Code uploads to Expo servers
2. Builds in the cloud (10-30 min)
3. You get download link
4. Download `.apk` (Android) or `.ipa` (iOS)

#### Step 5: Test Build

```bash
# Install on Android
# Download .apk file → Install on phone

# Install on iOS
# Download .ipa → Use TestFlight or install via Xcode
```

---

## Deploying Your App

### Web Deployment (FREE)

```bash
# Build for web
npm run web

# Deploy static files
npx expo export --platform web

# Upload 'dist/' folder to:
# - Vercel (free)
# - Netlify (free)
# - GitHub Pages (free)
```

### Android (Google Play Store)

**Requirements:**

- Google Play Developer Account ($25 one-time)
- Production build

**Steps:**

```bash
# 1. Production build
npx eas build --platform android --profile production

# 2. Submit to Play Store
npx eas submit --platform android

# 3. Fill out Play Store listing (screenshots, description, etc.)
# 4. Submit for review (1-3 days)
```

### iOS (Apple App Store)

**Requirements:**

- Apple Developer Account ($99/year)
- Mac (for some steps)
- Production build

**Steps:**

```bash
# 1. Production build
npx eas build --platform ios --profile production

# 2. Submit to App Store
npx eas submit --platform ios

# 3. Fill out App Store Connect listing
# 4. Submit for review (1-7 days)
```

---

## Understanding the Costs

### Development (FREE)

- Coding: **$0**
- Testing with `npm start`: **$0**
- Using Expo Go: **$0**
- Web deployment: **$0**

### Building (FREE TIER)

- **EAS Build Free:** 30 builds/month
- **EAS Build Paid:** $29/month (unlimited builds)

### Publishing

- **Google Play Store:** $25 (one-time)
- **Apple App Store:** $99/year
- **Web hosting:** $0 (Vercel, Netlify, etc.)

---

## Common Commands Reference

```bash
# Development
npm install                    # Install dependencies
npm start                      # Start dev server
npm run android               # Run on Android emulator
npm run ios                   # Run on iOS simulator
npm run web                   # Run in browser
npm run lint                  # Check code quality

# Building
npx eas build --platform android    # Build Android app
npx eas build --platform ios        # Build iOS app
npx eas build --platform all        # Build both

# Deployment
npx eas submit --platform android   # Submit to Play Store
npx eas submit --platform ios       # Submit to App Store

# Utilities
npm run reset-project         # Start fresh (moves current app/ to app-example/)
npx expo install [package]    # Install Expo-compatible package
npx expo doctor              # Check for issues
```

---

## Key Concepts

### Metro Bundler

- JavaScript bundler (like Webpack for mobile)
- Runs when you do `npm start`
- Converts your code to something React Native understands

### Expo Go

- Mobile app for testing Expo apps
- No need to build for quick testing
- Limited to Expo SDK features

### EAS (Expo Application Services)

- Cloud build service
- Builds iOS apps without Mac
- Handles signing, provisioning automatically

### New Architecture

- Enabled in this project (`"newArchEnabled": true`)
- Better performance
- Supports React 19 features

### TypeScript Paths (`@/`)

```tsx
// Instead of:
import { ThemedView } from "../../components/themed-view";

// Use:
import { ThemedView } from "@/components/themed-view";
```

---

## Quick Start Checklist

- [ ] Install Node.js 18+
- [ ] Run `npm install`
- [ ] Install Expo Go on your phone
- [ ] Run `npm start`
- [ ] Scan QR code with Expo Go
- [ ] Edit `app/(tabs)/index.tsx`
- [ ] See changes live on phone

**Congratulations! You're developing with Expo!** 🎉

---

## Next Steps

1. **Learn the basics:**
   - Edit `app/(tabs)/index.tsx`
   - Try different `ThemedText` types
   - Add new screens in `app/` folder

2. **Add features:**
   - Install packages: `npx expo install [package-name]`
   - Add navigation: Create new files in `app/`
   - Style with NativeWind (optional)

3. **When ready to deploy:**
   - Create Expo account
   - Run `npx eas build`
   - Submit to stores

---

## Getting Help

- **Expo Docs:** https://docs.expo.dev
- **Expo Discord:** https://chat.expo.dev
- **React Native Docs:** https://reactnative.dev
- **Common Issues:** Run `npx expo doctor`
