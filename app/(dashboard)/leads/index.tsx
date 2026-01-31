import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  status: string;
};

const leads: Lead[] = [
  {
    id: '1',
    name: 'John Doe',
    company: 'Acme',
    email: 'john@acme.com',
    status: 'new',
  },
  {
    id: '2',
    name: 'Jane Smith',
    company: 'Tech',
    email: 'jane@tech.com',
    status: 'contacted',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    company: 'Startup',
    email: 'bob@startup.com',
    status: 'qualified',
  },
];

export default function LeadsListScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leads</Text>
        <Pressable
          style={styles.addBtn}
          onPress={() => {
            router.push('/(dashboard)/leads/add' as never);
          }}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </Pressable>
      </View>
      <FlatList
        data={leads}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              router.push({
                pathname: '/(dashboard)/leads/[id]' as never,
                params: { id: item.id },
              } as never);
            }}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>{item.company}</Text>
            <Text style={styles.cardEmail}>{item.email}</Text>
            <Text style={styles.cardStatus}>{item.status}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addBtn: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 8,
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  cardEmail: {
    fontSize: 12,
    color: '#0066cc',
    marginBottom: 4,
  },
  cardStatus: {
    fontSize: 11,
    color: '#999',
  },
});
