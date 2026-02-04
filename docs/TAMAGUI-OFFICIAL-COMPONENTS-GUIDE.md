# Tamagui Official Components Integration - Complete Guide

## Overview

This app now uses **official Tamagui components** instead of custom implementations. All 40+ Tamagui UI packages are installed and ready to use.

## Component Library

### ✅ Integrated Components

Components that are already installed, exported, and ready to use:

#### **Layout & Structure**

- `YStack` - Vertical flex layout (flex-direction: column)
- `XStack` - Horizontal flex layout (flex-direction: row)
- `ZStack` - Stacked layout (absolute positioning)
- `ScrollView` - Scrollable container
- `Spacer` - Adds spacing between elements
- `Group`, `XGroup`, `YGroup` - Grouped elements with borders

#### **Typography**

- `Text` - Base text component
- `Heading`, `H1`, `H2`, `H3`, `H4`, `H5`, `H6` - Headings
- `Paragraph` - Paragraph text
- `SizableText` - Text with size variants

#### **Form Components**

- `Button` - Pressable button
- `Input` - Text input (custom implementation in `@/interface/primitives/input`)
- `TextArea` - Multi-line text input
- `Label` - Form label
- `Checkbox` - Checkbox input
- `Switch` - Toggle switch
- `RadioGroup` - Radio button group
- `Slider` - Range slider
- `Progress` - Progress bar
- `Form` - Form wrapper

#### **Display Components**

- `Avatar` - User avatar with fallback
- `Card` - Card container with sub-components
- `Badge` - Status badge (needs custom implementation)
- `Separator` - Divider line
- `Image` - Image component
- `ListItem` - List item with icon support
- `Spinner` - Loading spinner
- `Square`, `Circle` - Shape components

#### **Navigation**

- `Tabs` - Tab navigation
- `Accordion` - Collapsible sections

#### **Overlay Components**

- `Dialog` - Modal dialog
- `AlertDialog` - Confirmation dialog
- `Sheet` - Bottom sheet
- `Popover` - Popover overlay
- `Tooltip` - Tooltip (web only - install `@tamagui/tooltip`)
- `Toast` - Toast notifications (install `@tamagui/toast` + `burnt`)

#### **Menus**

- `Menu` - Dropdown menu
- `ContextMenu` - Right-click/long-press menu

#### **Visual**

- `LinearGradient` - Linear gradient backgrounds
- **Icons**: From `@tamagui/lucide-icons` - Check, X, ChevronDown, User, Mail, Phone, Building, Calendar, Search, Plus, Edit (Edit3), Trash, Save, Settings, LogOut, Menu, Home, Users, Briefcase, Bell, Star, etc.

#### **Utilities**

- `Theme` - Theme context provider
- `Portal` - Portal for overlays
- `FocusScope` - Focus management
- `RovingFocusGroup` - Keyboard navigation
- `VisuallyHidden` - Screen-reader only content
- `AnimatePresence` - Mount/unmount animations
- `Unspaced` - Avoid spacing

#### **HTML Elements** (web semantic elements)

- `Section`, `Article`, `Main`, `Header`, `Footer`, `Aside`, `Nav`

---

## Usage Examples

### 1. Button Component

```tsx
import { Button, Text } from '@/interface/primitives';

// Basic button
<Button onPress={() => alert('Pressed!')}>
  <Text>Click Me</Text>
</Button>

// Button with background color
<Button size="$5" backgroundColor="$blue10" borderRadius="$3">
  <Text color="white">Primary Button</Text>
</Button>

// Outlined button
<Button variant="outlined" borderColor="$red10">
  <Text color="$red10">Cancel</Text>
</Button>

// Unstyled button (for custom styling)
<Button unstyled onPress={handlePress}>
  <Text color="$primaryForeground">← Back</Text>
</Button>
```

**Button Props:**

- `size` - `"$1"` to `"$10"` (use `"$3"`, `"$4"`, `"$5"` commonly)
- `variant` - `"outlined"` (default is filled)
- `backgroundColor` - Any theme color token
- `borderRadius` - Any size token
- `onPress`, `onPressIn`, `onPressOut`, `onLongPress`
- `disabled`, `pressStyle`, `hoverStyle`, `focusStyle`

### 2. Avatar Component

