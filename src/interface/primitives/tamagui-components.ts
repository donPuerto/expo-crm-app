/**
 * Official Tamagui UI Components
 *
 * This file re-exports all official Tamagui components for use throughout the app.
 * Using official components ensures:
 * - Battle-tested implementations
 * - Automatic updates and bug fixes
 * - Consistent API and behavior
 * - Better performance and tree-shaking
 * - Full accessibility support
 */

// ============================================================================
// CORE COMPONENTS (from 'tamagui' package)
// ============================================================================

export {
  // Layout
  View,
  Text,
  YStack,
  XStack,
  ZStack,

  // Typography
  Heading,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Paragraph,
  SizableText,

  // Form Components
  Button,
  Input,
  TextArea,
  Label,
  Checkbox,
  Switch,
  RadioGroup,
  Slider,
  Progress,
  Form,

  // Display
  ScrollView,
  Separator,
  Spinner,

  // Utilities
  Theme,
  Spacer,
  Unspaced,
  VisuallyHidden,

  // Hooks
  useTheme,
  useMedia,

  // Animations
  AnimatePresence,

  // Types
  GetProps,
  TamaguiElement,
  styled,
  createStyledContext,
  withStaticProperties,
} from 'tamagui';

// ============================================================================
// UI COMPONENTS (from @tamagui/* packages)
// ============================================================================

// Avatar
export { Avatar, type AvatarProps } from '@tamagui/avatar';

// Card
export { Card, type CardProps } from '@tamagui/card';

// Accordion
export { Accordion } from '@tamagui/accordion';

// Alert Dialog
export { AlertDialog, type AlertDialogProps } from '@tamagui/alert-dialog';

// Dialog
export { Dialog, type DialogProps } from '@tamagui/dialog';

// Popover
export { Popover, type PopoverProps } from '@tamagui/popover';

// Sheet
export { Sheet, type SheetProps } from '@tamagui/sheet';

// Tabs
export { Tabs, type TabsProps } from '@tamagui/tabs';

// Menu
export { Menu } from '@tamagui/menu';

// Context Menu
export { ContextMenu } from '@tamagui/context-menu';

// Image
export { Image, type ImageProps } from '@tamagui/image';

// List Item
export { ListItem, type ListItemProps } from '@tamagui/list-item';

// Separator
export { Separator as TamaguiSeparator } from '@tamagui/separator';

// Shapes (Square, Circle)
export { Square, Circle, type SquareProps, type CircleProps } from '@tamagui/shapes';

// Linear Gradient
export { LinearGradient, type LinearGradientProps } from '@tamagui/linear-gradient';

// Group
export { Group, XGroup, YGroup, type GroupProps } from '@tamagui/group';

// Focus Scope
export { FocusScope, type FocusScopeProps } from '@tamagui/focus-scope';

// Portal
export { Portal, type PortalProps } from '@tamagui/portal';

// Roving Focus
export { RovingFocusGroup, type RovingFocusGroupProps } from '@tamagui/roving-focus';

// Elements (HTML semantic elements)
export { Section, Article, Main, Header, Footer, Aside, Nav } from '@tamagui/elements';

// ============================================================================
// ICONS (from @tamagui/lucide-icons)
// ============================================================================

export {
  // Common icons - add more as needed
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  Clock,
  Search,
  Plus,
  Minus,
  Edit3 as Edit,
  Trash,
  Save,
  Settings,
  LogOut,
  Menu as MenuIcon,
  Home,
  Users,
  Briefcase,
  FileText,
  Bell,
  Star,
  Heart,
  Share,
  Download,
  Upload,
  Filter,
  MoreVertical,
  MoreHorizontal,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
} from '@tamagui/lucide-icons';

// ============================================================================
// CUSTOM UTILITIES
// ============================================================================

/**
 * Helper function to extract initials from a name
 * @param name - Full name string
 * @returns Initials (max 2 characters)
 *
 * @example
 * getInitials('John Doe') // 'JD'
 * getInitials('Jane Smith Johnson') // 'JS'
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Helper to create consistent spacing
 */
export const spacing = {
  xs: '$1',
  sm: '$2',
  md: '$4',
  lg: '$6',
  xl: '$8',
  '2xl': '$10',
} as const;

/**
 * Helper to create consistent border radius
 */
export const radius = {
  sm: '$2',
  md: '$3',
  lg: '$4',
  full: '$12',
} as const;
