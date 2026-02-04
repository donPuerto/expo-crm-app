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

export default function AddLeadScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [isQualified, setIsQualified] = useState(false);
  type LeadFieldKey = 'name' | 'company' | 'email' | 'status';
  const [errors, setErrors] = useState<FieldErrors<LeadFieldKey>>({});

  const handleSave = () => {
    const nextErrors = validateValues(
      { name, company, email, status },
      {
        name: [v.required('Full name is required')],
        company: [v.required('Company is required')],
        email: [v.required('Email is required'), v.email()],
        status: [v.required('Lead status is required')],
      }
    );

    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      const first = Object.values(nextErrors).find(Boolean);
      Alert.alert('Error', first ?? 'Please check the form');
      return;
    }

    Alert.alert('Success', 'Lead added successfully');
    router.back();
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
        <H1 fontSize="$7" fontWeight="700" color="$color" marginBottom="$4">
          Add Lead
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
            placeholder="Lead name"
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
          <Input
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone number"
            keyboardType="phone-pad"
          />
        </YStack>

        <YStack marginTop="$3">
          <SelectField
            id="status"
            label="Lead Status"
            placeholder="Select status"
            options={[
              { label: 'New', value: 'new' },
              { label: 'Contacted', value: 'contacted' },
              { label: 'Qualified', value: 'qualified' },
              { label: 'Proposal Sent', value: 'proposal' },
              { label: 'Negotiation', value: 'negotiation' },
            ]}
            value={status}
            onValueChange={next => {
              setStatus(next);
              if (errors.status) setErrors(prev => ({ ...prev, status: undefined }));
            }}
            required
            error={errors.status}
          />
        </YStack>

        <YStack marginTop="$3">
          <SelectField
            id="source"
            label="Lead Source"
            placeholder="How did they find us?"
            options={[
              { label: 'Website', value: 'website' },
              { label: 'Referral', value: 'referral' },
              { label: 'Social Media', value: 'social' },
              { label: 'Email Campaign', value: 'email' },
              { label: 'Event', value: 'event' },
              { label: 'Other', value: 'other' },
            ]}
            value={source}
            onValueChange={setSource}
          />
        </YStack>

        <YStack marginTop="$4">
          <CheckboxField
            id="isQualified"
            label="Mark as qualified lead"
            description="This lead has been verified and shows strong interest"
            checked={isQualified}
            onCheckedChange={setIsQualified}
          />
        </YStack>

        <Button
          marginTop="$5"
          marginBottom="$4"
          size="$5"
          backgroundColor="$blue10"
          borderRadius="$3"
          onPress={handleSave}
        >
          <Text color="white">Save Lead</Text>
        </Button>
      </ScrollView>
    </YStack>
  );
}
