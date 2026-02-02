import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { type TextStyle, View, StyleSheet } from 'react-native';

const RESEND_CODE_INTERVAL_SECONDS = 30;
const TABULAR_NUMBERS_STYLE: TextStyle = { fontVariant: ['tabular-nums'] };

export function VerifyEmailForm() {
  const { email = '' } = useLocalSearchParams<{ email?: string }>();
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState('');
  const { countdown, restartCountdown } = useCountdown(RESEND_CODE_INTERVAL_SECONDS);

  function onSubmit() {
    if (!code) {
      setError('Verification code is required');
      return;
    }
    setError('');
  }

  function onResendCode() {
    restartCountdown();
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="h1">Verify your email</Text>
        <Text variant="muted" style={styles.headerSubtitle}>
          Enter the verification code sent to {email || 'your email'}
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.field}>
          <Label htmlFor="code">Verification code</Label>
          <Input
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
          {!error ? null : (
            <Text variant="small" style={styles.errorText}>
              {error}
            </Text>
          )}
          <Button
            variant="link"
            size="sm"
            disabled={countdown > 0}
            onPress={onResendCode}
            style={styles.resendButton}
          >
            <Text variant="small" style={styles.resendText}>
              Didn&apos;t receive the code? Resend{' '}
              {countdown > 0 ? (
                <Text variant="small" style={TABULAR_NUMBERS_STYLE}>
                  ({countdown})
                </Text>
              ) : null}
            </Text>
          </Button>
        </View>

        <View style={styles.actions}>
          <Button style={styles.submitButton} onPress={onSubmit}>
            <Text>Continue</Text>
          </Button>
          <Button variant="link" style={styles.cancelButton} onPress={router.back}>
            <Text>Cancel</Text>
          </Button>
        </View>
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
  resendButton: {
    marginTop: 8,
    paddingHorizontal: 0,
  },
  resendText: {
    textAlign: 'center',
  },
  actions: {
    gap: 12,
  },
  submitButton: {
    width: '100%',
  },
  cancelButton: {
    alignSelf: 'center',
  },
});

function useCountdown(seconds = 30) {
  const [countdown, setCountdown] = React.useState(seconds);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = React.useCallback(() => {
    setCountdown(seconds);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [seconds]);

  React.useEffect(() => {
    startCountdown();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startCountdown]);

  return { countdown, restartCountdown: startCountdown };
}
