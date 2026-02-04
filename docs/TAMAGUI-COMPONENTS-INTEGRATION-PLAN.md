# Tamagui Official Components Integration Plan

**Status:** 🚀 IN PROGRESS  
**Date:** February 4, 2026  
**Goal:** Replace custom primitives with official Tamagui UI components

---

## 📦 Installed Tamagui Packages (from package.json)

### ✅ Already Installed

**Core:**

- `tamagui` - Main package (includes Button, Input, Checkbox, etc.)
- `@tamagui/core` - Core styling engine
- `@tamagui/stacks` - XStack, YStack, ZStack

**Layout & Navigation:**

- `@tamagui/accordion` - Collapsible sections
- `@tamagui/tabs` - Tab navigation
- `@tamagui/group` - Visual grouping (borders)
- `@tamagui/scroll-view` - Enhanced ScrollView

**Overlays & Dialogs:**

- `@tamagui/alert-dialog` - Alert modals
- `@tamagui/dialog` - Custom dialogs
- `@tamagui/popover` - Popover menus
- `@tamagui/sheet` - Bottom sheets
- `@tamagui/portal` - Portal rendering
- `@tamagui/context-menu` - Right-click menus
- `@tamagui/menu` - Dropdown menus

**Display Components:**

- `@tamagui/avatar` - User avatars ✅ (we created custom version)
- `@tamagui/card` - Content cards ✅ (we created custom version)
- `@tamagui/image` - Enhanced images
- `@tamagui/list-item` - List items
- `@tamagui/separator` - Dividers

**Visual:**

- `@tamagui/linear-gradient` - Gradients
- `@tamagui/shapes` - Square, Circle
- `@tamagui/lucide-icons` - Icons

**Utilities:**

- `@tamagui/animate-presence` - Enter/exit animations
- `@tamagui/focus-scope` - Focus management
- `@tamagui/roving-focus` - Keyboard navigation
- `@tamagui/visually-hidden` - Screen reader only
- `@tamagui/elements` - HTML semantic elements
- `@tamagui/text` - Text, Heading components

**Animations:**

- `@tamagui/animations-react-native` - Current driver
- `@tamagui/animations-reanimated` - Reanimated driver
- `@tamagui/animations-motion` - Motion driver
- `@tamagui/animations-css` - CSS driver

**Native:**

- `@tamagui/native` - Native setup helpers
- `burnt` - Native toasts
- `zeego` - Native menus

---

## 🎯 Integration Strategy

### Phase 1: Core Form Components (Priority 1)

**Replace custom primitives with official components**

| Component   | Status | Package               | Custom File to Replace       |
| ----------- | ------ | --------------------- | ---------------------------- |
| Button      | ⏳     | `tamagui`             | `button.tamagui.tsx`         |
| Input       | ✅     | `tamagui` (TextInput) | `input.tsx` (already custom) |
| Checkbox    | 📦     | `tamagui`             | Need to create               |
| Switch      | 📦     | `tamagui`             | Need to create               |
| RadioGroup  | 📦     | `tamagui`             | Need to create               |
| Select      | 📦     | `tamagui`             | Need to create               |
| Slider      | 📦     | `tamagui`             | Need to create               |
| Textarea    | ⏳     | `tamagui` (TextArea)  | `textarea.tamagui.tsx`       |
| Label       | ⏳     | `tamagui`             | `label.tamagui.tsx`          |
| Form        | 📦     | `tamagui`             | Need to create               |
| Progress    | 📦     | `tamagui`             | Need to create               |
| ToggleGroup | 📦     | `tamagui`             | Need to create               |

### Phase 2: Display Components (Priority 2)

**Use official components for UI elements**

| Component | Status | Package              | Custom File to Replace |
| --------- | ------ | -------------------- | ---------------------- |
| Avatar    | ⏳     | `@tamagui/avatar`    | `avatar.tamagui.tsx`   |
| Card      | ⏳     | `@tamagui/card`      | `card.tamagui.tsx`     |
| Badge     | ⏳     | `tamagui`            | `badge.tamagui.tsx`    |
| Separator | 📦     | `@tamagui/separator` | N/A                    |
| Image     | 📦     | `@tamagui/image`     | N/A                    |
| ListItem  | 📦     | `@tamagui/list-item` | N/A                    |

### Phase 3: Navigation & Layout (Priority 3)

**Enhanced navigation components**

