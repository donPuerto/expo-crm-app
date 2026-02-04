import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { YStack, XStack, H1, H2, Text, Button, ScrollView } from 'tamagui';
import { Input, Avatar, getInitials, Label } from '@/interface/primitives';

export default function UserProfile() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Demo User');
  const [email, setEmail] = useState('demo@donpuerto.com');
  const [role, setRole] = useState('Administrator');
  const [phone, setPhone] = useState('+1 234 567 8900');
  const [company, setCompany] = useState('Don Puerto CRM');

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          router.back();
          setTimeout(() => {
            router.replace('/splash');
          }, 100);
        },
      },
    ]);
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <YStack backgroundColor="$primary" paddingTop={60} paddingHorizontal="$5" paddingBottom="$5">
        <XStack justifyContent="space-between" alignItems="center">
          <Button unstyled width={60} onPress={() => router.back()}>
            <Text color="$primaryForeground" fontSize="$4">
              ← Back
            </Text>
          </Button>
          <H1 fontSize="$6" fontWeight="bold" color="$primaryForeground">
            User Profile
          </H1>
          <YStack width={60} />
        </XStack>
      </YStack>

      <ScrollView flex={1}>
        <YStack alignItems="center" paddingVertical="$8">
          <Avatar circular size="$10" marginBottom="$3">
            <Avatar.Fallback backgroundColor="$blue10">
              <Text color="white" fontSize="$8" fontWeight="bold">
                {getInitials(name)}
              </Text>
            </Avatar.Fallback>
          </Avatar>
          {isEditing && (
            <Button size="$3" backgroundColor="$blue10" borderRadius="$2">
              <Text color="white">Change Photo</Text>
            </Button>
          )}
        </YStack>

        <YStack paddingHorizontal="$5" paddingVertical="$4">
          <H2 fontSize="$6" fontWeight="bold" color="$color" marginBottom="$4">
            Personal Information
          </H2>

          <YStack marginBottom="$5">
            <Label
              htmlFor="fullName"
              fontSize="$2"
              fontWeight="600"
              color="$gray11"
              marginBottom="$2"
              textTransform="uppercase"
            >
              Full Name
            </Label>
            {isEditing ? (
              <Input value={name} onChangeText={setName} placeholder="Enter your name" />
            ) : (
              <YStack
                paddingVertical="$3"
                paddingHorizontal="$4"
                backgroundColor="$card"
                borderRadius="$3"
                borderWidth={1}
                borderColor="$borderColor"
              >
                <Text fontSize="$4" color="$color">
                  {name}
                </Text>
              </YStack>
            )}
          </YStack>

          <YStack marginBottom="$5">
            <Label
              htmlFor="email"
              fontSize="$2"
              fontWeight="600"
              color="$gray11"
              marginBottom="$2"
              textTransform="uppercase"
            >
              Email
            </Label>
            {isEditing ? (
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <YStack
                paddingVertical="$3"
                paddingHorizontal="$4"
                backgroundColor="$card"
                borderRadius="$3"
                borderWidth={1}
                borderColor="$borderColor"
              >
                <Text fontSize="$4" color="$color">
                  {email}
                </Text>
              </YStack>
            )}
          </YStack>

          <YStack marginBottom="$5">
            <Label
              htmlFor="role"
              fontSize="$2"
              fontWeight="600"
              color="$gray11"
              marginBottom="$2"
              textTransform="uppercase"
            >
              Role
            </Label>
            {isEditing ? (
              <Input value={role} onChangeText={setRole} placeholder="Enter your role" />
            ) : (
              <YStack
                paddingVertical="$3"
                paddingHorizontal="$4"
                backgroundColor="$card"
                borderRadius="$3"
                borderWidth={1}
                borderColor="$borderColor"
              >
                <Text fontSize="$4" color="$color">
                  {role}
                </Text>
              </YStack>
            )}
          </YStack>

          <YStack marginBottom="$5">
            <Label
              htmlFor="phone"
              fontSize="$2"
              fontWeight="600"
              color="$gray11"
              marginBottom="$2"
              textTransform="uppercase"
            >
              Phone
            </Label>
            {isEditing ? (
              <Input
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone"
                keyboardType="phone-pad"
              />
            ) : (
              <YStack
                paddingVertical="$3"
                paddingHorizontal="$4"
                backgroundColor="$card"
                borderRadius="$3"
                borderWidth={1}
                borderColor="$borderColor"
              >
                <Text fontSize="$4" color="$color">
                  {phone}
                </Text>
              </YStack>
            )}
          </YStack>

          <YStack marginBottom="$5">
            <Label
              htmlFor="company"
              fontSize="$2"
              fontWeight="600"
              color="$gray11"
              marginBottom="$2"
              textTransform="uppercase"
            >
              Company
            </Label>
            {isEditing ? (
              <Input value={company} onChangeText={setCompany} placeholder="Enter your company" />
            ) : (
              <YStack
                paddingVertical="$3"
                paddingHorizontal="$4"
                backgroundColor="$card"
                borderRadius="$3"
                borderWidth={1}
                borderColor="$borderColor"
              >
                <Text fontSize="$4" color="$color">
                  {company}
                </Text>
              </YStack>
            )}
          </YStack>
        </YStack>

        <YStack paddingHorizontal="$5" paddingVertical="$4">
          <H2 fontSize="$6" fontWeight="bold" color="$color" marginBottom="$4">
            Activity Stats
          </H2>

          <XStack gap="$3" marginBottom="$3">
            <YStack
              flex={1}
              backgroundColor="$card"
              padding="$5"
              borderRadius="$3"
              alignItems="center"
              borderWidth={1}
              borderColor="$borderColor"
            >
              <Text fontSize="$8" fontWeight="bold" color="$primary" marginBottom="$1">
                24
              </Text>
              <Text fontSize="$2" color="$gray11" textAlign="center">
                Leads Created
              </Text>
            </YStack>
            <YStack
              flex={1}
              backgroundColor="$card"
              padding="$5"
              borderRadius="$3"
              alignItems="center"
              borderWidth={1}
              borderColor="$borderColor"
            >
              <Text fontSize="$8" fontWeight="bold" color="$primary" marginBottom="$1">
                156
              </Text>
              <Text fontSize="$2" color="$gray11" textAlign="center">
                Contacts Managed
              </Text>
            </YStack>
          </XStack>

          <XStack gap="$3" marginBottom="$3">
            <YStack
              flex={1}
              backgroundColor="$card"
              padding="$5"
              borderRadius="$3"
              alignItems="center"
              borderWidth={1}
              borderColor="$borderColor"
            >
              <Text fontSize="$8" fontWeight="bold" color="$primary" marginBottom="$1">
                89%
              </Text>
              <Text fontSize="$2" color="$gray11" textAlign="center">
                Success Rate
              </Text>
            </YStack>
            <YStack
              flex={1}
              backgroundColor="$card"
              padding="$5"
              borderRadius="$3"
              alignItems="center"
              borderWidth={1}
              borderColor="$borderColor"
            >
              <Text fontSize="$8" fontWeight="bold" color="$primary" marginBottom="$1">
                12
              </Text>
              <Text fontSize="$2" color="$gray11" textAlign="center">
                Active Deals
              </Text>
            </YStack>
          </XStack>
        </YStack>

        <YStack paddingHorizontal="$5" paddingVertical="$4">
          {isEditing ? (
            <XStack gap="$3" marginBottom="$3">
              <Button
                flex={1}
                size="$5"
                variant="outlined"
                borderRadius="$3"
                onPress={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                flex={1}
                size="$5"
                backgroundColor="$blue10"
                borderRadius="$3"
                onPress={handleSave}
              >
                <Text color="white">Save Changes</Text>
              </Button>
            </XStack>
          ) : (
            <Button
              size="$5"
              backgroundColor="$blue10"
              borderRadius="$3"
              marginBottom="$3"
              onPress={() => setIsEditing(true)}
            >
              <Text color="white">Edit Profile</Text>
            </Button>
          )}

          <Button
            size="$5"
            variant="outlined"
            borderColor="$red10"
            borderRadius="$3"
            onPress={handleLogout}
          >
            <Text color="$red10">Logout</Text>
          </Button>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
