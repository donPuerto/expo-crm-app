import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';

export function ResetPasswordForm() {
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');
  const codeInputRef = React.useRef<TextInput>(null);
  const [error, setError] = React.useState({ code: '', password: '' });

  function onSubmit() {
    setError({ code: '', password: '' });
  }

  function onPasswordSubmitEditing() {
    codeInputRef.current?.focus();
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="h1">Reset password</Text>
        <Text variant="muted" style={styles.headerSubtitle}>
          Enter the code sent to your email and set a new password
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.field}>
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            secureTextEntry
            onChangeText={setPassword}
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={onPasswordSubmitEditing}
            value={password}
          />
          {error.password ? (
            <Text variant="small" style={styles.errorText}>
              {error.password}
            </Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Label htmlFor="code">Verification code</Label>
          <Input
            ref={codeInputRef}
            id="code"
            autoCapitalize="none"
            onChangeText={setCode}
            returnKeyType="send"
            keyboardType="numeric"
            autoComplete="sms-otp"
            textContentType="oneTimeCode"
            onSubmitEditing={onSubmit}
            value={code}
          />
          {error.code ? (
            <Text variant="small" style={styles.errorText}>
              {error.code}
            </Text>
          ) : null}
        </View>

        <Button style={styles.submitButton} onPress={onSubmit}>
          <Text>Reset Password</Text>
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