| Component  | Status | Package                | Usage                |
| ---------- | ------ | ---------------------- | -------------------- |
| Tabs       | 📦     | `@tamagui/tabs`        | Tab navigation       |
| Accordion  | 📦     | `@tamagui/accordion`   | Collapsible sections |
| Group      | 📦     | `@tamagui/group`       | Visual grouping      |
| ScrollView | 📦     | `@tamagui/scroll-view` | Enhanced scroll      |

### Phase 4: Overlays & Dialogs (Priority 4)

**Modal and overlay components**

| Component   | Status | Package                    | Usage                |
| ----------- | ------ | -------------------------- | -------------------- |
| Dialog      | 📦     | `@tamagui/dialog`          | Custom modals        |
| AlertDialog | 📦     | `@tamagui/alert-dialog`    | Confirmation dialogs |
| Sheet       | 📦     | `@tamagui/sheet`           | Bottom sheets        |
| Popover     | 📦     | `@tamagui/popover`         | Contextual popovers  |
| Tooltip     | 📦     | `tamagui`                  | Tooltips             |
| Toast       | 📦     | `@tamagui/toast` + `burnt` | Notifications        |

### Phase 5: Menus (Priority 5)

**Dropdown and context menus**

| Component   | Status | Package                 | Usage             |
| ----------- | ------ | ----------------------- | ----------------- |
| Menu        | 📦     | `@tamagui/menu`         | Dropdown menus    |
| ContextMenu | 📦     | `@tamagui/context-menu` | Right-click menus |

### Phase 6: Utilities (Priority 6)

**Helper components and utilities**

| Component       | Status | Package                     | Usage            |
| --------------- | ------ | --------------------------- | ---------------- |
| Portal          | 📦     | `@tamagui/portal`           | Portal rendering |
| FocusScope      | 📦     | `@tamagui/focus-scope`      | Focus management |
| RovingFocus     | 📦     | `@tamagui/roving-focus`     | Keyboard nav     |
| VisuallyHidden  | 📦     | `@tamagui/visually-hidden`  | A11y             |
| Unspaced        | 📦     | `@tamagui/core`             | Skip spacing     |
| AnimatePresence | 📦     | `@tamagui/animate-presence` | Animations       |

### Phase 7: Visual & Icons (Priority 7)

**Visual enhancements**

| Component      | Status | Package                    | Usage           |
| -------------- | ------ | -------------------------- | --------------- |
| LinearGradient | 📦     | `@tamagui/linear-gradient` | Gradients       |
| Shapes         | 📦     | `@tamagui/shapes`          | Square, Circle  |
| LucideIcons    | 📦     | `@tamagui/lucide-icons`    | Icons           |
| Spinner        | 📦     | `tamagui`                  | Loading spinner |

### Phase 8: HTML & Semantic (Priority 8)

**Semantic HTML elements**

| Component    | Status | Package             | Usage                  |
| ------------ | ------ | ------------------- | ---------------------- |
| Anchor       | 📦     | `@tamagui/elements` | Links                  |
| HTMLElements | 📦     | `@tamagui/elements` | Section, Article, etc. |

---

## 🚀 Implementation Plan - Week 1

### Day 1: Core Form Components (Button, Input, Label)

**Goal:** Replace custom Button/Label with official Tamagui components

**Tasks:**

1. ✅ Check official Button API from `tamagui` package
2. ⏳ Replace `button.tamagui.tsx` with official Button import
3. ⏳ Replace `label.tamagui.tsx` with official Label
4. ⏳ Update `index.ts` to export official components
5. ⏳ Test in user-profile.tsx

**Files to Update:**

- `src/interface/primitives/button.tamagui.tsx` → Delete, use `import { Button } from 'tamagui'`
- `src/interface/primitives/label.tamagui.tsx` → Delete, use `import { Label } from 'tamagui'`
- `src/interface/primitives/index.ts` → Update exports

### Day 2: Display Components (Avatar, Card, Badge)

**Goal:** Replace custom display components

**Tasks:**

1. Replace `avatar.tamagui.tsx` with `@tamagui/avatar`
2. Replace `card.tamagui.tsx` with `@tamagui/card`
3. Create Badge wrapper if needed (check if Badge exists in tamagui)
4. Update user-profile.tsx to use official Avatar
5. Test all display components

**Files to Update:**

