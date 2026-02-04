# Tamagui Migration & Folder Restructuring Plan

**Created:** February 4, 2026  
**Estimated Total Tokens:** ~415,000 tokens  
**Estimated Duration:** 7 hours (automated) + testing time

---

## Executive Summary

This document outlines the comprehensive migration from NativeWind/rn-primitives to Tamagui, along with a complete folder restructure following modern Expo best practices.

### Current State Analysis

**Dependencies Audit:**

- ✅ **Keep:** All Expo packages (SDK 54), React Navigation, Zustand, Supabase
- ❌ **Remove:** NativeWind (4.2.1), Tailwind CSS (3.4.19), all `@rn-primitives/*` (26 packages)
- ➕ **Add:** Tamagui core packages, animation drivers, config utilities

**Component Inventory:**

- **52 React components** need migration
- **26 rn-primitives imports** to replace with Tamagui equivalents
- **8 auth/form components** use className patterns
- **3 dashboard wrapper components** with complex layouts
- **24 ui/ components** built on rn-primitives

---

## Migration Phases

### 📦 PHASE 1: Dependency Cleanup & Installation

**Estimated Tokens:** ~5,000  
**Duration:** 15 minutes

#### Step 1.1: Remove NativeWind Stack

```bash
npm uninstall nativewind tailwindcss tailwind-merge tailwindcss-animate
```

**Files to Delete:**

- `tailwind.config.js`
- `postcss.config.js`
- `global.css`
- `nativewind-env.d.ts`

#### Step 1.2: Remove rn-primitives (26 packages)

```bash
npm uninstall @rn-primitives/accordion @rn-primitives/alert-dialog \
  @rn-primitives/checkbox @rn-primitives/collapsible \
  @rn-primitives/context-menu @rn-primitives/dialog \
  @rn-primitives/dropdown-menu @rn-primitives/hover-card \
  @rn-primitives/label @rn-primitives/menubar @rn-primitives/popover \
  @rn-primitives/portal @rn-primitives/progress @rn-primitives/radio-group \
  @rn-primitives/select @rn-primitives/separator @rn-primitives/slot \
  @rn-primitives/switch @rn-primitives/tabs @rn-primitives/toggle \
  @rn-primitives/toggle-group @rn-primitives/tooltip
```

#### Step 1.3: Install Tamagui

```bash
npm install tamagui @tamagui/config @tamagui/core \
  @tamagui/lucide-icons @tamagui/animations-react-native \
  @tamagui/font-inter @tamagui/shorthands @tamagui/themes \
  @tamagui/babel-plugin --save-exact
```

**New Dependencies (~10 packages, optimized):**

- `tamagui` - Core framework
- `@tamagui/config` - Base configuration
- `@tamagui/core` - Runtime
- `@tamagui/lucide-icons` - Icon system (replaces lucide-react-native)
- `@tamagui/animations-react-native` - Animation driver
- `@tamagui/font-inter` - Typography (you already use Inter font)
- `@tamagui/shorthands` - Styling shortcuts
- `@tamagui/themes` - Theme system
- `@tamagui/babel-plugin` - Compile-time optimization

**Package.json Cleanup:**

```json
{
  "dependencies": {
    "@expo-google-fonts/inter": "^0.4.2",
    "@expo/vector-icons": "^15.0.3",
    "@react-native-async-storage/async-storage": "^2.2.0",
    "@react-navigation/bottom-tabs": "^7.4.0",
    "@react-navigation/elements": "^2.6.3",
    "@react-navigation/native": "^7.1.8",
    "@supabase/supabase-js": "^2.93.3",
    "@tamagui/animations-react-native": "^1.119.7",
    "@tamagui/config": "^1.119.7",
    "@tamagui/core": "^1.119.7",
    "@tamagui/font-inter": "^1.119.7",
    "@tamagui/lucide-icons": "^1.119.7",
    "@tamagui/shorthands": "^1.119.7",
    "@tamagui/themes": "^1.119.7",
    "class-variance-authority": "^0.7.1",
    "expo": "~54.0.32",
    "expo-constants": "~18.0.13",
    "expo-font": "~14.0.11",
    "expo-haptics": "~15.0.8",
    "expo-image": "~3.0.11",
    "expo-linear-gradient": "~15.0.8",
    "expo-linking": "~8.0.11",
    "expo-router": "~6.0.22",
    "expo-splash-screen": "~31.0.13",
    "expo-status-bar": "~3.0.9",
    "expo-symbols": "~1.0.8",
    "expo-system-ui": "~6.0.9",
    "expo-web-browser": "~15.0.10",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.5",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-get-random-values": "~1.11.0",
    "react-native-reanimated": "~4.1.1",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-url-polyfill": "^3.0.0",
    "react-native-web": "~0.21.0",
    "react-native-worklets": "0.5.1",
    "tamagui": "^1.119.7",
    "zustand": "^5.0.11"
  },
  "devDependencies": {
    "@tamagui/babel-plugin": "^1.119.7",
    "@types/react": "~19.1.0",
    "babel-plugin-module-resolver": "^5.0.2",
    "eslint": "^9.25.0",
    "eslint-config-expo": "~10.0.0",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-prettier": "^5.5.5",
    "glob": "^10.5.0",
    "prettier": "^3.8.1",
    "rimraf": "^4.4.1",
    "typescript": "~5.9.2"
  }
}
```

**Removed:**

- 26 `@rn-primitives/*` packages (-1.2MB)
- `nativewind`, `tailwindcss`, `tailwind-merge`, `tailwindcss-animate` (-5MB)
- `lucide-react-native` (replaced by `@tamagui/lucide-icons`)

**Net Change:** -7MB dependencies, +3MB Tamagui optimized packages

---

### ⚙️ PHASE 2: Configuration Setup

**Estimated Tokens:** ~15,000  
**Duration:** 30 minutes

#### Step 2.1: Create Tamagui Config

**File:** `src/tamagui/tamagui.config.ts`

