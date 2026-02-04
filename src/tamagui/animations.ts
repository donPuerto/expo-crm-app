/**
 * Animation Configuration - Web
 *
 * Uses Motion driver for off-thread performance on web via WAAPI.
 * Falls back to CSS driver for lightweight bundle if Motion fails.
 *
 * Platform: Web only (.ts extension)
 */

import { createAnimations } from '@tamagui/animations-motion';

// CSS fallback animations (lightweight)
import { createAnimations as createCSS } from '@tamagui/animations-css';

export const animations = createAnimations({
  // Spring animations (Motion-based)
  bouncy: {
    type: 'spring',
    damping: 9,
    mass: 0.9,
    stiffness: 150,
  },
  lazy: {
    type: 'spring',
    damping: 18,
    mass: 1,
    stiffness: 50,
  },
  quick: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  slow: {
    type: 'spring',
    damping: 25,
    mass: 1.5,
    stiffness: 60,
  },
  slowest: {
    type: 'spring',
    damping: 30,
    mass: 2,
    stiffness: 40,
  },

  // Timing animations (Motion duration-based)
  '100ms': {
    type: 'spring',
    duration: 100,
  },
  '200ms': {
    type: 'spring',
    duration: 200,
  },
  '300ms': {
    type: 'spring',
    duration: 300,
  },
  '400ms': {
    type: 'spring',
    duration: 400,
  },
  '500ms': {
    type: 'spring',
    duration: 500,
  },
});

export const cssAnimations = createCSS({
  bouncy: 'cubic-bezier(0.68, -0.55, 0.265, 1.55) 300ms',
  lazy: 'ease-out 500ms',
  quick: 'ease-in-out 200ms',
  slow: 'ease-in-out 600ms',
  slowest: 'ease-in-out 800ms',
  '100ms': 'ease-in-out 100ms',
  '200ms': 'ease-in-out 200ms',
  '300ms': 'ease-in-out 300ms',
  '400ms': 'ease-in-out 400ms',
  '500ms': 'ease-in-out 500ms',
});
