import { YStack, XStack, useMedia } from 'tamagui';

import Sidebar from './sidebar';
import Topbar from './topbar';

interface DashboardShellProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showTopbar?: boolean;
}

/**
 * Reusable dashboard shell component that provides consistent layout
 * for all dashboard screens. Handles responsive behavior (hides sidebar/topbar on mobile).
 */
export default function DashboardShell({
  children,
  showSidebar = true,
  showTopbar = false,
}: DashboardShellProps) {
  const media = useMedia();

  return (
    <YStack f={1}>
      {showTopbar && media.gtSm && <Topbar />}
      <XStack f={1}>
        {showSidebar && media.gtSm && <Sidebar />}
        <YStack f={1}>{children}</YStack>
      </XStack>
    </YStack>
  );
}