```typescript
import { config as defaultConfig } from '@tamagui/config/v4';
import { createTamagui } from 'tamagui';

// Custom theme matching your current colors
const customTheme = {
  light: {
    background: '#FFFFFF',
    foreground: '#0A0A0A',
    card: '#FFFFFF',
    cardForeground: '#0A0A0A',
    primary: '#0A7EA4',
    primaryForeground: '#FFFFFF',
    secondary: '#F4F4F5',
    secondaryForeground: '#0A0A0A',
    muted: '#F4F4F5',
    mutedForeground: '#71717A',
    accent: '#F4F4F5',
    accentForeground: '#0A0A0A',
    destructive: '#EF4444',
    destructiveForeground: '#FAFAFA',
    border: '#E4E4E7',
    input: '#E4E4E7',
    ring: '#0A7EA4',
  },
  dark: {
    background: '#0A0A0A',
    foreground: '#FAFAFA',
    card: '#0A0A0A',
    cardForeground: '#FAFAFA',
    primary: '#0A7EA4',
    primaryForeground: '#FFFFFF',
    secondary: '#27272A',
    secondaryForeground: '#FAFAFA',
    muted: '#27272A',
    mutedForeground: '#A1A1AA',
    accent: '#27272A',
    accentForeground: '#FAFAFA',
    destructive: '#7F1D1D',
    destructiveForeground: '#FAFAFA',
    border: '#27272A',
    input: '#27272A',
    ring: '#0A7EA4',
  },
};

const config = createTamagui({
  ...defaultConfig,
  themes: {
    ...defaultConfig.themes,
    light: customTheme.light,
    dark: customTheme.dark,
  },
});

export type AppConfig = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
```

#### Step 2.2: Update Babel Config

**File:** `babel.config.js`

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'react' }]],
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
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@/services': './services',
            '~assets': './assets',
          },
        },
      ],
      'react-native-reanimated/plugin', // Must be last
    ],
  };
};
```

#### Step 2.3: Update Metro Config

**File:** `metro.config.js`

```javascript
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add Tamagui support
config.resolver.sourceExts.push('mjs');

// Tamagui requires these for web
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
```

#### Step 2.4: Update Root Layout

**File:** `app/_layout.tsx`

Add Tamagui provider wrapper:

```tsx
import { TamaguiProvider, Theme } from 'tamagui';
import config from '@/tamagui/tamagui.config';

// Replace PortalHost with TamaguiProvider
<TamaguiProvider config={config}>
  <Theme name={colorScheme === 'dark' ? 'dark' : 'light'}>{/* existing router/navigation */}</Theme>
</TamaguiProvider>;
```

---

### 📁 PHASE 3: Folder Restructure

**Estimated Tokens:** ~25,000  
**Duration:** 45 minutes

#### Folder Mapping

**Old Structure → New Structure:**

```
services/                    → src/server/
  supabase.ts                → src/server/supabase.ts

docs/                        → docs/ (keep)
  SUPABASE-MIGRATION.sql     → src/database/migrations/001_initial.sql
  DATABASE-SCHEMA.md         → src/database/README.md

src/components/              → src/interface/
  ui/                        → src/interface/primitives/
  dashboard/                 → src/interface/dashboard/
  themed-text.tsx            → src/interface/themed-text.tsx
  ...

src/store/                   → src/features/auth/store/
  auth-store.ts              → src/features/auth/auth-store.ts
  font-store.ts              → src/features/theme/font-store.ts

src/constants/               → src/tamagui/
  theme.ts                   → MERGE INTO tamagui.config.ts

app/                         → app/
  (auth)/                    → app/(app)/auth/
  (tabs)/                    → app/(app)/home/
  (dashboards)/              → app/(app)/dashboards/
  (crm)/                     → app/(app)/crm/
  (modals)/                  → app/(app)/_modals/
```

**New Folders to Create:**

```
src/database/              # Database schemas and migrations
  migrations/
  schema/
  types.ts

src/data/                  # Data models and queries
  models/
  queries/
  hooks/

src/features/              # Feature-based modules
  auth/
    components/
    hooks/
    store/
    types.ts
  dashboard/
    components/
    hooks/
    widgets/
  crm/
    contacts/
    leads/
    companies/

src/interface/             # Reusable UI components
  primitives/              # Low-level Tamagui components
  layouts/
  forms/

src/server/                # Server-side code
  supabase.ts
  api/
  edge-functions/

src/tamagui/               # Theme configuration
  tamagui.config.ts
  tokens.ts
  themes.ts
```

#### File Move Operations (156 files)

**Phase 3.1: Move Services**

```powershell
# Move supabase service
New-Item -ItemType Directory -Force -Path "src/server"
Move-Item -Path "services/supabase.ts" -Destination "src/server/supabase.ts"
Remove-Item -Path "services" -Recurse -Force
```

**Phase 3.2: Move Database Files**

```powershell
New-Item -ItemType Directory -Force -Path "src/database/migrations"
Move-Item -Path "docs/SUPABASE-MIGRATION.sql" -Destination "src/database/migrations/001_initial.sql"
Copy-Item -Path "docs/DATABASE-SCHEMA.md" -Destination "src/database/README.md"
Move-Item -Path "src/types/database.ts" -Destination "src/database/types.ts"
```

**Phase 3.3: Rename Components to Interface**

```powershell
Move-Item -Path "src/components" -Destination "src/interface"
Move-Item -Path "src/interface/ui" -Destination "src/interface/primitives"
```

**Phase 3.4: Reorganize Features**

```powershell
# Create feature structure
New-Item -ItemType Directory -Force -Path "src/features/auth/components"
New-Item -ItemType Directory -Force -Path "src/features/auth/store"
New-Item -ItemType Directory -Force -Path "src/features/theme"
New-Item -ItemType Directory -Force -Path "src/features/dashboard"

# Move auth store
Move-Item -Path "src/store/auth-store.ts" -Destination "src/features/auth/auth-store.ts"
Move-Item -Path "src/store/font-store.ts" -Destination "src/features/theme/font-store.ts"

# Move auth components
Move-Item -Path "src/interface/sign-in-form.tsx" -Destination "src/features/auth/components/sign-in-form.tsx"
Move-Item -Path "src/interface/sign-up-form.tsx" -Destination "src/features/auth/components/sign-up-form.tsx"
Move-Item -Path "src/interface/forgot-password-form.tsx" -Destination "src/features/auth/components/forgot-password-form.tsx"
Move-Item -Path "src/interface/reset-password-form.tsx" -Destination "src/features/auth/components/reset-password-form.tsx"
Move-Item -Path "src/interface/verify-email-form.tsx" -Destination "src/features/auth/components/verify-email-form.tsx"

# Move dashboard features
Move-Item -Path "src/interface/dashboard" -Destination "src/features/dashboard/components"
```

**Phase 3.5: Reorganize App Routes**

```powershell
# Create new app structure
New-Item -ItemType Directory -Force -Path "app/(app)/auth"
New-Item -ItemType Directory -Force -Path "app/(app)/home"
New-Item -ItemType Directory -Force -Path "app/(app)/dashboards"
New-Item -ItemType Directory -Force -Path "app/(app)/crm"

