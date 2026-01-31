import React from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [emailAlerts, setEmailAlerts] = React.useState(false);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>
        Settings
      </ThemedText>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionHeader}>
          Profile
        </ThemedText>
        <Pressable style={styles.row}>
          <View>
            <ThemedText type="defaultSemiBold">Alex Johnson</ThemedText>
            <ThemedText style={styles.meta}>alex.johnson@company.com</ThemedText>
          </View>
          <ThemedText style={styles.link}>Edit</ThemedText>
        </Pressable>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionHeader}>
          Notifications
        </ThemedText>
        <View style={styles.row}>
          <ThemedText type="defaultSemiBold">Push notifications</ThemedText>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>
        <View style={styles.row}>
          <ThemedText type="defaultSemiBold">Email alerts</ThemedText>
          <Switch value={emailAlerts} onValueChange={setEmailAlerts} />
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionHeader}>
          Appearance
        </ThemedText>
        <View style={styles.row}>
          <ThemedText type="defaultSemiBold">Dark mode</ThemedText>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionHeader}>
          About
        </ThemedText>
        <View style={styles.row}>
          <ThemedText type="defaultSemiBold">Version</ThemedText>
          <ThemedText style={styles.meta}>1.0.0</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 16,
  },
  header: {
    marginBottom: 4,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
  },
  meta: {
    opacity: 0.7,
  },
  link: {
    color: '#2563eb',
    fontWeight: '600',
  },
});
