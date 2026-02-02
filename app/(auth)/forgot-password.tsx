import { ForgotPasswordForm } from '@/components/forgot-password-form';
import { GradientBackground } from '@/components/ui/gradient-background';
import { addOpacityToHex } from '@/lib/utils';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function ForgotPasswordScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'tint');
  const gradientColors = [backgroundColor, addOpacityToHex(primaryColor, 0.06), backgroundColor];

  return (
    <GradientBackground colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
        keyboardDismissMode="interactive">
        <View style={styles.container}>
          <ForgotPasswordForm />
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
    paddingTop: 64,
    paddingBottom: 40,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
});
