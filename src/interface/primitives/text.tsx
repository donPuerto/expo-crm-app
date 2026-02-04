import { cn } from '@/lib/utils';
import * as Slot from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Platform, Text as RNText, type Role, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useFont } from '@/hooks/use-font';

const textVariants = cva(
  cn(
    'text-foreground text-base',
    Platform.select({
      web: 'select-text',
    })
  ),
  {
    variants: {
      variant: {
        default: '',
        h1: cn(
          'text-center text-4xl font-extrabold tracking-tight',
          Platform.select({ web: 'scroll-m-20 text-balance' })
        ),
        h2: cn(
          'border-border border-b pb-2 text-3xl font-semibold tracking-tight',
          Platform.select({ web: 'scroll-m-20 first:mt-0' })
        ),
        h3: cn('text-2xl font-semibold tracking-tight', Platform.select({ web: 'scroll-m-20' })),
        h4: cn('text-xl font-semibold tracking-tight', Platform.select({ web: 'scroll-m-20' })),
        p: 'mt-3 leading-7 sm:mt-6',
        blockquote: 'mt-4 border-l-2 pl-3 italic sm:mt-6 sm:pl-6',
        code: cn(
          'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'
        ),
        lead: 'text-muted-foreground text-xl',
        large: 'text-lg font-semibold',
        small: 'text-sm font-medium leading-none',
        muted: 'text-muted-foreground text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type TextVariantProps = VariantProps<typeof textVariants>;

type TextVariant = NonNullable<TextVariantProps['variant']>;

const ROLE: Partial<Record<TextVariant, Role>> = {
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
  blockquote: Platform.select({ web: 'blockquote' as Role }),
  code: Platform.select({ web: 'code' as Role }),
};

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
  h1: '1',
  h2: '2',
  h3: '3',
  h4: '4',
};

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
  className,
  asChild = false,
  variant = 'default',
  style,
  ...props
}: React.ComponentProps<typeof RNText> &
  TextVariantProps &
  React.RefAttributes<RNText> & {
    asChild?: boolean;
  }) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot.Text : RNText;

  // Get theme colors and font for native styling
  const foregroundColor = useThemeColor({}, 'foreground');
  const mutedForegroundColor = useThemeColor({}, 'muted-foreground');
  const primaryForegroundColor = useThemeColor({}, 'primary-foreground');
  const destructiveForegroundColor = useThemeColor({}, 'destructive-foreground');
  const secondaryForegroundColor = useThemeColor({}, 'secondary-foreground');
  const accentForegroundColor = useThemeColor({}, 'accent-foreground');
  const primaryColor = useThemeColor({}, 'primary');
  const { fontFamily, getScaledFontSize } = useFont();

  // Determine text color based on context class (for button text)
  const getTextColorFromContext = () => {
    if (!textClass || Platform.OS === 'web') return foregroundColor;

    // Button text variants
    if (textClass.includes('text-primary-foreground')) return primaryForegroundColor;
    if (textClass.includes('text-white')) return '#ffffff';
    if (textClass.includes('text-accent-foreground')) return accentForegroundColor;
    if (textClass.includes('text-secondary-foreground')) return secondaryForegroundColor;
    if (textClass.includes('text-primary')) return primaryColor;
    if (textClass.includes('text-muted-foreground')) return mutedForegroundColor;

    return foregroundColor;
  };

  // Create native styles based on variant
  const getNativeStyle = () => {
    if (Platform.OS === 'web') return {}; // Let Tailwind handle web

    const baseStyle = {
      color: getTextColorFromContext(),
      fontFamily,
      fontSize: getScaledFontSize(16),
    };

    const variantStyle = {
      default: {},
      h1: { fontSize: getScaledFontSize(36), fontWeight: '800' as const, textAlign: 'center' as const },
      h2: { fontSize: getScaledFontSize(30), fontWeight: '600' as const },
      h3: { fontSize: getScaledFontSize(24), fontWeight: '600' as const },
      h4: { fontSize: getScaledFontSize(20), fontWeight: '600' as const },
      p: { fontSize: getScaledFontSize(16), lineHeight: getScaledFontSize(24) },
      blockquote: { fontSize: getScaledFontSize(16), fontStyle: 'italic' as const },
      code: { fontSize: getScaledFontSize(14), fontWeight: '600' as const },
      lead: { fontSize: getScaledFontSize(20), color: mutedForegroundColor },
      large: { fontSize: getScaledFontSize(18), fontWeight: '600' as const },
      small: { fontSize: getScaledFontSize(14), fontWeight: '500' as const },
      muted: { fontSize: getScaledFontSize(14), color: mutedForegroundColor },
    }[variant];

    // Apply font weight from context class (for button text)
    let fontWeight: any = undefined;
    if (textClass) {
      if (textClass.includes('font-medium')) fontWeight = '500';
      if (textClass.includes('font-semibold')) fontWeight = '600';
      if (textClass.includes('font-bold')) fontWeight = '700';
    }

    return { ...baseStyle, ...variantStyle, ...(fontWeight ? { fontWeight } : {}) };
  };

  return (
    <Component
      className={cn(textVariants({ variant }), textClass, className)}
      style={[getNativeStyle(), style]}
      role={variant ? ROLE[variant] : undefined}
      aria-level={variant ? ARIA_LEVEL[variant] : undefined}
      {...props}
    />
  );
}

export { Text, TextClassContext };