```tsx
import { Avatar, Text, getInitials } from '@/interface/primitives';

// Avatar with fallback
<Avatar circular size="$10">
  <Avatar.Fallback backgroundColor="$blue10">
    <Text color="white" fontSize="$8" fontWeight="bold">
      {getInitials("John Doe")}
    </Text>
  </Avatar.Fallback>
</Avatar>

// Avatar with image
<Avatar circular size="$6">
  <Avatar.Image src="https://example.com/avatar.jpg" />
  <Avatar.Fallback backgroundColor="$gray6">
    <Text color="white">JD</Text>
  </Avatar.Fallback>
</Avatar>
```

**Avatar Props:**

- `size` - `"$1"` to `"$10"` (common: `"$6"`, `"$8"`, `"$10"`)
- `circular` - Makes avatar round (always use this for avatars)

**Avatar Sub-components:**

- `Avatar.Image` - Image with `src` prop
- `Avatar.Fallback` - Shown when image fails or is loading

### 3. Label Component

```tsx
import { Label } from '@/interface/primitives';

// Basic label
<Label htmlFor="email">Email Address</Label>

// Styled label (uppercase, gray)
<Label
  htmlFor="fullName"
  fontSize="$2"
  fontWeight="600"
  color="$gray11"
  marginBottom="$2"
  textTransform="uppercase"
>
  Full Name
</Label>

// With required indicator
<Label htmlFor="password">
  Password <Text color="$red10">*</Text>
</Label>
```

**Label Props:**

- `htmlFor` - ID of associated input (required for accessibility)
- All Text component props (fontSize, fontWeight, color, etc.)

### 4. Card Component

```tsx
import { Card, H2, Text } from '@/interface/primitives';

<Card bordered padded>
  <Card.Header>
    <H2>Card Title</H2>
  </Card.Header>
  <Card.Footer>
    <Text>Footer content</Text>
  </Card.Footer>
</Card>;
```

**Card Props:**

- `bordered` - Adds border
- `padded` - Adds padding
- `elevate` - Adds shadow

**Card Sub-components:**

- `Card.Header` - Header section
- `Card.Footer` - Footer section
- `Card.Background` - Background layer

### 5. Dialog Component

```tsx
import { Dialog, Button, Text, XStack } from '@/interface/primitives';

<Dialog>
  <Dialog.Trigger asChild>
    <Button>
      <Text>Open Dialog</Text>
    </Button>
  </Dialog.Trigger>

  <Dialog.Portal>
    <Dialog.Overlay
      key="overlay"
      animation="quick"
      opacity={0.5}
      enterStyle={{ opacity: 0 }}
      exitStyle={{ opacity: 0 }}
    />
    <Dialog.Content
      bordered
      elevate
      key="content"
      animateOnly={['transform', 'opacity']}
      animation={[
        'quick',
        {
          opacity: {
            overshootClamping: true,
          },
        },
      ]}
      enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
      exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
      gap="$4"
    >
      <Dialog.Title>Confirm Action</Dialog.Title>
      <Dialog.Description>Are you sure you want to proceed?</Dialog.Description>

      <XStack gap="$3" justifyContent="flex-end">
        <Dialog.Close displayWhenAdapted asChild>
          <Button variant="outlined">
            <Text>Cancel</Text>
          </Button>
        </Dialog.Close>
        <Dialog.Close asChild>
          <Button backgroundColor="$blue10">
            <Text color="white">Confirm</Text>
          </Button>
        </Dialog.Close>
      </XStack>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog>;
```

### 6. AlertDialog (Replacement for Alert.alert())

```tsx
import { AlertDialog, Button, Text } from '@/interface/primitives';

// Replace this:
// Alert.alert('Logout', 'Are you sure?', [
//   { text: 'Cancel' },
//   { text: 'Logout', onPress: handleLogout }
// ]);

// With this:
<AlertDialog>
  <AlertDialog.Trigger asChild>
    <Button variant="outlined" borderColor="$red10">
      <Text color="$red10">Logout</Text>
    </Button>
  </AlertDialog.Trigger>

  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content>
      <AlertDialog.Title>Logout</AlertDialog.Title>
      <AlertDialog.Description>Are you sure you want to logout?</AlertDialog.Description>

      <XStack gap="$3" justifyContent="flex-end">
        <AlertDialog.Cancel asChild>
          <Button variant="outlined">
            <Text>Cancel</Text>
          </Button>
        </AlertDialog.Cancel>
        <AlertDialog.Action asChild>
          <Button backgroundColor="$red10" onPress={handleLogout}>
            <Text color="white">Logout</Text>
          </Button>
        </AlertDialog.Action>
      </XStack>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog>;
```

