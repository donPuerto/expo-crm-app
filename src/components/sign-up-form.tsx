import { SocialConnections } from '@/components/social-connections';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import * as React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';

export function SignUpForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const passwordInputRef = React.useRef<TextInput>(null);
  const [error] = React.useState<{ email?: string; password?: string }>({});

  function onSubmit() {
    // UI-only: no auth logic yet
  }

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="h1">Create your account</Text>
        <Text variant="muted" style={styles.headerSubtitle}>
          Welcome! Please fill in the details to get started.
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.field}>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="m@example.com"
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            onChangeText={setEmail}
            onSubmitEditing={onEmailSubmitEditing}
            returnKeyType="next"
            submitBehavior="submit"
            value={email}
          />
          {error.email ? (
            <Text variant="small" style={styles.errorText}>
              {error.email}
            </Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Label htmlFor="password">Password</Label>
          <Input
            ref={passwordInputRef}
            id="password"
            secureTextEntry
            onChangeText={setPassword}
            returnKeyType="send"
            onSubmitEditing={onSubmit}
            value={password}
          />
          {error.password ? (
            <Text variant="small" style={styles.errorText}>
              {error.password}
            </Text>
          ) : null}
        </View>

        <Button style={styles.submitButton} onPress={onSubmit}>
          <Text>Continue</Text>
        </Button>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text variant="small" style={styles.footerText}>
          Already have an account?{' '}
          <Text variant="small" style={styles.link} onPress={() => router.push('/(auth)/sign-in')}>
            Sign in
          </Text>
        </Text>

        <View style={styles.separatorRow}>
          <Separator style={styles.separator} />
          <Text variant="small" style={styles.separatorText}>
            or
          </Text>
          <Separator style={styles.separator} />
        </View>

        <SocialConnections />
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
  footer: {
    gap: 24,
  },
  footerText: {
    textAlign: 'center',
  },
  link: {
    textDecorationLine: 'underline',
  },
  separatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  separator: {
    flex: 1,
  },
  separatorText: {
    paddingHorizontal: 16,
  },
});
