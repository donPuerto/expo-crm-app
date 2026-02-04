# Expo CRM App - AI Agent Instructions

## Project Overview

This is an Expo React Native app (SDK 54) using:

- **Expo Router 6** for file-based navigation with typed routes
- **TypeScript** with strict mode and path aliases (`@/*`)
- **React 19** with the new architecture enabled
- **React Compiler** experimental feature enabled
- **Tamagui v2** for cross-platform styling and UI components
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

- **Client**: `src/server/supabase.ts` - Configured Supabase client with environment variables
- **Environment**: `.env` - Supabase credentials (EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY)
- **Database Types**: `src/database/types.ts` - TypeScript types for all database tables
- **Migrations**: `src/database/migrations/` - SQL migration files

### Tamagui Theming & Styling System

Cross-platform design system using Tamagui's theming architecture:

- **Configuration**: `src/tamagui/tamagui.config.ts` - Central Tamagui config with themes, tokens, and settings
- **Theme Provider**: `app/_layout.tsx` wraps app with `TamaguiProvider` and `Theme` components
- **Base Themes**: `light` and `dark` themes with standard Tamagui keys
- **Theme Values**: Access via `$theme-*` tokens (e.g., `$background`, `$color`, `$borderColor`)
- **Custom Tokens**: Brand colors (primary, secondary, destructive, etc.) and chart colors
- **Color Scheme**: Uses `useColorScheme()` hook, resolved to `defaultTheme` prop on TamaguiProvider

### State Management

- **Global State**: Use Zustand stores in feature-based modules (e.g., `src/features/auth/auth-store.ts`)
- **Data Persistence**: AsyncStorage for local caching
- **Backend State**: Supabase client for server data (use in Zustand stores)
- **Local State**: Use React hooks (`useState`, `useReducer`) for component-level state
- **Avoid**: Do not use React Context for shared data across the app (use Zustand instead)

## Component Patterns

### Platform-specific Files

Use `.ios.tsx`, `.android.tsx`, `.web.tsx` extensions for platform variants:

- Example: `icon-symbol.ios.tsx` vs `icon-symbol.tsx` (Android/Web fallback)

### Tamagui Base Components

**View and Text** are the foundation - functionally equivalent to React Native components with Tamagui's superset of props:

```tsx
import { View, Text } from '@tamagui/core'

// Direct usage with inline styles (compiler-optimized)
<View margin={10} $sm={{ margin: 5 }}>
  <Text color="$color" fontSize="$4">Hello</Text>
</View>

// Using shorthands (recommended)
<View mx="$sm" scale={1.2}>
  <Text c="$color">Hello</Text>
</View>
```

**Key Principles:**

- Inline styles are fully optimized by the compiler
- Use shorthands (`mx`, `c`, etc.) for concise code
- Style prop order matters (later props override earlier ones)
- No need for `Pressable` or `TouchableOpacity` - all Views have press handling built-in

### Tamagui Styled Components

Create components using Tamagui's `styled()` function:

````tsx
import { View, styled } from '@tamagui/core'

export const Card = styled(View, {
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
Use TypeScript path aliases following the feature-based architecture:

- **Tamagui Core**: `import { View, Text, styled } from '@tamagui/core'`
- **Tamagui Config**: `import config from '@/tamagui/tamagui.config'`
- **Server/Backend**: `import { supabase } from '@/server/supabase'`
- **Database Types**: `import type { Contact, ContactInsert } from '@/database/types'`
- **Features**:
  - `import { useAuthStore } from '@/features/auth/auth-store'`
  - `import { SignInForm } from '@/features/auth/components/sign-in-form'`
- **Interface/UI**:
  - `import { Button } from '@/interface/primitives/button'`
  - `import { Card } from '@/interface/components/card'`
- **Hooks**: `import { useColorScheme } from '@/hooks/use-color-scheme'`
- **Constants**: `import { theme } from '@/constants/theme'`
- **Assets**: `@/assets/images/...` with `require()` for static images (prefix: `~assets/`)

## Styling with Tamagui

### Core Principles

1. **Token-based Design**: Use `$` prefix to access design tokens
   ```tsx
   <View backgroundColor="$background" padding="$4" borderRadius="$2" />
````

2. **Superset of React Native**: All React Native style props work, plus Tamagui extensions
   - Cross-platform: `boxShadow`, `filter`, `backgroundImage`, `cursor` (iOS 17+)
   - Web-only: `backdropFilter`, `clipPath`, `mask`, `float`, `position: 'fixed'`

3. **Flat Transform Props**: Use shorthand instead of transform arrays

   ```tsx
   <View x={10} y={20} scale={1.5} rotate="45deg" />
   // vs React Native: transform={[{ translateX: 10 }, { translateY: 20 }, ...]}
   ```

4. **rem Units**: Cross-platform support with accessibility scaling

   ```tsx
   <Text fontSize="1.5rem" /> // Scales with user's font size preference
   ```

5. **CSS Shorthands with Tokens**:
   ```tsx
   <View
     boxShadow="0 0 10px $shadowColor"
     backgroundImage="linear-gradient(to bottom, $background, $color)"
     border="1px solid $borderColor"
   />
   ```

### Styling Patterns

**Inline Styles (for one-off cases):**

```tsx
<View backgroundColor="$card" padding="$4" borderRadius="$2" />
```

**Styled Components (for reusable components):**

```tsx
const Card = styled(View, {
  backgroundColor: '$card',
  padding: '$4',
  borderRadius: '$2',
});
```

**Variants (for configurable components):**

```tsx
const Button = styled(View, {
  variants: {
    variant: {
      primary: { backgroundColor: '$primary' },
      secondary: { backgroundColor: '$secondary' },
    },
  },
})
<Button variant="primary" />
```

**Avoid:**

- Do not use NativeWind/Tailwind classes (migrated to Tamagui)
- Do not use `StyleSheet.create` unless absolutely necessary (use Tamagui styled instead)
- Do not use inline style objects when theme tokens can be used
  **1. Style Props (Inline Styling):**

```tsx
<View
  backgroundColor="$background"
  padding="$4"
  borderRadius="$2"
  hoverStyle={{ backgroundColor: '$backgroundHover' }}
  pressStyle={{ scale: 0.98 }}
/>
```

**2. Pseudo States:**

- `hoverStyle` - Hover state (web only)
- `pressStyle` - Press/active state
- `focusStyle` - Focus state
- `focusVisibleStyle` - Keyboard focus only (accessibility)
- `focusWithinStyle` - When child has focus
- `disabledStyle` - When `disabled={true}`

**3. Parent-based Styling:**

**Media Queries:**

```tsx
<Text fontSize="$4" $sm={{ fontSize: '$3' }} $lg={{ fontSize: '$5' }} />
```

**Theme Queries:**

```tsx
<View backgroundColor="$background" $theme-dark={{ backgroundColor: '$backgroundStrong' }} />
```

**Platform Queries:**

```tsx
<View padding="$4" $platform-ios={{ paddingTop: '$6' }} $platform-web={{ cursor: 'pointer' }} />
```

**Group Styling:**

```tsx
<View group="card">
  <Text $group-card-hover={{ color: '$primary' }}>Hover the card to see this change</Text>
</View>
```

**4. Variants Pattern:**

Use variants for reusable style combinations:

```tsx
const Button = styled(View, {
  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
        color: '$primaryForeground',
      },
      secondary: {
        backgroundColor: '$secondary',
        color: '$secondaryForeground',
      },
    },
    size: {
      '...size': (size, { tokens }) => ({
        height: tokens.size[size],
        paddingHorizontal: tokens.space[size],
      }),
    },
  } as const,
});
```

**Spread Variants** (`...size`, `...space`, `...color`):

- Automatically map to token categories
- Type-safe without hardcoding every token value
- Functional variants receive `(value, { tokens, theme, props, font })`

**5. Event Props (No Pressable Needed):**

All Tamagui components have built-in press handling:

```tsx
<View
  onPress={() => console.log('pressed')}
  onLongPress={() => console.log('long press')}
  onHoverIn={() => console.log('hovered')}
  onHoverOut={() => console.log('hover out')}
  onFocus={() => console.log('focused')}
  pressStyle={{ opacity: 0.8 }}
  hoverStyle={{ backgroundColor: '$backgroundHover' }}
  focusStyle={{ outlineColor: '$blue10', outlineWidth: 2 }}
  disabled={false}
  hitSlop={10} // or { top: 10, bottom: 10, left: 5, right: 5 }
