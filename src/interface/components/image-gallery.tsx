/**
 * Image Gallery Demo
 *
 * Demonstrates swipe-direction-aware carousel animations.
 * Based on Tamagui AnimatePresence custom prop example.
 *
 * Features:
 * - Swipe direction detection (left/right)
 * - Smooth enter/exit animations
 * - Navigation buttons with icons
 * - Infinite loop (wraps at edges)
 * - Customizable animation speed
 *
 * Usage:
 * ```tsx
 * import { ImageGallery } from '@/interface/components/image-gallery'
 *
 * export default function GalleryScreen() {
 *   const photos = [
 *     'https://picsum.photos/500/300?1',
 *     'https://picsum.photos/500/300?2',
 *     'https://picsum.photos/500/300?3',
 *   ]
 *
 *   return <ImageGallery photos={photos} />
 * }
 * ```
 */

import { AnimatePresence } from '@tamagui/animate-presence';
import { ArrowLeft, ArrowRight } from '@tamagui/lucide-icons';
import { useState } from 'react';
import { XStack, YStack, styled, View } from '@tamagui/core';
import { Image } from 'expo-image';
import type { ViewProps } from '@tamagui/core';

// Gallery item with swipe direction variant
const GalleryItem = styled(YStack, {
  zIndex: 1,
  x: 0,
  opacity: 1,
  position: 'absolute',
  width: '100%',
  height: '100%',

  variants: {
    // going: 1 = right, 0 = nowhere, -1 = left
    going: {
      ':number': (going: number) => ({
        enterStyle: {
          x: going > 0 ? 1000 : going < 0 ? -1000 : 0,
          opacity: 0,
        },
        exitStyle: {
          zIndex: 0,
          x: going < 0 ? 1000 : going > 0 ? -1000 : 0,
          opacity: 0,
        },
      }),
    },
  } as const,
});

// Navigation button styled component
const NavButton = styled(View, {
  position: 'absolute',
  zIndex: 100,
  width: 44,
  height: 44,
  borderRadius: '$round',
  backgroundColor: '$background',
  shadowColor: '$shadowColor',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',

  hoverStyle: {
    scale: 1.1,
    shadowOpacity: 0.3,
  },

  pressStyle: {
    scale: 0.95,
  },

  variants: {
    side: {
      left: {
        left: '$4',
      },
      right: {
        right: '$4',
      },
    },
  } as const,
});

// Utility to wrap array indices
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export interface ImageGalleryProps extends Omit<ViewProps, 'children'> {
  /** Array of image URLs */
  photos: string[];

  /** Initial photo index */
  initialIndex?: number;

  /** Animation speed */
  animation?: 'quick' | 'slow' | 'slowest' | '200ms' | '300ms' | '400ms';

  /** Height of the gallery */
  height?: number | string;

  /** Show navigation buttons */
  showControls?: boolean;

  /** Callback when photo changes */
  onPhotoChange?: (index: number, direction: number) => void;
}

/**
 * Image Gallery with swipe-direction-aware animations
 *
 * Perfect for product galleries, photo viewers, or onboarding flows.
 */
export function ImageGallery({
  photos,
  initialIndex = 0,
  animation = 'slowest',
  height = 300,
  showControls = true,
  onPhotoChange,
  ...viewProps
}: ImageGalleryProps) {
  const [[page, going], setPage] = useState([initialIndex, 0]);

  const imageIndex = wrap(0, photos.length, page);

  const paginate = (direction: number) => {
    const newPage = page + direction;
    setPage([newPage, direction]);
    onPhotoChange?.(wrap(0, photos.length, newPage), direction);
  };

  return (
    <XStack
      overflow="hidden"
      backgroundColor="$background"
      position="relative"
      height={height}
      width="100%"
      alignItems="center"
      borderRadius="$4"
      {...viewProps}
    >
      <AnimatePresence initial={false} custom={{ going }}>
        <GalleryItem key={page} animation={animation} going={going}>
          <Image
            source={{ uri: photos[imageIndex] }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        </GalleryItem>
      </AnimatePresence>

      {showControls && photos.length > 1 && (
        <>
          <NavButton
            side="left"
            onPress={() => paginate(-1)}
            animation="quick"
            aria-label="Previous image"
          >
            <ArrowLeft size={20} color="$color" />
          </NavButton>

          <NavButton
            side="right"
            onPress={() => paginate(1)}
            animation="quick"
            aria-label="Next image"
          >
            <ArrowRight size={20} color="$color" />
          </NavButton>
        </>
      )}

      {/* Image counter */}
      <View position="absolute" bottom="$3" left={0} right={0} alignItems="center">
        <View
          backgroundColor="rgba(0, 0, 0, 0.6)"
          paddingHorizontal="$3"
          paddingVertical="$2"
          borderRadius="$round"
        >
          <YStack.Text fontSize="$2" color="white" fontWeight="600">
            {imageIndex + 1} / {photos.length}
          </YStack.Text>
        </View>
      </View>
    </XStack>
  );
}

/**
 * Example with custom content (not just images)
 */
export interface ContentCarouselProps<T> extends Omit<ViewProps, 'children'> {
  /** Array of items */
  items: T[];

  /** Render function for each item */
  renderItem: (item: T, index: number) => React.ReactNode;

  /** Initial item index */
  initialIndex?: number;

  /** Animation speed */
  animation?: 'quick' | 'slow' | 'slowest' | '200ms' | '300ms' | '400ms';

  /** Height of the carousel */
  height?: number | string;

  /** Show navigation buttons */
  showControls?: boolean;

  /** Callback when item changes */
  onItemChange?: (index: number, direction: number) => void;
}

export function ContentCarousel<T>({
  items,
  renderItem,
  initialIndex = 0,
  animation = 'slowest',
  height = 300,
  showControls = true,
  onItemChange,
  ...viewProps
}: ContentCarouselProps<T>) {
  const [[page, going], setPage] = useState([initialIndex, 0]);

  const itemIndex = wrap(0, items.length, page);

  const paginate = (direction: number) => {
    const newPage = page + direction;
    setPage([newPage, direction]);
    onItemChange?.(wrap(0, items.length, newPage), direction);
  };

  return (
    <XStack
      overflow="hidden"
      backgroundColor="$background"
      position="relative"
      height={height}
      width="100%"
      alignItems="center"
      borderRadius="$4"
      {...viewProps}
    >
      <AnimatePresence initial={false} custom={{ going }}>
        <GalleryItem key={page} animation={animation} going={going}>
          {renderItem(items[itemIndex], itemIndex)}
        </GalleryItem>
      </AnimatePresence>

      {showControls && items.length > 1 && (
        <>
          <NavButton
            side="left"
            onPress={() => paginate(-1)}
            animation="quick"
            aria-label="Previous item"
          >
            <ArrowLeft size={20} color="$color" />
          </NavButton>

          <NavButton
            side="right"
            onPress={() => paginate(1)}
            animation="quick"
            aria-label="Next item"
          >
            <ArrowRight size={20} color="$color" />
          </NavButton>
        </>
      )}
    </XStack>
  );
}
