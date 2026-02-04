/**
 * Custom hook for responsive layout utilities
 * Combines useMedia for type-safe responsive logic
 */

import { useMedia } from '@tamagui/core';

export function useResponsive() {
  const media = useMedia();

  return {
    // Direct media query access
    isMobile: media.xs || media.sm,
    isTablet: media.md,
    isDesktop: media.lg || media.xl || media.xxl,

    // Specific breakpoints
    isXs: media.xs,
    isSm: media.sm,
    isMd: media.md,
    isLg: media.lg,
    isXl: media.xl,
    isXxl: media.xxl,

    // Greater than breakpoints
    isGtXs: media.gtXs,
    isGtSm: media.gtSm,
    isGtMd: media.gtMd,
    isGtLg: media.gtLg,

    // Orientation/height
    isShort: media.short,
    isTall: media.tall,

    // Input methods
    hasHover: !media.hoverNone,
    hasTouch: media.pointerCoarse,
  };
}

/**
 * Example usage:
 *
 * const { isMobile, isDesktop } = useResponsive()
 *
 * if (isMobile) {
 *   return <MobileNav />
 * }
 *
 * return <DesktopNav />
 */