### 7. Sheet (Bottom Sheet)

```tsx
import { Sheet, Button, Text, H2 } from '@/interface/primitives';
import { useState } from 'react';

function MyComponent() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(0);

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={setOpen}
      snapPoints={[85, 50, 25]}
      position={position}
      onPositionChange={setPosition}
      dismissOnSnapToBottom
    >
      <Sheet.Trigger asChild>
        <Button>
          <Text>Open Sheet</Text>
        </Button>
      </Sheet.Trigger>

      <Sheet.Overlay />
      <Sheet.Frame padding="$4" gap="$4">
        <Sheet.Handle />
        <H2>Sheet Title</H2>
        <Text>Sheet content goes here</Text>
      </Sheet.Frame>
    </Sheet>
  );
}
```

### 8. Tabs Component

```tsx
import { Tabs, YStack, Text } from '@/interface/primitives';

<Tabs defaultValue="tab1" orientation="horizontal" gap="$4">
  <Tabs.List aria-label="Manage tabs">
    <Tabs.Tab value="tab1">
      <Text>Overview</Text>
    </Tabs.Tab>
    <Tabs.Tab value="tab2">
      <Text>Details</Text>
    </Tabs.Tab>
    <Tabs.Tab value="tab3">
      <Text>Settings</Text>
    </Tabs.Tab>
  </Tabs.List>

  <Tabs.Content value="tab1">
    <YStack padding="$4">
      <Text>Overview content</Text>
    </YStack>
  </Tabs.Content>

  <Tabs.Content value="tab2">
    <YStack padding="$4">
      <Text>Details content</Text>
    </YStack>
  </Tabs.Content>

  <Tabs.Content value="tab3">
    <YStack padding="$4">
      <Text>Settings content</Text>
    </YStack>
  </Tabs.Content>
</Tabs>;
```

### 9. Checkbox Component

```tsx
import { Checkbox, Label, XStack } from '@/interface/primitives';
import { Check } from '@tamagui/lucide-icons';

<XStack gap="$3" alignItems="center">
  <Checkbox id="terms" size="$5">
    <Checkbox.Indicator>
      <Check size={16} />
    </Checkbox.Indicator>
  </Checkbox>
  <Label htmlFor="terms">Accept terms and conditions</Label>
</XStack>;
```

### 10. Switch Component

```tsx
import { Switch, Label, XStack } from '@/interface/primitives';

<XStack gap="$3" alignItems="center">
  <Switch id="notifications" size="$4">
    <Switch.Thumb animation="quick" />
  </Switch>
  <Label htmlFor="notifications">Enable notifications</Label>
</XStack>;
```

### 11. Select Component

```tsx
import { Select, Label, YStack } from '@/interface/primitives';
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons';

<YStack gap="$2">
  <Label htmlFor="role">Select Role</Label>
  <Select id="role" defaultValue="user">
    <Select.Trigger iconAfter={ChevronDown}>
      <Select.Value placeholder="Select a role" />
    </Select.Trigger>

    <Select.Content>
      <Select.ScrollUpButton>
        <ChevronUp />
      </Select.ScrollUpButton>

      <Select.Viewport>
        <Select.Group>
          <Select.Label>Roles</Select.Label>
          <Select.Item index={0} value="admin">
            <Select.ItemText>Administrator</Select.ItemText>
            <Select.ItemIndicator>
              <Check />
            </Select.ItemIndicator>
          </Select.Item>
          <Select.Item index={1} value="user">
            <Select.ItemText>User</Select.ItemText>
            <Select.ItemIndicator>
              <Check />
            </Select.ItemIndicator>
          </Select.Item>
          <Select.Item index={2} value="guest">
            <Select.ItemText>Guest</Select.ItemText>
            <Select.ItemIndicator>
              <Check />
            </Select.ItemIndicator>
          </Select.Item>
        </Select.Group>
      </Select.Viewport>

      <Select.ScrollDownButton>
        <ChevronDown />
      </Select.ScrollDownButton>
    </Select.Content>
  </Select>
</YStack>;
```

