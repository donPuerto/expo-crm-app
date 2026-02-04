# Animation Drivers - Installation & Usage

## ✅ Installation Complete

All Tamagui animation drivers are now installed:

```json
{
  "@tamagui/animate-presence": "^2.0.0-rc.1",
  "@tamagui/animations-css": "^2.0.0-rc.1",
  "@tamagui/animations-motion": "^2.0.0-rc.1",
  "@tamagui/animations-react-native": "2.0.0-rc.1",
  "@tamagui/animations-reanimated": "^2.0.0-rc.1",
  "motion": "^12.31.0",
  "react-native-reanimated": "~4.1.1"
}
```

## 🎯 Platform-Specific Configuration

### Web (animations.ts)

Uses **Motion driver** for off-thread WAAPI performance:

- Best for web-only apps
- Off-thread animations via Web Animations API
- Excellent spring physics
- Medium bundle size

### Native (animations.native.ts)

Uses **Reanimated driver** for native performance:

- Best for native apps (iOS/Android)
- Off-thread animations
- Full spring physics support
- Larger bundle but best native performance

### Configuration

Located in `src/tamagui/tamagui.config.ts`:

```typescript
import { animations } from './animations'; // Auto-selects .ts or .native.ts
```

Metro bundler automatically picks the right file:

- Web: `animations.ts` → Motion driver
- iOS/Android: `animations.native.ts` → Reanimated driver

## 🎨 Available Animation Names

### Spring Animations (Interactive Elements)

- `bouncy` - Bouncy spring effect
- `lazy` - Slow, smooth spring
- `quick` - Fast spring (recommended for UI)
- `slow` - Very slow spring
- `slowest` - Ultra slow (for galleries)

### Timing Animations (Page Transitions)

- `100ms` - 100 milliseconds
- `200ms` - 200 milliseconds
- `300ms` - 300 milliseconds
- `400ms` - 400 milliseconds
- `500ms` - 500 milliseconds

## 📦 New Components Available

### 1. ImageGallery Component

**File**: `src/interface/components/image-gallery.tsx`

Swipe-direction-aware image carousel (from your example):

```tsx
import { ImageGallery } from '@/interface/transitions';

export default function GalleryScreen() {
  const photos = [
    'https://picsum.photos/500/300?1',
    'https://picsum.photos/500/300?2',
    'https://picsum.photos/500/300?3',
  ];

  return (
    <ImageGallery
      photos={photos}
      animation="slowest"
      onPhotoChange={(index, direction) => {
        console.log(`Photo ${index}, direction ${direction}`);
      }}
    />
  );
}
```

Features:

- ✅ Swipe direction detection (left/right)
- ✅ Infinite loop (wraps at edges)
- ✅ Navigation buttons with icons
- ✅ Image counter display
- ✅ Customizable animation speed

### 2. ContentCarousel Component

Generic carousel for any content type:

```tsx
import { ContentCarousel } from '@/interface/transitions';

const items = [
  { id: 1, title: 'Slide 1', content: '...' },
  { id: 2, title: 'Slide 2', content: '...' },
  { id: 3, title: 'Slide 3', content: '...' },
];

export default function OnboardingScreen() {
  return (
    <ContentCarousel
      items={items}
      renderItem={item => (
        <YStack padding="$4">
          <Text fontSize="$8">{item.title}</Text>
          <Text>{item.content}</Text>
        </YStack>
      )}
      showControls
    />
  );
}
```

### 3. AnimatedModal Component

**File**: `src/interface/components/animated-modal.tsx`

Enter/exit transitions (from your example):

```tsx
import { AnimatedModal } from '@/interface/transitions';
import { useState } from 'react';

export default function MyScreen() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onPress={() => setIsOpen(true)}>Open Modal</Button>

      <AnimatedModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Settings"
        enterAnimation="lazy" // Enters slowly
        exitAnimation="quick" // Exits quickly
      >
        <YStack gap="$4">
          <Text>Modal content here</Text>
          <Button onPress={() => setIsOpen(false)}>Close</Button>
        </YStack>
      </AnimatedModal>
    </>
  );
}
```

### 4. BottomSheetModal Component

Slides up from bottom:

```tsx
import { BottomSheetModal } from '@/interface/transitions';

<BottomSheetModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Filter Options">
  <YStack gap="$3">{/* Filter options */}</YStack>
</BottomSheetModal>;
```

### 5. FullScreenModal Component

Slides in from right (iOS style):

```tsx
import { FullScreenModal } from '@/interface/transitions';

<FullScreenModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit Profile">
  <YStack gap="$4">{/* Full screen content */}</YStack>
</FullScreenModal>;
```

## 🔥 Usage Examples from Your Code

