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

## Tamagui Setup & Configuration

This project is configured with **Tamagui v2** for styling and UI components. Here's how everything is set up:

### 1. Babel Configuration

**File:** `babel.config.js`

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: '@tamagui/core' }]],
    plugins: [
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './src/tamagui/tamagui.config.ts',
          logTimings: true,
          disableExtraction: process.env.NODE_ENV === 'development',
        },
      ],
      'react-native-reanimated/plugin', // Must be last
    ],
  };
};
```

**What it does:**

- Optimizes Tamagui styles at compile time
- Extracts styles to CSS on web for better performance
- Enables JSX import from `@tamagui/core`
- Disabled in development for faster refresh

### 2. Metro Configuration

**File:** `metro.config.js`

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('mjs');
config.resolver.resolverMainFields = ['react-native', 'browser', 'module', 'main'];

module.exports = config;
```

**What it does:**

- Adds `.mjs` support for Tamagui and other ESM packages
- Ensures correct module resolution for cross-platform code
- Platform-specific file resolution (`.native.ts`, `.ios.ts`, `.web.ts`)

### 3. Tamagui Configuration

**File:** `src/tamagui/tamagui.config.ts`

Your central Tamagui configuration with:

- **Themes**: `light` and `dark` base themes
- **Tokens**: Colors, spacing, font sizes, border radii
- **Media Queries**: Breakpoints for responsive design
- **Fonts**: Typography scale with Inter font
- **Animations**: Platform-specific animation configurations

```tsx
import { config } from '@tamagui/config/v5';
import { createTamagui } from 'tamagui';
import { animations } from './animations';

export default createTamagui({
  ...config,
  animations, // Platform-specific (see below)
  themes: {
    light: {
      /* ... */
    },
    dark: {
      /* ... */
    },
  },
});
```

**Platform-specific animations:**

- `animations.ts` - Web animations (Motion driver)
- `animations.native.ts` - Native animations (Reanimated driver)
- Metro automatically selects the correct file per platform

### 4. App Layout Configuration

**File:** `app/_layout.tsx`

```tsx
import { TamaguiProvider, Theme } from 'tamagui';
import config from '@/tamagui/tamagui.config';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <TamaguiProvider config={config} defaultTheme={colorScheme}>
      <Theme name={colorScheme}>{/* Your app content */}</Theme>
    </TamaguiProvider>
  );
}
```

**What it does:**

- Wraps app with `TamaguiProvider` for theme context
- Provides config to all Tamagui components
- Automatically switches theme based on system preference
- Enables theme tokens throughout the app

### 5. Font Loading

**Using `@tamagui/font-inter` and Expo Font:**

```tsx
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter: Inter_400Regular,
    InterMedium: Inter_500Medium,
    InterSemiBold: Inter_600SemiBold,
    InterBold: Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null; // or loading screen
  }

  return <TamaguiProvider config={config}>{/* Your app */}</TamaguiProvider>;
}
```

### 6. TypeScript Path Aliases

