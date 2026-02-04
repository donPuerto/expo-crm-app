/**
 * Animation Configuration - Native (iOS/Android)
 *
 * Uses Reanimated driver for off-thread performance on native.
 * Falls back to React Native driver if Reanimated fails.
 *
 * Platform: Native only (.native.ts extension)
 */

import { createAnimations } from '@tamagui/animations-reanimated';

// React Native fallback animations
import { createAnimations as createRN } from '@tamagui/animations-react-native';

export const animations = createAnimations({
  // Spring animations (Reanimated-based)
  bouncy: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
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
    damping: 20,
    mass: 1.5,
    stiffness: 60,
  },
  slowest: {
    type: 'spring',
    damping: 25,
    mass: 2,
    stiffness: 40,
  },

  // Timing animations (Reanimated timing-based)
  '100ms': {
    type: 'timing',
    duration: 100,
  },
  '200ms': {
    type: 'timing',
    duration: 200,
  },
  '300ms': {
    type: 'timing',
    duration: 300,
  },
  '400ms': {
    type: 'timing',
    duration: 400,
  },
  '500ms': {
    type: 'timing',
    duration: 500,
  },
});

export const rnAnimations = createRN({
  bouncy: {
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  lazy: {
    damping: 18,
    stiffness: 50,
  },
  quick: {
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  slow: {
    damping: 20,
    stiffness: 60,
  },
  slowest: {
    damping: 25,
    stiffness: 40,
  },
  '100ms': {
    type: 'timing',
    duration: 100,
  },
  '200ms': {
    type: 'timing',
    duration: 200,
  },
  '300ms': {
    type: 'timing',
    duration: 300,
  },
  '400ms': {
    type: 'timing',
    duration: 400,
  },
  '500ms': {
    type: 'timing',
    duration: 500,
  },
});
