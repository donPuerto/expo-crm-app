import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Contact = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  lastContact: string;
};

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'John Doe',
    company: 'Acme Corp',
    email: 'john@acme.com',
    phone: '+1 234 567 8900',
    lastContact: '2 days ago',
  },
  {
    id: '2',
    name: 'Jane Smith',
    company: 'Tech Inc',
    email: 'jane@tech.com',
    phone: '+1 234 567 8901',
    lastContact: '1 week ago',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    company: 'Startup LLC',
    email: 'bob@startup.com',
    phone: '+1 234 567 8902',
    lastContact: '3 days ago',
  },
];

export default function ContactDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const contact = mockContacts.find(item => item.id === id);

  if (!contact) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Contact not found</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{contact.name}</Text>

      <Text style={styles.label}>Company</Text>
      <Text style={styles.value}>{contact.company}</Text>

      <Text style={styles.label}>Email</Text>
      <Text style={styles.value}>{contact.email}</Text>

      <Text style={styles.label}>Phone</Text>
      <Text style={styles.value}>{contact.phone}</Text>

      <Text style={styles.label}>Last Contact</Text>
      <Text style={styles.value}>{contact.lastContact}</Text>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back to Contacts</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 12,
    marginBottom: 6,
  },
  value: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
