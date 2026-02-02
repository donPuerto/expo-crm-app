import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { createShadowStyle } from '@/lib/shadow-styles';
import { usePathname, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type NavItem = {
  label: string;
  href: string;
  icon: Parameters<typeof IconSymbol>[0]['name'];
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Sales', href: '/(dashboards)/sales', icon: 'chart.bar.fill' },
  { label: 'Users', href: '/(dashboards)/users', icon: 'person.3.fill' },
  { label: 'Admin', href: '/(dashboards)/admin', icon: 'gearshape.fill' },
  { label: 'Leads', href: '/(crm)/leads', icon: 'person.crop.circle.fill' },
  { label: 'Contacts', href: '/(crm)/contacts', icon: 'tray.full.fill' },
  { label: 'Manage Users', href: '/(crm)/users', icon: 'person.2.fill' },
];

function AnimatedNavItem({
  item,
  index,
  isActive,
  onPress,
  tint,
  iconDefault,
  borderColor,
}: {
  item: NavItem;
  index: number;
  isActive: boolean;
  onPress: () => void;
  tint: string;
  iconDefault: string;
  borderColor: string;
}) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-20);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    opacity.value = withDelay(index * 50, withTiming(1, { duration: 300 }));
    translateX.value = withDelay(index * 50, withSpring(0, { damping: 15 }));
    scale.value = withDelay(index * 50, withSpring(1, { damping: 15 }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.navItem,
          isActive && {
            backgroundColor: `${tint}15`,
            borderColor: tint,
            borderWidth: 1,
          },
          pressed && styles.navItemPressed,
        ]}
      >
        <IconSymbol
          name={item.icon}
          size={20}
          color={isActive ? tint : iconDefault}
          style={styles.navIcon}
        />
        <ThemedText style={[styles.navLabel, isActive && { color: tint, fontWeight: '600' }]}>
          {item.label}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const backgroundColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const tint = useThemeColor({}, 'tint');
  const iconDefault = useThemeColor({}, 'icon');
  const textColor = useThemeColor({}, 'text');

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href.split('/').slice(0, -1).join('/'));

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor, borderRightColor: borderColor },
        createShadowStyle({
          shadowColor: '#000',
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        }),
      ]}
    >
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <View style={styles.brandRow}>
          <ThemedText type="title" style={[styles.logo, { color: tint }]}>
            CRM
          </ThemedText>
          <View style={[styles.badge, { backgroundColor: `${tint}20` }]}>
            <ThemedText style={[styles.badgeText, { color: tint }]}>New</ThemedText>
          </View>
        </View>
        <ThemedText style={styles.subtle}>Account executive workspace</ThemedText>
      </View>

      <ScrollView style={styles.navContainer} showsVerticalScrollIndicator={false}>
        {NAV_ITEMS.map((item, index) => {
          const active = isActive(item.href);
          return (
            <AnimatedNavItem
              key={item.href}
              item={item}
              index={index}
              isActive={active}
              onPress={() => router.push(item.href as never)}
              tint={tint}
              iconDefault={iconDefault}
              borderColor={borderColor}
            />
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: borderColor }]}>
        <View>
          <ThemedText style={[styles.footerText, { color: textColor }]}>Alex Johnson</ThemedText>
          <ThemedText style={styles.subtle}>alex.johnson@company.com</ThemedText>
        </View>
        <ThemedText style={styles.footerText}>v1.0.0</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 260,
    borderRightWidth: 1,
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    gap: 8,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  subtle: {
    opacity: 0.7,
    fontSize: 12,
    fontWeight: '500',
  },
  navContainer: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  navItemPressed: {
    opacity: 0.8,
  },
  navIcon: {
    marginRight: 12,
  },
  navLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  footer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.7,
  },
});