# Move auth routes
Move-Item -Path "app/(auth)/*" -Destination "app/(app)/auth/"

# Move tab routes
Move-Item -Path "app/(tabs)/*" -Destination "app/(app)/home/"

# Move other routes
Move-Item -Path "app/(dashboards)/*" -Destination "app/(app)/dashboards/"
Move-Item -Path "app/(crm)/*" -Destination "app/(app)/crm/"
Move-Item -Path "app/(modals)" -Destination "app/(app)/_modals"

# Remove old directories
Remove-Item -Path "app/(auth)" -Recurse -Force
Remove-Item -Path "app/(tabs)" -Recurse -Force
Remove-Item -Path "app/(dashboards)" -Recurse -Force
Remove-Item -Path "app/(crm)" -Recurse -Force
Remove-Item -Path "app/(modals)" -Recurse -Force
```

#### Update tsconfig.json Paths

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/server/*": ["./src/server/*"],
      "@/database/*": ["./src/database/*"],
      "@/features/*": ["./src/features/*"],
      "@/interface/*": ["./src/interface/*"],
      "@/tamagui/*": ["./src/tamagui/*"],
      "@/*": ["./src/*"],
      "~assets/*": ["./assets/*"]
    }
  }
}
```

---

### 🎨 PHASE 4: Component Migration (UI Primitives)

**Estimated Tokens:** ~180,000  
**Duration:** 2 hours

#### Migration Strategy

Each component follows this pattern:

**Before (rn-primitives + NativeWind):**

```tsx
import * as CheckboxPrimitive from '@rn-primitives/checkbox';

<CheckboxPrimitive.Root className="border-2 border-primary" />;
```

**After (Tamagui):**

```tsx
import { Checkbox } from 'tamagui';

<Checkbox borderWidth={2} borderColor="$primary" />;
```

#### Component Migration Map (24 files)

| Old Component     | rn-primitives Package        | Tamagui Replacement | Complexity |
| ----------------- | ---------------------------- | ------------------- | ---------- |
| accordion.tsx     | @rn-primitives/accordion     | Accordion           | Medium     |
| alert-dialog.tsx  | @rn-primitives/alert-dialog  | Dialog              | Medium     |
| badge.tsx         | @rn-primitives/slot          | Badge (custom)      | Low        |
| button.tsx        | (styled View)                | Button              | Low        |
| card.tsx          | (styled View)                | Card                | Low        |
| checkbox.tsx      | @rn-primitives/checkbox      | Checkbox            | Low        |
| collapsible.tsx   | @rn-primitives/collapsible   | Accordion           | Low        |
| context-menu.tsx  | @rn-primitives/context-menu  | Popover             | High       |
| dialog.tsx        | @rn-primitives/dialog        | Dialog              | Medium     |
| dropdown-menu.tsx | @rn-primitives/dropdown-menu | Select              | High       |
| hover-card.tsx    | @rn-primitives/hover-card    | Popover             | Medium     |
| input.tsx         | (TextInput)                  | Input               | Low        |
| label.tsx         | @rn-primitives/label         | Label               | Low        |
| menubar.tsx       | @rn-primitives/menubar       | (custom)            | High       |
| popover.tsx       | @rn-primitives/popover       | Popover             | Medium     |
| progress.tsx      | @rn-primitives/progress      | Progress            | Low        |
| radio-group.tsx   | @rn-primitives/radio-group   | RadioGroup          | Low        |
| select.tsx        | @rn-primitives/select        | Select              | Medium     |
| separator.tsx     | @rn-primitives/separator     | Separator           | Low        |
| switch.tsx        | @rn-primitives/switch        | Switch              | Low        |
| tabs.tsx          | @rn-primitives/tabs          | Tabs                | Medium     |
| text.tsx          | @rn-primitives/slot          | Text                | Low        |
| toggle.tsx        | @rn-primitives/toggle        | (custom)            | Medium     |
| tooltip.tsx       | @rn-primitives/tooltip       | Tooltip             | Low        |

**Token Estimate Breakdown:**

- 10 Low complexity: 10 × 3,000 = 30,000 tokens
- 8 Medium complexity: 8 × 8,000 = 64,000 tokens
- 6 High complexity: 6 × 12,000 = 72,000 tokens
- Testing/validation: 14,000 tokens
- **Total:** ~180,000 tokens

#### Example: Button Component Migration

**Before:** `src/components/ui/button.tsx` (52 lines)

```tsx
import { Text, Pressable } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva('flex flex-row items-center justify-center rounded-md', {
  variants: {
    variant: {
      default: 'bg-primary',
      destructive: 'bg-destructive',
      outline: 'border border-input bg-background',
      // ...
    },
    size: {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
    },
  },
});
```

**After:** `src/interface/primitives/button.tsx` (28 lines)

```tsx
import { Button as TamaguiButton, type ButtonProps } from 'tamagui';
import { forwardRef } from 'react';

type Variant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type Size = 'default' | 'sm' | 'lg' | 'icon';

interface CustomButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
  variant?: Variant;
  size?: Size;
}

const Button = forwardRef<typeof TamaguiButton, CustomButtonProps>(
  ({ variant = 'default', size = 'default', ...props }, ref) => {
    const variantStyles = {
      default: { backgroundColor: '$primary', color: '$primaryForeground' },
      destructive: { backgroundColor: '$destructive', color: '$destructiveForeground' },
      outline: { borderWidth: 1, borderColor: '$input', backgroundColor: '$background' },
      secondary: { backgroundColor: '$secondary', color: '$secondaryForeground' },
      ghost: { backgroundColor: 'transparent' },
      link: { backgroundColor: 'transparent', textDecorationLine: 'underline' },
    };

    const sizeStyles = {
      default: { height: 40, paddingHorizontal: 16, paddingVertical: 8 },
      sm: { height: 36, paddingHorizontal: 12, borderRadius: 6 },
      lg: { height: 44, paddingHorizontal: 32, borderRadius: 6 },
      icon: { height: 40, width: 40 },
    };

    return (
      <TamaguiButton
        ref={ref}
        {...variantStyles[variant]}
        {...sizeStyles[size]}
        borderRadius={6}
        {...props}
      />
    );
  }
);

export { Button };
```

**Savings:** -24 lines, no CVA dependency, better performance

---

### 🔧 PHASE 5: Feature Component Migration

**Estimated Tokens:** ~80,000  
**Duration:** 1 hour

#### Components to Update

**Auth Components (8 files):**

