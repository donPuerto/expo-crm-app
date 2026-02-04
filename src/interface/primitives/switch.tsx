import { Switch as TamaguiSwitch, type SwitchProps } from 'tamagui';
import { forwardRef } from 'react';

/**
 * Switch - Toggle switch control
 *
 * Migrated from rn-primitives to Tamagui
 * Features: Theme-aware, animated, accessible
 *
 * @example
 * ```tsx
 * <Switch checked={enabled} onCheckedChange={setEnabled} />
 * <Switch size="$4" />
 * <Switch disabled />
 * ```
 */

const Switch = forwardRef<typeof TamaguiSwitch, SwitchProps>((props, ref) => {
  return (
    <TamaguiSwitch
      ref={ref}
      size="$2"
      backgroundColor={props.checked ? '$primary' : '$input'}
      borderColor="transparent"
      animation="quick"
      {...props}
    >
      <TamaguiSwitch.Thumb
        animation="quick"
        backgroundColor={props.checked ? '$primaryForeground' : '$background'}
      />
    </TamaguiSwitch>
  );
});

Switch.displayName = 'Switch';

export { Switch };
export type { SwitchProps };
