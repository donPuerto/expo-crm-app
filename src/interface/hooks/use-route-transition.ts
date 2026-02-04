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

import { useState, useEffect } from 'react';
import { usePathname } from 'expo-router';

export type TransitionDirection = 'forward' | 'backward' | 'none';

interface RouteTransitionState {
  direction: TransitionDirection;
  setDirection: (direction: TransitionDirection) => void;
}

/**
 * Hook to track navigation direction for animated transitions
 *
 * Automatically detects forward/backward navigation based on route changes.
 * Can be manually controlled using setDirection.
 */
export function useRouteTransition(): RouteTransitionState {
  const pathname = usePathname();
  const [direction, setDirection] = useState<TransitionDirection>('none');
  const [, setHistory] = useState<string[]>([pathname]);

  useEffect(() => {
    setHistory(prev => {
      // If current path is same as last, no change
      if (prev[prev.length - 1] === pathname) {
        return prev;
      }

      // Check if going back
      const previousIndex = prev.indexOf(pathname);
      if (previousIndex !== -1 && previousIndex < prev.length - 1) {
        setDirection('backward');
        return prev.slice(0, previousIndex + 1);
      }

      // Going forward
      setDirection('forward');
      return [...prev, pathname];
    });
  }, [pathname]);

  return { direction, setDirection };
}

/**
 * Example usage in a screen:
 *
 * ```tsx
 * import { DirectionalPageTransition } from '@/interface/components/directional-page-transition'
 * import { useRouteTransition } from '@/interface/hooks/use-route-transition'
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
