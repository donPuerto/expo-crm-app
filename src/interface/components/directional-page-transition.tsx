/**
 * Directional Page Transition
 *
 * Page transitions that respond to navigation direction (forward/backward).
 * Automatically adjusts enter/exit animations based on direction.
 *
 * Usage with useRouteTransition:
 * ```tsx
 * const { direction } = useRouteTransition()
 *
 * <DirectionalPageTransition direction={direction}>
 *   <YourContent />
 * </DirectionalPageTransition>
 * ```
 */

import { View, styled } from '@tamagui/core';
import type { ViewProps } from '@tamagui/core';
import type { TransitionDirection } from '@/interface/hooks/use-route-transition';

// Styled page with directional variants
const DirectionalPage = styled(View, {
  flex: 1,

  variants: {
    direction: {
      forward: {
        enterStyle: {
          opacity: 0,
          x: 30,
        },
        exitStyle: {
          opacity: 0,
          x: -30,
        },
      },
      backward: {
        enterStyle: {
          opacity: 0,
          x: -30,
        },
        exitStyle: {
          opacity: 0,
          x: 30,
        },
      },
      none: {
        enterStyle: {
          opacity: 0,
        },
        exitStyle: {
          opacity: 0,
        },
      },
    },
  } as const,

  defaultVariants: {
    direction: 'forward',
  },
});

export interface DirectionalPageTransitionProps extends ViewProps {
  children: React.ReactNode;
  direction?: TransitionDirection;
  /**
   * Custom animation name from config
   * @default 'quick'
   */
  animation?: string;
}

/**
 * Directional page transition component
 *
 * Slides pages in/out based on navigation direction:
 * - Forward: slides in from right, exits to left
 * - Backward: slides in from left, exits to right
 * - None: simple fade
 */
export function DirectionalPageTransition({
  children,
  direction = 'forward',
  animation = 'quick',
  ...viewProps
}: DirectionalPageTransitionProps) {
  return (
    <DirectionalPage direction={direction} animation={animation} {...viewProps}>
      {children}
    </DirectionalPage>
  );
}