/>
```

**Event Props:**

- `onPress`, `onPressIn`, `onPressOut`, `onLongPress` - Cross-platform press events
- `onHoverIn`, `onHoverOut` - Web-only hover events
- `onFocus`, `onBlur` - Focus events
- `disabled` - Disables all interactions
- `focusable` - Controls focus (sets tabIndex on web)
- `hitSlop` - Extends pressable area
- `delayLongPress` - Long press duration (default 500ms)

**Cross-platform Pointer Events:**

```tsx
<View
  onPointerDown={e => console.log(e.clientX, e.clientY)}
  onPointerMove={e => console.log('moving')}
  onPointerUp={e => console.log('released')}
/>
```

- Unified mouse, touch, and pen input
- On native: mapped to touch events with normalized shape
- Supports `setPointerCapture(pointerId)` for drag scenarios

**Web-only Events:**

- Mouse: `onClick`, `onDoubleClick`, `onMouseEnter`, `onMouseLeave`
- Keyboard: `onKeyDown`, `onKeyUp`
- Drag & Drop: `onDrag`, `onDragStart`, `onDrop`
- Input: `onChange`, `onInput`
- Scroll: `onScroll`
- Clipboard: `onCopy`, `onCut`, `onPaste`

**6. Compound Components with createStyledContext:**

Share variant props across related components:

```tsx
import { createStyledContext, withStaticProperties } from '@tamagui/core'

const ButtonContext = createStyledContext({ size: '$medium' })

const ButtonFrame = styled(View, {
  context: ButtonContext,
  variants: {
    size: { '...size': (size, { tokens }) => ({ height: tokens.size[size] }) }
  },
})

const ButtonText = styled(Text, {
  context: ButtonContext,
  variants: {
    size: { '...fontSize': (size, { font }) => ({ fontSize: font?.size[size] }) }
  },
})

export const Button = withStaticProperties(ButtonFrame, {
  Text: ButtonText,
})

// Usage: size automatically flows to both Frame and Text
<Button size="$large">
  <Button.Text>Click me</Button.Text>
</Button>
```

**7. Special Tamagui Props:**

```tsx
// Theme prop - Apply theme contextually
<View theme="dark">
  <Text color="$color">Uses dark theme color</Text>
</View>

// themeInverse - Invert light/dark
<View themeInverse>
  <Text>Automatically inverts parent theme</Text>
</View>

// render prop - Control rendered element (web)
<View render="button" onPress={() => {}}>
  <Text>Renders as <button> on web</Text>
</View>

// asChild - Pass props to child instead of rendering wrapper
<View asChild>
  <CustomComponent /> {/* Receives all View props */}
</View>

// animation props
<View animation="quick" x={isOpen ? 0 : -100}>
  <Text>Animated content</Text>
</View>

// group prop for parent-based styling
<View group="card">
  <Text $group-card-hover={{ color: '$primary' }}>Hover card</Text>
</View>

// debug prop for development
<View debug="verbose">
  <Text>Outputs detailed style information</Text>
</View>
```

**8. Order Matters:**

Style prop order determines precedence:

```tsx
// background can be overridden by props, width is always 200
export default props => <View background="red" {...props} width={200} />;
```

### Typography Components

Create text components with Tamagui:

```tsx
import { Text, styled } from '@tamagui/core';

export const Heading = styled(Text, {
  fontSize: '$6',
  fontWeight: '700',
  color: '$color',

  variants: {
    level: {
      1: { fontSize: '$9' },
      2: { fontSize: '$7' },
      3: { fontSize: '$6' },
    },
  } as const,
});
```

### Theme Component

Change themes anywhere in your app:

```tsx
import { Theme, Button, Text } from '@tamagui/core'

// Basic theme switching
<Theme name="dark">
  <Button>I'm a dark button</Button>
</Theme>

// Sub-theme usage (automatic combination)
<Theme name="dark">
  <Button>Uses dark theme</Button>
  <Theme name="blue">
    <Button>Uses dark_blue theme</Button>
  </Theme>
</Theme>

// Theme inversion
<Theme name="light">
  <Text>Light theme</Text>
  <Theme inverse>
    <Text>Dark theme (inverted)</Text>
  </Theme>
</Theme>
```

**Theme Naming:**

- Base themes: `light`, `dark`
- Sub-themes combine automatically: `light_blue`, `dark_red`
- Access with just the sub-theme name: `<Theme name="blue">` inside `dark` becomes `dark_blue`

### FontLanguage Component

Support custom fonts per language:

```tsx
import { FontLanguage, Text } from '@tamagui/core'

// Define font variants in config (e.g., body_cn for Chinese)
const config = createTamagui({
  fonts: {
    body: createFont({ family: 'Inter, sans-serif' }),
    body_cn: createFont({ family: 'Inter-CN' }),
    body_ar: createFont({ family: 'Inter-Arabic' }),
  },
})

// Usage
<FontLanguage body="cn">
  <Text fontFamily="$body">你好</Text>
</FontLanguage>

// Reset to default
<FontLanguage body="cn">
  <Text fontFamily="$body">你好</Text>
  <FontLanguage body="default">
    <Text fontFamily="$body">Hello</Text>
  </FontLanguage>
</FontLanguage>
```

**Benefits:**

- No need to conditionally set `fontFamily` on every Text component
- Uses CSS variables on web (no re-renders on language change)
- Fully typed - suffix with `_` creates language variant
- Use any suffix name: `_cn`, `_ar`, `_ja`, etc.

### Error Boundaries

- `app/_error.tsx` - Global error boundary for all routes
- `ErrorBoundary` component exported from `app/_layout.tsx` for inline error handling
- Use Tamagui components (`View`, `Text`, etc.) for error UI

## Tamagui Animations

### Animation Drivers

Tamagui supports four animation drivers with different strengths:

| Driver           | Platform     | Bundle Impact                  | Performance                       | Spring Physics   |
| ---------------- | ------------ | ------------------------------ | --------------------------------- | ---------------- |
| **CSS**          | Web only     | Lightest                       | Fast (CSS transitions)            | No (easing only) |
| **React Native** | Web + Native | Web: heavy (RNW), Native: none | On-thread                         | Yes (basic)      |
| **Reanimated**   | Web + Native | Larger                         | Off-thread (native), medium (web) | Yes              |
| **Motion**       | Web only     | Medium                         | Off-thread (WAAPI)                | Yes              |

**Current Configuration**: Using `@tamagui/animations-react-native` for cross-platform support

**Configuration Pattern**:

```tsx
import { createAnimations } from '@tamagui/animations-react-native';
import { createTamagui } from 'tamagui';

export default createTamagui({
  animations: createAnimations({
    // Spring animations
    bouncy: { damping: 10, mass: 0.9, stiffness: 100 },
    lazy: { damping: 18, stiffness: 50 },
    quick: { damping: 20, mass: 1.2, stiffness: 250 },

    // Timing animations (for page transitions)
    '100ms': { type: 'timing', duration: 100 },
    '200ms': { type: 'timing', duration: 200 },
    '300ms': { type: 'timing', duration: 300 },
  }),
});
```

**Spring Parameters**:

- `damping` - How quickly the spring settles (higher = less bouncy)
- `mass` - Mass of the object (higher = more inertia)
- `stiffness` - Spring stiffness coefficient (higher = faster)

### Basic Animation Usage

The `transition` prop accepts animation names from your config:

```tsx
import { View, Text } from '@tamagui/core'

// Basic animation
<View
  animation="bouncy"
  hoverStyle={{ scale: 1.1 }}
  pressStyle={{ scale: 0.95 }}
>
  <Text>Animated button</Text>
</View>

// With enterStyle (mount animation)
<View
  animation="quick"
  enterStyle={{ opacity: 0, y: 20, scale: 0.9 }}
>
  <Text>Fades in on mount</Text>
</View>
```

**Important**: Always keep `transition`/`animation` prop present (use `null` to disable):

```tsx
// ✅ Correct
<View animation={isActive ? 'bouncy' : null} />

// ❌ Wrong (causes HMR errors)
<View {...isActive && { animation: 'bouncy' }} />
```

### Granular Animation Control

Animate specific properties with different configurations:

```tsx
// Per-property animations
<View
  transition={{
    x: 'bouncy',
    y: 'quick',
    opacity: { type: 'lazy', overshootClamping: true },
  }}
/>

// Default animation + overrides
<View
  transition={[
    'bouncy', // default for all properties
    { y: 'slow', scale: { type: 'fast', repeat: 2 } }
  ]}
/>

// With delay (staggered animations)
<View
  transition={['bouncy', { delay: 100 }]}
  enterStyle={{ opacity: 0, scale: 0.5 }}
