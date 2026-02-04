/**
 * Route Transition Hook
 *
 * Provides page transition state management for Expo Router screens.
 * Handles animation direction based on navigation history.
 *
 * Usage:
 * ```tsx
 * const { direction, setDirection } = useRouteTransition()
 *
 * <DirectionalPageTransition direction={direction}>
 *   <YourContent />
 * </DirectionalPageTransition>
 * ```
 */

import { useEffect, useState } from 'react';
import { usePathname } from 'expo-router';

export type TransitionDirection = 'forward' | 'backward' | 'none';

type RouteTransitionState = {
  direction: TransitionDirection;
  setDirection: (direction: TransitionDirection) => void;
};

let routeHistory: string[] = [];

function computeDirection(nextPathname: string): TransitionDirection {
  if (routeHistory.length === 0) {
    routeHistory = [nextPathname];
    return 'none';
  }

  const current = routeHistory[routeHistory.length - 1];
  if (current === nextPathname) {
    return 'none';
  }

  const previousIndex = routeHistory.indexOf(nextPathname);
  if (previousIndex !== -1 && previousIndex < routeHistory.length - 1) {
    routeHistory = routeHistory.slice(0, previousIndex + 1);
    return 'backward';
  }

  routeHistory = [...routeHistory, nextPathname];
  return 'forward';
}

/**
 * Hook to track navigation direction for animated transitions.
 *
 * Automatically detects forward/backward navigation based on route changes.
 * Can be manually controlled using setDirection.
 */
export function useRouteTransition(): RouteTransitionState {
  const pathname = usePathname();
  const [direction, setDirection] = useState<TransitionDirection>(() => computeDirection(pathname));

  useEffect(() => {
    setDirection(computeDirection(pathname));
  }, [pathname]);

  return { direction, setDirection };
}

/**
 * Example usage in a screen:
 *
 * ```tsx
 * import { DirectionalPageTransition } from '@/interface/components/directional-page-transition'
 * import { useRouteTransition } from '@/hooks/use-route-transition'
 *
 * export default function MyScreen() {
 *   const { direction } = useRouteTransition()
 *
 *   return (
 *     <DirectionalPageTransition direction={direction}>
 *       <View>Your content</View>
 *     </DirectionalPageTransition>
 *   )
 * }
 * ```
 */
