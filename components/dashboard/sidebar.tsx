import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/(dashboard)', icon: 'D' },
  { label: 'Leads', href: '/(dashboard)/leads', icon: 'L' },
  { label: 'Contacts', href: '/(dashboard)/contacts', icon: 'C' },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'tabIconDefault');

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href.split('/').slice(0, -1).join('/'));

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <ThemedText type="title" style={styles.logo}>
          CRM
        </ThemedText>
      </View>

      <ScrollView style={styles.navContainer} showsVerticalScrollIndicator={false}>
        {NAV_ITEMS.map(item => {
          const active = isActive(item.href);
          return (
            <Pressable
              key={item.href}
              onPress={() => router.push(item.href as never)}
              style={({ pressed }) => [
                styles.navItem,
                active && styles.navItemActive,
                pressed && styles.navItemPressed,
              ]}
            >
              <ThemedText style={[styles.navIcon, active && styles.activeText]}>
                {item.icon}
              </ThemedText>
              <ThemedText style={[styles.navLabel, active && styles.activeText]}>
                {item.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: borderColor }]}>
        <ThemedText style={styles.footerText}>v1.0.0</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 250,
    borderRightWidth: 1,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  navContainer: {
    flex: 1,
    paddingVertical: 16,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: '#E8F3FF',
  },
  navItemPressed: {
    opacity: 0.7,
  },
  navIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  navLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeText: {
    color: '#0066CC',
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 12,
    opacity: 0.6,
  },
});
