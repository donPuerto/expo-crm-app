import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

// Purpose: render the CRM welcome/landing experience.
export default function WelcomeScreen() {
  // Purpose: derive theme-aware colors for light/dark modes.
  const backgroundColor = useThemeColor({ light: '#f8fafc', dark: '#0b1220' }, 'background');
  const cardBackground = useThemeColor({ light: '#ffffff', dark: '#111827' }, 'background');
  const headingColor = useThemeColor({ light: '#1e293b', dark: '#e2e8f0' }, 'text');
  const mutedColor = useThemeColor({ light: '#64748b', dark: '#94a3b8' }, 'text');

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        {/* Purpose: header/branding section */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>✨</Text>
          </View>
          <Text style={[styles.appName, { color: headingColor }]}>Don Puerto CRM</Text>
          <Text style={[styles.tagline, { color: mutedColor }]}>
            Your Intelligent Business{'\n'}Analytics Solutions
          </Text>
        </View>

        {/* Purpose: feature highlights */}
        <View style={styles.featuresContainer}>
          <View style={[styles.featureCard, { backgroundColor: cardBackground }]}>
            <Text style={styles.featureIcon}>📊</Text>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: headingColor }]}>
                Real-time Analytics
              </Text>
              <Text style={[styles.featureDesc, { color: mutedColor }]}>
                Track your business performance
              </Text>
            </View>
          </View>

          <View style={[styles.featureCard, { backgroundColor: cardBackground }]}>
            <Text style={styles.featureIcon}>👥</Text>

            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: headingColor }]}>
                Customer Management
              </Text>
              <Text style={[styles.featureDesc, { color: mutedColor }]}>
                Organize all your contacts
              </Text>
            </View>
          </View>

          <View style={[styles.featureCard, { backgroundColor: cardBackground }]}>
            <Text style={styles.featureIcon}>⚡</Text>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: headingColor }]}>Smart Automation</Text>
              <Text style={[styles.featureDesc, { color: mutedColor }]}>
                Save time with AI workflows
              </Text>
            </View>
          </View>
        </View>

        {/* Purpose: primary call-to-action */}
        <Link href={'/(auth)/sign-in' as never} asChild>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Sign In to Continue →</Text>
          </Pressable>
        </Link>

        {/* Purpose: secondary call-to-action */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: mutedColor }]}>
            Don&lsquo;t have an account?{' '}
          </Text>
          <Link href={'/(auth)/sign-up' as never}>
            <Text style={styles.footerLink}>Create Account</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

// Purpose: define styles for the welcome screen layout.
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#6366f1',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 48,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600',
  },
});
