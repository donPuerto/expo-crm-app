/**
 * Carousel/Swipeable Page Transition
 *
 * Advanced page transition with swipe direction detection.
 * Perfect for image galleries, onboarding flows, or any swipeable content.
 *
 * Based on Tamagui AnimatePresence `custom` prop example.
 *
 * Usage:
 * ```tsx
 * const items = ['Page 1', 'Page 2', 'Page 3']
 *
 * <CarouselTransition
 *   items={items}
 *   renderItem={(item) => <View><Text>{item}</Text></View>}
 * />
 * ```
 */

import { useState } from 'react';
import { View, XStack, styled } from '@tamagui/core';
import { AnimatePresence } from '@tamagui/animate-presence';
import type { ViewProps } from '@tamagui/core';

// Carousel item with swipe direction variants
const CarouselItem = styled(View, {
  flex: 1,
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

// Utility to wrap array indices
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export interface CarouselTransitionProps<T> extends Omit<ViewProps, 'children'> {
  /** Array of items to display */
  items: T[];

  /** Render function for each item */
  renderItem: (item: T, index: number) => React.ReactNode;

  /** Initial page index */
  initialPage?: number;

  /** Animation name from config */
  animation?: string;

  /** Callback when page changes */
  onPageChange?: (page: number, direction: number) => void;

  /** Show navigation controls */
  showControls?: boolean;

  /** Custom navigation controls */
  renderControls?: (props: {
    goNext: () => void;
    goPrevious: () => void;
    currentPage: number;
    totalPages: number;
  }) => React.ReactNode;
}

/**
 * Carousel with swipe-direction-aware transitions
 *
 * Features:
 * - Automatic swipe direction detection
 * - Smooth enter/exit animations
 * - Optional navigation controls
 * - Infinite loop (wraps at edges)
 */
export function CarouselTransition<T>({
  items,
  renderItem,
  initialPage = 0,
  animation = 'quick',
  onPageChange,
  showControls = false,
  renderControls,
  ...viewProps
}: CarouselTransitionProps<T>) {
  const [[page, going], setPage] = useState([initialPage, 0]);

  const itemIndex = wrap(0, items.length, page);

  const paginate = (direction: number) => {
    setPage([page + direction, direction]);
    onPageChange?.(page + direction, direction);
  };

  const goNext = () => paginate(1);
  const goPrevious = () => paginate(-1);

  return (
    <View position="relative" flex={1} overflow="hidden" {...viewProps}>
      <AnimatePresence initial={false} custom={{ going }}>
        <CarouselItem key={page} animation={animation} going={going}>
          {renderItem(items[itemIndex], itemIndex)}
        </CarouselItem>
      </AnimatePresence>

      {showControls &&
        (renderControls ? (
          renderControls({
            goNext,
            goPrevious,
            currentPage: itemIndex,
            totalPages: items.length,
          })
        ) : (
          <XStack
            position="absolute"
            bottom="$4"
            left={0}
            right={0}
            justifyContent="center"
            gap="$2"
          >
            {items.map((_, i) => (
              <View
                key={i}
                width={8}
                height={8}
                borderRadius="$round"
                backgroundColor={i === itemIndex ? '$primary' : '$borderColor'}
                onPress={() => {
                  const direction = i > itemIndex ? 1 : -1;
                  setPage([i, direction]);
                  onPageChange?.(i, direction);
                }}
                cursor="pointer"
                hoverStyle={{ scale: 1.2 }}
                pressStyle={{ scale: 0.9 }}
              />
            ))}
          </XStack>
        ))}
    </View>
  );
}

/**
 * Example usage:
 *
 * ```tsx
 * import { CarouselTransition } from '@/interface/components/carousel-transition'
 * import { View, Text, Image } from '@tamagui/core'
 *
 * const images = [
 *   'https://picsum.photos/500/300?1',
 *   'https://picsum.photos/500/300?2',
 *   'https://picsum.photos/500/300?3',
 * ]
 *
 * export default function Gallery() {
 *   return (
 *     <CarouselTransition
 *       items={images}
 *       renderItem={(url) => (
 *         <Image src={url} width="100%" height="100%" />
 *       )}
 *       showControls
 *       animation="slow"
 *     />
 *   )
 * }
 * ```
 */
