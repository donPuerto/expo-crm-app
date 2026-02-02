import { cn } from '@/lib/utils';
import * as SeparatorPrimitive from '@rn-primitives/separator';
import { Platform } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  style,
  ...props
}: SeparatorPrimitive.RootProps & React.RefAttributes<SeparatorPrimitive.RootRef> & { style?: any }) {
  // Get theme color for native styling
  const borderColor = useThemeColor({}, 'border');

  // Create native styles
  const getNativeStyle = () => {
    if (Platform.OS === 'web') return {}; // Let Tailwind handle web

    const baseStyle = {
      backgroundColor: borderColor,
      flexShrink: 0,
    };

    const orientationStyle = orientation === 'horizontal'
      ? { height: 1, width: '100%' }
      : { height: '100%', width: 1 };

    return { ...baseStyle, ...orientationStyle };
  };

  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'bg-border shrink-0',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
      style={[getNativeStyle(), style]}
      {...props}
    />
  );
}

export { Separator };
