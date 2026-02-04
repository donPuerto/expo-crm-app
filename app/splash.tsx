import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { LinearGradient, Text, View } from '@/interface/primitives';
import { addOpacityToHex } from '@/lib/utils';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useFont } from '@/hooks/use-font';

function AnimatedElement({ children, index }: { children: React.ReactNode; index: number }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const hasAnimated = React.useRef(false);

  useEffect(() => {
    if (!hasAnimated.current) {
      hasAnimated.current = true;
      opacity.value = withDelay(index * 150, withTiming(1, { duration: 600 }));
      translateY.value = withDelay(index * 150, withTiming(0, { duration: 600 }));
    }
  }, [index, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

export default function SplashScreen() {
  const router = useRouter();

  // Explicit theme colors using useThemeColor hook - MUST use for consistency
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  // Dynamic font settings
  const { fontFamily, getScaledFontSize } = useFont();

  // Dynamic styles with font scaling
  const dynamicStyles = StyleSheet.create({
    appName: {
      fontFamily,
      fontSize: getScaledFontSize(32),
      fontWeight: '700',
      color: textColor,
      textAlign: 'center',
    },
    tagline: {
      fontFamily,
      fontSize: getScaledFontSize(16),
      color: iconColor,
      textAlign: 'center',
      marginTop: 8,
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  // Subtle gradient colors based on theme
  const gradientColors = [
    backgroundColor,
    addOpacityToHex(primaryColor, 0.08), // Very subtle tint (8% opacity)
    backgroundColor,
  ];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <AnimatedElement index={0}>
        <View
          style={styles.logo}
          width={96}
          height={96}
          borderRadius={48}
          backgroundColor="$blue10"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="white" fontSize={24} fontWeight="800">
            CRM
          </Text>
        </View>
      </AnimatedElement>

      <AnimatedElement index={1}>
        <Text style={dynamicStyles.appName}>Application</Text>
      </AnimatedElement>

      <AnimatedElement index={2}>
        <Text style={dynamicStyles.tagline}>Your Intelligent Business{'\n'}CRM Solutions</Text>
      </AnimatedElement>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginBottom: 32,
  },
});
