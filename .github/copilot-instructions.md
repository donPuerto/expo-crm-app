# Expo CRM App - AI Agent Instructions

## Project Overview

This is an Expo React Native app (SDK 54) using:

- **Expo Router 6** for file-based navigation with typed routes
- **TypeScript** with strict mode and path aliases (`@/*`)
- **React 19** with the new architecture enabled
- **React Compiler** experimental feature enabled
- **Tailwind CSS** via NativeWind for utility-first styling
- **Zustand** for global state management
- Cross-platform support (iOS, Android, Web)

## Architecture & Navigation

### File-based Routing

Routes live in `app/` directory following Expo Router conventions:

- `app/_layout.tsx` - Root layout with ThemeProvider, Stack navigator, and error boundary
- `app/splash.tsx` - Initial splash screen
- `app/welcome.tsx` - Welcome/landing screen
- `app/(crm)/` - CRM management routes
- `app/(dashboards)/` - Dashboard routes
- `app/(tabs)/_layout.tsx` - Tab navigator (Home, Explore)
- `app/(modals)/user-profile.tsx` - User profile modal
- `app/modal.tsx` - Generic modal screen
- `app/+not-found.tsx` - 404 error page
- `app/_error.tsx` - Global error boundary fallback
- Route groups use parentheses: `(tabs)`, `(crm)`, `(dashboards)`, `(modals)` create logical groupings without adding to URL
- `unstable_settings.anchor` in root layout sets initial route to `splash`

### Supabase Backend Integration

- **Client**: `services/supabase.ts` - Configured Supabase client with environment variables
- **Environment**: `.env` - Supabase credentials (EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY)

### Theming System

Centralized theme system using React Navigation themes with manual preference overrides:

- **Constants**: `constants/theme.ts` exports `Colors` object with light/dark variants
- **Hook Pattern**: `useThemeColor(props, colorName)` retrieves themed colors with fallbacks
- **Themed Components**: `ThemedView` and `ThemedText` accept `lightColor`/`darkColor` props
- **Color Scheme**: Uses native `useColorScheme()` from `react-native`, aliased via `hooks/use-color-scheme.ts` (web fallback in `.web.ts` variant)
- **Theme Preference**: `ThemePreferenceContext` in `app/_layout.tsx` provides `useThemePreference()` hook for system/light/dark toggling

### State Management

- **Global State**: Use Zustand stores in `src/store/` directory for shared state
- **Data Persistence**: AsyncStorage for local caching (configured in font-store)
- **Backend State**: Supabase client for server data (use in Zustand stores)
- **Local State**: Use React hooks (`useState`, `useReducer`) for component-level state
- **Avoid**: Do not use React Context for shared data across the app

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

### Error Boundaries

- `app/_error.tsx` - Global error boundary for all routes
- `ErrorBoundary` component exported from `app/_layout.tsx` for inline error handling
- Both use `ThemedView` and `ThemedText` for consistent styling

## Import Conventions

- Use TypeScript path aliases: `@/` maps to project root
- Import from hooks: `@/hooks/use-color-scheme`, `@/hooks/use-theme-color`
- Import constants: `@/constants/theme`
- Import components: `@/components/themed-view`, `@/components/themed-text`
- Import stores: `@/store/*` (when using Zustand)
- Import Supabase: `import { supabase } from '@/services/supabase'`
- Import database types: `import type { Contact, ContactInsert } from '@/types/database'`
- Assets: `@/assets/images/...` with `require()` for static images

## Styling

### Tailwind CSS / NativeWind

- `global.css` imports Tailwind layers (`base`, `components`, `utilities`)
- Requires PostCSS/NativeWind processing
- Use utility classes for web, StyleSheet.create for native where needed
- Keep CSS minimal; prefer inline Tailwind utilities or StyleSheet objects

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

- `expo-haptics` - Haptic feedback (iOS-only)
- `expo-image` - Optimized image component
- `expo-router` - File-based navigation with typed routes
- `expo-symbols` - SF Symbols on iOS
- `expo-status-bar` - Cross-platform status bar control

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
- `global.css` - Tailwind directives for NativeWind
- `tailwind.config.js` - Tailwind CSS configuration (if present)

## Directory Structure

```
expo-crm-app/
├── app/
│   ├── _layout.tsx          # Root layout, theme context, error boundary
│   ├── _error.tsx           # Global error fallback
│   ├── +not-found.tsx       # 404 page
│   ├── splash.tsx           # Splash screen
│   ├── welcome.tsx          # Welcome/landing
│   ├── modal.tsx            # Generic modal
│   ├── (auth)/
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── (dashboard)/
│   │   └── ...
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   └── ...
│   └── (modals)/
│       └── user-profile.tsx
├── src/
│   ├── components/
│   │   ├── themed-text.tsx
│   │   ├── themed-view.tsx
│   │   └── ...
│   ├── constants/
│   │   └── theme.ts
│   ├── hooks/
│   │   ├── use-color-scheme.ts
│   │   ├── use-theme-color.ts
│   │   └── ...
│   ├── store/               # Zustand stores
│   │   └── font-store.ts
│   └── types/
│       └── database.ts      # Database TypeScript types
├── services/
│   └── supabase.ts          # Supabase client configuration
├── docs/
│   └── DATABASE-SCHEMA.md   # Database schema documentation
├── assets/
│   └── images/
├── .github/
│   └── copilot-instructions.md
├── .env                     # Environment variables (gitignored)
├── .env.example             # Environment template
├── global.css
├── app.json
├── tsconfig.json
└── package.json
```

## Agent Operating Rules

- **Read this file before making any code changes.**
- **Plan first**: write a brief step-by-step plan before coding.
- Follow Prettier and ESLint rules; keep formatting consistent with the repo.
- Add a brief comment per function and per logical section explaining the purpose.
- Use Zustand for shared/global state across the app (do not use React Context for shared data).
- **Use Supabase for backend**: All data operations should use the configured Supabase client from `services/supabase.ts`
- **Type safety**: Always import and use database types from `src/types/database.ts` for Supabase queries
- **Auto-update this file**: When creating new folders, routes, or patterns, immediately update this instructions file to reflect the changes.
