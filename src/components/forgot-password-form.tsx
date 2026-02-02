import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';

export function ForgotPasswordForm() {
  const { email: emailParam = '' } = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = React.useState(emailParam);
  const [error, setError] = React.useState<{ email?: string }>({});

  const onSubmit = () => {
    if (!email) {
      setError({ email: 'Email is required' });
      return;
    }
    setError({});
    router.push(`/(auth)/reset-password?email=${email}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="h1">Forgot password?</Text>
        <Text variant="muted" style={styles.headerSubtitle}>
          Enter your email to reset your password
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.field}>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            defaultValue={email}
            placeholder="m@example.com"
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            onChangeText={setEmail}
            onSubmitEditing={onSubmit}
            returnKeyType="send"
          />
          {error.email ? (
            <Text variant="small" style={styles.errorText}>
              {error.email}
            </Text>
          ) : null}
        </View>

        <Button style={styles.submitButton} onPress={onSubmit}>
          <Text>Reset your password</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 32,
  },
  header: {
    gap: 12,
    alignItems: 'center',
  },
  headerSubtitle: {
    textAlign: 'center',
  },
  form: {
    gap: 24,
  },
  field: {
    gap: 6,
  },
  errorText: {
    color: '#ef4444', // destructive color
  },
  submitButton: {
    width: '100%',
  },
});
