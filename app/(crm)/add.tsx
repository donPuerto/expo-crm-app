import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { YStack, H1, Text, Button } from 'tamagui';
import { Input } from '@/interface/primitives/input.tamagui';

export default function AddContactScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSave = () => {
    if (!name || !company || !email) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    Alert.alert('Success', 'Contact added successfully');
    router.back();
  };

  return (
    <YStack flex={1} backgroundColor="$background" paddingTop={60} paddingHorizontal="$5">
      <H1 fontSize="$7" fontWeight="700" color="$color" marginBottom="$4">
        Add Contact
      </H1>

      <YStack marginTop="$3">
        <Text fontSize="$2" fontWeight="600" color="$gray11" marginBottom="$2">
          Full Name
        </Text>
        <Input value={name} onChangeText={setName} placeholder="Contact name" />
      </YStack>

      <YStack marginTop="$3">
        <Text fontSize="$2" fontWeight="600" color="$gray11" marginBottom="$2">
          Company
        </Text>
        <Input value={company} onChangeText={setCompany} placeholder="Company" />
      </YStack>

      <YStack marginTop="$3">
        <Text fontSize="$2" fontWeight="600" color="$gray11" marginBottom="$2">
          Email
        </Text>
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </YStack>

      <YStack marginTop="$3">
        <Text fontSize="$2" fontWeight="600" color="$gray11" marginBottom="$2">
          Phone
        </Text>
        <Input value={phone} onChangeText={setPhone} placeholder="Phone" />
      </YStack>

      <Button
        marginTop="$5"
        size="$5"
        backgroundColor="$primary"
        borderRadius="$3"
        onPress={handleSave}
      >
        <Text color="$primaryForeground" fontWeight="600">
          Save Contact
        </Text>
      </Button>
    </YStack>
  );
}