**File:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/server/*": ["./src/server/*"],
      "@/database/*": ["./src/database/*"],
      "@/features/*": ["./src/features/*"],
      "@/interface/*": ["./src/interface/*"],
      "@/tamagui/*": ["./src/tamagui/*"],
      "~assets/*": ["./assets/*"]
    }
  }
}
```

**Import examples:**

```tsx
import config from '@/tamagui/tamagui.config';
import { Button } from '@/interface/primitives/button';
import { useAuthStore } from '@/features/auth/auth-store';
import { supabase } from '@/server/supabase';
```

### 7. First-Time Startup

**Always start with cache clear on first run:**

```bash
npx expo start -c
# or
npm start -- -c
```

**Why?** Tamagui's compiler caches optimizations, and stale cache can cause issues.

**Clear cache anytime you:**

- Update `tamagui.config.ts`
- Add new animation drivers
- Change babel plugin options
- See unexpected styling issues

### 8. Development Scripts

**File:** `package.json`

```json
{
  "scripts": {
    "start": "expo start",
    "start:clear": "expo start -c",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint"
  }
}
```

**Recommended workflow:**

```bash
npm run start:clear  # First run or after config changes
npm start            # Subsequent runs
npm run android      # Test on Android
npm run ios          # Test on iOS (Mac only)
npm run web          # Test in browser
```

### 9. Animation System

This project includes all Tamagui animation drivers:

**Installed packages:**

- `@tamagui/animate-presence` - Mount/unmount animations
- `@tamagui/animations-css` - CSS transitions (web)
- `@tamagui/animations-motion` - WAAPI animations (web)
- `@tamagui/animations-reanimated` - Reanimated 3 (native)
- `motion` - Motion library for web
- `react-native-reanimated` - Native animations

**Platform-specific setup:**

- **Web**: Uses Motion driver (off-thread WAAPI)
- **Native**: Uses Reanimated driver (off-thread)
- Automatic platform selection via Metro

**See:** [docs/ANIMATIONS-INDEX.md](./ANIMATIONS-INDEX.md) for complete guide

### 10. Troubleshooting

**Issue: Styles not applying**

```bash
npx expo start -c  # Clear cache
```

**Issue: TypeScript errors with Tamagui**

```bash
rm -rf node_modules
npm install
npx expo start -c
```

**Issue: Animations not working**

- Check `babel.config.js` has `react-native-reanimated/plugin` last
- Ensure animations imported in `tamagui.config.ts`
- Clear cache and restart

**Issue: Theme not switching**

- Verify `TamaguiProvider` wraps app in `_layout.tsx`
- Check `defaultTheme` prop matches color scheme
- Ensure `Theme` component wraps content

**Debugging tips:**

```tsx
// Debug theme values
<View debug="verbose">
  <Text>Check console for debug output</Text>
</View>;

// Check current theme
import { useTheme } from '@tamagui/core';
const theme = useTheme();
console.log(theme.background.val); // Raw color value
```

### 11. Migration from StyleSheet

**Before (StyleSheet):**

```tsx
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});

<View style={styles.container}>
```

**After (Tamagui):**

```tsx
import { View } from '@tamagui/core';

<View flex={1} padding="$4" backgroundColor="$background">
```

**Benefits:**

- No `StyleSheet.create` boilerplate
- Theme-aware with `$` tokens
- Type-safe with autocomplete
- Compiler-optimized (no runtime cost)
- Responsive with `$gtSm` props
- Animated with `animation` prop

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
├── app/                       # 📱 Expo Router - Your screens (file-based navigation)
│   │
│   ├── _layout.tsx           # Root layout with TamaguiProvider
│   ├── _error.tsx            # Global error boundary
│   ├── +not-found.tsx        # 404 page
│   ├── splash.tsx            # Splash screen
│   ├── welcome.tsx           # Welcome/landing page
│   │
│   ├── (auth)/               # 🔐 Authentication routes
│   │   ├── sign-in.tsx       # Login screen
│   │   ├── sign-up.tsx       # Registration
│   │   ├── forgot-password.tsx
│   │   └── reset-password.tsx
│   │
│   ├── (crm)/                # 💼 CRM - Sales Pipeline
│   │   │                    # NOTE: Customer & sales management
│   │   ├── contacts/         # 👤 Individual people
│   │   │   ├── [id].tsx
│   │   │   ├── add.tsx
│   │   │   └── index.tsx
│   │   ├── leads/            # 🎯 Potential customers
│   │   │   ├── [id].tsx
│   │   │   ├── add.tsx
│   │   │   └── index.tsx
│   │   ├── opportunities/    # 💰 Active sales opportunities
│   │   │   ├── [id].tsx
│   │   │   ├── add.tsx
│   │   │   └── index.tsx
│   │   ├── accounts/         # 🏢 Companies/organizations
│   │   │   ├── [id].tsx
│   │   │   ├── add.tsx
│   │   │   └── index.tsx
│   │   └── deals/            # ✅ Closed/won deals
│   │       ├── [id].tsx
│   │       ├── add.tsx
│   │       └── index.tsx
│   │
│   ├── (operations)/         # 🏗️ Work Operations
│   │   │                    # NOTE: Job & task management
│   │   ├── jobs/             # 📋 Job orders
│   │   │   ├── [id].tsx
│   │   │   ├── add.tsx
│   │   │   └── index.tsx
│   │   ├── tasks/            # ✓ Task management
│   │   │   ├── [id].tsx
│   │   │   ├── add.tsx
│   │   │   └── index.tsx
│   │   └── schedules/        # 📅 Calendar
│   │       ├── [id].tsx
│   │       └── index.tsx
│   │
│   ├── (dashboards)/         # 📊 Analytics & Reporting
│   │   ├── _layout.tsx
│   │   ├── index.tsx         # Overview dashboard
│   │   ├── sales.tsx         # Sales analytics
│   │   ├── operations.tsx    # Operations metrics
│   │   ├── team.tsx          # Team performance
│   │   └── admin.tsx         # Admin dashboard
│   │
│   ├── (tabs)/               # 🔹 Bottom Tab Navigation
│   │   ├── _layout.tsx       # Tab bar setup
│   │   ├── index.tsx         # Home screen
│   │   ├── contacts.tsx      # Quick contacts
│   │   ├── opportunities.tsx # Sales pipeline
│   │   ├── jobs.tsx          # Active jobs
│   │   ├── tasks.tsx         # Task list
│   │   ├── notifications.tsx # Notification center
│   │   ├── camera.tsx        # Camera/scanner
│   │   └── settings.tsx      # App settings
│   │
│   ├── (modals)/             # 🔲 Modal Screens
│   │   ├── user-profile.tsx  # User profile editor
│   │   ├── camera-capture.tsx # Photo capture
│   │   ├── document-scan.tsx # Document scanner
│   │   ├── notification-detail.tsx
│   │   ├── quick-add.tsx     # Quick entity add
│   │   └── filters.tsx       # Advanced filters
│   │
│   └── (notifications)/      # 🔔 Notification System
│       ├── index.tsx         # All notifications
│       ├── unread.tsx        # Unread only
│       ├── mentions.tsx      # @mentions
│       └── settings.tsx      # Notification preferences
│
├── src/
│   ├── server/               # 🌐 Backend/API layer
│   │   └── supabase.ts       # Supabase client
│   │
│   ├── database/             # 💾 Database layer
│   │   ├── types.ts          # TypeScript types for all tables
│   │   └── migrations/       # SQL migration files
│   │
│   ├── features/             # 🎯 Feature modules (domain-driven)
│   │   ├── auth/             # Authentication
│   │   │   ├── auth-store.ts
│   │   │   └── components/
│   │   ├── crm/              # CRM/Sales
│   │   │   ├── crm-store.ts
│   │   │   └── components/
│   │   ├── operations/       # Work operations
│   │   │   ├── operations-store.ts
│   │   │   └── components/
│   │   ├── notifications/    # Notifications
│   │   │   ├── notifications-store.ts
│   │   │   └── components/
│   │   ├── camera/           # Camera & scanning
│   │   │   ├── camera-store.ts
│   │   │   └── components/
│   │   ├── dashboard/        # Dashboard
│   │   │   ├── dashboard-store.ts
│   │   │   └── components/
│   │   └── theme/
│   │       └── font-store.ts
│   │
│   ├── interface/            # 🎨 UI layer
│   │   ├── components/       # Shared UI components
│   │   │   ├── card.tsx
│   │   │   ├── header.tsx
│   │   │   ├── image-gallery.tsx     # Animated gallery
│   │   │   └── animated-modal.tsx    # Modal variants
│   │   └── primitives/       # Base UI primitives (24 total)
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── dialog.tsx
│   │       └── ... (and 21 more)
│   │
│   ├── tamagui/              # 🎨 Tamagui configuration
│   │   ├── tamagui.config.ts         # Main config
│   │   ├── animations.ts             # Web animations (Motion)
│   │   └── animations.native.ts      # Native animations (Reanimated)
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── use-color-scheme.ts
│   │   ├── use-theme-color.ts
│   │   └── use-font.ts
│   │
│   ├── constants/            # App constants
│   │   └── theme.ts
│   │
│   └── lib/                  # Utilities
│       ├── utils.ts
│       └── shadow-styles.ts
│
├── assets/                   # Static assets
│   ├── fonts/
│   └── images/
│
├── docs/                     # Documentation
│   ├── EXPO-GUIDE.md         # This file
│   ├── ANIMATIONS-INDEX.md   # Animation system guide
│   ├── DATABASE-SCHEMA.md
│   └── TAMAGUI-*.md
│
├── app.json                  # Expo configuration
├── babel.config.js           # Babel with Tamagui plugin
├── metro.config.js           # Metro bundler config
├── tsconfig.json             # TypeScript with path aliases
└── package.json              # Dependencies & scripts
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
import { View, Text } from '@tamagui/core';

export default function HomeScreen() {
  return (
    <View flex={1} padding="$4" backgroundColor="$background">
      <Text fontSize="$8" fontWeight="700" color="$primary">
        Hello Tamagui!
      </Text>
      <Text fontSize="$4" color="$color" marginTop="$2">
        Welcome to your CRM app
      </Text>
    </View>
  );
}
```

**Key points:**

- Import from `@tamagui/core` instead of `react-native`
- Use theme tokens (`$4`, `$background`, `$primary`)
- No StyleSheet needed - inline props are optimized
- Automatic light/dark theme support

### 2. Save File

- **Hot Reload** automatically refreshes
- See changes instantly on device/simulator
- Tamagui compiler optimizes in the background
- No need to rebuild

### 3. If Something Breaks

```bash
# In terminal, press 'r' to reload
# or press 'c' to clear cache and reload
# or
# Shake device → "Reload"
```

**Common fixes:**

```bash
# Clear Tamagui compiler cache
npx expo start -c

# Reset Metro bundler
npx expo start --clear

# Full reset (if styles seem broken)
rm -rf node_modules .expo
npm install
npx expo start -c
```

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

**Tamagui-specific debugging:**

```tsx
// Debug component styles
<View debug="verbose">
  <Text>Check terminal for detailed style information</Text>
</View>;

// Check theme values
import { useTheme } from '@tamagui/core';

function DebugTheme() {
  const theme = useTheme();
  console.log('Background:', theme.background.val);
  console.log('Primary:', theme.primary.val);
  return null;
}

// Check media queries
import { useMedia } from '@tamagui/core';

function DebugMedia() {
  const media = useMedia();
  console.log('Small screen:', media.sm);
  console.log('Large screen:', media.lg);
  return null;
}
```

### 5. Best Practices

**DO:**

- ✅ Use theme tokens (`$background`, `$primary`)
- ✅ Use responsive props (`$gtSm={{ padding: '$6' }}`)
- ✅ Create reusable components with `styled()`
- ✅ Use `animation` prop for smooth interactions
- ✅ Import from `@tamagui/core` for base components
- ✅ Use path aliases (`@/interface/*`, `@/features/*`)

**DON'T:**

- ❌ Use `StyleSheet.create` (use Tamagui styled instead)
- ❌ Hard-code colors (`#fff`, `rgb(...)`)
- ❌ Use React Native's `Pressable` (use View with `onPress`)
- ❌ Import from `react-native` for View/Text
- ❌ Forget to clear cache after config changes

**Component patterns:**

```tsx
// ✅ Good: Reusable styled component
const Card = styled(View, {
  backgroundColor: '$card',
  borderRadius: '$4',
  padding: '$4',

  variants: {
    elevated: {
      true: { shadowRadius: 4, shadowOpacity: 0.1 }
    }
  } as const,
});

// ✅ Good: Responsive inline styles
<View
  padding="$4"
  $gtMd={{ padding: '$6' }}
>

// ❌ Avoid: StyleSheet
const styles = StyleSheet.create({
  container: { padding: 16 }
});
```

---

## Styling Your App (Tamagui v2)

This project uses **Tamagui v2** - a comprehensive UI kit and styling system optimized for React Native and web.

### Why Tamagui?

- ✅ **Cross-platform**: Write once, runs on iOS, Android, and Web
- ✅ **Compiler-optimized**: Styles extract to CSS at build time
- ✅ **Type-safe**: Full TypeScript support with autocomplete
- ✅ **Theme support**: Built-in light/dark mode with custom themes
- ✅ **Animations**: Unified animation API across platforms
- ✅ **Performance**: Near-native performance with zero runtime cost

### Basic Styling with Tamagui

```tsx
import { View, Text } from '@tamagui/core';

export default function MyScreen() {
  return (
    <View flex={1} padding="$4" backgroundColor="$background" gap="$2">
      <Text fontSize="$6" fontWeight="700" color="$color">
        Hello Tamagui!
      </Text>
    </View>
  );
}
```

**Key differences from StyleSheet:**

- No `StyleSheet.create` needed
- Use `$` tokens for theme values (`$4`, `$background`, `$primary`)
- Inline styles are compiler-optimized (no performance penalty)
- Automatic dark mode with theme tokens

### Theme Tokens

Tamagui uses design tokens for consistent spacing, colors, and typography:

```tsx
<View
  backgroundColor="$background" // Theme-aware background
  padding="$4" // $4 = 16px (from config)
  borderRadius="$2" // Consistent border radius
  borderColor="$borderColor" // Theme-aware border
>
  <Text color="$color" fontSize="$5">
    Content
  </Text>
</View>
```

**Common tokens:**

- **Space**: `$1` (4px), `$2` (8px), `$4` (16px), `$6` (24px)
- **Colors**: `$background`, `$color`, `$primary`, `$secondary`, `$borderColor`
- **Font sizes**: `$1` (11px), `$3` (15px), `$5` (18px), `$9` (36px)
- **Radii**: `$1` (3px), `$2` (5px), `$4` (9px)

### Responsive Design

Use media query props for responsive layouts:

```tsx
<View
  width="100%"
  padding="$4"
  $gtSm={{ padding: '$6' }} // Larger screens
  $gtMd={{ width: '80%' }} // Medium screens and up
>
  <Text
    fontSize="$4"
    $gtSm={{ fontSize: '$6' }} // Bigger text on larger screens
  >
    Responsive content
  </Text>
</View>
```

**Media queries available:**

- `$sm`, `$md`, `$lg`, `$xl` - Max-width breakpoints
- `$gtSm`, `$gtMd`, `$gtLg` - Min-width breakpoints
- `$short`, `$tall` - Height-based
- `$hoverNone`, `$pointerCoarse` - Input type

### Interactive States

Built-in pseudo-state support:

```tsx
<View
  backgroundColor="$primary"
  padding="$4"
  pressStyle={{ backgroundColor: '$primaryHover', scale: 0.98 }}
  hoverStyle={{ backgroundColor: '$primaryHover' }}
  focusStyle={{ outlineColor: '$blue10', outlineWidth: 2 }}
  onPress={() => console.log('Pressed!')}
>
  <Text color="$primaryForeground">Click me</Text>
</View>
```

**Available pseudo-states:**

- `pressStyle` - When pressed/tapped
- `hoverStyle` - On hover (web)
- `focusStyle` - When focused
- `disabledStyle` - When disabled={true}

### Creating Reusable Components

Use `styled()` for reusable components:

```tsx
import { View, Text, styled } from '@tamagui/core';

const Card = styled(View, {
  backgroundColor: '$card',
  borderRadius: '$4',
  padding: '$4',
  borderWidth: 1,
  borderColor: '$borderColor',

  variants: {
    elevated: {
      true: {
        shadowColor: '$shadowColor',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    },
    size: {
      small: { padding: '$2' },
      medium: { padding: '$4' },
      large: { padding: '$6' },
    },
  } as const,
});

// Usage
<Card elevated size="large">
  <Text>Card content</Text>
</Card>;
```

### Animations

This project includes all Tamagui animation drivers:

```tsx
import { View, AnimatePresence } from 'tamagui';

function AnimatedComponent({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <View
          key="content"
          animation="quick"
          enterStyle={{ opacity: 0, y: 20 }}
          exitStyle={{ opacity: 0, y: -20 }}
        >
          <Text>Animated content</Text>
        </View>
      )}
    </AnimatePresence>
  );
}
```

**Available animations:**

- `bouncy` - Spring with bounce
- `lazy` - Slow, smooth spring
- `quick` - Fast spring
- `100ms`, `200ms`, `300ms` - Timing-based

**See:** [docs/ANIMATIONS-INDEX.md](./ANIMATIONS-INDEX.md) for complete animation guide

### Theme Switching

Built-in theme support with `Theme` component:

```tsx
import { Theme, View, Text } from 'tamagui';

<Theme name="dark">
  <View backgroundColor="$background">
    <Text color="$color">Dark mode content</Text>
  </View>
</Theme>

// Or invert current theme
<Theme inverse>
  <Text>Inverted theme</Text>
</Theme>
```

### Using Hooks

Access theme and media state programmatically:

```tsx
import { useTheme, useMedia } from '@tamagui/core';

function MyComponent() {
  const theme = useTheme();
  const media = useMedia();

  return (
    <View backgroundColor={theme.background.get()} padding={media.sm ? '$2' : '$4'}>
      <Text>Responsive themed content</Text>
    </View>
  );
}
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
- **Platform-specific resolution**: Automatically picks `.native.ts` vs `.ts` files

### Expo Go

- Mobile app for testing Expo apps
- No need to build for quick testing
- Limited to Expo SDK features
- **Note**: Some Tamagui features work better in development builds

### EAS (Expo Application Services)

- Cloud build service
- Builds iOS apps without Mac
- Handles signing, provisioning automatically

### New Architecture

- Enabled in this project (`"newArchEnabled": true`)
- Better performance
- Supports React 19 features
- **Required for**: React Compiler, optimized Tamagui performance

### TypeScript Paths (`@/`)

```tsx
// Instead of:
import { ThemedView } from '../../components/themed-view';

// Use:
import { View } from '@tamagui/core';
import { Button } from '@/interface/primitives/button';
import { useAuthStore } from '@/features/auth/auth-store';
import config from '@/tamagui/tamagui.config';
```

**Available aliases:**

- `@/*` - Root src folder
- `@/server/*` - Backend/API
- `@/database/*` - Database types
- `@/features/*` - Feature modules
- `@/interface/*` - UI components
- `@/tamagui/*` - Tamagui config
- `~assets/*` - Static assets

### Tamagui Compiler

- Extracts styles to CSS at build time
- Optimizes inline styles (zero runtime cost)
- Enabled via `@tamagui/babel-plugin`
- **Disabled in dev mode** for fast refresh
- **Enabled in production** for performance

```javascript
// babel.config.js
[
  '@tamagui/babel-plugin',
  {
    disableExtraction: process.env.NODE_ENV === 'development',
  },
];
```

### Theme System

- **Base themes**: `light` and `dark`
- **Theme tokens**: `$background`, `$color`, `$primary`, etc.
- **Automatic switching**: Via `useColorScheme()` hook
- **Contextual themes**: Use `<Theme name="dark">` to override

```tsx
// Automatic theme switching
const colorScheme = useColorScheme();
<TamaguiProvider defaultTheme={colorScheme}>

// Manual theme override
<Theme name="dark">
  <View backgroundColor="$background">
    {/* Always uses dark theme */}
  </View>
