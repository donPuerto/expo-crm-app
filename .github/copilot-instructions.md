# Expo CRM App - AI Agent Instructions

## Project Overview
This is an Expo React Native app (SDK 54) using:
- **Expo Router 6** for file-based navigation with typed routes
- **TypeScript** with strict mode and path aliases (`@/*`)
- **React 19** with the new architecture enabled
- **React Compiler** experimental feature enabled
- Cross-platform support (iOS, Android, Web)

## Architecture & Navigation

### File-based Routing
Routes live in `app/` directory following Expo Router conventions:
- `app/_layout.tsx` - Root layout with ThemeProvider and Stack navigator
- `app/(tabs)/_layout.tsx` - Tab navigator (Home, Explore)
- `app/modal.tsx` - Modal screen presented via Stack
- Route groups use parentheses: `(tabs)` creates tabs without adding `/tabs` to URL
- `unstable_settings.anchor` in root layout sets initial route to `(tabs)`

### Theming System
Centralized theme system using React Navigation themes:
- **Constants**: `constants/theme.ts` exports `Colors` object with light/dark variants
- **Hook Pattern**: `useThemeColor(props, colorName)` retrieves themed colors with fallbacks
- **Themed Components**: `ThemedView` and `ThemedText` accept `lightColor`/`darkColor` props
- **Color Scheme**: Uses native `useColorScheme()` from `react-native`, aliased via `hooks/use-color-scheme.ts` (web fallback in `.web.ts` variant)

## Component Patterns

### Platform-specific Files
Use `.ios.tsx`, `.android.tsx`, `.web.tsx` extensions for platform variants:
- Example: `icon-symbol.ios.tsx` vs `icon-symbol.tsx` (Android/Web fallback)

### Themed Components
When creating UI components, extend base React Native components:
```tsx
export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};
```
Apply theme via `useThemeColor` hook, merge with style prop

### Typography Types
`ThemedText` supports type variants: `default`, `title`, `defaultSemiBold`, `subtitle`, `link`

## Import Conventions
- Use TypeScript path aliases: `@/` maps to project root
- Import from hooks: `@/hooks/use-color-scheme`
- Import constants: `@/constants/theme`
- Import components: `@/components/themed-view`
- Assets: `@/assets/images/...` with `require()` for static images

## Development Workflow

### Running the App
- `npm start` or `npx expo start` - Start dev server
- `npm run android` - Launch Android emulator
- `npm run ios` - Launch iOS simulator
- `npm run web` - Launch web browser

### Project Reset
- `npm run reset-project` - Moves `app/` to `app-example/` for fresh start (useful for removing starter template)

### Linting
- Uses `eslint-config-expo` flat config
- Run with `npm run lint`

## Key Technologies & Integrations

### Expo Modules
- `expo-haptics` - Haptic feedback (iOS-only, see `haptic-tab.tsx`)
- `expo-image` - Optimized image component
- `expo-router` - File-based navigation with typed routes
- `expo-symbols` - SF Symbols on iOS

### Animations
- `react-native-reanimated` 4.1 for animations
- `react-native-gesture-handler` for gestures
- `react-native-worklets` for JS worklets

### Process Environment
Check platform with `process.env.EXPO_OS` (e.g., `'ios'`, `'android'`, `'web'`)

## Configuration Files
- `app.json` - Expo config with new arch enabled, typed routes experiment, React Compiler
- `tsconfig.json` - Extends `expo/tsconfig.base`, uses `@/*` path mapping
- `eslint.config.js` - Flat config format (ESLint 9+)
