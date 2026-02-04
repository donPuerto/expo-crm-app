# Tamagui Official Components - Quick Reference

## Import All Components

```tsx
import {
  // Layout
  YStack,
  XStack,
  ZStack,
  ScrollView,
  Spacer,

  // Typography
  H1,
  H2,
  H3,
  Text,
  Paragraph,

  // Forms
  Button,
  Input,
  Label,
  Checkbox,
  Switch,
  RadioGroup,
  Select,

  // Display
  Avatar,
  Card,
  Separator,

  // Overlays
  Dialog,
  AlertDialog,
  Sheet,
  Popover,

  // Icons
  Check,
  User,
  Mail,
  Phone,
  Edit,
  Trash,
  ChevronDown,

  // Utilities
  getInitials,
  spacing,
  radius,
} from '@/interface/primitives';
```

---

## Button

```tsx
// Primary
<Button backgroundColor="$blue10">
  <Text color="white">Save</Text>
</Button>

// Outlined
<Button variant="outlined" borderColor="$red10">
  <Text color="$red10">Cancel</Text>
</Button>

// Unstyled (custom)
<Button unstyled onPress={handlePress}>
  <Text>Custom</Text>
</Button>
```

**Props**: `size`, `variant`, `backgroundColor`, `borderRadius`, `onPress`, `disabled`

---

## Avatar

```tsx
<Avatar circular size="$10">
  <Avatar.Fallback backgroundColor="$blue10">
    <Text color="white" fontSize="$8" fontWeight="bold">
      {getInitials("John Doe")}
    </Text>
  </Avatar.Fallback>
</Avatar>

// With image
<Avatar circular size="$6">
  <Avatar.Image src="https://..." />
  <Avatar.Fallback backgroundColor="$gray6">
    <Text color="white">JD</Text>
  </Avatar.Fallback>
</Avatar>
```

**Props**: `size` (`"$6"`, `"$8"`, `"$10"`), `circular` (always use for avatars)

---

## Label

```tsx
<Label
  htmlFor="email"
  fontSize="$2"
  fontWeight="600"
  color="$gray11"
  marginBottom="$2"
  textTransform="uppercase"
>
  Email Address
</Label>
```

**Props**: `htmlFor` (required), `fontSize`, `fontWeight`, `color`, `textTransform`

---

## Card

```tsx
<Card bordered padded>
  <Card.Header>
    <H2>Title</H2>
  </Card.Header>
  <Card.Footer>
    <Text>Footer</Text>
  </Card.Footer>
</Card>
```

**Props**: `bordered`, `padded`, `elevate`

---

## Dialog

```tsx
<Dialog>
  <Dialog.Trigger asChild>
    <Button>
      <Text>Open</Text>
    </Button>
  </Dialog.Trigger>

  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description>Description</Dialog.Description>
      <XStack gap="$3">
        <Dialog.Close asChild>
          <Button variant="outlined">
            <Text>Cancel</Text>
          </Button>
        </Dialog.Close>
        <Dialog.Close asChild>
          <Button backgroundColor="$blue10">
            <Text color="white">OK</Text>
          </Button>
        </Dialog.Close>
      </XStack>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog>
```

---

## AlertDialog (replaces Alert.alert)

```tsx
<AlertDialog>
  <AlertDialog.Trigger asChild>
    <Button variant="outlined" borderColor="$red10">
      <Text color="$red10">Delete</Text>
    </Button>
  </AlertDialog.Trigger>

  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content>
      <AlertDialog.Title>Confirm Delete</AlertDialog.Title>
      <AlertDialog.Description>Are you sure you want to delete this?</AlertDialog.Description>

      <XStack gap="$3">
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
</AlertDialog>
```

---

## Sheet (Bottom Sheet)

```tsx
const [open, setOpen] = useState(false);

<Sheet modal open={open} onOpenChange={setOpen} snapPoints={[85, 50, 25]}>
  <Sheet.Trigger asChild>
    <Button>
      <Text>Open Sheet</Text>
    </Button>
  </Sheet.Trigger>

  <Sheet.Overlay />
  <Sheet.Frame padding="$4">
    <Sheet.Handle />
    <H2>Sheet Title</H2>
    <Text>Content</Text>
  </Sheet.Frame>
</Sheet>;
```

---

## Tabs

```tsx
<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Tab value="tab1">
      <Text>Tab 1</Text>
    </Tabs.Tab>
    <Tabs.Tab value="tab2">
      <Text>Tab 2</Text>
    </Tabs.Tab>
  </Tabs.List>

  <Tabs.Content value="tab1">
    <Text>Content 1</Text>
  </Tabs.Content>
  <Tabs.Content value="tab2">
    <Text>Content 2</Text>
  </Tabs.Content>
</Tabs>
```

---

## Checkbox

