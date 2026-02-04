import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { YStack, XStack, Text, H1, ScrollView, Button } from 'tamagui';
import { Input } from '@/interface/primitives/input';

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
      <YStack marginBottom="$5">
        <Text fontSize="$2" fontWeight="600" marginBottom="$2" opacity={0.8}>
          {label}
        </Text>
        <Input
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="$gray9"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
      </YStack>
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

  const handleSave = () => {
    if (!name || !email || !role) {
      Alert.alert('Error', 'Please fill all required fields (Name, Email, Role)');
      return;
    }
    Alert.alert('Success', 'User added successfully');
    router.back();
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingTop: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <H1 fontSize="$9" fontWeight="bold" marginBottom="$6" color="$color">
          Add New User
        </H1>

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

        <YStack marginBottom="$6">
          <Text fontSize="$2" fontWeight="600" marginBottom="$2" opacity={0.8}>
            Status
          </Text>
          <XStack gap="$3" marginTop="$2">
            {(['active', 'inactive', 'pending'] as const).map(s => (
              <Button
                key={s}
                flex={1}
                size="$4"
                borderRadius="$2"
                borderWidth={1}
                backgroundColor={status === s ? '$primary' : '$card'}
                borderColor={status === s ? '$primary' : '$borderColor'}
                color={status === s ? '$primaryForeground' : '$color'}
                onPress={() => setStatus(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Button>
            ))}
          </XStack>
        </YStack>

        <Button
          marginTop="$2"
          size="$5"
          backgroundColor="$primary"
          color="$primaryForeground"
          fontWeight="600"
          borderRadius="$3"
          elevation={2}
          onPress={handleSave}
        >
          Save User
        </Button>
      </ScrollView>
    </YStack>
  );
}