1. `sign-in-form.tsx` → Move to `src/features/auth/components/`
2. `sign-up-form.tsx` → Update all className to Tamagui props
3. `forgot-password-form.tsx` → Replace Input, Button components
4. `reset-password-form.tsx` → Update form validation
5. `verify-email-form.tsx` → Update styling
6. `social-connections.tsx` → Migrate button variants
7. `auth-loading.tsx` → Use Tamagui Spinner
8. Auth pages in `app/(app)/auth/` → Update imports

**Dashboard Components (11 files):**

1. `dashboard-wrapper.tsx` → Use Stack/YStack layouts
2. `DashboardGrid.tsx` → Grid layout with Tamagui
3. `DashboardHeader.tsx` → H1, XStack for header
4. `DashboardShell.tsx` → ScrollView wrapper
5. `sidebar.tsx` → Navigation with YStack
6. `topbar.tsx` → XStack header
7. `StatCard.tsx` → Card primitive
8. `ChartCard.tsx` → Custom chart wrapper
9. `ActivityList.tsx` → ListView with items
10. Dashboard pages → Update all imports
11. Widget index → Re-export components

**Shared Components (8 files):**

1. `themed-text.tsx` → Wrap Tamagui Text
2. `themed-view.tsx` → Wrap Tamagui Stack
3. `parallax-scroll-view.tsx` → Use ScrollView
4. `hello-wave.tsx` → Animated component
5. `haptic-tab.tsx` → Tab with haptics
6. `external-link.tsx` → Link component
7. `app-logo.tsx` → Image wrapper
8. Icon components → Use @tamagui/lucide-icons

**Token Breakdown:**

- Auth components: 8 × 5,000 = 40,000 tokens
- Dashboard components: 11 × 2,500 = 27,500 tokens
- Shared components: 8 × 1,500 = 12,000 tokens
- **Total:** ~80,000 tokens

---

### 🔄 PHASE 6: Import Path Updates

**Estimated Tokens:** ~50,000  
**Duration:** 45 minutes

#### Files Requiring Import Updates (Estimated 80+ files)

**Categories:**

1. **App routes** (30 files): Update all component imports
2. **Feature components** (25 files): Update relative imports
3. **Store files** (2 files): Update Supabase import path
4. **Hooks** (5 files): Update component imports
5. **Lib utilities** (3 files): Remove tailwind-merge
6. **Interface components** (15 files): Update cross-references

**Import Mapping:**

```typescript
// OLD PATHS → NEW PATHS

// Components
'@/components/ui/' → '@/interface/primitives/'
'@/components/dashboard/' → '@/features/dashboard/components/'
'@/components/themed-text' → '@/interface/themed-text'

// Services
'@/services/supabase' → '@/server/supabase'
'./services/supabase' → '@/server/supabase'

// Store
'@/store/auth-store' → '@/features/auth/auth-store'
'@/store/font-store' → '@/features/theme/font-store'

// Types
'@/types/database' → '@/database/types'

// Theme
'@/constants/theme' → '@/tamagui/tamagui.config'

// Hooks
'@/hooks/' → '@/hooks/' (no change)
```

**Automated Find & Replace Strategy:**

Use `multi_replace_string_in_file` tool in batches of 10 files to update:

- Import statements
- Component references
- Type imports
- Path aliases

**Token Estimate:** ~600 tokens per file × 80 files = ~50,000 tokens

---

### 🧪 PHASE 7: Testing & Validation

**Estimated Tokens:** ~15,000  
**Duration:** 30 minutes

#### Validation Checklist

**Build Validation:**

```bash
# Clear caches
npx expo start --clear
rm -rf node_modules/.cache
rm -rf .expo

# Test builds
npx expo run:ios
npx expo run:android
npx expo start --web
```

**Type Checking:**

```bash
npx tsc --noEmit
```

**ESLint:**

```bash
npm run lint
```

**Runtime Checks:**

- [ ] App launches without errors
- [ ] Theme switching works (light/dark)
- [ ] All routes navigate correctly
- [ ] Auth flow works (sign in, sign up, reset password)
- [ ] Dashboard loads with data
- [ ] Forms submit properly
- [ ] Animations are smooth
- [ ] No console warnings

**Visual Regression:**

- [ ] Compare before/after screenshots of all screens
- [ ] Verify spacing and layout consistency
- [ ] Check responsive behavior on different screen sizes
- [ ] Test platform-specific variants (iOS symbols, web gradients)

---

## Token Budget Summary

| Phase     | Description                               | Estimated Tokens | Duration     |
| --------- | ----------------------------------------- | ---------------- | ------------ |
| 1         | Dependency cleanup & installation         | 5,000            | 15 min       |
| 2         | Configuration setup                       | 15,000           | 30 min       |
| 3         | Folder restructure                        | 25,000           | 45 min       |
| 4         | UI primitives migration (24 components)   | 180,000          | 2 hours      |
| 5         | Feature components migration (27 files)   | 80,000           | 1 hour       |
| 6         | Import path updates (80+ files)           | 50,000           | 45 min       |
| 7         | Testing & validation                      | 15,000           | 30 min       |
| 8         | Layout architecture & reusable components | 45,000           | 1 hour       |
| **TOTAL** | **Complete migration**                    | **~415,000**     | **~7 hours** |

**Buffer:** Added 20,000 token buffer for unexpected issues

**Cost Estimate (Claude Sonnet 4.5):**

- Input tokens: ~415,000 × $0.003/1K = $1.25
- Output tokens: ~60,000 × $0.015/1K = $0.90
- **Total:** ~$2.15

---

## Execution Strategy

### Recommended Approach

**Option 1: Single Session (Recommended)**
Execute all phases in one session for consistency:

- Start with clean git commit
- Run phases 1-8 sequentially
- Test thoroughly at end
- Single commit with complete migration

**Option 2: Phased Rollout**
Execute in stages with testing between:

- Week 1: Phases 1-3 (dependencies + folder structure)
- Week 2: Phases 4-5 (component migration)
- Week 3: Phase 6-7 (import updates + testing)

**Option 3: Parallel Track**
Create `tamagui-migration` branch:

- Develop new Tamagui components in parallel
- Gradually replace old components
- Merge when feature-complete

### Risk Mitigation

**Before Starting:**

1. ✅ Commit all current work
2. ✅ Create backup branch: `git checkout -b pre-tamagui-backup`
3. ✅ Document current app screenshots
4. ✅ Export Supabase schema (already done in docs/)
5. ✅ Test all critical user flows

**During Migration:**

1. Run TypeScript compiler after each phase
2. Test app launch after major changes
3. Keep detailed notes of any breaking changes
4. Take screenshots for visual comparison

