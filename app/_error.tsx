import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/interface/components/themed-text';
import { ThemedView } from '@/interface/components/themed-view';

export default function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Something went wrong
      </ThemedText>

      <ThemedText style={styles.message}>{error.message}</ThemedText>

      <TouchableOpacity style={styles.button} onPress={retry}>
        <ThemedText type="link">Try again</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.replace('/')}>
        <ThemedText type="link">Go to home</ThemedText>
      </TouchableOpacity>
    </ThemedView>
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
