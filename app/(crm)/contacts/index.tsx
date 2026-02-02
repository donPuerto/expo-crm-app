import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

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

export default function ContactsListScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/(crm)/contacts/add' as never)}
        >
          <Text style={styles.addButtonText}>+ Add Contact</Text>
        </Pressable>
      </View>

      <FlatList
        data={mockContacts}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/(crm)/contacts/[id]' as never,
                params: { id: item.id },
              } as never)
            }
          >
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.company}>{item.company}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
            <Text style={styles.lastContact}>{item.lastContact}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
  },
  addButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  email: {
    fontSize: 12,
    color: '#94a3b8',
  },
  lastContact: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