### 12. Accordion Component

```tsx
import { Accordion, YStack, Text } from '@/interface/primitives';
import { ChevronDown } from '@tamagui/lucide-icons';

<Accordion type="multiple" defaultValue={['item-1']}>
  <Accordion.Item value="item-1">
    <Accordion.Trigger>
      <Text>Section 1</Text>
      <ChevronDown />
    </Accordion.Trigger>
    <Accordion.Content>
      <YStack padding="$4">
        <Text>Content for section 1</Text>
      </YStack>
    </Accordion.Content>
  </Accordion.Item>

  <Accordion.Item value="item-2">
    <Accordion.Trigger>
      <Text>Section 2</Text>
      <ChevronDown />
    </Accordion.Trigger>
    <Accordion.Content>
      <YStack padding="$4">
        <Text>Content for section 2</Text>
      </YStack>
    </Accordion.Content>
  </Accordion.Item>
</Accordion>;
```

### 13. Menu Component

```tsx
import { Menu, Button, Text } from '@/interface/primitives';
import { MoreVertical, Edit, Trash } from '@tamagui/lucide-icons';

<Menu>
  <Menu.Trigger asChild>
    <Button unstyled>
      <MoreVertical size={20} />
    </Button>
  </Menu.Trigger>

  <Menu.Content>
    <Menu.Item key="edit" onSelect={() => handleEdit()}>
      <Menu.ItemIcon>
        <Edit size={16} />
      </Menu.ItemIcon>
      <Menu.ItemTitle>Edit</Menu.ItemTitle>
    </Menu.Item>

    <Menu.Separator />

    <Menu.Item key="delete" destructive onSelect={() => handleDelete()}>
      <Menu.ItemIcon>
        <Trash size={16} />
      </Menu.ItemIcon>
      <Menu.ItemTitle>Delete</Menu.ItemTitle>
    </Menu.Item>
  </Menu.Content>
</Menu>;
```

### 14. Linear Gradient

```tsx
import { LinearGradient, YStack, Text } from '@/interface/primitives';

<LinearGradient
  colors={['$blue10', '$purple10']}
  start={[0, 0]}
  end={[1, 1]}
  padding="$6"
  borderRadius="$4"
>
  <Text color="white" fontSize="$6" fontWeight="bold">
    Gradient Background
  </Text>
</LinearGradient>;
```

### 15. Icons

```tsx
import {
  Check, X, ChevronDown, User, Mail, Phone, Building,
  Calendar, Search, Plus, Edit, Trash, Save, Settings,
  LogOut, Menu, Home, Users, Briefcase, Bell, Star
} from '@/interface/primitives';

<Check size={20} color="$green10" />
<User size={24} color="$blue10" />
<Settings size={18} color="$gray10" />
```

---

## Helper Functions

### `getInitials(name: string)`

Extracts initials from a full name for avatar fallbacks.

```tsx
import { getInitials } from '@/interface/primitives';

getInitials('John Doe'); // "JD"
getInitials('Jane Smith Johnson'); // "JS" (max 2 characters)
```

### `spacing` and `radius` Constants

```tsx
import { spacing, radius } from '@/interface/primitives';

// spacing.xs = "$1", spacing.sm = "$2", spacing.md = "$4", etc.
<YStack gap={spacing.md} />

// radius.sm = "$2", radius.md = "$3", radius.lg = "$4", radius.full = "$12"
<Button borderRadius={radius.lg} />
```

---

## Migration Guide

### From Custom Components to Official Tamagui

#### Button Migration

**Before (Custom):**

```tsx
import { Button } from '@/interface/primitives';

<Button variant="default" size="medium">
  Click Me
</Button>;
```

**After (Official):**

```tsx
import { Button, Text } from '@/interface/primitives';

<Button size="$4" backgroundColor="$blue10" borderRadius="$3">
  <Text color="white">Click Me</Text>
</Button>;
```

#### Avatar Migration

**Before (Custom with Avatar.Text):**

```tsx
<Avatar size="2xl">
  <Avatar.Fallback>
    <Avatar.Text size="2xl">{initials}</Avatar.Text>
  </Avatar.Fallback>
</Avatar>
```