/>
```

### AnimatePresence - Mount/Unmount Animations

Animate components as they mount and unmount:

```tsx
import { AnimatePresence, View, Text } from 'tamagui';

export const Modal = ({ isVisible }) => (
  <AnimatePresence>
    {isVisible && (
      <View
        key="modal"
        animation="quick"
        enterStyle={{ opacity: 0, y: 10, scale: 0.9 }}
        exitStyle={{ opacity: 0, y: -10, scale: 0.9 }}
      >
        <Text>Modal content</Text>
      </View>
    )}
  </AnimatePresence>
);
```

**AnimatePresence Props**:

- `children` - Components with unique `key` props
- `initial` - If `false`, skip enter animation on mount (default: `true`)
- `exitBeforeEnter` - Only render one child at a time (default: `false`)
- `custom` - Pass data to children's variants for dynamic animations
- `onExitComplete` - Callback when all children finish exiting

**Component Props** (inside AnimatePresence):

- `enterStyle` - Styles to animate from when mounting
- `exitStyle` - Styles to animate to when unmounting
- `animation` or `transition` - Animation configuration
- `key` - **Required** unique identifier

### Page Transitions (Enter/Exit)

Different animations for incoming vs outgoing pages:

```tsx
import { AnimatePresence, View } from 'tamagui'

export const PageTransition = ({ show, children }) => (
  <AnimatePresence>
    {show && (
      <View
        key="page"
        animation={{ enter: 'lazy', exit: 'quick' }}
        enterStyle={{ opacity: 0, x: 20 }}
        exitStyle={{ opacity: 0, x: -20 }}
        flex={1}
      >
        {children}
      </View>
    )}
  </AnimatePresence>
)

// Combined with default for property changes
<View
  animation={{ enter: 'lazy', exit: 'quick', default: 'bouncy' }}
  enterStyle={{ opacity: 0 }}
  exitStyle={{ opacity: 0 }}
/>

// With delay and per-property control
<View
  animation={[
    'bouncy',
    { enter: 'lazy', exit: 'quick', delay: 200, x: 'slow' }
  ]}
  enterStyle={{ opacity: 0, x: -100 }}
  exitStyle={{ opacity: 0, x: 100 }}
/>
```

### Dynamic Exit Animations with `custom` Prop

Change exit animation based on user interaction (e.g., swipe direction):

```tsx
import { AnimatePresence, View, styled } from 'tamagui';
import { useState } from 'react';

const Page = styled(View, {
  fullscreen: true,
  variants: {
    going: {
      ':number': going => ({
        enterStyle: {
          x: going > 0 ? 1000 : -1000,
          opacity: 0,
        },
        exitStyle: {
          x: going < 0 ? 1000 : -1000,
          opacity: 0,
        },
      }),
    },
  } as const,
});

export function Carousel() {
  const [[page, going], setPage] = useState([0, 0]);

  return (
    <AnimatePresence custom={{ going }}>
      <Page key={page} animation="quick" going={going}>
        {/* content */}
      </Page>
    </AnimatePresence>
  );
}
```

### Animation Best Practices

1. **Always keep animation prop**: Use `animation={condition ? 'bouncy' : null}` not `{...condition && { animation: 'bouncy' }}`
2. **Use enterStyle for mount animations**: Automatically animates from enterStyle to base styles
3. **Normalize base styles**: Tamagui normalizes `opacity` to 1, `scale` to 1, `y`/`x` to 0 if not defined
4. **Per-platform drivers**: Use `.native.ts` and `.ts` extensions for different drivers per platform
5. **Lazy load heavy drivers**: Start with CSS, upgrade to Motion after authentication
6. **Use AnimatePresence for mount/unmount**: Required for `exitStyle` to work
7. **Unique keys required**: Every child in AnimatePresence needs a unique `key`
8. **Combine enter/exit/default**: `animation={{ enter: 'lazy', exit: 'quick', default: 'bouncy' }}`
9. **Delay for stagger effects**: `animation={['bouncy', { delay: i * 100 }]}`
10. **HMR constraint**: Adding animation prop during HMR may error - save twice or reload

### Swapping Animation Drivers

**Per-Platform** (file extensions):

```tsx
// animations.ts (web)
import { createAnimations } from '@tamagui/animations-motion';

// animations.native.ts (native)
import { createAnimations } from '@tamagui/animations-reanimated';

// tamagui.config.ts
import { animations } from './animations';
```

**Dynamic Loading** (Configuration component):

```tsx
import { Configuration } from 'tamagui';
import { createAnimations } from '@tamagui/animations-motion';

const motionDriver = createAnimations({ bouncy: { type: 'spring' } });

export function AuthLayout() {
  return (
    <Configuration animationDriver={motionDriver}>
      <Slot />
    </Configuration>
  );
}
```

**Multiple Drivers** (animatedBy prop):

```tsx
// Config
export default createTamagui({
  animations: {
    default: createCSS({ bouncy: 'ease-in 200ms' }),
    spring: createSpring({ bouncy: { type: 'spring' } }),
  },
})

// Usage
<View animation="bouncy" />                    {/* uses default (CSS) */}
<View animatedBy="spring" animation="bouncy" /> {/* uses spring */}
```

## Tamagui Hooks

### useMedia Hook

Access current media query state for responsive layouts:

```tsx
import { View, Text, useMedia } from '@tamagui/core';

