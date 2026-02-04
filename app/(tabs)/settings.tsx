import React from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { Paragraph, SizableText } from '@/interface/primitives';

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [emailAlerts, setEmailAlerts] = React.useState(false);

  return (
    <View style={styles.container}>
      <SizableText size="$8" fontWeight="800" style={styles.header}>
        Settings
      </SizableText>

      <View style={styles.section}>
        <SizableText size="$6" fontWeight="700" style={styles.sectionHeader}>
          Profile
        </SizableText>
        <Pressable style={styles.row}>
          <View>
            <Paragraph fontWeight="700">Alex Johnson</Paragraph>
            <Paragraph style={styles.meta}>alex.johnson@company.com</Paragraph>
          </View>
          <Paragraph style={styles.link}>Edit</Paragraph>
        </Pressable>
      </View>

      <View style={styles.section}>
        <SizableText size="$6" fontWeight="700" style={styles.sectionHeader}>
          Notifications
        </SizableText>
        <View style={styles.row}>
          <Paragraph fontWeight="700">Push notifications</Paragraph>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>
        <View style={styles.row}>
          <Paragraph fontWeight="700">Email alerts</Paragraph>
          <Switch value={emailAlerts} onValueChange={setEmailAlerts} />
        </View>
      </View>

      <View style={styles.section}>
        <SizableText size="$6" fontWeight="700" style={styles.sectionHeader}>
          Appearance
        </SizableText>
        <View style={styles.row}>
          <Paragraph fontWeight="700">Dark mode</Paragraph>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>
      </View>

      <View style={styles.section}>
        <SizableText size="$6" fontWeight="700" style={styles.sectionHeader}>
          About
        </SizableText>
        <View style={styles.row}>
          <Paragraph fontWeight="700">Version</Paragraph>
          <Paragraph style={styles.meta}>1.0.0</Paragraph>
        </View>
      </View>
    </View>
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
