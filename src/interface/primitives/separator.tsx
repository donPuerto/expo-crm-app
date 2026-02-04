import { Separator as TamaguiSeparator, type SeparatorProps } from 'tamagui';
import { forwardRef } from 'react';

/**
 * Separator - A visual or semantic separator
 *
 * Migrated from rn-primitives to Tamagui
 * Features: Theme-aware, responsive, accessible
 *
 * @example
 * ```tsx
 * <Separator />
 * <Separator orientation="vertical" />
 * <Separator backgroundColor="$primary" />
 * ```
 */

interface CustomSeparatorProps extends SeparatorProps {
  /**
   * The orientation of the separator
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Whether the separator is purely decorative (no semantic meaning)
   * @default true
   */
  decorative?: boolean;
}

const Separator = forwardRef<typeof TamaguiSeparator, CustomSeparatorProps>(
  ({ orientation = 'horizontal', decorative = true, ...props }, ref) => {
    return (
      <TamaguiSeparator
        ref={ref}
        orientation={orientation}
        backgroundColor="$borderColor"
        {...(orientation === 'horizontal'
          ? { height: 1, width: '100%' }
          : { height: '100%', width: 1 })}
        {...props}
      />
    );
  }
);

Separator.displayName = 'Separator';

export { Separator };
export type { CustomSeparatorProps as SeparatorProps };