export default () => {
  const media = useMedia();

  return (
    <View
      // Ternary usage
      backgroundColor={media.sm ? 'red' : 'blue'}
      // Spread usage
      {...(media.lg && {
        x: 10,
        y: 10,
      })}
    >
      <Text>Responsive content</Text>
    </View>
  );
};
```

**Key Features:**

- **Compiler-optimized**: Extracts to CSS when possible, removes hook entirely on web
- **Granular updates**: Only re-renders when accessed keys change
- **Type-safe**: Fully typed based on your media queries in config
- **Works with inline props**: Use `$gtSm`, `$md`, etc. for declarative responsive styles

**Configuration** (in `src/tamagui/tamagui.config.ts`):

```tsx
export default createTamagui({
  media: {
    xs: { maxWidth: 660 },
    sm: { maxWidth: 860 },
    md: { maxWidth: 980 },
    lg: { maxWidth: 1120 },
    xl: { maxWidth: 1280 },
    xxl: { maxWidth: 1536 },
    gtXs: { minWidth: 661 },
    gtSm: { minWidth: 861 },
    gtMd: { minWidth: 981 },
    gtLg: { minWidth: 1121 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  },
});
```

**Usage Patterns:**

```tsx
// Inline prop style (preferred - compiler extracts to CSS)
<View
  backgroundColor="red"
  $gtSm={{ backgroundColor: 'blue' }}
  $gtMd={{ backgroundColor: 'green' }}
/>;

// Hook style (for logic/conditional rendering)
const media = useMedia();
if (!media.gtSm) return <MobileView />;
return <DesktopView />;
```

**Limitations:**

- Not iterable - can't use `Object.keys()` or `in` operator
- Use `const media = useMedia()` then `media.sm` (avoid destructuring with renaming)

### useTheme Hook

Access current theme values in context:

```tsx
import { View, Text, useTheme } from '@tamagui/core';

export default () => {
  const theme = useTheme();

  return (
    <View backgroundColor={theme.background.val}>
      <Text color={theme.color.val}>Themed text</Text>
    </View>
  );
};
```

**Theme Value Structure:**

```tsx
{
  background: {
    val: '#000',           // Raw value
    variable: 'var(--background)',  // CSS variable (web)
    name: 'background',
    isVar: true,
  },
  color: {
    val: '#fff',
    variable: 'var(--color)',
    name: 'color',
    isVar: true,
  },
}
```

**Performance Optimization with `.get()`:**

```tsx
const theme = useTheme();

// Optimized - returns CSS variable on web (no re-render), raw value on native
const background = theme.background.get();

// Always returns raw value (will re-render on change)
const backgroundValue = theme.background.val;

// Force web-style (CSS variable) even on native
const webStyle = theme.background.get('web');
```

**Benefits of `.get()`:**

- **Web**: Returns CSS variable, avoids re-renders (CSS handles updates)
- **Native**: Returns raw value, re-renders on change
- **iOS with fastSchemeChange**: Returns DynamicColorIOS, avoids re-renders

**Using with External Components:**

```tsx
import { useTheme } from '@tamagui/core';
import { SomeExternalComponent } from 'some-library';

const App = () => {
  const theme = useTheme();

  return (
    <SomeExternalComponent
      style={{
        backgroundColor: theme.background.get(),
        color: theme.color.get(),
      }}
    />
  );
};
```

**Advanced: Changing Theme at Hook Level:**

```tsx
function MyComponent(props) {
  // Gets specific sub-theme based on context
  const theme = useTheme(props.theme, 'MyComponent');

  // If parent is <Theme name="dark"> and props.theme="green"
  // This returns: dark_green_MyComponent theme
}
```

**Combining useMedia + useTheme:**

```tsx
import { View, useMedia, useTheme } from '@tamagui/core';

const App = () => {
  const theme = useTheme();
  const media = useMedia();

  return (
    <View
      y={media.sm ? 10 : 0}
      backgroundColor={media.lg ? theme.red.get() : theme.blue.get()}
      {...(media.xl && {
        y: theme.space2.val,
      })}
    />
  );
};
```

**This compiles to optimized CSS on web!** The compiler extracts the logic into media queries and CSS variables.

## Configuration Files

- `app.json` - Expo config with new arch enabled, typed routes experiment, React Compiler
- `tsconfig.json` -TypeScript config with path aliases (`@/server/*`, `@/database/*`, `@/features/*`, `@/interface/*`, `@/tamagui/*`)
- `babel.config.js` - Babel config with `@tamagui/babel-plugin` for optimizations
- `metro.config.js` - Metro bundler config with `.mjs` support and resolverMainFields
- `eslint.config.js` - Flat config format (ESLint 9+)
- `src/tamagui/tamagui.config.ts` - Tamagui configuration with themes, tokens, and settings

## Import Conventions (Feature-based Architecture)

````
expo-crm-app/
├── app/                     # Expo Router routes (file-based navigation)
│   ├── _layout.tsx          # Root layout with TamaguiProvider, Theme, Stack
│   ├── _error.tsx           # Global error boundary fallback
│   ├── +not-found.tsx       # 404 page
│   ├── splash.tsx           # Splash screen
│   ├── welcome.tsx          # Welcome/landing page
│   ├── (auth)/              # Auth routes
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   └── forgot-password.tsx
│   ├── (crm)/               # CRM routes
│   │   ├── contacts/
│   │   ├── leads/
│   │   └── users/
│   ├── (dashboards)/        # Dashboard routes
│   │   ├── admin.tsx
│   │   ├── sales.tsx
│   │   └── users.tsx
│   ├── (tabs)/              # Tab navigator
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── settings.tsx
│   └── (modals)/            # Modal routes
│       └── user-profile.tsx
├── src/
│   ├── server/              # Backend/API layer
│   │   └── supabase.ts      # Supabase client configuration
│   ├── database/            # Database layer
│   │   ├── types.ts         # TypeScript types for all tables
│   │   └── migrations/      # SQL migration files
│   ├── features/            # Feature modules (domain-driven)
│   │   ├── auth/            # Authentication feature
│   │   │   ├── auth-store.ts         # Zustand store
│   │   │   └── components/           # Auth-specific components
│   │   │       ├── sign-in-form.tsx
│   │   │       └── sign-up-form.tsx
│   │   ├── theme/           # Theme feature
│   │   │   └── font-store.ts
│   │   └── dashboard/       # Dashboard feature
│   │       └── components/
│   ├── interface/           # UI layer
│   │   ├── components/      # Shared UI components
│   │   │   ├── card.tsx
│   │   │   └── header.tsx
│   │   └── primitives/      # Base UI primitives (migrated from rn-primitives)
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       └── dialog.tsx
│   ├── tamagui/             # Tamagui configuration
│   │   └── tamagui.config.ts
### Before Making Changes

1. **Read this file completely** before making any code changes
2. **Plan first**: Write a brief step-by-step plan before coding
3. **Check existing patterns**: Review similar components/features before creating new ones

### Code Standards

1. **TypeScript**: Use strict mode, define proper types, avoid `any`
2. **Formatting**: Follow Prettier and ESLint rules; keep consistent with the repo
3. **Comments**: Add brief comments per function and logical section explaining the purpose
4. **Imports**: Use path aliases (`@/server/*`, `@/features/*`, `@/interface/*`, etc.)

### Tamagui Component Guidelines

1. **Use styled() for reusable components**:
   ```tsx
   const Card = styled(View, {
     backgroundColor: '$card',
     variants: { /* ... */ },
   })
````

2. **Use variants for configurable styling**:

   ```tsx
   variants: {
     size: {
       small: { padding: '$2' },
       large: { padding: '$6' },
     },
   } as const
   ```

3. **Always use `as const`** on variants definition for proper TypeScript inference

4. **Access theme values** with `$` prefix: `$background`, `$primary`, `$borderColor`

5. **Use pseudo-states** for interactions: `hoverStyle`, `pressStyle`, `focusStyle`, `disabledStyle`

6. **Use createStyledContext** for compound components that share variants

7. **Use event props directly** on View/Text (no Pressable wrapper needed): `onPress`, `onHoverIn`, `onFocus`

8. **Use Theme component** for contextual theme switching: `<Theme name="dark">...</Theme>`

9. **Use FontLanguage** for multi-language font support: `<FontLanguage body="cn">...</FontLanguage>`

10. **Prefer inline style props** for one-off styling instead of StyleSheet.create

