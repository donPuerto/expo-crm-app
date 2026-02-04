# Tamagui Animations Guide

## Overview

This app uses Tamagui's animation system with `@tamagui/animations-react-native` driver for cross-platform animations. All page transitions, interactive elements, and UI components can be animated using Tamagui's declarative API.

## Animation Configuration

Located in `src/tamagui/tamagui.config.ts`:

```typescript
animations: createAnimations({
  // Spring animations for interactive elements
  bouncy: { damping: 10, mass: 0.9, stiffness: 100 },
  lazy: { damping: 18, stiffness: 50 },
  quick: { damping: 20, mass: 1.2, stiffness: 250 },
  slow: { damping: 20, stiffness: 60 },

  // Timing animations for page transitions
  '100ms': { type: 'timing', duration: 100 },
  '200ms': { type: 'timing', duration: 200 },
  '300ms': { type: 'timing', duration: 300 },
  '400ms': { type: 'timing', duration: 400 },
});
```

## Available Animation Components

### 1. PageTransition

**Location**: `src/interface/components/page-transition.tsx`

Simple page transition wrapper with predefined transition types.

```tsx
import { PageTransition } from '@/interface/components/page-transition';

export default function MyScreen() {
  return (
    <PageTransition type="slide">
      <View>Your content</View>
    </PageTransition>
  );
}
```

**Available Types**:

- `slide` - Slides in from right, exits to left (default)
- `fade` - Simple fade in/out
- `scale` - Scale + fade
- `slideUp` - Bottom sheet style (slides up from bottom)
- `slideDown` - Slides down from top

**Specialized Variants**:

```tsx
// iOS-style stack navigation
<StackPageTransition>
  <YourContent />
</StackPageTransition>

// Modal presentation
<ModalPageTransition>
  <YourContent />
</ModalPageTransition>

// Tab transitions
<TabPageTransition>
  <YourContent />
</TabPageTransition>
```

### 2. DirectionalPageTransition

**Location**: `src/interface/components/directional-page-transition.tsx`

Responds to navigation direction (forward/backward).

```tsx
import { DirectionalPageTransition } from '@/interface/components/directional-page-transition';
import { useRouteTransition } from '@/interface/hooks/use-route-transition';

export default function MyScreen() {
  const { direction } = useRouteTransition();

  return (
    <DirectionalPageTransition direction={direction}>
      <View>Your content</View>
    </DirectionalPageTransition>
  );
}
```

### 3. CarouselTransition

**Location**: `src/interface/components/carousel-transition.tsx`

Advanced carousel with swipe-direction-aware transitions.

```tsx
import { CarouselTransition } from '@/interface/components/carousel-transition';

const images = ['url1', 'url2', 'url3'];

export default function Gallery() {
  return (
    <CarouselTransition
      items={images}
      renderItem={url => <Image src={url} />}
      showControls
      animation="slow"
      onPageChange={(page, direction) => {
        console.log(`Page ${page}, direction ${direction}`);
      }}
    />
  );
}
```

## Basic Animation Patterns

### 1. Mount Animations (enterStyle)

Elements animate from `enterStyle` to base styles on mount:

```tsx
<View
  animation="quick"
  enterStyle={{ opacity: 0, y: 20, scale: 0.9 }}
  backgroundColor="$card"
  padding="$4"
>
  <Text>Fades and slides in on mount</Text>
</View>
```

### 2. Interactive Animations

Animate on hover, press, and focus:

```tsx
<View
  animation="bouncy"
  backgroundColor="$primary"
  padding="$4"
  borderRadius="$4"
  hoverStyle={{ scale: 1.05 }}
  pressStyle={{ scale: 0.95 }}
  focusStyle={{ borderColor: '$blue10' }}
>
  <Text>Interactive Button</Text>
</View>
```

### 3. Mount/Unmount with AnimatePresence

```tsx
import { AnimatePresence, View } from 'tamagui';

export const Modal = ({ isVisible }) => (
  <AnimatePresence>
    {isVisible && (
      <View
        key="modal"
        animation="quick"
        enterStyle={{ opacity: 0, y: 50 }}
        exitStyle={{ opacity: 0, y: 50 }}
      >
        <Text>Modal content</Text>
      </View>
    )}
  </AnimatePresence>
);
```

### 4. Staggered Animations

Animate list items with delay:

```tsx
{
  items.map((item, i) => (
    <View
      key={item.id}
      animation={['bouncy', { delay: i * 50 }]}
      enterStyle={{ opacity: 0, scale: 0.8, y: 20 }}
    >
      <Text>{item.name}</Text>
    </View>
  ));
}
```

### 5. Per-Property Animations

Different animations for different properties:

```tsx
<View
  transition={{
    x: 'bouncy', // X uses bouncy spring
    y: 'quick', // Y uses quick spring
    opacity: '200ms', // Opacity uses timing animation
  }}
  x={isOpen ? 0 : -100}
  y={isActive ? 10 : 0}
  opacity={isVisible ? 1 : 0}
/>
```

### 6. Enter/Exit Transitions

Different animations for enter vs exit:

```tsx
<View
  animation={{ enter: 'lazy', exit: 'quick', default: 'bouncy' }}
  enterStyle={{ opacity: 0, x: 20 }}
  exitStyle={{ opacity: 0, x: -20 }}
/>
```

