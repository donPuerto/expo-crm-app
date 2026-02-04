# Animation Documentation Index

All Tamagui animation documentation for the Expo CRM App.

## 📚 Quick Links

### 🚀 Getting Started

1. **[Quick Reference](./ANIMATION-QUICK-REFERENCE.md)** - 10 copy-paste examples for immediate use
2. **[Installation Summary](./ANIMATION-DRIVERS-INSTALLATION.md)** - What was installed and how it works
3. **[Setup Guide](./ANIMATION-DRIVERS-SETUP.md)** - Detailed setup and configuration

### 📖 In-Depth Guides

4. **[Complete Animation Guide](./ANIMATIONS-GUIDE.md)** - Comprehensive guide with recipes and best practices
5. **[Implementation Summary](./ANIMATION-IMPLEMENTATION-SUMMARY.md)** - What was implemented and why

## 🎯 Choose Your Path

### I want to copy-paste examples now

→ Start with **[ANIMATION-QUICK-REFERENCE.md](./ANIMATION-QUICK-REFERENCE.md)**

### I want to understand what was installed

→ Read **[ANIMATION-DRIVERS-INSTALLATION.md](./ANIMATION-DRIVERS-INSTALLATION.md)**

### I want to learn all animation patterns

→ Study **[ANIMATIONS-GUIDE.md](./ANIMATIONS-GUIDE.md)**

### I want to see implementation details

→ Review **[ANIMATION-IMPLEMENTATION-SUMMARY.md](./ANIMATION-IMPLEMENTATION-SUMMARY.md)**

## 📦 Available Components

All components are exported from `@/interface/transitions`:

### Page Transitions

- `PageTransition` - Pre-configured transitions (slide, fade, scale, slideUp, slideDown)
- `StackPageTransition` - iOS-style stack navigation
- `ModalPageTransition` - Bottom sheet style
- `TabPageTransition` - Tab switching
- `DirectionalPageTransition` - Forward/backward navigation

### Galleries & Carousels

- `ImageGallery` - Swipe-direction-aware image carousel
- `ContentCarousel` - Generic content carousel
- `CarouselTransition` - Advanced carousel with custom controls

### Modals

- `AnimatedModal` - Center modal with enter/exit animations
- `BottomSheetModal` - Slides up from bottom
- `FullScreenModal` - Slides in from right (iOS style)

### Core

- `AnimatePresence` - Mount/unmount animations
- `useRouteTransition` - Hook for navigation direction tracking

## 🎨 Animation Names

### Spring Animations (Interactive UI)

- `bouncy` - Bouncy spring effect
- `lazy` - Slow, smooth spring
- `quick` - Fast spring (recommended)
- `slow` - Very slow spring
- `slowest` - Ultra slow (for galleries)

### Timing Animations (Page Transitions)

- `100ms`, `200ms`, `300ms`, `400ms`, `500ms`

## ⚙️ Platform Configuration

### Web

- **Driver**: Motion (off-thread WAAPI)
- **File**: `src/tamagui/animations.ts`
- **Performance**: Off-thread via Web Animations API
- **Fallback**: CSS driver (lightest bundle)

### Native (iOS/Android)

- **Driver**: Reanimated (off-thread native)
- **File**: `src/tamagui/animations.native.ts`
- **Performance**: Off-thread native animations
- **Fallback**: React Native driver

Metro bundler automatically selects the correct file based on platform.

## 🔥 Popular Examples

### Image Gallery

```tsx
import { ImageGallery } from '@/interface/transitions';

<ImageGallery
  photos={['url1', 'url2', 'url3']}
  animation="slowest"
  onPhotoChange={(index, direction) => {
    console.log(`Photo ${index}, swipe ${direction}`);
  }}
/>;
```

### Animated Modal

```tsx
import { AnimatedModal } from '@/interface/transitions';

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
</AnimatedModal>;
```

### Page Transition

```tsx
import { PageTransition } from '@/interface/transitions';

export default function MyScreen() {
  return (
    <PageTransition type="slide" animation="quick">
      <YStack>Your content</YStack>
    </PageTransition>
  );
}
```

## 📁 File Structure

```
docs/
├── ANIMATIONS-INDEX.md (this file)
├── ANIMATION-QUICK-REFERENCE.md
├── ANIMATION-DRIVERS-INSTALLATION.md
├── ANIMATION-DRIVERS-SETUP.md
├── ANIMATIONS-GUIDE.md
└── ANIMATION-IMPLEMENTATION-SUMMARY.md

src/
├── tamagui/
│   ├── animations.ts (web - Motion driver)
│   └── animations.native.ts (native - Reanimated driver)
├── interface/
│   ├── components/
│   │   ├── page-transition.tsx
│   │   ├── directional-page-transition.tsx
│   │   ├── carousel-transition.tsx
│   │   ├── image-gallery.tsx
│   │   ├── animated-modal.tsx
│   │   └── page-transition-examples.tsx
│   └── transitions.ts (barrel export)
└── hooks/
  └── use-route-transition.ts
```

## 🎓 Learning Path

1. **Day 1**: Read Quick Reference → Try 3 examples
2. **Day 2**: Read Installation Summary → Understand platform drivers
3. **Day 3**: Study Animation Guide → Learn all patterns
4. **Day 4**: Apply to your screens → Build custom transitions
5. **Day 5**: Review Implementation Summary → Optimize performance

## 🚀 Next Steps

1. Choose a documentation file from above
2. Copy examples and apply to your screens
3. Customize animations and timing
4. Build new transition patterns
5. Share with the team!

## 📚 Related Documentation

- **Tamagui Official**: [tamagui.dev/docs/core/animations](https://tamagui.dev/docs/core/animations)
- **AI Instructions**: `.github/copilot-instructions.md` (Tamagui Animations section)
- **Migration Plan**: `TAMAGUI-MIGRATION-PLAN.md` (Phase 4 ready)

---

**All animation drivers installed ✅**  
**Platform-specific configs ready ✅**  
**Components production-ready ✅**  
**Documentation complete ✅**