### Example 1: Enter/Exit Transitions

```tsx
import { AnimatePresence, View } from 'tamagui';

export default ({ show }) => (
  <AnimatePresence>
    {show && (
      <View
        key="panel"
        animation={{ enter: 'lazy', exit: 'quick' }}
        enterStyle={{ opacity: 0, y: 20 }}
        exitStyle={{ opacity: 0, y: -20 }}
      >
        <Text>Panel content</Text>
      </View>
    )}
  </AnimatePresence>
);
```

**Now implemented in**: `AnimatedModal`, `BottomSheetModal`, `FullScreenModal`

### Example 2: Gallery with Custom Prop

```tsx
import { AnimatePresence } from '@tamagui/animate-presence';
import { ArrowLeft, ArrowRight } from '@tamagui/lucide-icons';
import { useState } from 'react';
import { Button, Image, XStack, YStack, styled } from 'tamagui';

const GalleryItem = styled(YStack, {
  zIndex: 1,
  x: 0,
  opacity: 1,
  fullscreen: true,

  variants: {
    going: {
      ':number': going => ({
        enterStyle: {
          x: going > 0 ? 1000 : -1000,
          opacity: 0,
        },
        exitStyle: {
          zIndex: 0,
          x: going < 0 ? 1000 : -1000,
          opacity: 0,
        },
      }),
    },
  } as const,
});

export function Demo() {
  const [[page, going], setPage] = useState([0, 0]);
  const photos = ['url1', 'url2', 'url3'];

  const imageIndex = wrap(0, photos.length, page);
  const paginate = (direction: number) => setPage([page + direction, direction]);

  return (
    <XStack>
      <AnimatePresence initial={false} custom={{ going }}>
        <GalleryItem key={page} animation="slowest" going={going}>
          <Image src={photos[imageIndex]} />
        </GalleryItem>
      </AnimatePresence>

      <Button onPress={() => paginate(-1)}>←</Button>
      <Button onPress={() => paginate(1)}>→</Button>
    </XStack>
  );
}
```

**Now implemented in**: `ImageGallery`, `ContentCarousel`

## 🚀 Quick Start

### Import Everything

```tsx
import {
  // Page transitions
  PageTransition,
  StackPageTransition,
  ModalPageTransition,
  TabPageTransition,

  // Directional navigation
  DirectionalPageTransition,
  useRouteTransition,

  // Carousels & galleries
  ImageGallery,
  ContentCarousel,
  CarouselTransition,

  // Modals
  AnimatedModal,
  BottomSheetModal,
  FullScreenModal,

  // Core
  AnimatePresence,
} from '@/interface/transitions';
```

### Use in Your Screens

**Gallery Screen**:

```tsx
export default function ProductGallery() {
  const images = product.images;

  return <ImageGallery photos={images} animation="slowest" height={400} />;
}
```

**Modal Screen**:

```tsx
export default function SettingsScreen() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onPress={() => setShowModal(true)}>Open Settings</Button>

      <AnimatedModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Settings"
        enterAnimation="lazy"
        exitAnimation="quick"
      >
        <SettingsForm />
      </AnimatedModal>
    </>
  );
}
```

**Page Transition**:

```tsx
export default function MyScreen() {
  return (
    <PageTransition type="slide" animation="quick">
      <YStack padding="$4">
        <Text>Your content</Text>
      </YStack>
    </PageTransition>
  );
}
```

## 📚 Documentation

- **Main Guide**: `docs/ANIMATIONS-GUIDE.md`
- **Implementation Summary**: `docs/ANIMATION-IMPLEMENTATION-SUMMARY.md`
- **AI Instructions**: `.github/copilot-instructions.md` (Tamagui Animations section)
- **Examples**: `src/interface/components/page-transition-examples.tsx`

## 🔧 Configuration Files

- **Main Config**: `src/tamagui/tamagui.config.ts` (uses platform-specific animations)
- **Web Animations**: `src/tamagui/animations.ts` (Motion driver)
- **Native Animations**: `src/tamagui/animations.native.ts` (Reanimated driver)

## ⚡ Performance

### Web

- Motion driver: Off-thread via WAAPI
- CSS fallback available: Lightest bundle
- Smooth 60fps animations

### Native

- Reanimated driver: Off-thread native animations
- React Native fallback available
- Optimized for mobile devices

## 🎓 Next Steps

1. **Try the examples**: Use `ImageGallery` or `AnimatedModal` in your screens
2. **Apply to existing screens**: Add `PageTransition` wrappers
3. **Customize animations**: Adjust `enterAnimation` and `exitAnimation` props
4. **Create new patterns**: Use `AnimatePresence` with `custom` prop for advanced transitions

All animation drivers are installed and ready to use! 🚀