**Rollback Plan:**
If migration fails, restore from backup:

```bash
git checkout pre-tamagui-backup
npm install
npx expo start --clear
```

---

## Post-Migration Optimizations

### Performance Gains

**Tamagui Compile-Time Extraction:**

- Styles extracted at build time
- Reduced runtime overhead
- Smaller bundle size (~15% reduction expected)

**Animation Performance:**

- Native driver for animations
- Better gesture handling
- Smoother transitions

**Developer Experience:**

- Better TypeScript autocomplete
- Theme token intellisense
- Faster hot reload

### Next Steps After Migration

1. **Enable Production Optimizations:**

   ```javascript
   // babel.config.js
   disableExtraction: false, // Enable in production
   ```

2. **Add Custom Animations:**

   ```typescript
   import { createAnimations } from '@tamagui/animations-react-native';
   // Custom spring/timing configs
   ```

3. **Theme Extensions:**
   - Add brand colors
   - Custom font families
   - Additional spacing scales

4. **Component Library:**
   - Document all interface components
   - Create Storybook or design system
   - Add usage examples

---

## PHASE 8: Layout Architecture & Reusable Components

**Estimated Tokens:** ~45,000  
**Duration:** 1 hour

### Design Philosophy

**Core Principles:**

1. **Composition over configuration** - Build complex layouts from simple primitives
2. **Per-page theming** - Each screen controls its own theme, colors, and typography
3. **Responsive by default** - Mobile-first with automatic tablet/desktop adaptation
4. **Type-safe layouts** - Full TypeScript support with intellisense

### Layout System Architecture

```
src/interface/
├── layouts/                          # Reusable page layouts
│   ├── AppLayout.tsx                 # Base layout with AppBar + content
│   ├── DashboardLayout.tsx           # Dashboard with sidebar + content
│   ├── AuthLayout.tsx                # Centered auth forms with branding
│   ├── DetailLayout.tsx              # Detail pages with back action
│   └── ModalLayout.tsx               # Modal/sheet layouts
│
├── navigation/                       # Navigation components
│   ├── AppBar.tsx                    # Top app bar (configurable)
│   ├── AppHeader.tsx                 # Large header with actions
│   ├── BottomBar.tsx                 # Bottom navigation bar
│   ├── BackAction.tsx                # Back button with custom actions
│   ├── Sidebar.tsx                   # Collapsible sidebar (tablet+)
│   └── TabBar.tsx                    # Custom tab bar component
│
├── primitives/                       # Low-level Tamagui components
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── ...
│
└── themed/                           # Theme-aware wrappers
    ├── themed-stack.tsx              # Stack with theme context
    ├── themed-text.tsx               # Text with theme variants
    └── themed-view.tsx               # View with theme support
```

---

### 1. Navigation Components

#### **AppBar Component**

Flexible top bar supporting multiple variants:

```typescript
// src/interface/navigation/AppBar.tsx
import { XStack, YStack, Text } from 'tamagui'
import { BackAction } from './BackAction'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface AppBarProps {
  variant?: 'default' | 'transparent' | 'primary' | 'surface'
  title?: string
  subtitle?: string
  showBack?: boolean
  onBackPress?: () => void
  leftAction?: React.ReactNode
  rightActions?: React.ReactNode[]
  elevation?: number
  sticky?: boolean
  height?: number | 'auto'
  // Per-page theme overrides
  backgroundColor?: string
  textColor?: string
}

export function AppBar({
  variant = 'default',
  title,
  subtitle,
  showBack = false,
  onBackPress,
  leftAction,
  rightActions,
  elevation = 0,
  sticky = false,
  height = 56,
  backgroundColor,
  textColor,
}: AppBarProps) {
  const insets = useSafeAreaInsets()

  const variantStyles = {
    default: {
      backgroundColor: backgroundColor || '$background',
      borderBottomWidth: 1,
      borderBottomColor: '$borderColor'
    },
    transparent: {
      backgroundColor: backgroundColor || 'transparent'
    },
    primary: {
      backgroundColor: backgroundColor || '$primary',
      color: textColor || '$primaryForeground'
    },
    surface: {
      backgroundColor: backgroundColor || '$card',
      elevation: elevation || 2
    },
  }

  return (
    <XStack
      {...variantStyles[variant]}
      paddingTop={insets.top}
      height={height === 'auto' ? undefined : height}
      alignItems="center"
      paddingHorizontal="$4"
      gap="$3"
      position={sticky ? 'sticky' : 'relative'}
      top={sticky ? 0 : undefined}
      zIndex={sticky ? 100 : undefined}
    >
      {/* Left Section */}
      {showBack && <BackAction onPress={onBackPress} color={textColor} />}
      {leftAction}

      {/* Title Section */}
      {(title || subtitle) && (
        <YStack flex={1} gap="$1">
          {title && (
            <Text
              fontSize="$6"
              fontWeight="600"
              color={textColor || '$foreground'}
              numberOfLines={1}
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              fontSize="$2"
              color={textColor || '$mutedForeground'}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </YStack>
      )}

      {/* Right Actions */}
      {rightActions && (
        <XStack gap="$2" alignItems="center">
          {rightActions.map((action, i) => (
            <React.Fragment key={i}>{action}</React.Fragment>
          ))}
        </XStack>
      )}
    </XStack>
  )
}
```

**Usage Examples:**

```tsx
// Default app bar
<AppBar title="Contacts" showBack />

// Primary colored header
<AppBar
  variant="primary"
  title="Dashboard"
  rightActions={[
    <IconButton icon={Search} />,
    <IconButton icon={Settings} />
  ]}
/>

// Transparent overlay (for image backgrounds)
<AppBar
  variant="transparent"
  title="Profile"
  textColor="#ffffff"
  showBack
/>

// Custom themed per-page
<AppBar
  title="Sales Report"
  backgroundColor="#1a365d"
  textColor="#ffffff"
  elevation={4}
/>
```

---

#### **AppHeader Component**

Large header with actions and optional search:

