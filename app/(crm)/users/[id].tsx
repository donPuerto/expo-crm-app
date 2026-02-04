import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  YStack,
  XStack,
  H1,
  Text,
  Button,
  ScrollView,
  Separator,
  Input,
} from '@/interface/primitives';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  phone?: string;
  department?: string;
};

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@company.com',
    role: 'Administrator',
    status: 'active',
    phone: '+1 234 567 8900',
    department: 'IT',
  },
  {
    id: '2',
    name: 'Sarah Williams',
    email: 'sarah.williams@company.com',
    role: 'Sales Manager',
    status: 'active',
    phone: '+1 234 567 8901',
    department: 'Sales',
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    role: 'Support Agent',
    status: 'active',
    phone: '+1 234 567 8902',
    department: 'Support',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    role: 'Marketing Specialist',
    status: 'pending',
    phone: '+1 234 567 8903',
    department: 'Marketing',
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@company.com',
    role: 'Developer',
    status: 'inactive',
    phone: '+1 234 567 8904',
    department: 'Engineering',
  },
];

export default function UserDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const user = mockUsers.find(item => item.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [role, setRole] = useState(user?.role || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [status, setStatus] = useState<User['status']>(user?.status || 'active');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
      setRole(user.role);
      setDepartment(user.department || '');
      setStatus(user.status);
    }
  }, [user]);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
    translateY.value = withSpring(0, { damping: 15 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!user) {
    return (
      <YStack
        flex={1}
        backgroundColor="$background"
        justifyContent="center"
        alignItems="center"
        paddingHorizontal="$5"
      >
        <Text fontSize="$4" fontWeight="600" color="$red10" marginBottom="$5">
          User not found
        </Text>
        <Button size="$4" backgroundColor="$primary" onPress={() => router.back()}>
          <Text color="$primaryForeground" fontWeight="600">
            Go Back
          </Text>
        </Button>
      </YStack>
    );
  }

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return '$green10';
      case 'pending':
        return '$orange10';
      case 'inactive':
        return '$red10';
      default:
        return '$borderColor';
    }
  };

  const getStatusBgColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return '$green3';
      case 'pending':
        return '$orange3';
      case 'inactive':
        return '$red3';
      default:
        return '$gray3';
    }
  };

  const handleSave = () => {
    if (!name || !email || !role) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    Alert.alert('Success', 'User updated successfully');
    setIsEditing(false);
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <YStack
        backgroundColor="$card"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        paddingVertical="$4"
        paddingHorizontal="$5"
      >
        <XStack alignItems="center" gap="$4">
          <Button unstyled onPress={() => router.back()}>
            <Text fontSize="$4" fontWeight="600" color="$primary">
              ← Back
            </Text>
          </Button>
          <H1 flex={1} fontSize="$6" fontWeight="700" color="$color">
            {isEditing ? 'Edit User' : 'User Details'}
          </H1>
          <Button
            size="$3"
            backgroundColor={isEditing ? '$primary' : 'transparent'}
            borderRadius="$2"
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            <Text color={isEditing ? '$primaryForeground' : '$primary'} fontWeight="600">
              {isEditing ? 'Save' : 'Edit'}
            </Text>
          </Button>
        </XStack>
      </YStack>

      <ScrollView flex={1} padding="$5" paddingBottom="$10">
        <Animated.View style={animatedStyle}>
          <YStack
            backgroundColor="$card"
            borderWidth={1}
            borderColor="$borderColor"
            borderRadius="$4"
            padding="$6"
            gap="$5"
            elevation="$2"
          >
            <YStack gap="$3">
              {isEditing ? (
                <Input value={name} onChangeText={setName} placeholder="Full Name" size="$6" />
              ) : (
                <H1 fontSize="$8" fontWeight="bold" color="$color" marginBottom="$2">
                  {name}
                </H1>
              )}
              <XStack
                alignSelf="flex-start"
                paddingVertical="$2"
                paddingHorizontal="$3.5"
                borderRadius="$3"
                borderWidth={1}
                borderColor={getStatusColor(status)}
                backgroundColor={getStatusBgColor(status)}
                alignItems="center"
                gap="$2"
              >
                <YStack
                  width={10}
                  height={10}
                  borderRadius="$12"
                  backgroundColor={getStatusColor(status)}
                />
                {isEditing ? (
                  <XStack gap="$1.5">
                    {(['active', 'inactive', 'pending'] as const).map(s => (
                      <Button
                        key={s}
                        unstyled
                        paddingHorizontal="$2.5"
                        paddingVertical="$1"
                        borderRadius="$2"
                        backgroundColor={status === s ? getStatusColor(s) : 'transparent'}
                        onPress={() => setStatus(s)}
                      >
                        <Text
                          fontSize="$1"
                          fontWeight="600"
                          textTransform="uppercase"
                          color={status === s ? '$white' : getStatusColor(s)}
                        >
                          {s}
                        </Text>
                      </Button>
                    ))}
                  </XStack>
                ) : (
                  <Text
                    fontSize="$2"
                    fontWeight="700"
                    textTransform="uppercase"
                    color={getStatusColor(status)}
                  >
                    {status}
                  </Text>
                )}
              </XStack>
            </YStack>

            <Separator />

            <YStack gap="$2">
              <Text
                fontSize="$2"
                fontWeight="600"
                color="$gray11"
                textTransform="uppercase"
                letterSpacing={0.5}
              >
                Email Address
              </Text>
              {isEditing ? (
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <Text fontSize="$4" fontWeight="500" color="$primary">
                  {email}
                </Text>
              )}
            </YStack>

            <YStack gap="$2">
              <Text
                fontSize="$2"
                fontWeight="600"
                color="$gray11"
                textTransform="uppercase"
                letterSpacing={0.5}
              >
                Phone Number
              </Text>
              {isEditing ? (
                <Input
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Phone"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text fontSize="$4" fontWeight="500" color="$color">
                  {phone || 'Not provided'}
                </Text>
              )}
            </YStack>

            <YStack gap="$2">
              <Text
                fontSize="$2"
                fontWeight="600"
                color="$gray11"
                textTransform="uppercase"
                letterSpacing={0.5}
              >
                Role
              </Text>
              {isEditing ? (
                <Input value={role} onChangeText={setRole} placeholder="Role" />
              ) : (
                <Text fontSize="$4" fontWeight="500" color="$color">
                  {role}
                </Text>
              )}
            </YStack>

            <YStack gap="$2">
              <Text
                fontSize="$2"
                fontWeight="600"
                color="$gray11"
                textTransform="uppercase"
                letterSpacing={0.5}
              >
                Department
              </Text>
              {isEditing ? (
                <Input value={department} onChangeText={setDepartment} placeholder="Department" />
              ) : (
                <Text fontSize="$4" fontWeight="500" color="$color">
                  {department || 'Not assigned'}
                </Text>
              )}
            </YStack>

            {!isEditing && (
              <>
                <Separator marginVertical="$2" />
                <XStack gap="$3" marginTop="$2">
                  <Button
                    flex={1}
                    size="$4"
                    backgroundColor="$primary"
                    borderRadius="$2"
                    elevation="$2"
                    onPress={() => Alert.alert('Contact', `Calling ${name}...`)}
                  >
                    <Text color="$primaryForeground" fontWeight="600">
                      Call
                    </Text>
                  </Button>
                  <Button
                    flex={1}
                    size="$4"
                    backgroundColor="$card"
                    borderWidth={1}
                    borderColor="$borderColor"
                    borderRadius="$2"
                    onPress={() => Alert.alert('Email', `Opening email to ${email}...`)}
                  >
                    <Text color="$color" fontWeight="600">
                      Email
                    </Text>
                  </Button>
                </XStack>
              </>
            )}
          </YStack>
        </Animated.View>
      </ScrollView>
    </YStack>
  );
}
