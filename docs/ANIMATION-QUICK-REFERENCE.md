# 🎬 Animation Quick Reference

## Import Statement

```tsx
import {
  AnimatePresence,
  ImageGallery,
  AnimatedModal,
  BottomSheetModal,
  FullScreenModal,
  PageTransition,
  DirectionalPageTransition,
  useRouteTransition,
} from '@/interface/transitions';
```

## 1️⃣ Image Gallery (Swipe Direction)

```tsx
<ImageGallery
  photos={['url1', 'url2', 'url3']}
  animation="slowest"
  height={400}
  onPhotoChange={(index, direction) => {
    console.log(`Photo ${index}, direction ${direction}`);
  }}
/>
```

## 2️⃣ Animated Modal (Enter Slow, Exit Fast)

```tsx
<AnimatedModal
  isOpen={show}
  onClose={() => setShow(false)}
  title="Settings"
  enterAnimation="lazy"
  exitAnimation="quick"
>
  <YStack gap="$4">
    <Text>Content</Text>
  </YStack>
</AnimatedModal>
```

## 3️⃣ Bottom Sheet

```tsx
<BottomSheetModal isOpen={show} onClose={() => setShow(false)} title="Options">
  <Button>Option 1</Button>
</BottomSheetModal>
```

## 4️⃣ Full Screen Modal

```tsx
<FullScreenModal isOpen={show} onClose={() => setShow(false)} title="Edit Profile">
  <YStack flex={1}>{/* Full screen content */}</YStack>
</FullScreenModal>
```

## 5️⃣ Page Transitions

```tsx
<PageTransition type="slide" animation="quick">
  <YStack>Your screen content</YStack>
</PageTransition>
```

## 6️⃣ Directional Navigation

```tsx
const { direction } = useRouteTransition()

<DirectionalPageTransition direction={direction}>
  <YStack>Auto-animates based on nav direction</YStack>
</DirectionalPageTransition>
```

## 7️⃣ Custom AnimatePresence

```tsx
<AnimatePresence>
  {show && (
    <View
      key="item"
      animation={{ enter: 'lazy', exit: 'quick' }}
      enterStyle={{ opacity: 0, y: 20 }}
      exitStyle={{ opacity: 0, y: -20 }}
    >
      <Text>Content</Text>
    </View>
  )}
</AnimatePresence>
```

## 8️⃣ Interactive Button

```tsx
<View
  animation="bouncy"
  backgroundColor="$primary"
  padding="$4"
  borderRadius="$4"
  hoverStyle={{ scale: 1.05 }}
  pressStyle={{ scale: 0.95 }}
>
  <Text>Bouncy Button</Text>
</View>
```

## 9️⃣ Staggered List

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

## 🔟 Content Carousel

```tsx
<ContentCarousel
  items={slides}
  renderItem={slide => (
    <YStack padding="$4">
      <Text fontSize="$8">{slide.title}</Text>
    </YStack>
  )}
  showControls
  animation="slow"
/>
```

## Animation Names

**Spring (UI)**: `bouncy` `lazy` `quick` `slow` `slowest`  
**Timing (Pages)**: `100ms` `200ms` `300ms` `400ms` `500ms`

## Platform-Specific Drivers

- **Web**: Motion driver (off-thread WAAPI)
- **Native**: Reanimated driver (off-thread native)
- **Auto-selected** by Metro bundler based on platform

## Documentation

- Setup: `ANIMATION-DRIVERS-INSTALLATION.md`
- Guide: `docs/ANIMATIONS-GUIDE.md`
- Examples: `src/interface/components/page-transition-examples.tsx`
