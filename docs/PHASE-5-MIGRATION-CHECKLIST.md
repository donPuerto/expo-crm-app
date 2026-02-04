# Phase 5: Feature Component Migration - Detailed Checklist

**Created:** February 4, 2026  
**Status:** In Progress  
**Components:** 20 total (1 auth, 6 dashboard, 13 shared)

---

## Migration Status Overview

- ✅ **READY**: Component analyzed, clear migration path (14 files)
- ⚠️ **NEEDS REVIEW**: Requires further analysis (6 files)
- 🎯 **EXCELLENT**: Already uses Tamagui (1 file)
- ✓ **OK**: No migration needed (1 file)

---

## 1. Auth Components (1 file)

### ✅ social-connections.tsx

**Current State:**

```tsx
import { Apple, Chrome, Github } from 'lucide-react-native';
import { View, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
```

**Migration Tasks:**

- [ ] Replace `lucide-react-native` → `@tamagui/lucide-icons`
- [ ] Replace `Button from @/components/ui/button` → `Button from 'tamagui'`
- [ ] Replace `Icon` component with direct Lucide icon usage
- [ ] Replace `View` → `XStack`
- [ ] Remove `StyleSheet.create`
- [ ] Convert `flexDirection: 'row'` → XStack default
- [ ] Convert `gap: 12` → `gap="$3"` prop
- [ ] Convert `justifyContent: 'center'` → `justifyContent="center"` prop
- [ ] Update button props: `variant="outline"` → `variant="outlined"`, `size="sm"` → `size="$3"`
- [ ] Use icon prop on Button instead of wrapping in Icon component

**After:**

```tsx
import { Apple, Chrome, Github } from '@tamagui/lucide-icons';
import { XStack, Button } from 'tamagui';

export function SocialConnections() {
  return (
    <XStack gap="$3" justifyContent="center">
      <Button variant="outlined" size="$3" icon={Apple} flex={1} minWidth={80} />
      <Button variant="outlined" size="$3" icon={Chrome} flex={1} minWidth={80} />
      <Button variant="outlined" size="$3" icon={Github} flex={1} minWidth={80} />
    </XStack>
  );
}
```

**Lines Saved:** ~20 lines

---

## 2. Dashboard Components (6 files)

### ✅ dashboard-wrapper.tsx

**Current State:**

```tsx
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Sidebar from '@/components/dashboard/sidebar';
import Topbar from '@/components/dashboard/topbar';
```

**Migration Tasks:**

- [ ] Replace `View` → `YStack` for vertical layouts
- [ ] Remove `StyleSheet.create`
- [ ] Replace `useWindowDimensions` → `useMedia` hook
- [ ] Convert `flexDirection: 'row'` → `XStack`
- [ ] Convert `flex: 1` → `flex={1}` or `f={1}` shorthand
- [ ] Update imports from `@/components/dashboard/` → `@/features/dashboard/components/dashboard/`

**After:**

```tsx
import { YStack, XStack, useMedia } from 'tamagui';
import Sidebar from '@/features/dashboard/components/dashboard/sidebar';
import Topbar from '@/features/dashboard/components/dashboard/topbar';

export default function DashboardWrapper({ children, showSidebar = true, showTopbar = false }) {
  const media = useMedia();

  return (
    <YStack f={1}>
      {showTopbar && media.gtSm && <Topbar />}
      <XStack f={1}>
        {showSidebar && media.gtSm && <Sidebar />}
        <YStack f={1}>{children}</YStack>
      </XStack>
    </YStack>
  );
}
```

**Lines Saved:** ~15 lines

---

### ✅ DashboardHeader.tsx

**Current State:**

```tsx
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
```

**Migration Tasks:**

- [ ] Replace `ThemedText` → `H1`, `Text` from tamagui
- [ ] Replace `ThemedView` → `YStack`
- [ ] Replace `View` → `XStack` for row layouts
- [ ] Remove `useThemeColor` hook (use theme tokens)
- [ ] Remove `StyleSheet.create`
- [ ] Replace `borderBottomColor` → `borderBottomColor="$borderColor"`
- [ ] Replace `backgroundColor` → `backgroundColor="$card"`
- [ ] Remove `createShadowStyle` (use Tamagui elevation prop)
- [ ] Keep Reanimated animations (compatible with Tamagui)
- [ ] Update imports

**After:**

```tsx
import { YStack, XStack, H1, Text } from 'tamagui';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export function DashboardHeader({ title, subtitle, actions }) {
  // ... animation logic stays the same ...

  return (
    <Animated.View style={animatedStyle}>
      <YStack
        backgroundColor="$card"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        paddingVertical="$5"
        paddingHorizontal="$6"
        elevation={2}
      >
        <XStack justifyContent="space-between" alignItems="center">
          <YStack>
            <H1 size="$8" marginBottom="$1">
              {title}
            </H1>
            {subtitle && (
              <Text fontSize="$3" opacity={0.7} fontWeight="500">
                {subtitle}
              </Text>
            )}
          </YStack>
          {actions && <XStack gap="$3">{actions}</XStack>}
        </XStack>
      </YStack>
    </Animated.View>
  );
}
```

