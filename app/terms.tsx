import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ThemedText } from '@/interface/components/themed-text';
import { ThemedView } from '@/interface/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

function AnimatedContent({ children, index }: { children: React.ReactNode; index: number }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const hasAnimated = React.useRef(false);

  useEffect(() => {
    if (!hasAnimated.current) {
      hasAnimated.current = true;
      opacity.value = withDelay(index * 50, withTiming(1, { duration: 400 }));
      translateY.value = withDelay(index * 50, withTiming(0, { duration: 400 }));
    }
    return () => {
      hasAnimated.current = false;
      opacity.value = 0;
      translateY.value = 20;
    };
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

export default function TermsScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'text');

  return (
    <ThemedView style={[styles.container, { backgroundColor }]} accessibilityViewIsModal>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AnimatedContent index={0}>
          <ThemedText type="title" style={[styles.title, { color: textColor }]}>
            Terms of Service
          </ThemedText>
        </AnimatedContent>
        <AnimatedContent index={1}>
          <ThemedText style={[styles.date, { color: mutedColor }]}>
            Last updated: January 2025
          </ThemedText>
        </AnimatedContent>

        <AnimatedContent index={2}>
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: textColor }]}>
              1. Acceptance of Terms
            </ThemedText>
            <ThemedText style={[styles.paragraph, { color: mutedColor }]}>
              By accessing and using Don Puerto CRM, you accept and agree to be bound by the terms
              and provision of this agreement.
            </ThemedText>
          </View>
        </AnimatedContent>

        <AnimatedContent index={3}>
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: textColor }]}>
              2. Use License
            </ThemedText>
            <ThemedText style={[styles.paragraph, { color: mutedColor }]}>
              Permission is granted to temporarily use Don Puerto CRM for personal and commercial
              purposes. This is the grant of a license, not a transfer of title, and under this
              license you may not:
            </ThemedText>
            <ThemedText style={[styles.listItem, { color: mutedColor }]}>
              • Modify or copy the materials
            </ThemedText>
            <ThemedText style={[styles.listItem, { color: mutedColor }]}>
              • Use the materials for any commercial purpose or for any public display
            </ThemedText>
            <ThemedText style={[styles.listItem, { color: mutedColor }]}>
              • Attempt to reverse engineer any software contained in the application
            </ThemedText>
          </View>
        </AnimatedContent>

        <AnimatedContent index={4}>
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: textColor }]}>
              3. Disclaimer
            </ThemedText>
            <ThemedText style={[styles.paragraph, { color: mutedColor }]}>
              The materials on Don Puerto CRM are provided on an &apos;as is&apos; basis. Don Puerto
              makes no warranties, expressed or implied, and hereby disclaims and negates all other
              warranties including, without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or non-infringement of intellectual
              property or other violation of rights.
            </ThemedText>
          </View>
        </AnimatedContent>

        <AnimatedContent index={5}>
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: textColor }]}>
              4. Limitations
            </ThemedText>
            <ThemedText style={[styles.paragraph, { color: mutedColor }]}>
              In no event shall Don Puerto or its suppliers be liable for any damages (including,
              without limitation, damages for loss of data or profit, or due to business
              interruption) arising out of the use or inability to use the materials on Don Puerto
              CRM.
            </ThemedText>
          </View>
        </AnimatedContent>

        <AnimatedContent index={6}>
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: textColor }]}>
              5. Contact Information
            </ThemedText>
            <ThemedText style={[styles.paragraph, { color: mutedColor }]}>
              If you have any questions about these Terms of Service, please contact us at
              support@donpuerto.com
            </ThemedText>
          </View>
        </AnimatedContent>

        <AnimatedContent index={7}>
          <Button variant="outline" onPress={() => router.back()} style={styles.backButton}>
            <Text>Go Back</Text>
          </Button>
        </AnimatedContent>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    marginBottom: 32,
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 12,
  },
  listItem: {
    fontSize: 15,
    lineHeight: 24,
    marginLeft: 16,
    marginBottom: 8,
  },
  backButton: {
    marginTop: 32,
  },
});