```typescript
// src/interface/navigation/AppHeader.tsx
import { YStack, XStack, H1, Text, Input } from 'tamagui'

interface AppHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode[]
  showSearch?: boolean
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  variant?: 'default' | 'gradient' | 'image'
  backgroundColor?: string
  backgroundImage?: string
  minHeight?: number
  paddingHorizontal?: number
}

export function AppHeader({
  title,
  subtitle,
  actions,
  showSearch,
  searchPlaceholder = 'Search...',
  onSearch,
  variant = 'default',
  backgroundColor,
  backgroundImage,
  minHeight = 120,
  paddingHorizontal = 20,
}: AppHeaderProps) {
  return (
    <YStack
      backgroundColor={backgroundColor || '$background'}
      paddingHorizontal={paddingHorizontal}
      paddingTop="$6"
      paddingBottom="$4"
      minHeight={minHeight}
      gap="$4"
    >
      {/* Title + Actions Row */}
      <XStack justifyContent="space-between" alignItems="center">
        <YStack flex={1} gap="$2">
          <H1 fontSize="$9" fontWeight="bold" color="$foreground">
            {title}
          </H1>
          {subtitle && (
            <Text fontSize="$4" color="$mutedForeground">
              {subtitle}
            </Text>
          )}
        </YStack>

        {actions && (
          <XStack gap="$2">
            {actions.map((action, i) => (
              <React.Fragment key={i}>{action}</React.Fragment>
            ))}
          </XStack>
        )}
      </XStack>

      {/* Optional Search Bar */}
      {showSearch && (
        <Input
          placeholder={searchPlaceholder}
          onChangeText={onSearch}
          size="$4"
          backgroundColor="$background"
          borderWidth={1}
          borderColor="$borderColor"
        />
      )}
    </YStack>
  )
}
```

---

#### **BottomBar Component**

Custom bottom navigation with animations:

```typescript
// src/interface/navigation/BottomBar.tsx
import { XStack, Button } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated'

interface BottomBarItem {
  id: string
  label: string
  icon: React.ComponentType<{ size?: number; color?: string }>
  onPress: () => void
}

interface BottomBarProps {
  items: BottomBarItem[]
  activeId: string
  variant?: 'default' | 'floating'
  backgroundColor?: string
  activeTintColor?: string
  inactiveTintColor?: string
}

export function BottomBar({
  items,
  activeId,
  variant = 'default',
  backgroundColor,
  activeTintColor = '$primary',
  inactiveTintColor = '$mutedForeground',
}: BottomBarProps) {
  const insets = useSafeAreaInsets()

  return (
    <XStack
      backgroundColor={backgroundColor || '$card'}
      paddingBottom={insets.bottom}
      paddingHorizontal="$4"
      paddingTop="$2"
      height={60 + insets.bottom}
      alignItems="center"
      justifyContent="space-around"
      borderTopWidth={variant === 'default' ? 1 : 0}
      borderTopColor="$borderColor"
      elevation={variant === 'floating' ? 8 : 0}
      marginHorizontal={variant === 'floating' ? '$4' : 0}
      marginBottom={variant === 'floating' ? '$4' : 0}
      borderRadius={variant === 'floating' ? '$4' : 0}
    >
      {items.map((item) => {
        const isActive = item.id === activeId
        const Icon = item.icon

        return (
          <Button
            key={item.id}
            unstyled
            onPress={item.onPress}
            flexDirection="column"
            alignItems="center"
            gap="$1"
            flex={1}
            paddingVertical="$2"
          >
            <Icon
              size={24}
              color={isActive ? activeTintColor : inactiveTintColor}
            />
            <Text
              fontSize="$1"
              color={isActive ? activeTintColor : inactiveTintColor}
              fontWeight={isActive ? '600' : '400'}
            >
              {item.label}
            </Text>
          </Button>
        )
      })}
    </XStack>
  )
}
```

---

#### **BackAction Component**

Reusable back button with haptics:

```typescript
// src/interface/navigation/BackAction.tsx
import { Button } from 'tamagui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'

interface BackActionProps {
  onPress?: () => void
  label?: string
  color?: string
  showLabel?: boolean
}

export function BackAction({
  onPress,
  label = 'Back',
  color,
  showLabel = false
}: BackActionProps) {
  const router = useRouter()

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    if (onPress) {
      onPress()
    } else {
      router.back()
    }
  }

  return (
    <Button
      unstyled
      onPress={handlePress}
      flexDirection="row"
      alignItems="center"
      gap="$1"
      paddingVertical="$2"
      paddingHorizontal="$2"
    >
      <ChevronLeft size={24} color={color || '$foreground'} />
      {showLabel && (
        <Text fontSize="$4" color={color || '$foreground'}>
          {label}
        </Text>
      )}
    </Button>
  )
}
```

---

### 2. Page Layouts

#### **AppLayout** (Base Layout)

Universal layout for most screens:

```typescript
// src/interface/layouts/AppLayout.tsx
import { YStack, ScrollView } from 'tamagui'
import { AppBar } from '../navigation/AppBar'
import { BottomBar } from '../navigation/BottomBar'

interface AppLayoutProps {
  children: React.ReactNode

  // AppBar config
  showAppBar?: boolean
  appBarProps?: ComponentProps<typeof AppBar>

  // BottomBar config
  showBottomBar?: boolean
  bottomBarProps?: ComponentProps<typeof BottomBar>

  // Scroll config
  scrollable?: boolean
  refreshControl?: React.ReactElement

  // Theme overrides (per-page)
  theme?: 'light' | 'dark' | 'custom'
  backgroundColor?: string

  // Layout options
  fullWidth?: boolean
  maxWidth?: number
  paddingHorizontal?: number
  paddingVertical?: number
}

export function AppLayout({
  children,
  showAppBar = true,
  appBarProps,
  showBottomBar = false,
  bottomBarProps,
  scrollable = true,
  refreshControl,
  theme,
  backgroundColor,
  fullWidth = false,
  maxWidth = 1200,
  paddingHorizontal = 20,
  paddingVertical = 0,
}: AppLayoutProps) {
  const content = (
    <YStack
      flex={1}
      backgroundColor={backgroundColor || '$background'}
      maxWidth={fullWidth ? undefined : maxWidth}
      width="100%"
      alignSelf="center"
      paddingHorizontal={paddingHorizontal}
      paddingVertical={paddingVertical}
    >
      {children}
    </YStack>
  )

  return (
    <YStack flex={1} backgroundColor={backgroundColor || '$background'}>
      {showAppBar && <AppBar {...appBarProps} />}

      {scrollable ? (
        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}

      {showBottomBar && <BottomBar {...bottomBarProps} />}
    </YStack>
  )
}
```

**Usage:**