11. **Use useMedia hook** for responsive logic:
    - Prefer inline `$gtSm` style props for compiler optimization
    - Use `const media = useMedia()` for conditional rendering
    - Access keys directly: `media.sm`, `media.lg` (don't destructure with rename)

12. **Use useTheme hook** to access theme values:
    - Use `.get()` for performance (CSS variables on web, raw values on native)
    - Use `.val` when you need raw value always
    - Combine with useMedia for responsive + themed components

13. **Use special props** when needed: `asChild`, `theme`, `themeInverse`, `render`, `debug`
14. **Use animations** for smooth interactions:
    - Always keep `animation` prop present (use `null` to disable)
    - Use `enterStyle` for mount animations
    - Use `AnimatePresence` with `exitStyle` for unmount animations
    - Use `animation={{ enter: 'lazy', exit: 'quick' }}` for page transitions
    - Use `custom` prop for dynamic exit animations based on user interaction

### State Management Rules

1. **Zustand for global state**: Create feature-specific stores in `src/features/*/`
2. **Local state**: Use React hooks (`useState`, `useReducer`) for component-level state
3. **Avoid React Context**: Do not use React Context for shared data (use Zustand)
4. **Supabase for backend**: All data operations use `src/server/supabase.ts`
5. **Type safety**: Always import database types from `src/database/types.ts`

### File Organization Rules

1. **Feature-based structure**: Group related code by feature/domain, not by file type
2. **Colocation**: Keep components, stores, and types close to where they're used
3. **Shared code**: Place truly shared utilities in `src/interface/` or `src/lib/`
4. **Platform-specific**: Use `.ios.tsx`, `.android.tsx`, `.web.tsx` for platform variants

### Migration Status (DO NOT USE)

- ❌ NativeWind/Tailwind CSS (removed - use Tamagui)
- ❌ `StyleSheet.create` (prefer Tamagui styled)
- ❌ `@rn-primitives/*` (migrating to Tamagui primitives)
- ❌ Old path aliases (`@/components`, `@/store`, `@/types`)

### Auto-update Instructions

**When creating new patterns, immediately update this file** to reflect:

- New folder structures
- New component patterns
- New routing conventions
- New state management approaches
- New styling patterns
  ├── assets/ # Static assets
  │ ├── fonts/
  │ └── images/
  ├── docs/ # Documentation
  │ ├── TAMAGUI-MIGRATION-PLAN.md
  │ ├── TAMAGUI-V5-NOTES.md
  │ └── DATABASE-SCHEMA.md
  ├── .github/
  │ └── copilot-instructions.md
  ├── .env # Environment variables (gitignored)
  ├── .env.example # Environment template
  ├── app.json # Expo configuration
  ├── babel.config.js # Babel with Tamagui plugin
  ├── metro.config.js # Metro bundler config
  ├── tsconfig.json # TypeScript config with path aliases
  └── package.json

````

### Path Alias Mapping

Configure in `tsconfig.json` and `babel.config.js`:

```json
{
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
- `react-native-reanimated` 4.1 for animations
- `react-native-gesture-handler` for gestures
- `react-native-worklets` for JS worklets

### Process Environment

Check platform with `process.env.EXPO_OS` (e.g., `'ios'`, `'android'`, `'web'`)

## Configuration Files

- `app.json` - Expo config with new arch enabled, typed routes experiment, React Compiler
- `babel.config.js` - Babel config with `@tamagui/babel-plugin` for optimizations
- `metro.config.js` - Metro bundler config with `.mjs` support and resolverMainFields
- `tsconfig.json` - TypeScript config with path aliases (`@/server/*`, `@/database/*`, `@/features/*`, `@/interface/*`, `@/tamagui/*`)
- `eslint.config.js` - Flat config format (ESLint 9+)
- `src/tamagui/tamagui.config.ts` - Tamagui configuration with themes, tokens, and settings
- `src/tamagui/animations.ts` - Web animations (Motion driver)
- `src/tamagui/animations.native.ts` - Native animations (Reanimated driver)

## Directory Structure

````

expo-crm-app/
├── app/ # 📱 Expo Router - File-based navigation
│ │
│ ├── \_layout.tsx # Root layout (TamaguiProvider, Theme, Stack navigator)
│ ├── \_error.tsx # Global error boundary fallback
│ ├── +not-found.tsx # 404 error page
│ ├── splash.tsx # Initial splash screen
│ ├── welcome.tsx # Welcome/onboarding screen
│ ├── modal.tsx # Generic modal route
│ ├── policy.tsx # Privacy policy
│ ├── terms.tsx # Terms of service
│ │
│ ├── (auth)/ # 🔐 Authentication routes
│ │ ├── sign-in.tsx # Login screen
│ │ ├── sign-up.tsx # Registration screen
│ │ ├── forgot-password.tsx # Password recovery
│ │ ├── reset-password.tsx # Password reset form
│ │ └── sign-up/
│ │ └── verify-email.tsx # Email verification step
│ │
│ ├── (crm)/ # 💼 CRM - Sales Pipeline
│ │ │ # NOTE: Sales entities & customer management
│ │ ├── \_layout.tsx # CRM area layout
│ │ ├── [id].tsx # Generic entity detail
│ │ ├── add.tsx # Quick add entity
│ │ │
│ │ ├── contacts/ # 👤 Individual people/contacts
│ │ │ ├── [id].tsx # Contact detail view
│ │ │ ├── add.tsx # Add new contact
│ │ │ └── index.tsx # Contact list
│ │ │
│ │ ├── leads/ # 🎯 Potential customers (early stage)
│ │ │ ├── [id].tsx # Lead detail view
│ │ │ ├── add.tsx # Add new lead
│ │ │ └── index.tsx # Lead list
│ │ │
│ │ ├── opportunities/ # 💰 Active sales opportunities
│ │ │ ├── [id].tsx # Opportunity detail view
│ │ │ ├── add.tsx # Add new opportunity
│ │ │ └── index.tsx # Opportunity pipeline
│ │ │
│ │ ├── accounts/ # 🏢 Companies/organizations
│ │ │ ├── [id].tsx # Account detail view
│ │ │ ├── add.tsx # Add new account
│ │ │ └── index.tsx # Account list
│ │ │
│ │ └── deals/ # ✅ Closed/won opportunities
│ │ ├── [id].tsx # Deal detail view
│ │ ├── add.tsx # Add new deal
│ │ └── index.tsx # Deal history
│ │
│ ├── (operations)/ # 🏗️ Work Operations
│ │ │ # NOTE: Job management & task tracking
│ │ ├── \_layout.tsx # Operations layout
│ │ │
│ │ ├── jobs/ # 📋 Job orders/service jobs
│ │ │ ├── [id].tsx # Job detail view
│ │ │ ├── add.tsx # Create new job
│ │ │ └── index.tsx # Job list
│ │ │
│ │ ├── tasks/ # ✓ Task management
│ │ │ ├── [id].tsx # Task detail view
│ │ │ ├── add.tsx # Create new task
│ │ │ └── index.tsx # Task board
│ │ │
│ │ └── schedules/ # 📅 Calendar/scheduling
│ │ ├── [id].tsx # Schedule detail
│ │ └── index.tsx # Calendar view
│ │
│ ├── (dashboards)/ # 📊 Analytics & Reporting
│ │ │ # NOTE: Data visualization & insights
│ │ ├── \_layout.tsx # Dashboard layout
│ │ ├── index.tsx # Overview dashboard (main)
│ │ ├── sales.tsx # Sales analytics & metrics
│ │ ├── operations.tsx # Operations KPIs
│ │ ├── team.tsx # Team performance analytics
│ │ └── admin.tsx # Admin dashboard
│ │
│ ├── (tabs)/ # 🔹 Bottom Tab Navigation
│ │ │ # NOTE: Primary app navigation
│ │ ├── \_layout.tsx # Tab bar configuration
│ │ ├── index.tsx # Home tab (dashboard overview)
│ │ ├── contacts.tsx # Quick contacts access
│ │ ├── opportunities.tsx # Opportunities pipeline
│ │ ├── jobs.tsx # Active jobs
│ │ ├── tasks.tsx # Task list
│ │ ├── notifications.tsx # Notification center
│ │ ├── camera.tsx # Camera/scanner access
│ │ └── settings.tsx # App settings
│ │
│ ├── (modals)/ # 🔲 Modal Screens
│ │ │ # NOTE: Overlays & full-screen modals
│ │ ├── user-profile.tsx # User profile editor
│ │ ├── camera-capture.tsx # Photo capture (business cards, products)
│ │ ├── document-scan.tsx # Document scanner (receipts, contracts)
│ │ ├── notification-detail.tsx # Notification detail view
│ │ ├── quick-add.tsx # Quick entity creation
│ │ └── filters.tsx # Advanced filter modal
│ │
│ └── (notifications)/ # 🔔 Notification System
│ │ # NOTE: Full notification management
│ ├── \_layout.tsx # Notifications layout
│ ├── index.tsx # All notifications
│ ├── unread.tsx # Unread only
│ ├── mentions.tsx # @mentions & direct
│ └── settings.tsx # Notification preferences
│
├── src/ # 📦 Source Code
│ │
│ ├── server/ # 🌐 Backend/API Layer
│ │ └── supabase.ts # Supabase client configuration
│ │
│ ├── database/ # 💾 Database Layer
│ │ ├── types.ts # TypeScript types for all tables
│ │ └── migrations/ # SQL migration files
│ │
│ ├── features/ # 🎯 Feature Modules (Domain-Driven)
│ │ │ # NOTE: Feature-based architecture
│ │ │
│ │ ├── auth/ # 🔐 Authentication feature
│ │ │ ├── auth-store.ts # Zustand auth state
│ │ │ ├── hooks/ # Auth-specific hooks
│ │ │ ├── utils/ # Auth utilities
│ │ │ └── components/ # Auth UI components
│ │ │ ├── sign-in-form.tsx
│ │ │ ├── sign-up-form.tsx
│ │ │ ├── forgot-password-form.tsx
│ │ │ └── social-connections.tsx
│ │ │
│ │ ├── sales/ # 💼 CRM/Sales feature
│ │ │ ├── crm-store.ts # CRM state management
│ │ │ ├── hooks/ # CRM-specific hooks
│ │ │ └── components/ # CRM UI components
│ │ │ ├── contact-card.tsx
│ │ │ ├── lead-card.tsx
│ │ │ ├── opportunity-card.tsx
│ │ │ └── pipeline-board.tsx
│ │ │
│ │ ├── operations/ # 🏗️ Operations feature
│ │ │ ├── operations-store.ts # Operations state
│ │ │ └── components/ # Operations UI components
│ │ │ ├── job-card.tsx
│ │ │ ├── task-card.tsx
│ │ │ └── schedule-view.tsx
│ │ │
│ │ ├── notifications/ # 🔔 Notifications feature
│ │ │ ├── notifications-store.ts # Notification state
│ │ │ ├── hooks/ # Notification hooks
│ │ │ └── components/ # Notification UI
│ │ │ ├── notification-item.tsx
│ │ │ ├── notification-badge.tsx
│ │ │ └── notification-settings.tsx
│ │ │
│ │ ├── camera/ # 📷 Camera feature
│ │ │ ├── camera-store.ts # Camera state
│ │ │ └── components/ # Camera UI components
│ │ │ ├── camera-view.tsx
│ │ │ ├── document-scanner.tsx
│ │ │ └── image-preview.tsx
│ │ │
│ │ ├── dashboard/ # 📊 Dashboard feature
│ │ │ ├── dashboard-store.ts # Dashboard state
│ │ │ └── components/ # Dashboard components
│ │ │ ├── stat-card.tsx
│ │ │ ├── chart-card.tsx
│ │ │ └── metric-widget.tsx
│ │ │
│ │ └── theme/ # 🎨 Theme feature
│ │ └── font-store.ts # Font preferences
│ │
│ ├── interface/ # 🎨 UI Layer
│ │ │ # NOTE: Reusable UI components
│ │ │
│ │ ├── components/ # Shared UI components
│ │ │ ├── card.tsx # Generic card
│ │ │ ├── header.tsx # Page header
│ │ │ ├── empty-state.tsx # Empty state placeholder
│ │ │ ├── loading-spinner.tsx # Loading indicator
│ │ │ ├── error-boundary.tsx # Error fallback
│ │ │ ├── image-gallery.tsx # Animated image gallery
│ │ │ └── animated-modal.tsx # Modal with animations
│ │ │
│ │ └── primitives/ # Base UI primitives
│ │ │ # NOTE: Tamagui-based primitives (24 total)
│ │ ├── button.tsx # Button component
│ │ ├── input.tsx # Text input
│ │ ├── dialog.tsx # Dialog/modal
│ │ ├── dropdown.tsx # Dropdown menu
│ │ ├── select.tsx # Select picker
│ │ ├── checkbox.tsx # Checkbox
│ │ ├── switch.tsx # Toggle switch
│ │ ├── radio.tsx # Radio button
│ │ ├── slider.tsx # Slider
│ │ ├── tabs.tsx # Tab component
│ │ ├── accordion.tsx # Accordion
│ │ ├── badge.tsx # Badge/chip
│ │ ├── avatar.tsx # Avatar/profile pic
│ │ ├── card.tsx # Card primitive
│ │ ├── alert.tsx # Alert/notification
│ │ ├── toast.tsx # Toast notification
│ │ ├── tooltip.tsx # Tooltip
│ │ ├── popover.tsx # Popover
│ │ ├── sheet.tsx # Bottom sheet
│ │ ├── progress.tsx # Progress bar
│ │ ├── skeleton.tsx # Skeleton loader
│ │ ├── separator.tsx # Divider/separator
│ │ ├── label.tsx # Form label
│ │ └── textarea.tsx # Multi-line input
│ │
│ ├── tamagui/ # 🎨 Tamagui Configuration
│ │ ├── tamagui.config.ts # Main Tamagui config (themes, tokens, fonts)
│ │ ├── animations.ts # Web animations (Motion driver)
│ │ └── animations.native.ts # Native animations (Reanimated driver)
│ ├── hooks/ # Custom React hooks
│ │ ├── use-color-scheme.ts
│ │ ├── use-theme-color.ts
│ │ └── use-font.ts
│ ├── constants/ # App constants
│ │ └── theme.ts
│ └── lib/ # Utilities
│ ├── utils.ts
│ └── shadow-styles.ts
├── assets/ # Static assets
│ ├── fonts/
│ └── images/
├── docs/ # Documentation
│ ├── EXPO-GUIDE.md # Complete Expo + Tamagui setup guide
│ ├── ANIMATIONS-INDEX.md # Animation system master index
│ ├── ANIMATIONS-GUIDE.md # Complete animation guide
│ ├── ANIMATION-QUICK-REFERENCE.md
│ ├── ANIMATION-DRIVERS-SETUP.md
│ ├── ANIMATION-DRIVERS-INSTALLATION.md
│ ├── ANIMATION-IMPLEMENTATION-SUMMARY.md
│ ├── DATABASE-SCHEMA.md
│ ├── AUTHENTICATION-IMPLEMENTATION.md
│ ├── ROUTE-STRUCTURE.md
│ ├── TAMAGUI-MIGRATION-PLAN.md
│ ├── TAMAGUI-V5-NOTES.md
│ └── TOOLS-SETUP.md
├── .github/
│ └── copilot-instructions.md
├── .env # Environment variables (gitignored)
├── .env.example # Environment template
├── app.json # Expo configuration
├── babel.config.js # Babel with Tamagui plugin
├── metro.config.js # Metro bundler config
├── tsconfig.json # TypeScript config with path aliases
└── package.json # Dependencies & scripts

````

## Agent Operating Rules

### Before Making Changes

1. **Read this file completely** before making any code changes
2. **Read relevant documentation** before implementing:
   - **Animation features**: Read `docs/ANIMATIONS-INDEX.md` and linked animation guides
   - **Expo setup**: Read `docs/EXPO-GUIDE.md` for Tamagui + Expo patterns
   - **Database operations**: Read `docs/DATABASE-SCHEMA.md` for schema reference
   - **Authentication**: Read `docs/AUTHENTICATION-IMPLEMENTATION.md` for auth patterns
   - **Route structure**: Read `docs/ROUTE-STRUCTURE.md` for navigation patterns
   - **UI Components**: Check official Tamagui UI docs at https://tamagui.dev/ui/* for component APIs
3. **Plan first**: Write a brief step-by-step plan before coding
4. **Check existing patterns**: Review similar components/features before creating new ones

### Tamagui Official UI Components

**All packages are already installed in the `tamagui` package.** Always use official Tamagui UI components from `@tamagui/*` packages instead of custom implementations:

**Layout Components:**
- **XStack, YStack, ZStack** (`@tamagui/stacks`): Flex-based layouts (flex-row, flex-col, stacked)
  - `gap` prop for spacing between elements
  - `elevation` prop for natural shadows
  - All extend View with full [Tamagui Props](https://tamagui.dev/docs/intro/props)
  - Media queries: `$gtSm`, `$md`, etc.
  - Pseudo-states: `hoverStyle`, `pressStyle`, `focusStyle`

**Typography Components:**
- **Headings** (`@tamagui/text`): H1, H2, H3, H4, H5, H6, and base Heading component
  - All extend from base `Heading` which extends `Paragraph` → `SizableText` → `Text`
  - Props: `size` prop (uses font.size tokens 1-10 from config)
  - Default font family: `$heading` (must be defined in tamagui.config.ts)
  - Accessibility: `accessibilityRole: 'header'` automatically applied
  - Fully themeable with all [Tamagui Props](https://tamagui.dev/docs/intro/props)
  - Size variant automatically maps fontSize, lineHeight, fontWeight, letterSpacing from font config
  - Example: `<H1>Title</H1>`, `<H2>Subtitle</H2>`, `<Heading size="$8">Custom</Heading>`

**Form Components:**
- **Button** (`@tamagui/button`):
  - Props: `size`, `variant="outlined"`, `icon`, `iconAfter`, `circular`, `chromeless`, `unstyled`
  - Web form props: `type`, `formAction`, `formMethod`, `formEncType`, `formNoValidate`, `formTarget`
  - Icon theming: automatic size/color from theme, `iconSize`, `scaleIcon`
  - Group theming: `Button.Apply` for shared context

- **Checkbox** (`@tamagui/checkbox`):
  - Pattern: `<Checkbox><Checkbox.Indicator /></Checkbox>`
  - Props: `checked`, `defaultChecked`, `onCheckedChange`, `indeterminate`, `native`, `size`
  - Styling: `activeStyle`, `activeTheme`, `scaleIcon`, `scaleSize`

- **Input/TextArea** (`@tamagui/input`, `@tamagui/text-area`):
  - Wrappers around React Native TextInput with full style props
  - Props: `size`, all standard TextInput props
  - Cross-platform styling with theme tokens

- **Label** (`@tamagui/label`):
  - Props: `htmlFor` (required), `unstyled`
  - ARIA support: `aria-required`, `aria-invalid`, `aria-disabled`, `aria-describedby`, `aria-labelledby`
  - Extends SizableText
  - Hook: `useLabelContext()` for custom controls

- **RadioGroup** (`@tamagui/radio-group`):
  - Pattern: `<RadioGroup><RadioGroup.Item><RadioGroup.Indicator /></RadioGroup.Item></RadioGroup>`
  - Props: `value`, `defaultValue`, `onValueChange`, `orientation`, `disabled`, `native`, `accentColor`
  - Item props: `value`, `disabled`, `scaleSize`, `unstyled`

- **Switch** (`@tamagui/switch`):
  - Pattern: `<Switch><Switch.Thumb /></Switch>`
  - Props: `checked`, `defaultChecked`, `onCheckedChange`, `native`, `nativeProps`
  - Styling: `activeStyle`, `activeTheme`, `unstyled`
  - Thumb: separate styling with `activeStyle`

**Selection Components:**
- **Select** (`@tamagui/select`):
  - Complex pattern: `Trigger`, `Value`, `Content`, `Viewport`, `ScrollUpButton/DownButton`, `Group`, `Label`, `Item`, `ItemText`, `Indicator`, `FocusScope`
  - Props: `value`, `defaultValue`, `onValueChange`, `open`, `defaultOpen`, `onOpenChange`, `native`, `renderValue`
  - Native adaptation: Use `<Adapt when="maxMd"><Select.Sheet>` for mobile
  - Animated indicator: `<Select.Indicator transition="quick" />` for smooth highlighting

- **Slider** (`@tamagui/slider`):
  - Pattern: `<Slider><Slider.Track><Slider.TrackActive /></Slider.Track><Slider.Thumb index={0} /></Slider>`
  - Props: `value`, `defaultValue`, `onValueChange`, `min`, `max`, `step`, `orientation`, `disabled`
  - Multiple thumbs: Use `index` prop on each `Thumb`
  - iOS vertical: Requires `insets` on `TamaguiProvider` from `useSafeAreaInsets()`

- **ToggleGroup** (`@tamagui/toggle-group`):
  - Pattern: `<ToggleGroup><XGroup><XGroup.Item><ToggleGroup.Item /></XGroup.Item></XGroup></ToggleGroup>`
  - Props: `type="single" | "multiple"`, `value`, `defaultValue`, `onValueChange`, `orientation`, `loop`, `disableDeactivation`
  - Item styling: `activeStyle`, `activeTheme`
  - Hook: `useToggleGroupItem()` for custom components
  - Visual grouping: Compose with `XGroup`/`YGroup` for borders

**Display Components:**
- **Progress** (`@tamagui/progress`):
  - Pattern: `<Progress><Progress.Indicator /></Progress>`
  - Props: `value`, `max`, `size`, `unstyled`
  - Indicator: Animatable with `transition` prop

**Menu Components:**
- **Menu** (`@tamagui/menu`):
  - Complex pattern: `Trigger`, `Portal`, `Content`, `Item`, `ItemTitle`, `ItemIcon`, `ItemImage`, `ItemSubtitle`, `Separator`, `Arrow`, `Sub`, `SubTrigger`, `SubContent`, `CheckboxItem`, `ItemIndicator`, `Group`, `Label`
  - Props: `placement`, `open`, `defaultOpen`, `onOpenChange`, `modal`, `stayInFrame`, `allowFlip`, `offset`
  - Item props: `key`, `disabled`, `destructive`, `hidden`, `onSelect`, `textValue`
  - Native menus: Use `native` prop (requires `zeego`, `@react-native-menu/menu`, `react-native-ios-context-menu`, `react-native-ios-utilities`)
  - Native icons: iOS SF Symbols via `ios` prop, Android drawable via `android` prop
  - Styling: Use `focusStyle` for highlights, not `hoverStyle` (prevents double-highlighting)

- **ContextMenu** (`@tamagui/context-menu`):
  - Same pattern as Menu with right-click/long-press trigger
  - Trigger props: `action="press" | "longPress"` (default: `longPress`)
  - iOS-only: `Preview` component for custom preview when menu is visible
  - Preview props: `size`, `onPress`, `backgroundColor`, `borderRadius`, `preferredCommitStyle`
  - All Menu features: submenus, checkboxes, radio items, native support, SF Symbols

**Overlay Components:**
- **Popover** (`@tamagui/popover`):
  - Pattern: `<Popover><Popover.Trigger /><Popover.Content><Popover.Arrow /></Popover.Content></Popover>`
  - Props: `open`, `defaultOpen`, `onOpenChange`, `placement` (12 positions), `size`, `keepChildrenMounted`, `stayInFrame`, `allowFlip`, `offset`, `hoverable`, `resize`
  - Content props: `animatePosition`, `transformOrigin`, `trapFocus`, `disableFocusScope`, `onOpenAutoFocus`, `onCloseAutoFocus`, `lazyMount`
  - FocusScope: `<Popover.FocusScope loop trapped focusOnIdle={true}>` for focus management
  - Anchor: Use `<Popover.Anchor />` when trigger location differs from attach point
  - Adapt: Use `<Adapt when="maxMd"><Sheet>` for mobile sheet rendering
  - Scoping: Mount Popover at root with `scope` prop, attach Trigger anywhere with matching scope
  - ScrollView: `<Popover.ScrollView>` for scrollable content (automatically removed when adapted to Sheet)

- **Dialog** (`@tamagui/dialog`):
  - Pattern: `<Dialog><Dialog.Trigger /><Dialog.Portal><Dialog.Overlay /><Dialog.Content><Dialog.Title /><Dialog.Description /><Dialog.Close /></Dialog.Content></Dialog.Portal></Dialog>`
  - Props: `open`, `defaultOpen`, `onOpenChange`, `modal` (default: `true`), `disableRemoveScroll`, `size`
  - Content props: `forceMount`, `unstyled`, `disableOutsidePointerEvents` (default: `true` in v1 for modal)
  - Title/Description: **Required** (can wrap in `VisuallyHidden` to hide). Title defaults to H2, Description to Paragraph
  - Close: Accepts YStack props, recommended with `asChild` for custom buttons. `displayWhenAdapted` prop controls visibility in adapted mode
  - Dismissal: By default dismisses on overlay click, Escape key, or Close element. Prevent with `onPointerDownOutside={(e) => e.preventDefault()}`
  - Modal vs Non-Modal: Modal (default) prevents outside interaction, traps focus. Non-modal allows outside interaction
  - FocusScope: `<Dialog.FocusScope loop trapped focusOnIdle={true}>` for custom focus management
  - Adapt: Use `<Dialog.Adapt when="maxMd"><Dialog.Sheet>` for mobile sheet (doesn't preserve state on transition yet)
  - Scoping: Mount Dialog at root with `scope` prop for performance, attach Trigger with matching scope
  - Native modals: Wrap screen in `<PortalProvider>` when using with react-navigation

- **AlertDialog** (`@tamagui/alert-dialog`):
  - Pattern: `<AlertDialog><AlertDialog.Trigger /><AlertDialog.Portal><AlertDialog.Overlay /><AlertDialog.Content><AlertDialog.Title /><AlertDialog.Description /><AlertDialog.Cancel /><AlertDialog.Action /></AlertDialog.Content></AlertDialog.Portal></AlertDialog>`
  - Shares all Dialog props except `modal` (always `true`)
  - Native: `native` prop renders as native iOS AlertDialog
  - Action buttons: `Cancel`, `Action` (confirms), `Destructive` (renders red on iOS native)
  - All action buttons accept `displayWhenAdapted` prop
  - Title/Description: **Required** (can wrap in VisuallyHidden)
  - Example: `<AlertDialog.Destructive asChild><Button theme="red">Delete</Button></AlertDialog.Destructive>`

- **Sheet** (`@tamagui/sheet`):
  - Pattern: `<Sheet><Sheet.Overlay /><Sheet.Handle /><Sheet.Frame><Sheet.ScrollView>{/* content */}</Sheet.ScrollView></Sheet.Frame></Sheet>`
  - Props: `open`, `defaultOpen`, `onOpenChange`, `position` (controlled snap point index), `defaultPosition`, `snapPoints` (default: `[80, 10]`), `dismissOnOverlayPress` (default: `true`), `dismissOnSnapToBottom`, `modal`, `disableDrag`, `moveOnKeyboardChange` (native-only)
  - Snap points: Array of numbers 0-100 (% of screen height), most visible to least visible
  - Animation: `animationConfig` prop for Animated.spring() customization
  - Native: `native="ios"` for iOS native sheet (requires native dependency)
  - Handle: `<Sheet.Handle />` shows draggable handle, cycles through snapPoints on tap (override with `onPress`)
  - ScrollView: `<Sheet.ScrollView />` for scrollable content with proper gesture coordination
  - Gesture Handler: Optional `react-native-gesture-handler` integration for smooth scroll-to-drag handoffs
    - Setup: `import '@tamagui/native/setup-gesture-handler'` + wrap app in `GestureHandlerRootView`
    - Benefits: Seamless scroll/drag transitions, no gesture conflicts, native-quality feel
  - RemoveScroll: `disableRemoveScroll` prop to prevent body scroll blocking (enabled by default when modal)
  - Context: On Android with `modal`, must manually re-propagate React context (RN limitation)

- **Tooltip** (`@tamagui/tooltip`):
  - Pattern: `<Tooltip><Tooltip.Trigger /><Tooltip.Content><Tooltip.Arrow /></Tooltip.Content></Tooltip>`
  - Props: `open`, `defaultOpen`, `onOpenChange`, `restMs` (hover delay), `delay` (max show time), `groupId`, `placement`, `size`, `modal`, `stayInFrame`, `allowFlip`, `offset`
  - Delay: Can be number or `{ open?: number, close?: number }`
  - Anchor: Use `<Tooltip.Anchor />` when trigger location differs from attach point
  - TooltipGroup: `<TooltipGroup delay={200}>` for smart sequential tooltips (shows immediately when hovering between grouped tooltips)
  - Group props: `delay`, `timeoutMs`, `preventAnimation` (disables enter/exit animations while group active)
  - closeOpenTooltips: Helper function `() => void` to close any open tooltips
  - Scoping: Mount Tooltip at root with `scope` prop for performance, attach Trigger anywhere with matching scope
  - Native: Does **not** render on native platforms (web only, accessibility-only on native)

- **Toast** (`@tamagui/toast`):
  - **NOT included in `tamagui` package** - must install separately: `yarn add @tamagui/toast burnt`
  - Pattern: `<ToastProvider><Toast><Toast.Title /><Toast.Description /><Toast.Action /><Toast.Close /></Toast></ToastProvider>`
  - Provider props: `label`, `duration` (default: 5000ms), `swipeDirection` (default: `right`), `swipeThreshold` (default: 50px), `native`, `burntOptions`, `notificationOptions`
  - Toast props: `type` (foreground/background), `duration`, `defaultOpen`, `open`, `onOpenChange`, `viewportName`, `unstyled`
  - Events: `onEscapeKeyDown`, `onPause`, `onResume`, `onSwipeStart`, `onSwipeMove`, `onSwipeCancel`, `onSwipeEnd`
  - Viewport: `<ToastViewport hotkey={['F8']} multipleToasts portalToRoot />` - required portal for toasts
  - Positioning: Change viewport positioning (top/bottom/left/right) via style props, `flexDirection` controls stack order
  - Hooks: `useToastController()` returns `{ show, hide, options }`, `useToastState()` returns current toast data
  - Native: Use `native` prop for platform-native toasts (iOS: SPIndicator/SPAlert via burnt, Android: ToastAndroid, Web: Notification API)
  - Custom data: Pass to `show(title, { customData })`, access via `useToastState().customData`, use TS module augmentation for types
  - Safe area: Use `useSafeAreaInsets()` to position viewport inside device safe area
  - Multiple viewports: Use `name` prop on viewport, `viewportName` on toast to target specific viewport

**Container Components:**
- **Form** (`@tamagui/form`):
  - Pattern: `<Form onSubmit={...}><Form.Trigger asChild><Button /></Form.Trigger></Form>`
  - Cross-platform form wrapper
  - Use `Form.Trigger` with `asChild` for custom submit buttons

**Navigation Components:**
- **Accordion** (`@tamagui/accordion`):
  - Pattern: `<Accordion type="single"><Accordion.Item value="item-1"><Accordion.Header><Accordion.Trigger /></Accordion.Header><Accordion.Content /></Accordion.Item></Accordion>`
  - Props: `type` ("single" | "multiple"), `value`, `defaultValue`, `onValueChange`, `collapsible` (allows closing when type="single"), `disabled`, `dir` ("ltr" | "rtl")
  - Item props: `value` (required, unique), `disabled`, `asChild`
  - Header: Use `asChild` to change to appropriate heading level (e.g., `<Accordion.Header asChild><H2>...</H2></Accordion.Header>`)
  - Content: `forceMount` prop for controlling animation with external libraries
  - Keyboard: Full keyboard navigation support
  - Single mode: Only one item open at a time
  - Multiple mode: Multiple items can be open simultaneously
  - Accessibility: Adheres to WAI-ARIA Accordion pattern

- **Tabs** (`@tamagui/tabs`):
  - Pattern: `<Tabs defaultValue="tab1"><Tabs.List><Tabs.Tab value="tab1"><Text>Tab 1</Text></Tabs.Tab></Tabs.List><Tabs.Content value="tab1">Content</Tabs.Content></Tabs>`
  - Props: `value`, `defaultValue`, `onValueChange`, `orientation` ("horizontal" | "vertical"), `dir` ("ltr" | "rtl"), `activationMode` ("manual" | "automatic"), `loop` (default: `true`)
  - List: Extends Group, supports scrolling, `disablePassBorderRadius` prop, `loop` prop for keyboard navigation
  - Tab: Extends ThemeableStack, props: `value` (required), `disabled`, `unstyled`, `activeStyle`, `activeTheme`, `onInteraction` (for custom indicators)
  - Content: `value` (required), `forceMount` (for animation control)
  - Size: Pass `size` to root Tabs to affect all descendants
  - Activation modes: "automatic" focuses on tab change, "manual" requires click/enter
  - Keyboard: Full keyboard navigation with arrow keys, Home, End
  - Custom indicators: Use `onInteraction` callback on Tab for advanced animation patterns
  - Limitation: Like Group, border radius detection only works with direct Tab children in List

**Native Integrations** (`@tamagui/native`):
All native integrations are optional - components work without them, but with improved performance and platform-native UX:

- **Portal** (`react-native-teleport`):
  - Setup: `import '@tamagui/native/setup-portal'` before Tamagui imports
  - Preserves React context in Sheet, Dialog, Popover (navigation, app state work inside portaled content)
  - Fixes default JS-based portal that breaks context

- **Sheet Gestures** (`react-native-gesture-handler`):
  - Setup: `import '@tamagui/native/setup-gesture-handler'` + wrap app in `GestureHandlerRootView`
  - Native gesture coordination for smoother sheets, prevents scroll/pan conflicts on iOS

- **Menu & ContextMenu** (`zeego`, `@react-native-menu/menu`, `react-native-ios-context-menu`, `react-native-ios-utilities`):
  - Use `<Menu native>` or `<ContextMenu native>` props
  - Renders platform-native menus with iOS haptics, blur effects, system integration

- **Toast** (`burnt`):
  - Use `<Toast.Provider native>` prop
  - Platform-native toasts: SPIndicator (iOS), ToastAndroid (Android), Notification API (Web)

- **LinearGradient** (`expo-linear-gradient`):
  - Setup: `import '@tamagui/native/setup-expo-linear-gradient'` before Tamagui imports
  - High-performance native gradient rendering

**Usage Pattern:**
```tsx
import { Button, Checkbox, Input, Label, XStack, YStack } from 'tamagui'

