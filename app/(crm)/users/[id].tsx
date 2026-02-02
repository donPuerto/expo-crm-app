import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { createShadowStyle } from '@/lib/shadow-styles';

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

  const backgroundColor = useThemeColor({}, 'background');
  const cardBg = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const tint = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const successColor = useThemeColor({}, 'success');
  const warningColor = useThemeColor({}, 'warning');
  const errorColor = useThemeColor({}, 'error');

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
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <ThemedText style={[styles.errorText, { color: errorColor }]}>User not found</ThemedText>
        <Pressable
          style={[styles.button, { backgroundColor: tint }]}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.buttonText}>Go Back</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return successColor;
      case 'pending':
        return warningColor;
      case 'inactive':
        return errorColor;
      default:
        return borderColor;
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
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: cardBg, borderBottomColor: borderColor },
          createShadowStyle({
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }),
        ]}
      >
        <Pressable onPress={() => router.back()}>
          <ThemedText style={[styles.backButton, { color: tint }]}>← Back</ThemedText>
        </Pressable>
        <ThemedText type="title" style={[styles.headerTitle, { color: textColor }]}>
          {isEditing ? 'Edit User' : 'User Details'}
        </ThemedText>
        <Pressable
          onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
          style={[styles.editButton, { backgroundColor: isEditing ? tint : 'transparent' }]}
        >
          <ThemedText
            style={[
              styles.editButtonText,
              { color: isEditing ? '#ffffff' : tint },
            ]}
          >
            {isEditing ? 'Save' : 'Edit'}
          </ThemedText>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={animatedStyle}>
          <ThemedView
            style={[
              styles.card,
              {
                backgroundColor: cardBg,
                borderColor,
              },
              createShadowStyle({
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }),
            ]}
          >
            <View style={styles.nameSection}>
              {isEditing ? (
                <TextInput
                  style={[styles.nameInput, { color: textColor, borderColor }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Full Name"
                  placeholderTextColor="#9ca3af"
                />
              ) : (
                <ThemedText type="title" style={[styles.name, { color: textColor }]}>
                  {name}
                </ThemedText>
              )}
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: `${getStatusColor(status)}20`,
                    borderColor: getStatusColor(status),
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(status) },
                  ]}
                />
                {isEditing ? (
                  <View style={styles.statusButtons}>
                    {(['active', 'inactive', 'pending'] as const).map(s => (
                      <Pressable
                        key={s}
                        onPress={() => setStatus(s)}
                        style={[
                          styles.statusOption,
                          {
                            backgroundColor: status === s ? getStatusColor(s) : 'transparent',
                          },
                        ]}
                      >
                        <ThemedText
                          style={[
                            styles.statusOptionText,
                            { color: status === s ? '#ffffff' : getStatusColor(s) },
                          ]}
                        >
                          {s}
                        </ThemedText>
                      </Pressable>
                    ))}
                  </View>
                ) : (
                  <ThemedText
                    style={[styles.statusText, { color: getStatusColor(status) }]}
                  >
                    {status}
                  </ThemedText>
                )}
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <ThemedText style={styles.label}>Email Address</ThemedText>
              {isEditing ? (
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: backgroundColor,
                      borderColor,
                      color: textColor,
                    },
                  ]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <ThemedText style={[styles.value, { color: tint }]}>{email}</ThemedText>
              )}
            </View>

            <View style={styles.section}>
              <ThemedText style={styles.label}>Phone Number</ThemedText>
              {isEditing ? (
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: backgroundColor,
                      borderColor,
                      color: textColor,
                    },
                  ]}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Phone"
                  keyboardType="phone-pad"
                />
              ) : (
                <ThemedText style={styles.value}>{phone || 'Not provided'}</ThemedText>
              )}
            </View>

            <View style={styles.section}>
              <ThemedText style={styles.label}>Role</ThemedText>
              {isEditing ? (
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: backgroundColor,
                      borderColor,
                      color: textColor,
                    },
                  ]}
                  value={role}
                  onChangeText={setRole}
                  placeholder="Role"
                />
              ) : (
                <ThemedText style={styles.value}>{role}</ThemedText>
              )}
            </View>

            <View style={styles.section}>
              <ThemedText style={styles.label}>Department</ThemedText>
              {isEditing ? (
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: backgroundColor,
                      borderColor,
                      color: textColor,
                    },
                  ]}
                  value={department}
                  onChangeText={setDepartment}
                  placeholder="Department"
                />
              ) : (
                <ThemedText style={styles.value}>{department || 'Not assigned'}</ThemedText>
              )}
            </View>

            {!isEditing && (
              <>
                <View style={styles.divider} />
                <View style={styles.actions}>
                  <Pressable
                    style={[
                      styles.actionButton,
                      { backgroundColor: tint },
                      createShadowStyle({
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2,
                      }),
                    ]}
                    onPress={() => Alert.alert('Contact', `Calling ${name}...`)}
                  >
                    <ThemedText style={styles.actionButtonText}>Call</ThemedText>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor: cardBg,
                        borderWidth: 1,
                        borderColor,
                      },
                    ]}
                    onPress={() => Alert.alert('Email', `Opening email to ${email}...`)}
                  >
                    <ThemedText style={[styles.actionButtonText, { color: textColor }]}>
                      Email
                    </ThemedText>
                  </Pressable>
                </View>
              </>
            )}
          </ThemedView>
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  backButton: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    gap: 20,
  },
  nameSection: {
    gap: 12,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  nameInput: {
    fontSize: 28,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  statusOption: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusOptionText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  section: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '600',
  },
  button: {
    marginTop: 20,
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
