import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Tab = 'overview' | 'leads' | 'contacts' | 'users';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
}

interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  lastContact: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'online' | 'offline' | 'away';
}

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

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@donpuerto.com',
    role: 'Administrator',
    status: 'online',
  },
  {
    id: '2',
    name: 'Sales Manager',
    email: 'sales@donpuerto.com',
    role: 'Sales',
    status: 'away',
  },
  {
    id: '3',
    name: 'Support Agent',
    email: 'support@donpuerto.com',
    role: 'Support',
    status: 'online',
  },
  {
    id: '4',
    name: 'Demo User',
    email: 'demo@donpuerto.com',
    role: 'Demo',
    status: 'offline',
  },
];

export default function DashboardHome() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => router.replace('/splash') },
    ]);
  };

  const filteredLeads = mockLeads.filter(
    lead =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = mockContacts.filter(
    contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = mockUsers.filter(
    user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return '#3b82f6';
      case 'contacted':
        return '#f59e0b';
      case 'qualified':
        return '#10b981';
      case 'lost':
        return '#ef4444';
      case 'online':
        return '#10b981';
      case 'offline':
        return '#ef4444';
      case 'away':
        return '#f59e0b';
      default:
        return '#64748b';
    }
  };

  const renderLeadItem = ({ item }: { item: Lead }) => (
    <Pressable style={styles.listItem}>
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle}>{item.name}</Text>
        <Text style={styles.listItemSubtitle}>{item.company}</Text>
        <Text style={styles.listItemEmail}>{item.email}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </Pressable>
  );

  const renderContactItem = ({ item }: { item: Contact }) => (
    <Pressable style={styles.listItem}>
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle}>{item.name}</Text>
        <Text style={styles.listItemSubtitle}>{item.company}</Text>
        <Text style={styles.listItemEmail}>{item.email}</Text>
      </View>
      <Text style={styles.lastContactText}>{item.lastContact}</Text>
    </Pressable>
  );

  const renderUserItem = ({ item }: { item: User }) => (
    <Pressable style={styles.listItem}>
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle}>{item.name}</Text>
        <Text style={styles.listItemSubtitle}>{item.role}</Text>
        <Text style={styles.listItemEmail}>{item.email}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Don Puerto CRM</Text>
          <Text style={styles.headerSubtitle}>Welcome back!</Text>
        </View>
        <Pressable style={styles.searchButton} onPress={() => setShowSearch(!showSearch)}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </Pressable>
      </View>

      {showSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search leads, contacts, or users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>
      )}

      <View style={styles.tabsContainer}>
        {(['overview', 'leads', 'contacts', 'users'] as Tab[]).map(tab => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'overview' && (
          <View style={styles.overviewContainer}>
            <Text style={styles.sectionTitle}>Dashboard Overview</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{mockLeads.length}</Text>
                <Text style={styles.statLabel}>Active Leads</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{mockContacts.length}</Text>
                <Text style={styles.statLabel}>Contacts</Text>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{mockUsers.length}</Text>
                <Text style={styles.statLabel}>Team Members</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>89%</Text>
                <Text style={styles.statLabel}>Success Rate</Text>
              </View>
            </View>

            <View style={styles.quickActions}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <Pressable
                style={styles.actionButton}
                onPress={() => router.push('/(dashboard)/leads' as never)}
              >
                <Text style={styles.actionButtonText}>📋 All Leads</Text>
              </Pressable>
              <Pressable
                style={styles.actionButton}
                onPress={() => router.push('/(dashboard)/leads/add' as never)}
              >
                <Text style={styles.actionButtonText}>➕ Add Lead</Text>
              </Pressable>
              <Pressable
                style={styles.actionButton}
                onPress={() => router.push('/(dashboard)/contacts' as never)}
              >
                <Text style={styles.actionButtonText}>👥 All Contacts</Text>
              </Pressable>
              <Pressable
                style={styles.actionButton}
                onPress={() => router.push('/(dashboard)/contacts/add' as never)}
              >
                <Text style={styles.actionButtonText}>➕ Add Contact</Text>
              </Pressable>
            </View>
          </View>
        )}

        {activeTab === 'leads' && (
          <View style={styles.listContainer}>
            <Text style={styles.sectionTitle}>Leads ({filteredLeads.length})</Text>
            <FlatList
              data={filteredLeads}
              renderItem={renderLeadItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {activeTab === 'contacts' && (
          <View style={styles.listContainer}>
            <Text style={styles.sectionTitle}>Contacts ({filteredContacts.length})</Text>
            <FlatList
              data={filteredContacts}
              renderItem={renderContactItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {activeTab === 'users' && (
          <View style={styles.listContainer}>
            <Text style={styles.sectionTitle}>Users ({filteredUsers.length})</Text>
            <FlatList
              data={filteredUsers}
              renderItem={renderUserItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <Pressable style={styles.navButton}>
          <Text style={styles.navButtonText}>⚙️</Text>
          <Text style={styles.navButtonLabel}>Settings</Text>
        </Pressable>
        <Pressable style={styles.navButton}>
          <Text style={styles.navButtonText}>📊</Text>
          <Text style={styles.navButtonLabel}>Analytics</Text>
        </Pressable>
        <Pressable style={styles.navButton}>
          <Text style={styles.navButtonText}>📈</Text>
          <Text style={styles.navButtonLabel}>Charts</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => router.push('/(modals)/user-profile')}>
          <Text style={styles.navButtonText}>👤</Text>
          <Text style={styles.navButtonLabel}>Profile</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={handleLogout}>
          <Text style={styles.navButtonText}>🚪</Text>
          <Text style={styles.navButtonLabel}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#6366f1',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e7ff',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#6366f1',
  },
  tabText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#6366f1',
  },
  content: {
    flex: 1,
  },
  overviewContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  quickActions: {
    marginTop: 24,
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  listItemEmail: {
    fontSize: 12,
    color: '#94a3b8',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  lastContactText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingVertical: 8,
    paddingBottom: 20,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navButtonText: {
    fontSize: 24,
    marginBottom: 4,
  },
  navButtonLabel: {
    fontSize: 11,
    color: '#64748b',
  },
});