```tsx
<XStack gap="$3" alignItems="center">
  <Checkbox id="terms" size="$5">
    <Checkbox.Indicator>
      <Check size={16} />
    </Checkbox.Indicator>
  </Checkbox>
  <Label htmlFor="terms">Accept terms</Label>
</XStack>
```

---

## Switch

```tsx
<XStack gap="$3" alignItems="center">
  <Switch id="notifications" size="$4">
    <Switch.Thumb animation="quick" />
  </Switch>
  <Label htmlFor="notifications">Enable notifications</Label>
</XStack>
```

---

## Select

```tsx
<Select defaultValue="user">
  <Select.Trigger iconAfter={ChevronDown}>
    <Select.Value placeholder="Select role" />
  </Select.Trigger>

  <Select.Content>
    <Select.Viewport>
      <Select.Item value="admin">
        <Select.ItemText>Admin</Select.ItemText>
        <Select.ItemIndicator>
          <Check />
        </Select.ItemIndicator>
      </Select.Item>
      <Select.Item value="user">
        <Select.ItemText>User</Select.ItemText>
        <Select.ItemIndicator>
          <Check />
        </Select.ItemIndicator>
      </Select.Item>
    </Select.Viewport>
  </Select.Content>
</Select>
```

---

## Accordion

```tsx
<Accordion type="multiple" defaultValue={['item-1']}>
  <Accordion.Item value="item-1">
    <Accordion.Trigger>
      <Text>Section 1</Text>
      <ChevronDown />
    </Accordion.Trigger>
    <Accordion.Content>
      <Text>Content 1</Text>
    </Accordion.Content>
  </Accordion.Item>
</Accordion>
```

---

## Menu

```tsx
<Menu>
  <Menu.Trigger asChild>
    <Button unstyled>
      <MoreVertical />
    </Button>
  </Menu.Trigger>

  <Menu.Content>
    <Menu.Item key="edit" onSelect={handleEdit}>
      <Menu.ItemIcon>
        <Edit />
      </Menu.ItemIcon>
      <Menu.ItemTitle>Edit</Menu.ItemTitle>
    </Menu.Item>
    <Menu.Separator />
    <Menu.Item key="delete" destructive onSelect={handleDelete}>
      <Menu.ItemIcon>
        <Trash />
      </Menu.ItemIcon>
      <Menu.ItemTitle>Delete</Menu.ItemTitle>
    </Menu.Item>
  </Menu.Content>
</Menu>
```

---

## Icons

```tsx
import { Check, X, User, Mail, Phone, Edit, Trash, Settings } from '@/interface/primitives';

<Check size={20} color="$green10" />
<User size={24} color="$blue10" />
<Settings size={18} />
```

**Available Icons**: Check, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, User, Mail, Phone, Building, Calendar, Clock, Search, Plus, Minus, Edit (Edit3), Trash, Save, Settings, LogOut, Menu, Home, Users, Briefcase, FileText, Bell, Star, Heart, Share, Download, Upload, Filter, MoreVertical, MoreHorizontal, Eye, EyeOff, Lock, Unlock, AlertCircle, AlertTriangle, CheckCircle, Info, XCircle

---

## Helpers

```tsx
// Get initials for avatar
getInitials("John Doe") // "JD"

// Spacing tokens
<YStack gap={spacing.md} />
// spacing.xs = "$1", spacing.sm = "$2", spacing.md = "$4", spacing.lg = "$6", spacing.xl = "$8", spacing['2xl'] = "$10"

// Radius tokens
<Button borderRadius={radius.lg} />
// radius.sm = "$2", radius.md = "$3", radius.lg = "$4", radius.full = "$12"
```

---

## Full Component List (40+)

**Layout**: YStack, XStack, ZStack, ScrollView, Spacer, Group, XGroup, YGroup  
**Typography**: Text, Heading, H1-H6, Paragraph, SizableText  
**Forms**: Button, Input, TextArea, Label, Checkbox, Switch, RadioGroup, Select, Slider, Progress, Form  
**Display**: Avatar, Card, Separator, Spinner, Square, Circle, Image, ListItem  
**Navigation**: Tabs, Accordion  
**Overlays**: Dialog, AlertDialog, Sheet, Popover  
**Menus**: Menu, ContextMenu  
**Visual**: LinearGradient  
**Utilities**: Theme, Portal, FocusScope, RovingFocusGroup, VisuallyHidden, AnimatePresence, Unspaced  
**HTML**: Section, Article, Main, Header, Footer, Aside, Nav

---

## Documentation

**Complete Guide**: `docs/TAMAGUI-OFFICIAL-COMPONENTS-GUIDE.md`  
**Integration Summary**: `docs/TAMAGUI-OFFICIAL-COMPONENTS-INTEGRATION-SUMMARY.md`  
**Official Docs**: https://tamagui.dev/ui/intro
