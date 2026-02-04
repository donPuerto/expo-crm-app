import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Paragraph, SizableText, View } from '@/interface/primitives';

export default function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <SizableText size="$8" fontWeight="800" style={styles.title}>
        Something went wrong
      </SizableText>

      <Paragraph style={styles.message}>{error.message}</Paragraph>

      <TouchableOpacity style={styles.button} onPress={retry}>
        <Paragraph color="$primary" textDecorationLine="underline">
          Try again
        </Paragraph>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.replace('/')}>
        <Paragraph color="$primary" textDecorationLine="underline">
          Go to home
        </Paragraph>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 16,
  },
  message: {
    marginBottom: 24,
    textAlign: 'center',
    opacity: 0.7,
  },
  button: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
});