```tsx
// Simple page with app bar
<AppLayout
  appBarProps={{ title: 'Contacts', showBack: true }}
  paddingHorizontal={20}
  paddingVertical={16}
>
  <ContactsList />
</AppLayout>

// Dashboard with custom theme
<AppLayout
  appBarProps={{
    variant: 'primary',
    title: 'Sales Dashboard',
    backgroundColor: '#1e40af',
    textColor: '#ffffff'
  }}
  backgroundColor="#f0f9ff"
  fullWidth
>
  <DashboardContent />
</AppLayout>

// Page with bottom bar
<AppLayout
  showBottomBar
  bottomBarProps={{
    items: navigationItems,
    activeId: 'home'
  }}
>
  <HomeContent />
</AppLayout>
```

---

#### **DashboardLayout**

Layout with optional sidebar for dashboard screens:

```typescript
// src/interface/layouts/DashboardLayout.tsx
import { XStack, YStack } from 'tamagui'
import { Sidebar } from '../navigation/Sidebar'
import { AppBar } from '../navigation/AppBar'
import { useWindowDimensions } from 'react-native'

interface DashboardLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
  sidebarCollapsed?: boolean
  onToggleSidebar?: () => void
  appBarProps?: ComponentProps<typeof AppBar>
  backgroundColor?: string
}

export function DashboardLayout({
  children,
  showSidebar = true,
  sidebarCollapsed = false,
  onToggleSidebar,
  appBarProps,
  backgroundColor,
}: DashboardLayoutProps) {
  const { width } = useWindowDimensions()
  const isMobile = width < 768
  const shouldShowSidebar = showSidebar && !isMobile

  return (
    <YStack flex={1} backgroundColor={backgroundColor || '$background'}>
      <AppBar {...appBarProps} />

      <XStack flex={1}>
        {shouldShowSidebar && (
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={onToggleSidebar}
          />
        )}

        <YStack flex={1}>
          {children}
        </YStack>
      </XStack>
    </YStack>
  )
}
```

---

#### **AuthLayout**

Centered layout for authentication screens:

```typescript
// src/interface/layouts/AuthLayout.tsx
import { YStack, XStack, ScrollView } from 'tamagui'
import { AppLogo } from '../primitives/app-logo'
import { useWindowDimensions } from 'react-native'

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  showLogo?: boolean
  maxWidth?: number
  backgroundColor?: string
  cardBackgroundColor?: string
}

export function AuthLayout({
  children,
  title,
  subtitle,
  showLogo = true,
  maxWidth = 440,
  backgroundColor,
  cardBackgroundColor,
}: AuthLayoutProps) {
  const { height } = useWindowDimensions()

  return (
    <ScrollView
      flex={1}
      backgroundColor={backgroundColor || '$background'}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        minHeight: height,
      }}
    >
      <YStack
        paddingHorizontal="$6"
        paddingVertical="$8"
        maxWidth={maxWidth}
        width="100%"
        alignSelf="center"
        gap="$6"
      >
        {/* Logo & Branding */}
        {showLogo && (
          <YStack alignItems="center" gap="$4">
            <AppLogo size={96} />
            {title && (
              <YStack gap="$2" alignItems="center">
                <Text fontSize="$8" fontWeight="bold" textAlign="center">
                  {title}
                </Text>
                {subtitle && (
                  <Text
                    fontSize="$4"
                    color="$mutedForeground"
                    textAlign="center"
                  >
                    {subtitle}
                  </Text>
                )}
              </YStack>
            )}
          </YStack>
        )}

        {/* Auth Form Card */}
        <YStack
          backgroundColor={cardBackgroundColor || '$card'}
          borderRadius="$4"
          padding="$6"
          borderWidth={1}
          borderColor="$borderColor"
          elevation={2}
        >
          {children}
        </YStack>
      </YStack>
    </ScrollView>
  )
}
```

**Usage:**

```tsx
// Sign In Page
<AuthLayout
  title="Welcome Back"
  subtitle="Sign in to your account"
>
  <SignInForm />
</AuthLayout>

// Custom themed auth
<AuthLayout
  backgroundColor="#0f172a"
  cardBackgroundColor="#1e293b"
  title="Create Account"
>
  <SignUpForm />
</AuthLayout>
```

---

#### **DetailLayout**

Layout for detail/edit pages with back action:

```typescript
// src/interface/layouts/DetailLayout.tsx
import { YStack, ScrollView } from 'tamagui'
import { AppBar } from '../navigation/AppBar'

interface DetailLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  onBack?: () => void
  actions?: React.ReactNode[]
  scrollable?: boolean
  backgroundColor?: string
  contentPadding?: number
}

export function DetailLayout({
  children,
  title,
  subtitle,
  onBack,
  actions,
  scrollable = true,
  backgroundColor,
  contentPadding = 20,
}: DetailLayoutProps) {
  const content = (
    <YStack
      flex={1}
      padding={contentPadding}
      gap="$4"
    >
      {children}
    </YStack>
  )

  return (
    <YStack flex={1} backgroundColor={backgroundColor || '$background'}>
      <AppBar
        title={title}
        subtitle={subtitle}
        showBack
        onBackPress={onBack}
        rightActions={actions}
      />

      {scrollable ? (
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </YStack>
  )
}
```

---

### 3. Per-Page Theming System

#### **Theme Context Provider**

```typescript
// src/tamagui/page-theme-provider.tsx
import { Theme, ThemeProvider } from 'tamagui'
import { createContext, useContext, useState } from 'react'

interface PageThemeConfig {
  colorScheme?: 'light' | 'dark'
  primary?: string
  background?: string
  fontSize?: number
  fontFamily?: string
}

interface PageThemeContextValue {
  config: PageThemeConfig
  updateTheme: (config: Partial<PageThemeConfig>) => void
}

const PageThemeContext = createContext<PageThemeContextValue | null>(null)

export function PageThemeProvider({
  children,
  initialConfig = {}
}: {
  children: React.ReactNode
  initialConfig?: PageThemeConfig
}) {
  const [config, setConfig] = useState<PageThemeConfig>(initialConfig)

  const updateTheme = (newConfig: Partial<PageThemeConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }))
  }

  return (
    <PageThemeContext.Provider value={{ config, updateTheme }}>
      <Theme name={config.colorScheme || 'light'}>
        {children}
      </Theme>
    </PageThemeContext.Provider>
  )
}

export function usePageTheme() {
  const context = useContext(PageThemeContext)
  if (!context) {
    throw new Error('usePageTheme must be used within PageThemeProvider')
  }
  return context
}
```

**Usage:**