## Page Transition Recipes

### Recipe 1: Welcome Screen with Staggered Features

```tsx
import { PageTransition } from '@/interface/components/page-transition';

export default function WelcomeScreen() {
  const features = [
    { icon: Users, title: 'Manage Contacts' },
    { icon: BarChart3, title: 'Track Sales' },
    { icon: Zap, title: 'Automate Workflows' },
  ];

  return (
    <PageTransition type="fade">
      <YStack padding="$4" gap="$4">
        <Text fontSize="$8" animation="quick" enterStyle={{ opacity: 0, y: -20 }}>
          Welcome to CRM
        </Text>

        {features.map((feature, i) => (
          <View
            key={feature.title}
            animation={['bouncy', { delay: i * 100 }]}
            enterStyle={{ opacity: 0, scale: 0.8, y: 20 }}
            backgroundColor="$card"
            padding="$4"
            borderRadius="$4"
          >
            <Text>{feature.title}</Text>
          </View>
        ))}
      </YStack>
    </PageTransition>
  );
}
```

### Recipe 2: Modal with Backdrop

```tsx
import { AnimatePresence, View } from 'tamagui';

export function Modal({ isVisible, onClose, children }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <View
            key="backdrop"
            animation="quick"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            backgroundColor="rgba(0, 0, 0, 0.5)"
            onPress={onClose}
          />

          {/* Modal Content */}
          <View
            key="modal"
            animation="quick"
            enterStyle={{ opacity: 0, y: 50, scale: 0.95 }}
            exitStyle={{ opacity: 0, y: 50, scale: 0.95 }}
            position="absolute"
            top="20%"
            left="10%"
            right="10%"
            backgroundColor="$background"
            padding="$4"
            borderRadius="$4"
            shadowColor="$shadowColor"
            shadowOpacity={0.3}
            shadowRadius={20}
          >
            {children}
          </View>
        </>
      )}
    </AnimatePresence>
  );
}
```

### Recipe 3: Tab Navigation with Fade

```tsx
import { AnimatePresence, View } from 'tamagui';

export function TabView({ activeTab, tabs }) {
  return (
    <AnimatePresence exitBeforeEnter>
      <View
        key={activeTab}
        animation="200ms"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
        flex={1}
      >
        {tabs[activeTab].content}
      </View>
    </AnimatePresence>
  );
}
```

### Recipe 4: Pull-to-Refresh Indicator

```tsx
<View animation="quick" opacity={isPulling ? 1 : 0} y={isPulling ? 0 : -50} padding="$2">
  <ActivityIndicator />
</View>
```

## Best Practices

### ✅ DO

1. **Keep animation prop present**:

   ```tsx
   <View animation={isActive ? 'bouncy' : null} />
   ```

2. **Use enterStyle for mount animations**:

   ```tsx
   <View animation="quick" enterStyle={{ opacity: 0, y: 20 }} />
   ```

3. **Use AnimatePresence for unmount animations**:

   ```tsx
   <AnimatePresence>{show && <View key="item" exitStyle={{ opacity: 0 }} />}</AnimatePresence>
   ```

4. **Unique keys in AnimatePresence**:

   ```tsx
   {
     items.map(item => <View key={item.id} />);
   }
   ```

5. **Use appropriate timing**:
   - Interactive elements: `quick`, `bouncy`
   - Page transitions: `200ms`, `300ms`, `lazy`
   - Micro-interactions: `100ms`, `quick`

### ❌ DON'T

1. **Don't conditionally add animation prop**:

   ```tsx
   // ❌ Wrong
   <View {...isActive && { animation: 'bouncy' }} />

   // ✅ Correct
   <View animation={isActive ? 'bouncy' : null} />
   ```

2. **Don't forget keys in AnimatePresence**:

   ```tsx
   // ❌ Wrong
   <AnimatePresence>
     {show && <View />}
   </AnimatePresence>

   // ✅ Correct
   <AnimatePresence>
     {show && <View key="unique-key" />}
   </AnimatePresence>
   ```

3. **Don't use exitStyle without AnimatePresence**:

   ```tsx
   // ❌ Won't work
   <View exitStyle={{ opacity: 0 }} />

   // ✅ Correct
   <AnimatePresence>
     <View key="item" exitStyle={{ opacity: 0 }} />
   </AnimatePresence>
   ```

## Animation Performance Tips

1. **Use timing animations for page transitions** - More predictable than springs for large movements
2. **Limit animated properties** - Only animate what's necessary (opacity, x/y, scale)
3. **Use animateOnly prop** - Restrict which properties can animate
4. **Avoid animating layout properties** - Prefer transforms (x, y, scale) over width/height
5. **Test on low-end devices** - Ensure smooth 60fps performance

## Examples

See `src/interface/components/page-transition-examples.tsx` for complete working examples:

- Modal transitions
- Stack navigation
- Staggered lists
- Tab transitions
- Interactive buttons

## Further Reading

- [Tamagui Animations Docs](https://tamagui.dev/docs/core/animations)
- [AnimatePresence Docs](https://tamagui.dev/docs/core/animate-presence)
- [Animation Drivers Docs](https://tamagui.dev/docs/core/animation-drivers)
- GitHub Instructions: `.github/copilot-instructions.md` (Tamagui Animations section)