**After (Official - Text inside Fallback):**

```tsx
<Avatar circular size="$10">
  <Avatar.Fallback backgroundColor="$blue10">
    <Text color="white" fontSize="$8" fontWeight="bold">
      {initials}
    </Text>
  </Avatar.Fallback>
</Avatar>
```

#### Label Migration

**Before (Custom with `uppercase` prop):**

```tsx
<Label uppercase>Email</Label>
```

**After (Official - use textTransform):**

```tsx
<Label
  htmlFor="email"
  fontSize="$2"
  fontWeight="600"
  color="$gray11"
  marginBottom="$2"
  textTransform="uppercase"
>
  Email
</Label>
```

#### Alert.alert() Migration

**Before (React Native Alert):**

```tsx
import { Alert } from 'react-native';

Alert.alert('Delete', 'Are you sure?', [
  { text: 'Cancel', style: 'cancel' },
  { text: 'Delete', style: 'destructive', onPress: handleDelete },
]);
```

**After (Tamagui AlertDialog):**

```tsx
import { AlertDialog, Button, Text, XStack } from '@/interface/primitives';

<AlertDialog>
  <AlertDialog.Trigger asChild>
    <Button variant="outlined" borderColor="$red10">
      <Text color="$red10">Delete</Text>
    </Button>
  </AlertDialog.Trigger>

  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content>
      <AlertDialog.Title>Delete</AlertDialog.Title>
      <AlertDialog.Description>Are you sure you want to delete this item?</AlertDialog.Description>

      <XStack gap="$3" justifyContent="flex-end">
        <AlertDialog.Cancel asChild>
          <Button variant="outlined">
            <Text>Cancel</Text>
          </Button>
        </AlertDialog.Cancel>
        <AlertDialog.Action asChild>
          <Button backgroundColor="$red10" onPress={handleDelete}>
            <Text color="white">Delete</Text>
          </Button>
        </AlertDialog.Action>
      </XStack>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog>;
```

---

## Component Documentation Links

- **Button**: https://tamagui.dev/ui/button
- **Avatar**: https://tamagui.dev/ui/avatar
- **Card**: https://tamagui.dev/ui/card
- **Dialog**: https://tamagui.dev/ui/dialog
- **AlertDialog**: https://tamagui.dev/ui/alert-dialog
- **Sheet**: https://tamagui.dev/ui/sheet
- **Tabs**: https://tamagui.dev/ui/tabs
- **Accordion**: https://tamagui.dev/ui/accordion
- **Select**: https://tamagui.dev/ui/select
- **Checkbox**: https://tamagui.dev/ui/checkbox
- **Switch**: https://tamagui.dev/ui/switch
- **Slider**: https://tamagui.dev/ui/slider
- **Menu**: https://tamagui.dev/ui/menu
- **All Components**: https://tamagui.dev/ui/intro

---

## Next Steps

1. ✅ **Phase 1 Complete**: Core components integrated (Button, Avatar, Label, Card)
2. ⏳ **Phase 2**: Add form controls (Checkbox, Switch, RadioGroup, Select)
3. ⏳ **Phase 3**: Add overlays (Dialog, AlertDialog, Sheet, Popover)
4. ⏳ **Phase 4**: Add navigation (Tabs, Accordion, Menu)
5. ⏳ **Phase 5**: Migrate all `Alert.alert()` to `AlertDialog`
6. ⏳ **Phase 6**: Add Toast notifications with `burnt`

---

## Benefits of Official Components

✅ **Maintained by Tamagui team** - Regular updates and bug fixes  
✅ **Consistent API** - All components follow same patterns  
✅ **Better performance** - Compiler optimizations  
✅ **Tree-shaking** - Smaller bundle size  
✅ **Accessibility** - Built-in ARIA support  
✅ **Cross-platform** - Works on iOS, Android, and Web  
✅ **TypeScript** - Fully typed with IntelliSense  
✅ **Animations** - Built-in animation support  
✅ **Theming** - Automatic theme support  
✅ **Documentation** - Extensive official docs

---

## Support

For questions or issues, refer to:

- **Tamagui Docs**: https://tamagui.dev
- **GitHub**: https://github.com/tamagui/tamagui
- **Discord**: https://discord.gg/tamagui
