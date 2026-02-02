import { cn } from '@/lib/utils';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Platform, StyleSheet, TextInput, type TextInputProps } from 'react-native';

function Input({ className, style, ...props }: TextInputProps & React.RefAttributes<TextInput>) {
  // Get theme colors
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const cardColor = useThemeColor({}, 'card');
  const placeholderColor = useThemeColor({}, 'icon');

  return (
    <TextInput
      style={[
        styles.input,
        {
          borderColor,
          color: textColor,
          backgroundColor: cardColor + '99', // 60% opacity
        },
        style,
      ]}
      className={cn(
        'flex h-12 w-full min-w-0 flex-row items-center rounded-lg border px-4 py-3 text-base leading-5',
        props.editable === false &&
          cn(
            'opacity-50',
            Platform.select({ web: 'disabled:pointer-events-none disabled:cursor-not-allowed' })
          ),
        Platform.select({
          web: cn(
            'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow,background-color] md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
          ),
          native: '',
        }),
        className
      )}
      placeholderTextColor={placeholderColor}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
});

export { Input };
