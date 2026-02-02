import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { createShadowStyle } from '@/lib/shadow-styles';

function AnimatedInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  index,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  index: number;
}) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-20);
  const borderColor = useThemeColor({}, 'border');
  const cardBg = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');

  React.useEffect(() => {
    opacity.value = withDelay(index * 50, withTiming(1, { duration: 300 }));
    translateX.value = withDelay(index * 50, withSpring(0, { damping: 15 }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>{label}</ThemedText>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: cardBg,
              borderColor,
              color: textColor,
            },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
      </View>
    </Animated.View>
  );
}

export default function AddUserScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive' | 'pending'>('active');

  const backgroundColor = useThemeColor({}, 'background');
  const tint = useThemeColor({}, 'tint');
  const cardBg = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');

  const handleSave = () => {
    if (!name || !email || !role) {
      Alert.alert('Error', 'Please fill all required fields (Name, Email, Role)');
      return;
    }
    Alert.alert('Success', 'User added successfully');
    router.back();
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={[styles.title, { color: textColor }]}>
          Add New User
        </ThemedText>

        <AnimatedInput
          label="Full Name *"
          value={name}
          onChangeText={setName}
          placeholder="Enter full name"
          index={0}
        />

        <AnimatedInput
          label="Email Address *"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email address"
          keyboardType="email-address"
          autoCapitalize="none"
          index={1}
        />

        <AnimatedInput
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          index={2}
        />

        <AnimatedInput
          label="Role *"
          value={role}
          onChangeText={setRole}
          placeholder="e.g., Administrator, Manager, Agent"
          index={3}
        />

        <AnimatedInput
          label="Department"
          value={department}
          onChangeText={setDepartment}
          placeholder="e.g., Sales, Support, IT"
          index={4}
        />

        <View style={styles.statusContainer}>
          <ThemedText style={styles.label}>Status</ThemedText>
          <View style={styles.statusButtons}>
            {(['active', 'inactive', 'pending'] as const).map(s => (
              <Pressable
                key={s}
                onPress={() => setStatus(s)}
                style={[
                  styles.statusButton,
                  {
                    backgroundColor: status === s ? tint : cardBg,
                    borderColor: status === s ? tint : borderColor,
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.statusButtonText,
                    { color: status === s ? '#ffffff' : textColor },
                  ]}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          style={[
            styles.saveButton,
            { backgroundColor: tint },
            createShadowStyle({
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }),
          ]}
          onPress={handleSave}
        >
          <ThemedText style={styles.saveButtonText}>Save User</ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  statusContainer: {
    marginBottom: 24,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});
