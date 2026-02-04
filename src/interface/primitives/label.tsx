import { Label as TamaguiLabel, type LabelProps } from 'tamagui';
import { forwardRef } from 'react';

/**
 * Label - Accessible label for form controls
 * 
 * Migrated from rn-primitives to Tamagui
 * Features: Theme-aware, accessible, supports press events
 * 
 * @example
 * ```tsx
 * <Label htmlFor="email">Email</Label>
 * <Label disabled>Disabled label</Label>
 * <Label color="$primary">Styled label</Label>
 * ```
 */

interface CustomLabelProps extends LabelProps {
  /**
   * Whether the label is disabled
   * @default false
   */
  disabled?: boolean;
}

const Label = forwardRef<typeof TamaguiLabel, CustomLabelProps>(
  ({ disabled, ...props }, ref) => {
    return (
      <TamaguiLabel
        ref={ref}
        color="$color"
        fontSize="$3"
        fontWeight="600"
        userSelect="none"
        opacity={disabled ? 0.5 : 1}
        pointerEvents={disabled ? 'none' : 'auto'}
        {...props}
      />
    );
  }
);

Label.displayName = 'Label';

export { Label };
export type { CustomLabelProps as LabelProps };
          className
        )}
        style={[getNativeStyle(), style]}
        {...props}
      />
    </LabelPrimitive.Root>
  );
}

export { Label };