```tsx
// In app route
function SalesDashboardPage() {
  return (
    <PageThemeProvider
      initialConfig={{
        colorScheme: 'dark',
        primary: '#3b82f6',
        fontSize: 16,
      }}
    >
      <DashboardLayout
        appBarProps={{
          title: 'Sales Dashboard',
          backgroundColor: '#1e3a8a',
        }}
      >
        <SalesContent />
      </DashboardLayout>
    </PageThemeProvider>
  );
}

// Inside component, access theme
function SalesContent() {
  const { config, updateTheme } = usePageTheme();

  return (
    <YStack>
      <Button onPress={() => updateTheme({ colorScheme: 'light' })}>Switch to Light Mode</Button>
      <Text fontSize={config.fontSize}>Sales data goes here</Text>
    </YStack>
  );
}
```

---

### 4. Complete Layout Examples

#### **Example 1: Dashboard Page**

```tsx
// app/(app)/dashboards/sales.tsx
import { DashboardLayout } from '@/interface/layouts/DashboardLayout';
import { PageThemeProvider } from '@/tamagui/page-theme-provider';
import { DashboardGrid } from '@/features/dashboard/components';

export default function SalesDashboard() {
  return (
    <PageThemeProvider initialConfig={{ colorScheme: 'light' }}>
      <DashboardLayout
        showSidebar
        appBarProps={{
          variant: 'primary',
          title: 'Sales Dashboard',
          subtitle: 'Real-time metrics',
          rightActions: [<IconButton icon={Filter} />, <IconButton icon={Download} />],
        }}
        backgroundColor="$background"
      >
        <ScrollView>
          <DashboardGrid>{/* Dashboard widgets */}</DashboardGrid>
        </ScrollView>
      </DashboardLayout>
    </PageThemeProvider>
  );
}
```

#### **Example 2: Contact Detail Page**

```tsx
// app/(app)/crm/contacts/[id].tsx
import { DetailLayout } from '@/interface/layouts/DetailLayout';
import { ContactForm } from '@/features/crm/components';

export default function ContactDetailPage() {
  const { id } = useLocalSearchParams();

  return (
    <DetailLayout
      title="John Doe"
      subtitle="Senior Developer at Acme Corp"
      actions={[<IconButton icon={Edit} />, <IconButton icon={Share} />]}
    >
      <ContactForm contactId={id} />
    </DetailLayout>
  );
}
```

#### **Example 3: Auth Page with Custom Theme**

```tsx
// app/(app)/auth/sign-in.tsx
import { AuthLayout } from '@/interface/layouts/AuthLayout';
import { SignInForm } from '@/features/auth/components';
import { PageThemeProvider } from '@/tamagui/page-theme-provider';

export default function SignInPage() {
  return (
    <PageThemeProvider initialConfig={{ colorScheme: 'dark' }}>
      <AuthLayout
        title="Welcome Back"
        subtitle="Sign in to continue"
        backgroundColor="#0f172a"
        cardBackgroundColor="#1e293b"
      >
        <SignInForm />
      </AuthLayout>
    </PageThemeProvider>
  );
}
```

#### **Example 4: Tabbed Page with Bottom Bar**

```tsx
// app/(app)/home/index.tsx
import { AppLayout } from '@/interface/layouts/AppLayout';
import { AppHeader } from '@/interface/navigation/AppHeader';

export default function HomePage() {
  const bottomBarItems = [
    { id: 'home', label: 'Home', icon: Home, onPress: () => {} },
    { id: 'leads', label: 'Leads', icon: Users, onPress: () => {} },
    { id: 'contacts', label: 'Contacts', icon: Mail, onPress: () => {} },
  ];

  return (
    <AppLayout
      showAppBar={false} // Using AppHeader instead
      showBottomBar
      bottomBarProps={{
        items: bottomBarItems,
        activeId: 'home',
        variant: 'floating',
      }}
      scrollable
      paddingHorizontal={0}
    >
      <AppHeader
        title="Good Morning!"
        subtitle="John Doe"
        showSearch
        onSearch={q => console.log(q)}
        actions={[<IconButton icon={Bell} />, <Avatar size={40} />]}
      />

      <YStack padding="$4" gap="$4">
        {/* Page content */}
      </YStack>
    </AppLayout>
  );
}
```

---

### 5. Token Estimate for Layout Implementation

**Component Breakdown:**

- AppBar: ~8,000 tokens (full implementation + variants)
- AppHeader: ~5,000 tokens
- BottomBar: ~6,000 tokens
- BackAction: ~2,000 tokens
- Sidebar (migrate existing): ~4,000 tokens
- AppLayout: ~6,000 tokens
- DashboardLayout: ~4,000 tokens
- AuthLayout: ~4,000 tokens
- DetailLayout: ~3,000 tokens
- PageThemeProvider: ~3,000 tokens

**Total: ~45,000 tokens**

---

### Benefits of This Architecture

✅ **Reusability** - Mix and match layouts, navigation components  
✅ **Per-Page Theming** - Each screen controls its own colors, fonts, scheme  
✅ **Type Safety** - Full TypeScript autocomplete and validation  
✅ **Responsive** - Auto-adapts to mobile/tablet/desktop  
✅ **Composition** - Build complex UIs from simple primitives  
✅ **Performance** - Tamagui's compile-time optimization  
✅ **Consistency** - Shared design language across all screens  
✅ **Flexibility** - Override any prop per-screen as needed

---

## Questions & Answers

**Q: Can we keep some rn-primitives components?**
A: Not recommended. Mixing styling systems causes bundle bloat and inconsistent behavior.

**Q: Will this break existing Supabase integration?**
A: No. Only import paths change (`services/` → `src/server/`). Supabase client remains identical.

**Q: What about Expo Router?**
A: Fully compatible. Tamagui works seamlessly with Expo Router file-based navigation.

**Q: Can we use Tailwind classes with Tamagui?**
A: No. Tamagui uses a prop-based styling system. NativeWind must be fully removed.

**Q: Will web builds still work?**
A: Yes. Tamagui has excellent web support with SSR capabilities.

**Q: What about React 19 compatibility?**
A: Tamagui 1.119+ fully supports React 19 with the new architecture.

---

## Approval Required

Before proceeding, please confirm:

- [ ] Review token budget (~415,000 tokens ≈ $2.15)
- [ ] Approve folder restructure strategy
- [ ] Approve layout architecture design
- [ ] Choose execution approach (single session vs phased)
- [ ] Backup current codebase
- [ ] Set aside 7+ hours for migration + testing

**Ready to proceed?** Reply with:

- ✅ "Proceed with single session migration"
- 📅 "Start with Phase 1-3 only"
- ❓ "I have questions about [specific phase]"

---

**Last Updated:** February 4, 2026  
**Maintained By:** GitHub Copilot (Claude Sonnet 4.5)
