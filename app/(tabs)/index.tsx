import * as React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  useColorScheme as useRNColorScheme,
  RefreshControl,
  Modal,
  Appearance,
  Animated,
  Dimensions,
} from 'react-native';
import {
  Plus,
  X as XIcon,
  Check,
  Sun,
  Moon,
  Home as HomeIcon,
  Users,
  Settings,
  Menu as MenuIcon,
} from '@/interface/primitives';

import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { GradientBackground } from '@/components/ui/gradient-background';
import { Avatar } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Icon } from '@/components/ui/icon';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useFont } from '@/hooks/use-font';
import { addOpacityToHex } from '@/lib/utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.75;

// Mock data
const SALES_DATA = {
  total: '$8,681.97',
  period: 'This month',
  deals: {
    total: 21,
    won: { count: 16, value: '$291.23' },
    lost: { count: 5, value: '$122.97' },
  },
};

const UPCOMING_TASKS = [
  { id: '1', title: 'Team briefing', type: 'Meeting', status: 'overdue', time: '09:00 am' },
  { id: '2', title: 'Call with W.Warren', type: 'Call', status: 'planned', time: '09:00 am' },
  { id: '3', title: 'Send email contracts', type: 'Meeting', status: 'planned', time: '09:00 am' },
  { id: '4', title: 'Task with kismat', type: 'Task', status: 'overdue', time: '09:00 am' },
];