**Lines Saved:** ~25 lines

---

### ✅ DashboardGrid.tsx

**Current State:**

```tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
```

**Migration Tasks:**

- [ ] Replace `View` → `XStack` with `flexWrap="wrap"`
- [ ] Remove `StyleSheet.create`
- [ ] Use `gap` prop directly instead of style object
- [ ] Use `useMedia` for responsive column calculation
- [ ] Simplify item width calculation with Tamagui width tokens

**After:**

```tsx
import { XStack, YStack, useMedia } from 'tamagui';

export function DashboardGrid({ children, columns = 2, gap = '$3' }) {
  const media = useMedia();
  const responsiveWidth = media.gtLg ? '30%' : media.gtMd ? '45%' : '100%';

  return (
    <XStack flexWrap="wrap" gap={gap}>
      {React.Children.map(children, (child, index) => (
        <YStack key={index} flexGrow={1} minWidth={responsiveWidth}>
          {child}
        </YStack>
      ))}
    </XStack>
  );
}
```

**Lines Saved:** ~10 lines

---

### ✅ DashboardShell.tsx

**Current State:**

- Duplicate of `dashboard-wrapper.tsx` (same functionality)

**Migration Tasks:**

- [ ] Same as dashboard-wrapper.tsx
- [ ] **Consider:** Consolidate with dashboard-wrapper or remove if redundant

**After:**

- Same as dashboard-wrapper.tsx

**Lines Saved:** ~15 lines (or entire file if consolidated)

---

### ✅ sidebar.tsx

**Current State:**

```tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
```

**Migration Tasks:**