- `src/interface/primitives/avatar.tamagui.tsx` → Delete, use `@tamagui/avatar`
- `src/interface/primitives/card.tamagui.tsx` → Delete, use `@tamagui/card`
- `app/(modals)/user-profile.tsx` → Update imports

### Day 3: Form Controls (Checkbox, Switch, RadioGroup, Select)

**Goal:** Add official form components

**Tasks:**

1. Export Checkbox from `tamagui`
2. Export Switch from `tamagui`
3. Export RadioGroup from `tamagui`
4. Export Select from `tamagui`
5. Create example usage in forms
6. Add to primitives index

**New Exports in `index.ts`:**

```tsx
export { Checkbox } from 'tamagui';
export { Switch } from 'tamagui';
export { RadioGroup } from 'tamagui';
export { Select, Adapt } from 'tamagui';
```

### Day 4: Navigation & Layout (Tabs, Accordion, Group)

**Goal:** Add navigation components

**Tasks:**

1. Export Tabs from `@tamagui/tabs`
2. Export Accordion from `@tamagui/accordion`
3. Export Group from `@tamagui/group`
4. Export Separator from `@tamagui/separator`
5. Use in dashboard/CRM pages

**Usage:**

- Tabs for tab navigation
- Accordion for FAQ/collapsible sections
- Group for button groups
- Separator for visual dividers

### Day 5: Overlays (Dialog, Sheet, Popover, Toast)

**Goal:** Add modal/overlay components

**Tasks:**

1. Setup Dialog from `@tamagui/dialog`
2. Setup AlertDialog from `@tamagui/alert-dialog`
3. Setup Sheet from `@tamagui/sheet`
4. Setup Popover from `@tamagui/popover`
5. Setup Toast with `burnt` for native
6. Replace Alert.alert() with AlertDialog

**Migration:**

- `Alert.alert()` → `<AlertDialog>`
- Custom modals → `<Dialog>`
- Bottom sheets → `<Sheet>`

---

## 📝 Implementation Checklist

### Immediate Actions (Today)

- [ ] Create official components wrapper file
- [ ] Replace Button with official Tamagui Button
- [ ] Replace Avatar with @tamagui/avatar
- [ ] Replace Card with @tamagui/card
- [ ] Test in user-profile.tsx
- [ ] Update primitives index.ts

### This Week

- [ ] Add Checkbox, Switch, RadioGroup, Select
- [ ] Add Progress, Slider, ToggleGroup
- [ ] Add Tabs, Accordion, Separator
- [ ] Add Dialog, AlertDialog, Sheet
- [ ] Add Popover, Tooltip, Toast
- [ ] Add Menu, ContextMenu
- [ ] Migrate all Alert.alert() to AlertDialog
- [ ] Document component usage patterns

### Next Week

- [ ] Integrate ListItem in contact/lead lists
- [ ] Use Image for avatars/photos
- [ ] Add LinearGradient to headers
- [ ] Use LucideIcons throughout app
- [ ] Add Spinner for loading states
- [ ] Use Portal for modals
- [ ] Add FocusScope to forms
- [ ] Use AnimatePresence for transitions

---

## 🎯 Success Metrics

**Code Quality:**

- Zero custom component implementations for built-in features
- 100% official Tamagui component usage
- Consistent API across all components
- Full TypeScript support

**Performance:**

- Better tree-shaking (only import what's used)
- Compiler optimizations
- Smaller bundle size

**Maintainability:**

- Official components maintained by Tamagui team
- Automatic bug fixes via package updates
- Better documentation
- Community support

---

## 📚 Component Documentation Links

**Official Tamagui Docs:**

- Button: https://tamagui.dev/ui/button
- Avatar: https://tamagui.dev/ui/avatar
- Card: https://tamagui.dev/ui/card
- Checkbox: https://tamagui.dev/ui/checkbox
- Switch: https://tamagui.dev/ui/switch
- RadioGroup: https://tamagui.dev/ui/radio-group
- Select: https://tamagui.dev/ui/select
- Dialog: https://tamagui.dev/ui/dialog
- Sheet: https://tamagui.dev/ui/sheet
- Tabs: https://tamagui.dev/ui/tabs
- Accordion: https://tamagui.dev/ui/accordion
- Toast: https://tamagui.dev/ui/toast

---

**Status:** Ready to start implementation  
**Next Action:** Replace Button with official Tamagui Button
