import { cn } from '@/lib/utils';
import * as LabelPrimitive from '@rn-primitives/label';
import { Platform, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useFont } from '@/hooks/use-font';

function Label({
  className,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  disabled,
  style,
  ...props
}: LabelPrimitive.TextProps & React.RefAttributes<LabelPrimitive.TextRef> & { style?: any }) {
  // Get theme colors and font for native styling
  const foregroundColor = useThemeColor({}, 'foreground');
  const { fontFamily, getScaledFontSize } = useFont();

  // Create native styles
  const getNativeStyle = () => {
    if (Platform.OS === 'web') return {}; // Let Tailwind handle web

    return {
      color: foregroundColor,
      fontFamily,
      fontSize: getScaledFontSize(14),
      fontWeight: '600' as const,
    };
  };

  return (
    <LabelPrimitive.Root
      className={cn(
        'flex select-none flex-row items-center gap-2',
        Platform.select({
          web: 'cursor-default leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
        }),
        disabled && 'opacity-50'
      )}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}>
      <LabelPrimitive.Text
        className={cn(
          'text-foreground text-sm font-semibold',
          Platform.select({ web: 'leading-none' }),
          className
        )}
        style={[getNativeStyle(), style]}
        {...props}
      />
    </LabelPrimitive.Root>
  );
}

export { Label };
