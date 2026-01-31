import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
};

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Doe',
    company: 'Acme Corp',
    email: 'john@acme.com',
    status: 'new',
  },
  {
    id: '2',
    name: 'Jane Smith',
    company: 'Tech Inc',
    email: 'jane@tech.com',
    status: 'contacted',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    company: 'Startup LLC',
    email: 'bob@startup.com',
    status: 'qualified',
  },
  {
    id: '4',
    name: 'Alice Brown',
    company: 'Enterprise Co',
    email: 'alice@enterprise.com',
    status: 'lost',
  },
];

export default function LeadDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const lead = mockLeads.find(item => item.id === id);

  if (!lead) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Lead not found</Text>
        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return '#3B82F6';
      case 'contacted':
        return '#F59E0B';
      case 'qualified':
        return '#10B981';
      case 'lost':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Lead Details</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.name}>{lead.name}</Text>
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(lead.status) }]} />
          <Text style={styles.statusText}>{lead.status}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Company</Text>
          <Text style={styles.value}>{lead.company}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{lead.email}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.actions}>
          <Pressable style={[styles.actionButton, styles.primaryButton]}>
            <Text style={styles.primaryButtonText}>Contact</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, styles.secondaryButton]}>
            <Text style={styles.secondaryButtonText}>Edit</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    fontSize: 16,
    color: '#0066CC',
    fontWeight: '600',
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    textTransform: 'capitalize',
  },
  section: {
    marginVertical: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#0066CC',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  secondaryButtonText: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#0066CC',
    marginTop: 20,
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
