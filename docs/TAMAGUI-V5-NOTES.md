# Tamagui v5 Configuration Notes

## Current Status

We're using **@tamagui/config v2.0.0-rc.1** which predates the v5 release. Our configuration follows v5 best practices for easy migration when stable.

## Config v5 vs v2 Differences

### 1. Package Imports

**v5 (when available):**

```typescript
import { defaultConfig } from '@tamagui/config/v5';
import { animations } from '@tamagui/config/v5-css'; // or v5-rn, v5-reanimated, v5-motion
import { createV5Theme, defaultChildrenThemes } from '@tamagui/config/v5';
import { blue, blueDark, gray, grayDark } from '@tamagui/colors';
```

**v2 (current):**

```typescript
import { config as defaultConfig } from '@tamagui/config';
import { createTamagui } from '@tamagui/core';
```

### 2. Animation Drivers (v5)

Animations are **NOT bundled** in v5 - must import separately:

- `@tamagui/config/v5-css` - CSS animations (smallest, best for web)
- `@tamagui/config/v5-motion` - Spring physics animations
- `@tamagui/config/v5-rn` - React Native Animated API
- `@tamagui/config/v5-reanimated` - Reanimated (best native performance)

**Cross-platform example:**

```typescript
import { animations as animationsCSS } from '@tamagui/config/v5-css';
import { animations as animationsReanimated } from '@tamagui/config/v5-reanimated';
import { isWeb } from 'tamagui';

const config = createTamagui({
  ...defaultConfig,
  animations: isWeb ? animationsCSS : animationsReanimated,
});
```

### 3. Media Query Changes

**v4/v2:**

- `$2xl`, `$2xs`
- `$max2Xl`

**v5:**

- `$xxl`, `$xxs`, `$xxxs`
- `$max-xxl`, `$max-xxs`, `$max-xxxs`
- New: `$height-xxxs`, `$height-xxs`, `$height-xs`, `$height-sm`, etc.
- New: `$pointerTouch` for touch device detection

### 4. Default Settings Changes

**v5 defaults:**

```typescript
{
  defaultFont: 'body',
  fastSchemeChange: true,
  shouldAddPrefersColorThemes: true,
  allowedStyleValues: 'somewhat-strict-web',
  addThemeClassName: 'html',
  onlyAllowShorthands: true,
  styleCompat: 'react-native', // flex uses flexBasis: 0 (v4 used 'legacy')
  // defaultPosition NOT SET (defaults to browser 'static', v4 used 'relative')
}
```

### 5. Theme Creation with createV5Theme

**v5 helper function:**

```typescript
import { createV5Theme, defaultChildrenThemes } from '@tamagui/config/v5';
import { blue, blueDark, cyan, cyanDark } from '@tamagui/colors';

const themes = createV5Theme({
  childrenThemes: {
    ...defaultChildrenThemes, // blue, red, green, yellow, etc.
    cyan: { light: cyan, dark: cyanDark },
  },
});
```

**Options:**

- `childrenThemes` - Color palettes (use `@tamagui/colors` or custom)
- `lightPalette` / `darkPalette` - Override base 12-color palettes
- `grandChildrenThemes` - Override alt1, alt2, surface1, etc.
- `componentThemes` - Component-specific themes (default: false in v5)

### 6. Color Adjustment Utilities

**v5 adds helpers:**

```typescript
import { adjustPalette, adjustPalettes } from '@tamagui/config/v5';

// Adjust single palette
const mutedBlue = adjustPalette(blue, (hsl, index) => ({
  ...hsl,
  s: hsl.s * 0.7, // desaturate
  l: Math.min(100, hsl.l * 1.1), // lighten
}));

// Adjust multiple palettes
const mutedThemes = adjustPalettes(defaultChildrenThemes, {
  default: {
    light: hsl => ({ ...hsl, s: hsl.s * 0.8 }),
    dark: hsl => ({ ...hsl, s: hsl.s * 0.6 }),
  },
  yellow: {
    light: hsl => ({ ...hsl, s: hsl.s * 0.5 }),
  },
});
```

### 7. New Color Themes

**v5 includes:**

- Grayscale: `gray`, `neutral`
- Colors: `blue`, `green`, `red`, `yellow`, `orange`, `pink`, `purple`, `teal`
- Fixed: `black`, `white`

All use **Radix Colors v3** with improved accessibility.

### 8. Theme Values

**Standard keys (same in our v2 config):**

- Background: `background`, `backgroundHover`, `backgroundPress`, `backgroundFocus`, `backgroundStrong`, `backgroundTransparent`
- Color: `color`, `colorHover`, `colorPress`, `colorFocus`, `colorTransparent`
- Border: `borderColor`, `borderColorHover`, `borderColorPress`, `borderColorFocus`
- Other: `placeholderColor`, `outlineColor`, `shadowColor`, `shadowColorHover`

**v5 additions:**

- Opacity variants: `color01` (10%), `color0075` (7.5%), `background02` (20%), etc.
- Shadow scales: `shadow1`-`shadow8`
- Highlight scales: `highlight1`-`highlight8`
- Radix scales: `$blue1`-`$blue12`, `$red1`-`$red12`, etc.
- Neutral colors: `neutral1`-`neutral12`
- Accent colors: `accent1`-`accent12`, `accentBackground`, `accentColor`

### 9. Tree Shaking (v5 Optimization)

Remove theme JS from client bundle (saves ~20KB):

```typescript
export const config = createTamagui({
  ...defaultConfig,
  // Only load themes on server - client hydrates from CSS
  themes: process.env.VITE_ENVIRONMENT === 'client' ? ({} as typeof themes) : themes,
});
```

Requires SSR and `config.getCSS()` or bundler `outputCSS` option.

## Our Current Implementation

### ✅ Already v5-Compatible

1. **Standard theme keys** - All required keys present
2. **BaseTheme pattern** - Type safety via `type BaseTheme = typeof light`
3. **satisfies keyword** - `satisfies Record<string, BaseTheme>`
4. **Semantic color naming** - primary, secondary, destructive, etc.
5. **Proper imports** - Using `@tamagui/core` for createTamagui

### ⚠️ Pending v5 Migration

1. **Animation driver** - Need to choose and import (v5-css, v5-rn, v5-reanimated)
2. **Media query names** - Update when using max/min width queries
3. **Color themes** - Add more themes using `@tamagui/colors` and `createV5Theme`
4. **Opacity variants** - Add `color01`, `background02`, etc. if needed
5. **Shadow/highlight scales** - Add if needed for elevation effects

## Migration Checklist (When v5 Stable)

- [ ] Update package: `npm install @tamagui/config@latest`
- [ ] Change import: `@tamagui/config` → `@tamagui/config/v5`
- [ ] Import animations: Add `import { animations } from '@tamagui/config/v5-reanimated'`
- [ ] Use createV5Theme: Migrate to `createV5Theme({ childrenThemes: {...} })`
- [ ] Update media queries: Rename `$2xl` → `$xxl`, `$max2Xl` → `$max-xxl`
- [ ] Review flex behavior: `styleCompat: 'react-native'` (flexBasis: 0)
- [ ] Review position: No `defaultPosition` set (defaults to static)
- [ ] Test color values: Radix Colors v3 has slightly different shades
- [ ] Consider tree shaking: Implement if using SSR

## References

- [Tamagui Config v5 Docs](https://tamagui.dev/docs/core/config-v5)
- [Tamagui Colors Package](https://tamagui.dev/docs/core/colors)
- [Radix Colors v3](https://www.radix-ui.com/colors)
- [Animation Drivers](https://tamagui.dev/docs/core/config-v5#choosing-an-animation-driver)