- [ ] Replace `ThemedView` → `YStack`
- [ ] Replace `ThemedText` → `Text`
- [ ] Replace `View` → `YStack` or `XStack` as appropriate
- [ ] Replace `ScrollView` → `ScrollView` from tamagui
- [ ] Replace `Pressable` → Tamagui's built-in press handling on `YStack`
- [ ] OR keep React Native `Pressable` (it's fine to mix)
- [ ] Remove `StyleSheet.create`
- [ ] Remove `useThemeColor` hook (use theme tokens)
- [ ] Convert border colors → `borderColor="$borderColor"`
- [ ] Keep Reanimated animations
- [ ] Keep `IconSymbol` (iOS SF Symbols component)

**After:**

```tsx
import { YStack, XStack, Text, ScrollView } from 'tamagui';
import { IconSymbol } from '@/interface/primitives/icon-symbol';
import { Pressable } from 'react-native'; // or migrate to YStack onPress
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// ... AnimatedNavItem component with press handling ...

export default function Sidebar() {
  return (
    <YStack
      width={240}
      backgroundColor="$card"
      borderRightWidth={1}
      borderRightColor="$borderColor"
      elevation={1}
    >
      <ScrollView>{/* Navigation items */}</ScrollView>
    </YStack>
  );
}
```

**Lines Saved:** ~20 lines

---

### ✅ topbar.tsx

**Current State:**

```tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet, View } from 'react-native';
```

**Migration Tasks:**

- [ ] Replace `ThemedView` → `XStack`
- [ ] Replace `ThemedText` → `Text`
- [ ] Remove `StyleSheet.create`
- [ ] Remove `useThemeColor` hook
- [ ] Convert border/background colors → theme tokens

**After:**

```tsx
import { XStack, Text } from 'tamagui';

export default function Topbar() {
  return (
    <XStack
      backgroundColor="$background"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
      paddingVertical="$3"
      paddingHorizontal="$5"
      alignItems="flex-start"
      justifyContent="center"
    >
      <Text fontSize="$4" fontWeight="600">
        Dashboard
      </Text>
    </XStack>
  );
}
```

**Lines Saved:** ~10 lines

---

## 3. Shared Components (13 files)

### ✅ themed-text.tsx

**Current State:**

```tsx
import { StyleSheet, Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useFont } from '@/hooks/use-font';
```

**Migration Tasks:**

- [ ] Wrap Tamagui `Text` or `SizableText` component
- [ ] Remove `useThemeColor` hook (use `$color` token)
- [ ] Remove `useFont` hook (Tamagui handles fonts)
- [ ] Remove `StyleSheet` usage
- [ ] Map font sizes to Tamagui size tokens (`$3`, `$4`, `$8`, etc.)
- [ ] Use `fontWeight` prop directly
- [ ] Keep type variants but simplify implementation
- [ ] Use Tamagui's built-in responsive font sizing

**After:**

```tsx
import { Text, styled } from 'tamagui';
import type { TextProps } from 'tamagui';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

const StyledText = styled(Text, {
  color: '$color',

  variants: {
    type: {
      default: { fontSize: '$4', lineHeight: '$6' },
      defaultSemiBold: { fontSize: '$4', lineHeight: '$6', fontWeight: '600' },
      title: { fontSize: '$9', fontWeight: 'bold', lineHeight: '$9' },
      subtitle: { fontSize: '$6', fontWeight: 'bold' },
      link: { fontSize: '$4', lineHeight: '$7', color: '$blue10' },
    },
  } as const,

  defaultVariants: {
    type: 'default',
  },
});

export function ThemedText({ type = 'default', ...props }: ThemedTextProps) {
  return <StyledText type={type} {...props} />;
}
```

**Lines Saved:** ~25 lines

---

### ✅ themed-view.tsx

**Current State:**

```tsx
import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
```

**Migration Tasks:**

- [ ] Replace with Tamagui `View` or `YStack`
- [ ] Remove `useThemeColor` hook
- [ ] Use `$background` token directly
- [ ] Simplify to single-prop interface

**After:**

```tsx
import { View, type ViewProps } from 'tamagui';

export type ThemedViewProps = ViewProps;

export function ThemedView({ ...props }: ThemedViewProps) {
  return <View backgroundColor="$background" {...props} />;
}
```

**Lines Saved:** ~8 lines

---

### ⚠️ parallax-scroll-view.tsx

**Current State:**

```tsx
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';
import { ThemedView } from '@/components/themed-view';
```

**Migration Tasks:**

- [ ] Replace `ThemedView` → `YStack`
- [ ] Replace `Animated.ScrollView` → Consider wrapping Tamagui `ScrollView` with Animated.createAnimatedComponent
- [ ] OR keep `Animated.ScrollView` (works fine)
- [ ] Remove `StyleSheet.create`
- [ ] Use theme tokens for backgroundColor
- [ ] Remove `useThemeColor` hook
- [ ] Keep all Reanimated animations (100% compatible)

**Consideration:**

- Parallax scroll is animation-heavy - may want to keep Reanimated's Animated.ScrollView
- Tamagui ScrollView is just a styled wrapper, so mixing is fine

**After:**

```tsx
import { YStack } from 'tamagui';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

export default function ParallaxScrollView({ children, headerImage, headerBackgroundColor }) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollOffset.value, [-250, 0, 250], [-125, 0, 187.5]) },
      { scale: interpolate(scrollOffset.value, [-250, 0, 250], [2, 1, 1]) },
    ],
  }));

  return (
    <Animated.ScrollView
      ref={scrollRef}
      backgroundColor="$background"
      f={1}
      scrollEventThrottle={16}
    >
      <Animated.View
        height={250}
        overflow="hidden"
        backgroundColor={headerBackgroundColor}
        style={headerAnimatedStyle}
      >
        {headerImage}
      </Animated.View>
      <YStack f={1} padding="$8" gap="$4">
        {children}
      </YStack>
    </Animated.ScrollView>
  );
}
```

**Lines Saved:** ~15 lines

---

### ⚠️ hello-wave.tsx

**Current State:**

```tsx
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
```

**Migration Tasks:**

- [ ] **Option 1:** Keep as-is (Reanimated animations work great)
- [ ] **Option 2:** Replace with Tamagui `Text` + `animation` prop
- [ ] **Recommendation:** Keep Reanimated for complex spring physics

**After (if keeping Reanimated):**

```tsx
// Keep as-is - already optimal
```

**After (if using Tamagui animations):**

```tsx
import { Text } from 'tamagui';

export function HelloWave() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // Use Tamagui's animation system
  }, []);

  return (
    <Text fontSize="$7" lineHeight="$8" marginTop={-6} animation="bouncy" rotate={`${rotation}deg`}>
      👋
    </Text>
  );
}
```

**Recommendation:** Keep Reanimated version (more control)

---

### ✓ haptic-tab.tsx

**Status:** No migration needed

**Reason:** React Navigation integration - not a styling component

---

### ⚠️ external-link.tsx

**Current State:**

```tsx
import { Href, Link } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
```

**Migration Tasks:**

- [ ] **Option 1:** Keep as-is (already optimal with expo-router)
- [ ] **Option 2:** Wrap with Tamagui `Anchor` component for styling
- [ ] **Recommendation:** Keep as-is OR add optional Tamagui styling wrapper

**After:**

```tsx
// Option 1: Keep as-is
// Option 2: Add Tamagui Anchor wrapper
import { Anchor } from 'tamagui';

export function ExternalLink({ href, children, ...rest }: Props) {
  return (
    <Anchor asChild>
      <Link target="_blank" href={href} onPress={...} {...rest}>
        {children}
      </Link>
    </Anchor>
  );
}
```

**Recommendation:** Keep as-is (minimal benefit from Tamagui)

---

### 🎯 responsive-card.tsx

**Status:** EXCELLENT - Already uses Tamagui!

**Current State:**

```tsx
import { View, Text, styled, useMedia, useTheme } from '@tamagui/core';
```

**Migration Tasks:**

- [ ] None! This is a reference implementation
- [ ] Use as example for other components

**Observations:**

- Already uses `styled()` with variants
- Already uses `useMedia()` and `useTheme()`
- Demonstrates both compiler-optimized and hook-based approaches
- Perfect example of Tamagui best practices

---

### ⚠️ animated-modal.tsx

**Status:** NEEDS REVIEW

**Action Required:**

- [ ] Read file to assess current implementation
- [ ] Check if uses AnimatePresence or custom animations
- [ ] Determine migration strategy

---

### ⚠️ image-gallery.tsx

**Status:** NEEDS REVIEW

**Action Required:**

- [ ] Read file to assess current implementation
- [ ] Check if uses Tamagui Image component or custom implementation
- [ ] Determine migration strategy

---

### ⚠️ carousel-transition.tsx

**Status:** NEEDS REVIEW

**Action Required:**

- [ ] Read file to assess animation implementation
- [ ] Check compatibility with Tamagui animations
- [ ] Determine if Reanimated should be kept

---

### ⚠️ directional-page-transition.tsx

**Status:** NEEDS REVIEW

**Action Required:**

- [ ] Read file to assess animation implementation
- [ ] Check compatibility with Tamagui page transitions
- [ ] Determine migration strategy

---

### ⚠️ page-transition.tsx

**Status:** NEEDS REVIEW

**Action Required:**

- [ ] Read file to assess animation implementation
- [ ] Check if uses Tamagui AnimatePresence
- [ ] Determine migration strategy

---

### ⚠️ page-transition-examples.tsx

**Status:** NEEDS REVIEW

**Action Required:**

- [ ] Read file to check if examples are up-to-date
- [ ] Update examples to use Tamagui animations if needed

---

## Migration Priority

### Phase 5.1: Quick Wins (Start Here)

1. ✅ topbar.tsx (simplest, 10 lines saved)
2. ✅ themed-view.tsx (simple wrapper, 8 lines saved)
3. ✅ social-connections.tsx (straightforward, 20 lines saved)
4. ✅ DashboardGrid.tsx (simple layout, 10 lines saved)

### Phase 5.2: Medium Complexity

5. ✅ dashboard-wrapper.tsx (15 lines saved)
6. ✅ DashboardShell.tsx (consolidate or remove)
7. ✅ themed-text.tsx (25 lines saved, important component)

### Phase 5.3: Complex Components

8. ✅ DashboardHeader.tsx (keep animations, 25 lines saved)
9. ✅ sidebar.tsx (keep animations, 20 lines saved)
10. ⚠️ parallax-scroll-view.tsx (animation-heavy)

### Phase 5.4: Review Components

11. ⚠️ animated-modal.tsx
12. ⚠️ image-gallery.tsx
13. ⚠️ carousel-transition.tsx
14. ⚠️ directional-page-transition.tsx
15. ⚠️ page-transition.tsx
16. ⚠️ page-transition-examples.tsx

### Phase 5.5: Keep As-Is

17. ✓ haptic-tab.tsx
18. ⚠️ external-link.tsx (optional)
19. ⚠️ hello-wave.tsx (optional)
20. 🎯 responsive-card.tsx (already perfect!)

---

## Total Lines Saved Estimate

- Auth: 20 lines
- Dashboard: 95 lines
- Shared (migrated): 48 lines
- **Total:** ~163 lines saved
- **Percentage:** ~15-20% code reduction

---

## Common Patterns

### StyleSheet → Props

```tsx
// Before
const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 }
});
<View style={styles.container} />

// After
<YStack f={1} padding="$3" />
```

### useThemeColor → Tokens

```tsx
// Before
const color = useThemeColor({}, 'background');
<View style={{ backgroundColor: color }} />

// After
<View backgroundColor="$background" />
```

### View → Stack

```tsx
// Before
<View style={{ flexDirection: 'row', gap: 12 }}>

// After
<XStack gap="$3">
```

### Text Types → Variants

```tsx
// Before
type === 'title' ? styles.title : styles.default

// After
<Text type="title">  // using styled variants
```

---

## Next Steps

1. ✅ Review this checklist
2. Start with Phase 5.1 (Quick Wins)
3. Test each migration individually
4. Read and analyze ⚠️ NEEDS REVIEW components
5. Update import paths across app (Phase 6)
