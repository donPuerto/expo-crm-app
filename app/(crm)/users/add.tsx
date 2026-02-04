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
import { YStack, Text, H1, ScrollView, Button } from 'tamagui';
import { Input } from '@/interface/primitives/input.tamagui';
import {
  SelectField,
  SwitchField,
  validateValues,
  hasErrors,
  v,
  type FieldErrors,
} from '@/interface/components/form-fields';

function AnimatedInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  error,
  index,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
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
        <Text
          fontSize="$2"
          fontWeight="600"
          marginBottom="$2"
          opacity={0.8}
          color={error ? '$red10' : '$color'}
        >
          {label}
        </Text>
        <Input
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          borderColor={error ? '$red10' : '$borderColor'}
        />

        {error && (
          <Text fontSize="$2" color="$red10" marginTop="$2">
            {error}
          </Text>
        )}
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
  const [isActive, setIsActive] = useState(true);
  const [sendInvite, setSendInvite] = useState(true);
  type UserFieldKey = 'name' | 'email' | 'role';
  const [errors, setErrors] = useState<FieldErrors<UserFieldKey>>({});

  const handleSave = () => {
    const nextErrors = validateValues(
      { name, email, role },
      {
        name: [v.required('Full name is required')],
        email: [v.required('Email is required'), v.email()],
        role: [v.required('Role is required')],
      }
    );

    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      const first = Object.values(nextErrors).find(Boolean);
      Alert.alert('Error', first ?? 'Please check the form');
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
          onChangeText={text => {
            setName(text);
            if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
          }}
          placeholder="Enter full name"
          error={errors.name}
          index={0}
        />

        <AnimatedInput
          label="Email Address *"
          value={email}
          onChangeText={text => {
            setEmail(text);
            if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
          }}
          placeholder="Enter email address"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
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

        <Animated.View
          style={useAnimatedStyle(() => ({
            opacity: withDelay(3 * 50, withTiming(1, { duration: 300 })),
            transform: [{ translateX: withDelay(3 * 50, withSpring(0, { damping: 15 })) }],
          }))}
        >
          <YStack marginBottom="$5">
            <SelectField
              id="role"
              label="Role"
              placeholder="Select user role"
              options={[
                { label: 'Administrator', value: 'admin' },
                { label: 'Manager', value: 'manager' },
                { label: 'Sales Agent', value: 'agent' },
                { label: 'Support', value: 'support' },
                { label: 'Viewer', value: 'viewer' },
              ]}
              value={role}
              onValueChange={next => {
                setRole(next);
                if (errors.role) setErrors(prev => ({ ...prev, role: undefined }));
              }}
              required
              error={errors.role}
            />
          </YStack>
        </Animated.View>

        <AnimatedInput
          label="Department"
          value={department}
          onChangeText={setDepartment}
          placeholder="e.g., Sales, Support, IT"
          index={4}
        />

        <Animated.View
          style={useAnimatedStyle(() => ({
            opacity: withDelay(5 * 50, withTiming(1, { duration: 300 })),
            transform: [{ translateX: withDelay(5 * 50, withSpring(0, { damping: 15 })) }],
          }))}
        >
          <YStack marginBottom="$5">
            <SwitchField
              id="isActive"
              label="Active Status"
              description="User can access the system"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </YStack>
        </Animated.View>

        <Animated.View
          style={useAnimatedStyle(() => ({
            opacity: withDelay(6 * 50, withTiming(1, { duration: 300 })),
            transform: [{ translateX: withDelay(6 * 50, withSpring(0, { damping: 15 })) }],
          }))}
        >
          <YStack marginBottom="$6">
            <SwitchField
              id="sendInvite"
              label="Send Invitation Email"
              description="User will receive login credentials"
              checked={sendInvite}
              onCheckedChange={setSendInvite}
            />
          </YStack>
        </Animated.View>

        <Button
          marginTop="$2"
          size="$5"
          backgroundColor="$blue10"
          borderRadius="$3"
          elevation={2}
          onPress={handleSave}
        >
          <Text color="white">Save User</Text>
        </Button>
      </ScrollView>
    </YStack>
  );
}