</Theme>
```

### Animation Drivers

This project uses platform-specific animation drivers:

- **Web**: Motion driver (off-thread WAAPI)
- **Native**: Reanimated driver (off-thread)
- **Automatic selection**: Metro picks correct file (`.ts` vs `.native.ts`)

```
src/tamagui/
├── animations.ts        # Web (Motion)
└── animations.native.ts # Native (Reanimated)
```

### Responsive Design

Tamagui provides built-in media query support:

```tsx
<View
  width="100%"
  $sm={{ width: '90%' }}    // Small screens
  $gtMd={{ width: '600px' }} // Medium and up
>
```

**Available breakpoints:**

- `$xs`, `$sm`, `$md`, `$lg`, `$xl` - Max-width
- `$gtXs`, `$gtSm`, `$gtMd`, `$gtLg` - Min-width
- `$short`, `$tall` - Height-based

---

## Quick Start Checklist

- [ ] Install Node.js 18+
- [ ] Install Yarn 4.4.0+ (recommended for Tamagui)
- [ ] Run `npm install` (or `yarn install`)
- [ ] Install Expo Go on your phone
- [ ] Run `npm start -- -c` (clear cache on first run)
- [ ] Scan QR code with Expo Go
- [ ] Edit `app/(tabs)/index.tsx`
- [ ] Try Tamagui components (`<View>`, `<Text>`)
- [ ] Test theme switching (light/dark mode)
- [ ] See changes live on phone

**Congratulations! You're developing with Expo + Tamagui!** 🎉

---

## Next Steps

1. **Learn Tamagui basics:**
   - Read [docs/ANIMATIONS-INDEX.md](./ANIMATIONS-INDEX.md)
   - Experiment with theme tokens (`$background`, `$primary`)
   - Try responsive props (`$gtSm={{ padding: '$6' }}`)
   - Create a styled component with `styled()`

2. **Build your first feature:**
   - Create new route in `app/` folder
   - Use primitives from `src/interface/primitives/`
   - Add feature store in `src/features/`
   - Connect to Supabase backend

3. **Explore animations:**
   - Use `animation` prop for smooth interactions
   - Try `AnimatePresence` for mount/unmount
   - Experiment with different drivers (Motion, Reanimated)
   - Create custom animated components

4. **Add features:**
   - Install packages: `npx expo install [package-name]`
   - Add navigation: Create new files in `app/`
   - Use Tamagui primitives: Import from `@/interface/primitives/`
   - Create feature modules: Add to `src/features/`

5. **When ready to deploy:**
   - Create Expo account
   - Configure `eas.json`
   - Run `npx eas build`
   - Submit to stores

---

## Additional Resources

### Tamagui Documentation

- **Official Docs:** https://tamagui.dev
- **Expo Guide:** https://tamagui.dev/docs/guides/expo
- **Config v5:** https://tamagui.dev/docs/core/configuration
- **Styling:** https://tamagui.dev/docs/intro/props
- **Animations:** https://tamagui.dev/docs/core/animations
- **Components:** https://tamagui.dev/ui/intro

### Project Documentation

- **Animation System:** [docs/ANIMATIONS-INDEX.md](./ANIMATIONS-INDEX.md)
- **Database Schema:** [docs/DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md)
- **Authentication:** [docs/AUTHENTICATION-IMPLEMENTATION.md](./AUTHENTICATION-IMPLEMENTATION.md)
- **Route Structure:** [docs/ROUTE-STRUCTURE.md](./ROUTE-STRUCTURE.md)

### Expo Resources

- **Expo Docs:** https://docs.expo.dev
- **Expo Discord:** https://chat.expo.dev
- **React Native Docs:** https://reactnative.dev
- **Common Issues:** Run `npx expo doctor`