// All components support theme tokens, animations, and responsive props
<YStack gap="$4" padding="$4">
  <Label htmlFor="email" aria-required>Email</Label>
  <Input id="email" size="$4" placeholder="email@example.com" />

  <XStack gap="$2" alignItems="center">
    <Checkbox size="$4">
      <Checkbox.Indicator />
    </Checkbox>
    <Label htmlFor="terms">Accept terms</Label>
  </XStack>

  <Button size="$4" variant="outlined" icon={Icon}>
    Submit
  </Button>
</YStack>
```

**Documentation:**
- Stacks: https://tamagui.dev/ui/stacks
- Headings: https://tamagui.dev/ui/headings
- Native: https://tamagui.dev/ui/native
- Button: https://tamagui.dev/ui/button
- Checkbox: https://tamagui.dev/ui/checkbox
- Form: https://tamagui.dev/ui/form
- Inputs: https://tamagui.dev/ui/inputs
- Label: https://tamagui.dev/ui/label
- Progress: https://tamagui.dev/ui/progress
- RadioGroup: https://tamagui.dev/ui/radio-group
- Select: https://tamagui.dev/ui/select
- Slider: https://tamagui.dev/ui/slider
- Switch: https://tamagui.dev/ui/switch
- ToggleGroup: https://tamagui.dev/ui/toggle-group
- Menu: https://tamagui.dev/ui/menu
- ContextMenu: https://tamagui.dev/ui/context-menu
- Accordion: https://tamagui.dev/ui/accordion
- AlertDialog: https://tamagui.dev/ui/alert-dialog
- Dialog: https://tamagui.dev/ui/dialog
- Popover: https://tamagui.dev/ui/popover
- Sheet: https://tamagui.dev/ui/sheet
- Tabs: https://tamagui.dev/ui/tabs
- Tooltip: https://tamagui.dev/ui/tooltip
- Toast: https://tamagui.dev/ui/toast

### Code Standards

1. **TypeScript**: Use strict mode, define proper types, avoid `any`
2. **Formatting**: Follow Prettier and ESLint rules; keep consistent with the repo
3. **Comments**: Add brief comments per function and logical section explaining the purpose
4. **Imports**: Use path aliases (`@/server/*`, `@/features/*`, `@/interface/*`, etc.)

### State & Data Management

- Use Zustand for shared/global state across the app (do not use React Context for shared data)
- **Use Supabase for backend**: All data operations should use the configured Supabase client from `src/server/supabase.ts`
- **Type safety**: Always import and use database types from `src/database/types.ts` for Supabase queries

### Documentation

- **Auto-update this file**: When creating new folders, routes, or patterns, immediately update this instructions file to reflect the changes
- **Document new patterns**: Add to relevant docs in `docs/` folder when introducing new architectural patterns
```
````
