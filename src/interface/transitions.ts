/**
 * Page Transitions
 *
 * Export all page transition components for easy importing.
 *
 * Usage:
 * ```tsx
 * import {
 *   PageTransition,
 *   ImageGallery,
 *   AnimatedModal,
 *   AnimatePresence,
 * } from '@/interface/transitions'
 * ```
 */

export {
  PageTransition,
  AnimatedPage,
  StackPageTransition,
  ModalPageTransition,
  TabPageTransition,
  type PageTransitionProps,
  type PageTransitionType,
} from './components/page-transition';

export {
  DirectionalPageTransition,
  type DirectionalPageTransitionProps,
} from './components/directional-page-transition';

export { CarouselTransition, type CarouselTransitionProps } from './components/carousel-transition';

export {
  ImageGallery,
  ContentCarousel,
  type ImageGalleryProps,
  type ContentCarouselProps,
} from './components/image-gallery';

export {
  AnimatedModal,
  BottomSheetModal,
  FullScreenModal,
  type AnimatedModalProps,
} from './components/animated-modal';

export { useRouteTransition, type TransitionDirection } from './hooks/use-route-transition';

// Re-export AnimatePresence from Tamagui for convenience
export { AnimatePresence } from '@tamagui/animate-presence';
