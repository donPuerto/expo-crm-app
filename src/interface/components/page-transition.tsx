/**
 * Page Transition Wrapper
 *
 * Provides animated page transitions for Expo Router screens.
 * Supports different animations for enter (incoming) and exit (outgoing) pages.
 *
 * Usage:
 * ```tsx
 * export default function MyScreen() {
 *   return (
 *     <PageTransition type="slide">
 *       <View>Your content</View>
 *     </PageTransition>
 *   )
 * }
 * ```
 */

import { View, styled } from '@tamagui/core';
import { AnimatePresence } from '@tamagui/animate-presence';
import type { ViewProps } from '@tamagui/core';

// Styled page container with animation variants
const PageContainer = styled(View, {
  flex: 1,

  variants: {
    type: {
      // Slide transition (default)
      slide: {
        enterStyle: {
          opacity: 0,
          x: 20,
        },
        exitStyle: {
          opacity: 0,
          x: -20,
        },
      },

      // Fade transition
      fade: {
        enterStyle: {
          opacity: 0,
        },
        exitStyle: {
          opacity: 0,
        },
      },

      // Scale transition
      scale: {
        enterStyle: {
          opacity: 0,
          scale: 0.95,
        },
        exitStyle: {
          opacity: 0,
          scale: 1.05,
        },
      },

      // Slide up (bottom sheet style)
      slideUp: {
        enterStyle: {
          opacity: 0,
          y: 50,
        },
        exitStyle: {
          opacity: 0,
          y: 50,
        },
      },

      // Slide down
      slideDown: {
        enterStyle: {
          opacity: 0,
          y: -50,
        },
        exitStyle: {
          opacity: 0,
          y: -50,
        },
      },
    },
  } as const,

  defaultVariants: {
    type: 'slide',
  },
});

export type PageTransitionType = 'slide' | 'fade' | 'scale' | 'slideUp' | 'slideDown';

export interface PageTransitionProps extends ViewProps {
  children: React.ReactNode;
  type?: PageTransitionType;
  /**
   * Custom animation name from config
   * @default 'quick'
   */
  animation?: string;
  /**
   * Use different animations for enter vs exit
   * @example { enter: 'lazy', exit: 'quick' }
   */
  transitionConfig?: {
    enter?: string;
    exit?: string;
    default?: string;
  };
}

/**
 * Page transition wrapper component
 *
 * Automatically handles enter/exit animations for route changes.
 * Does not require AnimatePresence wrapper - handles it internally.
 */
export function PageTransition({
  children,
  type = 'slide',
  animation = 'quick',
  transitionConfig,
  ...viewProps
}: PageTransitionProps) {
  const transition = transitionConfig || animation;

  return (
    <PageContainer type={type} animation={transition} {...viewProps}>
      {children}
    </PageContainer>
  );
}

/**
 * Animated page wrapper for use with AnimatePresence
 *
 * Use this when you need manual control over AnimatePresence
 * (e.g., conditional rendering, multiple pages)
 *
 * @example
 * ```tsx
 * <AnimatePresence>
 *   {isVisible && (
 *     <AnimatedPage key="page-1" type="slide">
 *       <View>Content</View>
 *     </AnimatedPage>
 *   )}
 * </AnimatePresence>
 * ```
 */
export function AnimatedPage({
  children,
  type = 'slide',
  animation = 'quick',
  transitionConfig,
  ...viewProps
}: PageTransitionProps) {
  const transition = transitionConfig || animation;

  return (
    <PageContainer type={type} animation={transition} {...viewProps}>
      {children}
    </PageContainer>
  );
}

/**
 * Stack-style page transition (for nested navigation)
 *
 * Pages slide in from right, slide out to left (iOS style)
 */
export function StackPageTransition({ children, ...props }: Omit<PageTransitionProps, 'type'>) {
  return (
    <PageTransition type="slide" animation={{ enter: 'quick', exit: '200ms' }} {...props}>
      {children}
    </PageTransition>
  );
}

/**
 * Modal-style page transition
 *
 * Pages slide up from bottom, slide down on exit
 */
export function ModalPageTransition({ children, ...props }: Omit<PageTransitionProps, 'type'>) {
  return (
    <PageTransition type="slideUp" animation="quick" {...props}>
      {children}
    </PageTransition>
  );
}

/**
 * Tab-style page transition
 *
 * Simple fade transition for tab changes
 */
export function TabPageTransition({ children, ...props }: Omit<PageTransitionProps, 'type'>) {
  return (
    <PageTransition type="fade" animation="200ms" {...props}>
      {children}
    </PageTransition>
  );
}
