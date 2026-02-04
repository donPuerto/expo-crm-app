import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { Button, Paragraph, SizableText, Text } from '@/interface/primitives';
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
    <View style={[styles.container, { backgroundColor }]} accessibilityViewIsModal>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AnimatedContent index={0}>
          <SizableText size="$8" fontWeight="800" style={[styles.title, { color: textColor }]}>
            Privacy Policy
          </SizableText>
        </AnimatedContent>
        <AnimatedContent index={1}>
          <Paragraph style={[styles.date, { color: mutedColor }]}>
            Last updated: January 2025
          </Paragraph>
        </AnimatedContent>

        <AnimatedContent index={2}>
          <View style={styles.section}>
            <Paragraph fontWeight="700" style={[styles.sectionTitle, { color: textColor }]}>
              1. Information We Collect
            </Paragraph>
            <Paragraph style={[styles.paragraph, { color: mutedColor }]}>
              We collect information that you provide directly to us, including when you create an
              account, use our services, or contact us for support. This may include:
            </Paragraph>
            <Paragraph style={[styles.listItem, { color: mutedColor }]}>
              • Name and contact information
            </Paragraph>
            <Paragraph style={[styles.listItem, { color: mutedColor }]}>
              • Account credentials
            </Paragraph>
            <Paragraph style={[styles.listItem, { color: mutedColor }]}>
              • Business information and CRM data
            </Paragraph>
          </View>
        </AnimatedContent>

        <AnimatedContent index={3}>
          <View style={styles.section}>
            <Paragraph fontWeight="700" style={[styles.sectionTitle, { color: textColor }]}>
              2. How We Use Your Information
            </Paragraph>
            <Paragraph style={[styles.paragraph, { color: mutedColor }]}>
              We use the information we collect to:
            </Paragraph>
            <Paragraph style={[styles.listItem, { color: mutedColor }]}>
              • Provide, maintain, and improve our services
            </Paragraph>
            <Paragraph style={[styles.listItem, { color: mutedColor }]}>
              • Process transactions and send related information
            </Paragraph>
            <Paragraph style={[styles.listItem, { color: mutedColor }]}>
              • Send technical notices and support messages
            </Paragraph>
            <Paragraph style={[styles.listItem, { color: mutedColor }]}>
              • Respond to your comments and questions
            </Paragraph>
          </View>
        </AnimatedContent>

        <AnimatedContent index={4}>
          <View style={styles.section}>
            <Paragraph fontWeight="700" style={[styles.sectionTitle, { color: textColor }]}>
              3. Information Sharing
            </Paragraph>
            <Paragraph style={[styles.paragraph, { color: mutedColor }]}>
              We do not sell, trade, or rent your personal information to third parties. We may
              share your information only in the following circumstances:
            </Paragraph>
            <Paragraph style={[styles.listItem, { color: mutedColor }]}>
              • With your consent
            </Paragraph>
            <Paragraph style={[styles.listItem, { color: mutedColor }]}>
              • To comply with legal obligations
            </Paragraph>
            <Paragraph style={[styles.listItem, { color: mutedColor }]}>
              • To protect our rights and safety
            </Paragraph>
          </View>
        </AnimatedContent>

        <AnimatedContent index={5}>
          <View style={styles.section}>
            <Paragraph fontWeight="700" style={[styles.sectionTitle, { color: textColor }]}>
              4. Data Security
            </Paragraph>
            <Paragraph style={[styles.paragraph, { color: mutedColor }]}>
              We implement appropriate technical and organizational security measures to protect
              your personal information against unauthorized access, alteration, disclosure, or
              destruction. However, no method of transmission over the Internet is 100% secure.
            </Paragraph>
          </View>
        </AnimatedContent>

        <AnimatedContent index={6}>
          <View style={styles.section}>
            <Paragraph fontWeight="700" style={[styles.sectionTitle, { color: textColor }]}>
              5. Your Rights
            </Paragraph>
            <Paragraph style={[styles.paragraph, { color: mutedColor }]}>
              You have the right to access, update, or delete your personal information at any time.
              You can also opt-out of certain communications from us. Contact us at
              support@donpuerto.com to exercise these rights.
            </Paragraph>
          </View>
        </AnimatedContent>

        <AnimatedContent index={7}>
          <View style={styles.section}>
            <Paragraph fontWeight="700" style={[styles.sectionTitle, { color: textColor }]}>
              6. Contact Us
            </Paragraph>
            <Paragraph style={[styles.paragraph, { color: mutedColor }]}>
              If you have any questions about this Privacy Policy, please contact us at
              privacy@donpuerto.com
            </Paragraph>
          </View>
        </AnimatedContent>

        <AnimatedContent index={8}>
          <Button variant="outlined" onPress={() => router.back()} style={styles.backButton}>
            <Text>Go Back</Text>
          </Button>
        </AnimatedContent>
      </ScrollView>
    </View>
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
