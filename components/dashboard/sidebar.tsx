import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

type NavItem = {
  label: string;
  href: string;
  icon: Parameters<typeof IconSymbol>[0]['name'];
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/(dashboard)', icon: 'house.fill' },
  { label: 'Leads', href: '/(dashboard)/leads', icon: 'person.3.fill' },
  { label: 'Contacts', href: '/(dashboard)/contacts', icon: 'tray.full.fill' },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const tint = useThemeColor({}, 'tint');
  const iconDefault = useThemeColor({}, 'icon');

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href.split('/').slice(0, -1).join('/'));

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <View style={styles.brandRow}>
          <ThemedText type="title" style={styles.logo}>
            CRM
          </ThemedText>
          <ThemedText style={styles.badge}>New</ThemedText>
        </View>
        <ThemedText style={styles.subtle}>Account executive workspace</ThemedText>
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
                active && { backgroundColor: `${tint}14`, borderColor: tint },
                pressed && styles.navItemPressed,
              ]}
            >
              <IconSymbol
                name={item.icon}
                size={18}
                color={active ? tint : iconDefault}
                style={styles.navIcon}
              />
              <ThemedText style={[styles.navLabel, active && { color: tint, fontWeight: '600' }]}>
                {item.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: borderColor }]}>
        <View>
          <ThemedText style={styles.footerText}>Alex Johnson</ThemedText>
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
    width: 250,
    borderRightWidth: 1,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    gap: 6,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
  },
  subtle: {
    opacity: 0.7,
    fontSize: 12,
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
    borderWidth: 1,
    borderColor: 'transparent',
  },
  navItemPressed: {
    opacity: 0.7,
  },
  navIcon: {
    marginRight: 12,
  },
  navLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 12,
    opacity: 0.6,
  },
});