export default function HomeScreen() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const colorScheme = useRNColorScheme();
  const slideAnim = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'tint');
  const mutedColor = useThemeColor({}, 'icon');
  const cardBackground = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');

  const { fontFamily } = useFont();

  const isDark = colorScheme === 'dark';

  // Animate drawer open/close
  React.useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: menuOpen ? 0 : -DRAWER_WIDTH,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, [menuOpen, slideAnim]);

  // Pull to refresh handler
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data fetching
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  // Toggle theme
  const handleThemeToggle = () => {
    const newColorScheme = isDark ? 'light' : 'dark';
    Appearance.setColorScheme(newColorScheme);
  };

  // Close drawer
  const closeDrawer = () => setMenuOpen(false);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Sidebar Drawer */}
      <Modal visible={menuOpen} transparent animationType="none" onRequestClose={closeDrawer}>
        <View style={styles.drawerOverlay}>
          {/* Overlay that closes drawer */}
          <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer} />

          {/* Drawer that slides in/out */}
          <Animated.View
            style={[
              styles.drawerContainer,
              { backgroundColor: cardBackground, transform: [{ translateX: slideAnim }] },
            ]}
            onStartShouldSetResponder={() => true}
          >
            {/* Company Header */}
            <View style={[styles.companyHeader, { borderBottomColor: borderColor }]}>
              <View style={styles.companyInfo}>
                <Avatar fallback="Acme Inc." size={32} />
                <Label style={[styles.companyName, { color: textColor }]}>Acme Inc.</Label>
              </View>
              <Pressable onPress={closeDrawer} style={styles.closeIconButton}>
                <Icon as={XIcon} size={20} color={mutedColor} />
              </Pressable>
            </View>

            {/* Quick Create Button */}
            <View style={styles.quickCreateContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.quickCreateButton,
                  { backgroundColor: mutedColor, opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={() => console.log('Quick create')}
              >
                <Icon as={Plus} size={18} color="#ffffff" />
                <Label style={styles.quickCreateLabel}>Quick Create</Label>
              </Pressable>
            </View>

            {/* Menu Items */}
            <ScrollView style={styles.drawerContent} showsVerticalScrollIndicator={false}>
              {/* Dashboard Section */}
              <View style={styles.menuSection}>
                <Label style={[styles.sectionHeader, { color: mutedColor }]}>Dashboard</Label>

                <Pressable
                  style={({ pressed }) => [
                    styles.menuItem,
                    {
                      backgroundColor: pressed
                        ? addOpacityToHex(primaryColor, 0.08)
                        : 'transparent',
                    },
                  ]}
                  onPress={closeDrawer}
                >
                  <Icon as={HomeIcon} size={20} color={textColor} />
                  <Label style={[styles.menuLabel, { color: textColor }]}>Leads</Label>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.menuItem,
                    {
                      backgroundColor: pressed ? addOpacityToHex(mutedColor, 0.08) : 'transparent',
                    },
                  ]}
                  onPress={closeDrawer}
                >
                  <Icon as={Users} size={20} color={textColor} />
                  <Label style={[styles.menuLabel, { color: textColor }]}>Contacts</Label>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.menuItem,
                    {
                      backgroundColor: pressed ? addOpacityToHex(mutedColor, 0.08) : 'transparent',
                    },
                  ]}
                  onPress={closeDrawer}
                >
                  <Icon as={HomeIcon} size={20} color={textColor} />
                  <Label style={[styles.menuLabel, { color: textColor }]}>Opportunity</Label>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.menuItem,
                    {
                      backgroundColor: pressed ? addOpacityToHex(mutedColor, 0.08) : 'transparent',
                    },
                  ]}
                  onPress={closeDrawer}
                >
                  <Icon as={Check} size={20} color={textColor} />
                  <Label style={[styles.menuLabel, { color: textColor }]}>Tasks</Label>
                </Pressable>
              </View>
            </ScrollView>

            {/* Bottom Menu */}
            <View style={[styles.bottomMenu, { borderTopColor: borderColor }]}>
              <Pressable
                style={({ pressed }) => [
                  styles.bottomMenuItem,
                  {
                    backgroundColor: pressed ? addOpacityToHex(mutedColor, 0.08) : 'transparent',
                  },
                ]}
                onPress={closeDrawer}
              >
                <Icon as={Settings} size={20} color={textColor} />
                <Label style={[styles.menuLabel, { color: textColor }]}>Settings</Label>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.bottomMenuItem,
                  {
                    backgroundColor: pressed ? addOpacityToHex(mutedColor, 0.08) : 'transparent',
                  },
                ]}
                onPress={handleThemeToggle}
              >
                <Icon as={isDark ? Sun : Moon} size={20} color={textColor} />
                <Label style={[styles.menuLabel, { color: textColor }]}>Dark Mode</Label>
              </Pressable>
            </View>

            {/* User Profile at Bottom */}
            <Pressable
              style={({ pressed }) => [
                styles.drawerFooter,
                {
                  borderTopColor: borderColor,
                  backgroundColor: pressed ? addOpacityToHex(primaryColor, 0.08) : 'transparent',
                },
              ]}
              onPress={() => {
                closeDrawer();
                console.log('Navigate to user profile');
              }}
            >
              <View style={styles.userAvatarContainer}>
                <Avatar fallback="shadcn" size={36} />
              </View>
              <View style={styles.drawerUserInfo}>
                <Label style={[styles.drawerUserName, { color: textColor }]}>shadcn</Label>
                <Text variant="small" style={[styles.drawerUserEmail, { color: mutedColor }]}>
                  m@example.com
                </Text>
              </View>
              <View style={styles.userSettingsIconContainer}>
                <Icon as={Settings} size={16} color={mutedColor} />
              </View>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>

      {/* Header with gradient */}
      <GradientBackground
        colors={[primaryColor, addOpacityToHex(primaryColor, 0.9), primaryColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => setMenuOpen(!menuOpen)} style={styles.menuButton}>
              <MenuIcon size={24} color="#ffffff" />
            </Pressable>
            <Text variant="h3" style={[styles.headerTitle, { fontFamily, color: '#ffffff' }]}>
              Home
            </Text>
            <Pressable onPress={handleThemeToggle} style={styles.themeButton}>
              {isDark ? <Sun size={24} color="#ffffff" /> : <Moon size={24} color="#ffffff" />}
            </Pressable>
          </View>
        </View>

        {/* Sales Summary */}
        <View style={styles.salesSummary}>
          <View style={styles.salesHeader}>
            <Text style={[styles.salesLabel, { fontFamily, color: '#ffffff' }]}>Sales summary</Text>
            <Pressable style={styles.periodButton}>
              <Text style={[styles.periodText, { fontFamily, color: '#ffffff' }]}>
                {SALES_DATA.period}
              </Text>
            </Pressable>
          </View>

          <Text style={[styles.salesAmount, { fontFamily, color: '#ffffff' }]}>
            {SALES_DATA.total}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { fontFamily, color: '#ffffff' }]}>
                {SALES_DATA.deals.total}
              </Text>
              <Text style={[styles.statLabel, { fontFamily, color: '#ffffff' }]}>total deals</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { fontFamily, color: '#ffffff' }]}>
                {SALES_DATA.deals.won.value}
              </Text>
              <Text style={[styles.statLabel, { fontFamily, color: '#ffffff' }]}>
                {SALES_DATA.deals.won.count} won
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { fontFamily, color: '#ffffff' }]}>
                {SALES_DATA.deals.lost.value}
              </Text>
              <Text style={[styles.statLabel, { fontFamily, color: '#ffffff' }]}>
                {SALES_DATA.deals.lost.count} lost
              </Text>
            </View>
          </View>
        </View>
      </GradientBackground>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={primaryColor}
            colors={[primaryColor]}
          />
        }
      >
        {/* New Activity Section */}
        <View style={styles.section}>
          <Text variant="h4" style={[styles.sectionTitle, { fontFamily, color: textColor }]}>
            New activity for today
          </Text>
          <View style={styles.activityButtons}>
            <Button
              style={styles.activityButton}
              onPress={() => {
                /* Add Meeting */
              }}
            >
              <View style={styles.activityButtonContent}>
                <Plus size={20} color="#ffffff" />
                <Text variant="default" style={styles.activityButtonText}>
                  Meeting
                </Text>
              </View>
            </Button>
            <Button
              style={styles.activityButton}
              onPress={() => {
                /* Add Task */
              }}
            >
              <View style={styles.activityButtonContent}>
                <Plus size={20} color="#ffffff" />
                <Text variant="default" style={styles.activityButtonText}>
                  Task
                </Text>
              </View>
            </Button>
            <Button
              style={styles.activityButton}
              onPress={() => {
                /* Add Call */
              }}
            >
              <View style={styles.activityButtonContent}>
                <Plus size={20} color="#ffffff" />
                <Text variant="default" style={styles.activityButtonText}>
                  Call
                </Text>
              </View>
            </Button>
          </View>
        </View>

        {/* Upcoming Tasks */}
        <View style={styles.section}>
          <Text variant="h4" style={[styles.sectionTitle, { fontFamily, color: textColor }]}>
            Upcoming tasks
          </Text>
          <View style={styles.tasksList}>
            {UPCOMING_TASKS.map(task => (
              <Card key={task.id} style={styles.taskCard}>
                <CardContent style={styles.taskCardContent}>
                  <View style={styles.taskLeft}>
                    <View
                      style={[
                        styles.taskIcon,
                        {
                          backgroundColor:
                            task.status === 'overdue'
                              ? 'rgba(239, 68, 68, 0.1)'
                              : 'rgba(59, 130, 246, 0.1)',
                        },
                      ]}
                    >
                      {task.status === 'overdue' ? (
                        <XIcon size={20} color="#ef4444" />
                      ) : (
                        <Check size={20} color="#3b82f6" />
                      )}
                    </View>
                    <View style={styles.taskInfo}>
                      <Text
                        variant="default"
                        style={[styles.taskTitle, { fontFamily, color: textColor }]}
                      >
                        {task.title}
                      </Text>
                      <View style={styles.taskMeta}>
                        <Text
                          variant="small"
                          style={[styles.taskType, { fontFamily, color: mutedColor }]}
                        >
                          {task.type}
                        </Text>
                        <Separator orientation="vertical" style={styles.separator} />
                        <Text
                          variant="small"
                          style={[
                            styles.taskStatus,
                            {
                              fontFamily,
                              color: task.status === 'overdue' ? '#ef4444' : '#22c55e',
                            },
                          ]}
                        >
                          {task.status === 'overdue' ? 'Overdue' : 'Planned'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text
                    variant="small"
                    style={[styles.taskTime, { fontFamily, color: mutedColor }]}
                  >
                    {task.time}
                  </Text>
                </CardContent>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Drawer styles
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContainer: {
    width: DRAWER_WIDTH,
    height: '100%',
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickCreateContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  quickCreateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  quickCreateLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  drawerContent: {
    flex: 1,
  },
  menuSection: {
    paddingBottom: 16,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingVertical: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  bottomMenu: {
    borderTopWidth: 1,
    paddingVertical: 8,
  },
  bottomMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  drawerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingBottom: 24,
    borderTopWidth: 1,
  },
  userAvatarContainer: {
    marginRight: 12,
  },
  drawerUserInfo: {
    flex: 1,
    gap: 4,
    marginRight: 12,
  },
  drawerUserName: {
    fontSize: 14,
    fontWeight: '600',
  },
  drawerUserEmail: {
    fontSize: 12,
  },
  userSettingsIconContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Header styles
  header: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  themeButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
  },
  // Sales Summary styles
  salesSummary: {
    gap: 16,
  },
  salesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  salesLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  periodText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  salesAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: -2,
    color: '#ffffff',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  statBox: {
    gap: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    opacity: 0.95,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100, // Extra padding for bottom tab bar
    gap: 24,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  activityButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  activityButton: {
    flex: 1,
  },
  activityButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  activityButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  tasksList: {
    gap: 12,
  },
  taskCard: {
    marginBottom: 0,
  },
  taskCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  taskIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskInfo: {
    flex: 1,
    gap: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  taskMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  taskType: {
    fontSize: 13,
    fontWeight: '500',
  },
  taskStatus: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  taskTime: {
    fontSize: 13,
    fontWeight: '500',
  },
  separator: {
    width: 1,
    height: 12,
  },
});
