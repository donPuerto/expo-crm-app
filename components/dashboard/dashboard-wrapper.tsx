import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { Sidebar, Topbar } from '@/components/dashboard';

interface DashboardWrapperProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showTopbar?: boolean;
}

export default function DashboardWrapper({
  children,
  showSidebar = true,
  showTopbar = false,
}: DashboardWrapperProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={styles.container}>
      {/* Topbar only for larger layouts */}
      {showTopbar && !isMobile && <Topbar />}

      <View style={styles.mainContainer}>
        {/* Sidebar - Hide on mobile */}
        {showSidebar && !isMobile && <Sidebar />}

        {/* Main Content */}
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
});
