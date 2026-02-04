import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { YStack, H1, Text, Button, ScrollView, Input } from '@/interface/primitives';
import {
  SelectField,
  CheckboxField,
  validateValues,
  hasErrors,
  v,
  type FieldErrors,
} from '@/interface/components/form-fields';

export default function AddContactScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  type ContactFieldKey = 'name' | 'company' | 'email';
  const [errors, setErrors] = useState<FieldErrors<ContactFieldKey>>({});

  const handleSave = () => {
    const nextErrors = validateValues(
      { name, company, email },
      {
        name: [v.required('Full name is required')],
        company: [v.required('Company is required')],
        email: [v.required('Email is required'), v.email()],
      }
    );

    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      const first = Object.values(nextErrors).find(Boolean);
      Alert.alert('Error', first ?? 'Please check the form');
      return;
    }

    Alert.alert('Success', 'Contact added successfully');
    router.back();
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
        <H1 fontSize="$7" fontWeight="700" color="$color" marginBottom="$4">
          Add Contact
        </H1>

        <YStack marginTop="$3">
          <Text
            fontSize="$2"
            fontWeight="600"
            color={errors.name ? '$red10' : '$gray11'}
            marginBottom="$2"
          >
            Full Name
          </Text>
          <Input
            value={name}
            onChangeText={text => {
              setName(text);
              if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
            }}
            placeholder="Contact name"
            borderColor={errors.name ? '$red10' : '$borderColor'}
          />
          {errors.name && (
            <Text fontSize="$2" color="$red10" marginTop="$2">
              {errors.name}
            </Text>
          )}
        </YStack>

        <YStack marginTop="$3">
          <Text
            fontSize="$2"
            fontWeight="600"
            color={errors.company ? '$red10' : '$gray11'}
            marginBottom="$2"
          >
            Company
          </Text>
          <Input
            value={company}
            onChangeText={text => {
              setCompany(text);
              if (errors.company) setErrors(prev => ({ ...prev, company: undefined }));
            }}
            placeholder="Company"
            borderColor={errors.company ? '$red10' : '$borderColor'}
          />
          {errors.company && (
            <Text fontSize="$2" color="$red10" marginTop="$2">
              {errors.company}
            </Text>
          )}
        </YStack>

        <YStack marginTop="$3">
          <SelectField
            id="position"
            label="Position"
            placeholder="Select position"
            options={[
              { label: 'CEO', value: 'ceo' },
              { label: 'Manager', value: 'manager' },
              { label: 'Director', value: 'director' },
              { label: 'Executive', value: 'executive' },
              { label: 'Employee', value: 'employee' },
              { label: 'Other', value: 'other' },
            ]}
            value={position}
            onValueChange={setPosition}
          />
        </YStack>

        <YStack marginTop="$3">
          <Text
            fontSize="$2"
            fontWeight="600"
            color={errors.email ? '$red10' : '$gray11'}
            marginBottom="$2"
          >
            Email
          </Text>
          <Input
            value={email}
            onChangeText={text => {
              setEmail(text);
              if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
            }}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            borderColor={errors.email ? '$red10' : '$borderColor'}
          />
          {errors.email && (
            <Text fontSize="$2" color="$red10" marginTop="$2">
              {errors.email}
            </Text>
          )}
        </YStack>

        <YStack marginTop="$3">
          <Text fontSize="$2" fontWeight="600" color="$gray11" marginBottom="$2">
            Phone
          </Text>
          <Input value={phone} onChangeText={setPhone} placeholder="Phone" />
        </YStack>

        <YStack marginTop="$4">
          <CheckboxField
            id="isPrimary"
            label="Set as primary contact"
            description="This contact will be the main point of contact for the company"
            checked={isPrimary}
            onCheckedChange={setIsPrimary}
          />
        </YStack>

        <Button
          marginTop="$5"
          size="$5"
          backgroundColor="$blue10"
          borderRadius="$3"
          onPress={handleSave}
        >
          <Text color="white">Save Contact</Text>
        </Button>
      </ScrollView>
    </YStack>
  );
}
