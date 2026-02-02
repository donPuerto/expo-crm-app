import { SignUpForm } from '@/components/sign-up-form';
import { GradientBackground } from '@/components/ui/gradient-background';
import { addOpacityToHex } from '@/lib/utils';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function SignUpScreen() {
  // Theme colors for gradient
  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'tint');

  // Subtle gradient colors
  const gradientColors = [backgroundColor, addOpacityToHex(primaryColor, 0.06), backgroundColor];

  return (
    <GradientBackground colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
        keyboardDismissMode="interactive"
      >
        <View style={styles.container}>
          <SignUpForm />
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  container: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
});
