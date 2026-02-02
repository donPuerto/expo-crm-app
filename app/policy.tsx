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
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
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

export default function PolicyScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'text');

  return (
    <ThemedView style={[styles.container, { backgroundColor }]} accessibilityViewIsModal>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AnimatedContent index={0}>
          <ThemedText type="title" style={[styles.title, { color: textColor }]}>
            Privacy Policy
          </ThemedText>
        </AnimatedContent>
        <AnimatedContent index={1}>
          <ThemedText style={[styles.date, { color: mutedColor }]}>Last updated: January 2025</ThemedText>
        </AnimatedContent>

        <AnimatedContent index={2}>
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: textColor }]}>
              1. Information We Collect
            </ThemedText>
            <ThemedText style={[styles.paragraph, { color: mutedColor }]}>
              We collect information that you provide directly to us, including when you create an
              account, use our services, or contact us for support. This may include:
            </ThemedText>
            <ThemedText style={[styles.listItem, { color: mutedColor }]}>
              • Name and contact information
            </ThemedText>
            <ThemedText style={[styles.listItem, { color: mutedColor }]}>
              • Account credentials
            </ThemedText>
            <ThemedText style={[styles.listItem, { color: mutedColor }]}>
              • Business information and CRM data
            </ThemedText>
          </View>
        </AnimatedContent>

        <AnimatedContent index={3}>
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: textColor }]}>
              2. How We Use Your Information
            </ThemedText>
            <ThemedText style={[styles.paragraph, { color: mutedColor }]}>
              We use the information we collect to:
            </ThemedText>
            <ThemedText style={[styles.listItem, { color: mutedColor }]}>
              • Provide, maintain, and improve our services
            </ThemedText>
            <ThemedText style={[styles.listItem, { color: mutedColor }]}>
              • Process transactions and send related information
            </ThemedText>
            <ThemedText style={[styles.listItem, { color: mutedColor }]}>
              • Send technical notices and support messages
            </ThemedText>
            <ThemedText style={[styles.listItem, { color: mutedColor }]}>
              • Respond to your comments and questions
            </ThemedText>
          </View>
        </AnimatedContent>

        <AnimatedContent index={4}>
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: textColor }]}>
              3. Information Sharing
            </ThemedText>
            <ThemedText style={[styles.paragraph, { color: mutedColor }]}>
              We do not sell, trade, or rent your personal information to third parties. We may
              share your information only in the following circumstances:
            </ThemedText>
            <ThemedText style={[styles.listItem, { color: mutedColor }]}>
              • With your consent
            </ThemedText>
            <ThemedText style={[styles.listItem, { color: mutedColor }]}>
              • To comply with legal obligations
            </ThemedText>
            <ThemedText style={[styles.listItem, { color: mutedColor }]}>
              • To protect our rights and safety
            </ThemedText>
          </View>
        </AnimatedContent>

        <AnimatedContent index={5}>
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: textColor }]}>
              4. Data Security
            </ThemedText>
            <ThemedText style={[styles.paragraph, { color: mutedColor }]}>
              We implement appropriate technical and organizational security measures to protect your
              personal information against unauthorized access, alteration, disclosure, or
              destruction. However, no method of transmission over the Internet is 100% secure.
            </ThemedText>
          </View>
        </AnimatedContent>

        <AnimatedContent index={6}>
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: textColor }]}>
              5. Your Rights
            </ThemedText>
            <ThemedText style={[styles.paragraph, { color: mutedColor }]}>
              You have the right to access, update, or delete your personal information at any time.
              You can also opt-out of certain communications from us. Contact us at
              support@donpuerto.com to exercise these rights.
            </ThemedText>
          </View>
        </AnimatedContent>

        <AnimatedContent index={7}>
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: textColor }]}>
              6. Contact Us
            </ThemedText>
            <ThemedText style={[styles.paragraph, { color: mutedColor }]}>
              If you have any questions about this Privacy Policy, please contact us at
              privacy@donpuerto.com
            </ThemedText>
          </View>
        </AnimatedContent>

        <AnimatedContent index={8}>
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
