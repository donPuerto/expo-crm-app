import { useRouter } from 'expo-router';
import { BarChart3, Users, Zap } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { Button } from '@/components/ui/button';
import { GradientBackground } from '@/components/ui/gradient-background';
import { AppLogo } from '@/components/ui/app-logo';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { addOpacityToHex } from '@/lib/utils';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useFont } from '@/hooks/use-font';

function AnimatedFeatureCard({ children, index }: { children: React.ReactNode; index: number }) {
  const opacity = useSharedValue(0);
  const hasAnimated = React.useRef(false);

  useEffect(() => {
    // Prevent double animation on re-renders or React Strict Mode
    // Only animate once when component first mounts
    if (!hasAnimated.current) {
      hasAnimated.current = true;
      opacity.value = withDelay(index * 100, withTiming(1, { duration: 600 }));
    }
    // opacity is a useSharedValue from reanimated - stable reference, safe to include in deps
    // hasAnimated ref prevents re-animation even if dependencies change
  }, [index, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

// Purpose: render the CRM welcome/landing experience.
export default function WelcomeScreen() {
  const router = useRouter();

  // Explicit theme colors using useThemeColor hook - MUST use for consistency
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'tint');
  const cardBackground = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');

  // Dynamic font settings
  const { fontFamily, getScaledFontSize } = useFont();

  // Dynamic styles with font scaling
  const dynamicStyles = StyleSheet.create({
    title: {
      textAlign: 'center',
      fontFamily,
      fontSize: getScaledFontSize(32),
    },
    featureTitle: {
      marginBottom: 4,
      fontFamily,
      fontSize: getScaledFontSize(18),
    },
    legalText: {
      fontSize: getScaledFontSize(12),
      textAlign: 'center',
      fontFamily,
    },
    legalLink: {
      fontSize: getScaledFontSize(12),
      fontWeight: '600',
      textDecorationLine: 'underline',
      fontFamily,
    },
  });

  // Subtle gradient colors based on theme
  const gradientColors = [
    backgroundColor,
    addOpacityToHex(primaryColor, 0.06), // Very subtle tint (6% opacity)
    addOpacityToHex(primaryColor, 0.03), // Even more subtle (3% opacity)
    backgroundColor,
  ];

  return (
    <GradientBackground
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.4, 0.6, 1]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Purpose: header/branding section */}
          <AnimatedFeatureCard index={0}>
            <View style={styles.header}>
              <AppLogo size={80} iconSize={40} />
              <View style={styles.titleContainer}>
                <Text variant="h1" style={[dynamicStyles.title, { color: textColor }]}>
                  Welcome to your
                </Text>
                <Text variant="h1" style={[dynamicStyles.title, { color: primaryColor }]}>
                  Application
                </Text>
              </View>
            </View>
          </AnimatedFeatureCard>

          {/* Purpose: feature highlights */}
          <View style={styles.featuresContainer}>
            <AnimatedFeatureCard index={1}>
              <View style={[styles.featureItem, { backgroundColor: cardBackground, borderColor }]}>
                <View
                  style={[styles.featureIconContainer, { backgroundColor: `${primaryColor}20` }]}
                >
                  <Icon as={BarChart3} size={24} color={primaryColor} />
                </View>
                <View style={styles.featureContent}>
                  <Text variant="large" style={[dynamicStyles.featureTitle, { color: textColor }]}>
                    Real-time Analytics
                  </Text>
                  <Text variant="muted" style={{ color: iconColor }}>
                    Track your business performance
                  </Text>
                </View>
              </View>
            </AnimatedFeatureCard>

            <AnimatedFeatureCard index={2}>
              <View style={[styles.featureItem, { backgroundColor: cardBackground, borderColor }]}>
                <View
                  style={[styles.featureIconContainer, { backgroundColor: `${primaryColor}20` }]}
                >
                  <Icon as={Users} size={24} color={primaryColor} />
                </View>
                <View style={styles.featureContent}>
                  <Text variant="large" style={[dynamicStyles.featureTitle, { color: textColor }]}>
                    Customer Management
                  </Text>
                  <Text variant="muted" style={{ color: iconColor }}>
                    Organize all your contacts
                  </Text>
                </View>
              </View>
            </AnimatedFeatureCard>

            <AnimatedFeatureCard index={3}>
              <View style={[styles.featureItem, { backgroundColor: cardBackground, borderColor }]}>
                <View
                  style={[styles.featureIconContainer, { backgroundColor: `${primaryColor}20` }]}
                >
                  <Icon as={Zap} size={24} color={primaryColor} />
                </View>
                <View style={styles.featureContent}>
                  <Text variant="large" style={[dynamicStyles.featureTitle, { color: textColor }]}>
                    Smart Automation
                  </Text>
                  <Text variant="muted" style={{ color: iconColor }}>
                    Save time with AI workflows
                  </Text>
                </View>
              </View>
            </AnimatedFeatureCard>
          </View>

          {/* Purpose: primary call-to-action */}
          <AnimatedFeatureCard index={4}>
            <Button
              variant="default"
              size="lg"
              className="w-full"
              onPress={() => router.push('/(tabs)/')}
            >
              <Text>Continue</Text>
            </Button>
          </AnimatedFeatureCard>

          {/* Purpose: Terms and Policy links */}
          <AnimatedFeatureCard index={5}>
            <View style={styles.legalContainer}>
              <Text variant="muted" style={[dynamicStyles.legalText, { color: iconColor }]}>
                By pressing continue, you agree to our{' '}
              </Text>
              <Pressable onPress={() => router.push('/terms' as never)}>
                <Text style={[dynamicStyles.legalLink, { color: primaryColor }]}>
                  Terms of Service
                </Text>
              </Pressable>
              <Text variant="muted" style={[dynamicStyles.legalText, { color: iconColor }]}>
                {' '}
                and that you have read our{' '}
              </Text>
              <Pressable onPress={() => router.push('/policy' as never)}>
                <Text style={[dynamicStyles.legalLink, { color: primaryColor }]}>
                  Privacy Policy
                </Text>
              </Pressable>
            </View>
          </AnimatedFeatureCard>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
    gap: 20, // Spacing between logo and title
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    marginBottom: 4,
  },
  legalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 24,
    paddingHorizontal: 8,
  },
  legalText: {
    fontSize: 12,
    textAlign: 'center',
  },
  legalLink: {
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
